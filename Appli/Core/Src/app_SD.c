/**
 ******************************************************************************
 * @file    app_imagepipeline.c
 * @author  Scientivic
 *
 * Pipeline "image SD" qui remplace la caméra :
 * - Lecture BMP sur SD
 * - Conversion vers LCD (RGB565)
 * - Conversion vers NN (RGB/BGR)
 ******************************************************************************
 */

#include <assert.h>
#include <string.h>
#include <stdio.h>
#include <stdbool.h>

#include "added/app_SD.h"
#include "app_config.h"
//#include "stai_network.h"
#include "ff.h"
#include "diskio.h"
#include "stm32n6570_discovery_sd.h"
#include "stm32n6xx_hal.h"

/* Synchronisation utilisée par main.c */
extern int32_t cameraFrameReceived;

/* ========================== DEBUG ========================== */
#define IMGPIPE_DEBUG 1
#if IMGPIPE_DEBUG
  #define LOGF(...) printf(__VA_ARGS__)
#else
  #define LOGF(...) do{}while(0)
#endif

/* ========================== STRUCTURES BMP ========================== */
#pragma pack(push,1)
typedef struct {
    uint16_t bfType;     /* 'BM' */
    uint32_t bfSize;
    uint16_t bfReserved1;
    uint16_t bfReserved2;
    uint32_t bfOffBits;  /* offset des pixels */
} BMP_FileHdr;

typedef struct {
    uint32_t biSize;
    int32_t  biWidth;
    int32_t  biHeight;
    uint16_t biPlanes;
    uint16_t biBitCount;     /* 24 bpp attendu */
    uint32_t biCompression;  /* 0 = BI_RGB */
    uint32_t biSizeImage;
    int32_t  biXPelsPerMeter;
    int32_t  biYPelsPerMeter;
    uint32_t biClrUsed;
    uint32_t biClrImportant;
} BMP_InfoHdr;
#pragma pack(pop)

/* ========================== ETAT GLOBAL ========================== */
static FATFS s_fs;                        /* instance FatFS */
static char  s_files[BMP_MAX_FILES][BMP_MAX_NAME]; /* liste d’images */
static uint32_t s_file_count = 0;
static uint32_t s_file_index = 0;

static uint8_t *s_lcd_dst = NULL;         /* buffer LCD */
static uint32_t s_lcd_w = 0;
static uint32_t s_lcd_h = 0;

__attribute__((section(".psram_bss")))
__attribute__((aligned(32)))
static uint8_t  s_nn_buf[NN_WIDTH * NN_HEIGHT * NN_BPP];
static uint8_t  s_new_frame_ready = 0;

static uint32_t s_last_tick = 0;
static uint8_t  s_first_frame = 1;

/* buffer ligne BMP */
__attribute__((section(".psram_bss")))
__attribute__((aligned(32)))
static uint8_t s_linebuf[800 * 3 + 4]; /* 800 px max en 24bpp */

/* ========================== UTILITAIRES ========================== */
static int str_endswith_bmp(const char *name)
{
    size_t n = strlen(name);
    if (n < 4) return 0;
    char a = name[n-3] | 0x20;
    char b = name[n-2] | 0x20;
    char c = name[n-1] | 0x20;
    return (name[n-4] == '.') && (a=='b') && (b=='m') && (c=='p');
}

static void sort_files(void)
{
    for (uint32_t i=0; i<s_file_count; i++)
    {
        for (uint32_t j=i+1; j<s_file_count; j++)
        {
            if (strcmp(s_files[i], s_files[j]) > 0)
            {
                char tmp[BMP_MAX_NAME];
                strcpy(tmp, s_files[i]);
                strcpy(s_files[i], s_files[j]);
                strcpy(s_files[j], tmp);
            }
        }
    }
}

/* Scan du dossier BMP_DIR */
static void scan_bmp_dir(void)
{
    DIR dir;
    FILINFO fno;
    s_file_count = 0;

    LOGF("[IMG] scan dir=%s\r\n", BMP_DIR);

    if (f_opendir(&dir, BMP_DIR) != FR_OK) {
        LOGF("[IMG] f_opendir failed\r\n");
        return;
    }

    while (f_readdir(&dir, &fno) == FR_OK && fno.fname[0])
    {
        if ((fno.fattrib & AM_DIR) == 0 && str_endswith_bmp(fno.fname))
        {
            if (s_file_count < BMP_MAX_FILES)
            {
                snprintf(s_files[s_file_count], BMP_MAX_NAME, "%s/%s", BMP_DIR, fno.fname);
                LOGF("[IMG] found: %s\r\n", s_files[s_file_count]);
                s_file_count++;
            }
        }
    }
    f_closedir(&dir);
    sort_files();
    LOGF("[IMG] total files=%lu\r\n", (unsigned long)s_file_count);
}

/* ========================== ASPECT RATIO ========================== */
typedef enum {
    AR_CROP,
    AR_FIT,
    AR_FULLSCREEN
} ar_mode_t;

static ar_mode_t get_ar_mode(void)
{
#if ASPECT_RATIO_MODE == ASPECT_RATIO_CROP
    return AR_CROP;
#elif ASPECT_RATIO_MODE == ASPECT_RATIO_FIT
    return AR_FIT;
#else
    return AR_FULLSCREEN;
#endif
}

/* Calcule le pixel source correspondant au pixel de sortie */
static void map_output_to_src(uint32_t out_w, uint32_t out_h,
                              uint32_t src_w, uint32_t src_h,
                              ar_mode_t mode,
                              uint32_t out_x, uint32_t out_y,
                              int32_t *src_x, int32_t *src_y,
                              uint8_t *is_black)
{
    float fx, fy;
    *is_black = 0;

    if (mode == AR_FULLSCREEN)
    {
        fx = (float)src_w / (float)out_w;
        fy = (float)src_h / (float)out_h;
        *src_x = (int32_t)(out_x * fx);
        *src_y = (int32_t)(out_y * fy);
        return;
    }

    float scale;
    if (mode == AR_CROP)
    {
        scale = (float)out_w / (float)src_w;
        float scale_h = (float)out_h / (float)src_h;
        if (scale_h > scale) scale = scale_h;

        float crop_w = (float)out_w / scale;
        float crop_h = (float)out_h / scale;
        float x0 = ((float)src_w - crop_w) * 0.5f;
        float y0 = ((float)src_h - crop_h) * 0.5f;

        *src_x = (int32_t)(x0 + out_x / scale);
        *src_y = (int32_t)(y0 + out_y / scale);
    }
    else /* FIT */
    {
        scale = (float)out_w / (float)src_w;
        float scale_h = (float)out_h / (float)src_h;
        if (scale_h < scale) scale = scale_h;

        float scaled_w = src_w * scale;
        float scaled_h = src_h * scale;

        float dx = ((float)out_w - scaled_w) * 0.5f;
        float dy = ((float)out_h - scaled_h) * 0.5f;

        if (out_x < dx || out_y < dy ||
            out_x >= (dx + scaled_w) || out_y >= (dy + scaled_h))
        {
            *is_black = 1;
            *src_x = 0;
            *src_y = 0;
            return;
        }

        *src_x = (int32_t)((out_x - dx) / scale);
        *src_y = (int32_t)((out_y - dy) / scale);
    }
}

/* ========================== BMP HEADER ========================== */
static int read_bmp_header(FIL *fp, BMP_InfoHdr *ih, uint32_t *data_off)
{
    BMP_FileHdr fh;
    UINT br = 0;
    if (f_read(fp, &fh, sizeof(fh), &br) != FR_OK || br != sizeof(fh)) return -1;
    if (f_read(fp, ih, sizeof(*ih), &br) != FR_OK || br != sizeof(*ih)) return -1;

    if (fh.bfType != 0x4D42U) return -1;
    if (ih->biCompression != 0) return -1;

#if BMP_INPUT_BPP == BMP_INPUT_BPP_24
    if (ih->biBitCount != 24) return -1;
#elif BMP_INPUT_BPP == BMP_INPUT_BPP_16
    if (ih->biBitCount != 16) return -1;
#endif

    *data_off = fh.bfOffBits;

    LOGF("[IMG] BMP %ldx%ld bpp=%u off=%lu\r\n",
         (long)ih->biWidth, (long)ih->biHeight,
         ih->biBitCount, (unsigned long)*data_off);

    return 0;
}

/* ========================== OVERLAY NN ========================== */
static void overlay_nn_to_lcd_top_left(void)
{
    if (!s_lcd_dst) return;

    const uint32_t nn_w = NN_WIDTH;
    const uint32_t nn_h = NN_HEIGHT;

    uint32_t max_w = (nn_w < s_lcd_w) ? nn_w : s_lcd_w;
    uint32_t max_h = (nn_h < s_lcd_h) ? nn_h : s_lcd_h;

    for (uint32_t y = 0; y < max_h; y++)
    {
        for (uint32_t x = 0; x < max_w; x++)
        {
            uint8_t r=0,g=0,b=0;

#if NN_BPP == 3
            uint32_t idx = (y * nn_w + x) * 3U;
            if (IS_NN_RGB) {
                r = s_nn_buf[idx + 0];
                g = s_nn_buf[idx + 1];
                b = s_nn_buf[idx + 2];
            } else {
                b = s_nn_buf[idx + 0];
                g = s_nn_buf[idx + 1];
                r = s_nn_buf[idx + 2];
            }
#else
            uint8_t gray = s_nn_buf[y * nn_w + x];
            r = g = b = gray;
#endif

            uint16_t rgb565 =
                ((r & 0xF8) << 8) |
                ((g & 0xFC) << 3) |
                ((b & 0xF8) >> 3);

            ((uint16_t*)s_lcd_dst)[y * s_lcd_w + x] = rgb565;
        }
    }
}

/* ========================== RENDER BMP ========================== */
static void render_bmp_to_outputs(const char *path)
{
    FIL fp;
    BMP_InfoHdr ih;
    uint32_t data_off;

    LOGF("[IMG] render %s\r\n", path);

    if (f_open(&fp, path, FA_READ) != FR_OK) {
        LOGF("[IMG] f_open failed\r\n");
        return;
    }
    if (read_bmp_header(&fp, &ih, &data_off) != 0) {
        LOGF("[IMG] invalid BMP header\r\n");
        f_close(&fp);
        return;
    }

    uint32_t src_w = (uint32_t)ih.biWidth;
    uint32_t src_h = (ih.biHeight < 0) ? (uint32_t)(-ih.biHeight) : (uint32_t)ih.biHeight;
    uint8_t bottom_up = (ih.biHeight > 0);

    uint32_t src_stride;
#if BMP_INPUT_BPP == BMP_INPUT_BPP_24
    src_stride = ((src_w * 3U + 3U) / 4U) * 4U;
#else
    src_stride = ((src_w * 2U + 3U) / 4U) * 4U;
#endif

    LOGF("[IMG] src_w=%lu src_h=%lu stride=%lu\r\n",
         (unsigned long)src_w, (unsigned long)src_h, (unsigned long)src_stride);

    ar_mode_t mode_lcd = get_ar_mode();
    ar_mode_t mode_nn = (mode_lcd == AR_FULLSCREEN) ? AR_FIT : mode_lcd;

    /* ---- LCD ---- */
    if (s_lcd_dst)
    {
        uint32_t out_w = s_lcd_w;
        uint32_t out_h = s_lcd_h;

        for (uint32_t y = 0; y < out_h; y++)
        {
            uint32_t last_file_row = 0xFFFFFFFF;

            for (uint32_t x = 0; x < out_w; x++)
            {
                int32_t sx, sy;
                uint8_t is_black;
                map_output_to_src(out_w, out_h, src_w, src_h, mode_lcd, x, y, &sx, &sy, &is_black);

                uint8_t r=0,g=0,b=0;
                if (!is_black)
                {
                    if (sx < 0) sx = 0;
                    if (sy < 0) sy = 0;
                    if ((uint32_t)sx >= src_w) sx = src_w - 1;
                    if ((uint32_t)sy >= src_h) sy = src_h - 1;

                    uint32_t file_row = bottom_up ? (src_h - 1 - (uint32_t)sy) : (uint32_t)sy;

                    if (file_row != last_file_row)
                    {
                        UINT br = 0;
                        f_lseek(&fp, data_off + file_row * src_stride);
                        f_read(&fp, s_linebuf, src_stride, &br);
                        last_file_row = file_row;
                    }

#if BMP_INPUT_BPP == BMP_INPUT_BPP_24
                    uint8_t *px = &s_linebuf[sx * 3U];
                    b = px[0]; g = px[1]; r = px[2];
#else
                    uint16_t px = ((uint16_t*)s_linebuf)[sx];
                    r = (uint8_t)((px >> 11) & 0x1F);
                    g = (uint8_t)((px >> 5) & 0x3F);
                    b = (uint8_t)(px & 0x1F);
                    r = (r << 3) | (r >> 2);
                    g = (g << 2) | (g >> 4);
                    b = (b << 3) | (b >> 2);
#endif
                }

                uint16_t rgb565 =
                    ((r & 0xF8) << 8) |
                    ((g & 0xFC) << 3) |
                    ((b & 0xF8) >> 3);

                ((uint16_t*)s_lcd_dst)[y * s_lcd_w + x] = rgb565;
            }
        }
    }

    /* ---- NN ---- */
    for (uint32_t y = 0; y < NN_HEIGHT; y++)
    {
        uint32_t last_file_row = 0xFFFFFFFF;

        for (uint32_t x = 0; x < NN_WIDTH; x++)
        {
            int32_t sx, sy;
            uint8_t is_black;
            map_output_to_src(NN_WIDTH, NN_HEIGHT,
                              src_w, src_h, mode_nn, x, y, &sx, &sy, &is_black);

            uint8_t r=0,g=0,b=0;
            if (!is_black)
            {
                if (sx < 0) sx = 0;
                if (sy < 0) sy = 0;
                if ((uint32_t)sx >= src_w) sx = src_w - 1;
                if ((uint32_t)sy >= src_h) sy = src_h - 1;

                uint32_t file_row = bottom_up ? (src_h - 1 - (uint32_t)sy) : (uint32_t)sy;

                if (file_row != last_file_row)
                {
                    UINT br = 0;
                    f_lseek(&fp, data_off + file_row * src_stride);
                    f_read(&fp, s_linebuf, src_stride, &br);
                    last_file_row = file_row;
                }

#if BMP_INPUT_BPP == BMP_INPUT_BPP_24
                uint8_t *px = &s_linebuf[sx * 3U];
                b = px[0]; g = px[1]; r = px[2];
#else
                uint16_t px = ((uint16_t*)s_linebuf)[sx];
                r = (uint8_t)((px >> 11) & 0x1F);
                g = (uint8_t)((px >> 5) & 0x3F);
                b = (uint8_t)(px & 0x1F);
                r = (r << 3) | (r >> 2);
                g = (g << 2) | (g >> 4);
                b = (b << 3) | (b >> 2);
#endif
            }

#if NN_BPP == 3
            uint32_t idx = (y * NN_WIDTH + x) * 3U;
            if (IS_NN_RGB) {
                s_nn_buf[idx + 0] = r;
                s_nn_buf[idx + 1] = g;
                s_nn_buf[idx + 2] = b;
            } else {
                s_nn_buf[idx + 0] = b;
                s_nn_buf[idx + 1] = g;
                s_nn_buf[idx + 2] = r;
            }
#else
            uint8_t gray = (uint8_t)((r * 77 + g * 150 + b * 29) >> 8);
            s_nn_buf[y * NN_WIDTH + x] = gray;
#endif
        }
    }

    f_close(&fp);
#if NN_OVERLAY_ENABLE
    /* overlay debug NN en haut-gauche */
    overlay_nn_to_lcd_top_left();
#endif

    /* nettoyage cache LCD */
    SCB_CleanDCache_by_Addr((uint32_t*)s_lcd_dst, s_lcd_w * s_lcd_h * 2);
}

/* ========================== API PUBLIQUE ========================== */
void SD_Init(uint32_t *lcd_bg_width, uint32_t *lcd_bg_height, uint32_t *pitch_nn)//verified
{
    LOGF("[IMG] Init start\r\n");

    BSP_SD_Init(0);
    f_mount(&s_fs, "0:", 1);
    scan_bmp_dir();

    if (s_file_count == 0) {
        *lcd_bg_width = SCREEN_WIDTH;
        *lcd_bg_height = SCREEN_HEIGHT;
        *pitch_nn = NN_WIDTH * NN_BPP;
        return;
    }

    FIL fp;
    BMP_InfoHdr ih;
    uint32_t data_off;
    if (f_open(&fp, s_files[0], FA_READ) == FR_OK &&
        read_bmp_header(&fp, &ih, &data_off) == 0)
    {
        uint32_t bmp_w = (uint32_t)ih.biWidth;
        uint32_t bmp_h = (ih.biHeight < 0) ? (uint32_t)(-ih.biHeight) : (uint32_t)ih.biHeight;

        uint32_t calc_bg_height = (bmp_h <= SCREEN_HEIGHT) ? bmp_h : SCREEN_HEIGHT;
        uint32_t calc_bg_width;
#if ASPECT_RATIO_MODE == ASPECT_RATIO_FULLSCREEN
        calc_bg_width = (((bmp_w * calc_bg_height) / bmp_h) - ((bmp_w * calc_bg_height) / bmp_h) % 16);
#else
        (void)bmp_w;
        calc_bg_width = (bmp_h <= SCREEN_HEIGHT) ? bmp_h : SCREEN_HEIGHT;
#endif
        *lcd_bg_width = calc_bg_width;
        *lcd_bg_height = calc_bg_height;
        s_lcd_w = calc_bg_width;
        s_lcd_h = calc_bg_height;

        f_close(&fp);
    }
    else
    {
        *lcd_bg_width = SCREEN_WIDTH;
        *lcd_bg_height = SCREEN_HEIGHT;
        s_lcd_w = SCREEN_WIDTH;
        s_lcd_h = SCREEN_HEIGHT;
    }

    *pitch_nn = NN_WIDTH * NN_BPP;
}

void SD_DeInit(void)
{
    f_mount(NULL, "", 0);
}

void SD_DisplayPipe_Start(uint8_t *display_pipe_dst)//verified
{
    s_lcd_dst = display_pipe_dst;
}

void SD_NNPipe_Start(uint8_t *nn_pipe_dst)//verified
{
    if (s_new_frame_ready)
    {
        if (nn_pipe_dst != s_nn_buf)
        {
            memcpy(nn_pipe_dst, s_nn_buf,
                   NN_WIDTH * NN_HEIGHT * NN_BPP);
        }
        SCB_CleanDCache_by_Addr((uint32_t*)nn_pipe_dst,
                                NN_WIDTH * NN_HEIGHT * NN_BPP);
        cameraFrameReceived++;
        s_new_frame_ready = 0;
    }
}

void SD_IspUpdate(void) //verified
{
    if (s_file_count == 0 || s_lcd_dst == NULL) return;

    uint32_t now = HAL_GetTick();
    if (!s_first_frame && (now - s_last_tick) < TEMPS_IMAGE_MS)
        return;

    render_bmp_to_outputs(s_files[s_file_index]);
    s_file_index = (s_file_index + 1) % s_file_count;

    s_last_tick = now;
    s_first_frame = 0;
    s_new_frame_ready = 1;
}
