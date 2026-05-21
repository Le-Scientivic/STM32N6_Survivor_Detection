/*
 * app_imagepipeline.h
 *
 *  Created on: 31 mars 2026
 *      Author: Scientivic
 */

#ifndef APP_IMAGEPIPELINE
#define APP_IMAGEPIPELINE

#include <stdint.h>

#define SCREEN_HEIGHT (480)
#define SCREEN_WIDTH  (800)

/* ------------------ Config utilisateur ------------------ */
#define BMP_DIR             "0:/images_test"
#define BMP_MAX_FILES       256
#define BMP_MAX_NAME        64

/* BMP input format (24 par défaut) */
#define BMP_INPUT_BPP_24    24
#define BMP_INPUT_BPP_16    16
#ifndef BMP_INPUT_BPP
#define BMP_INPUT_BPP       BMP_INPUT_BPP_24
#endif

/* NN format */
#ifndef IS_NN_RGB
#define IS_NN_RGB           1   /* 1=RGB, 0=BGR */
#endif

/* Temps entre 2 images (ms) */
#ifndef TEMPS_IMAGE_MS
#define TEMPS_IMAGE_MS      6000U
#endif

/* Overlay */
#define NN_OVERLAY_ENABLE 1   /* 1=overlay NN, 0=pas d’overlay */
/* --------------------------------------------------------- */

void SD_Init(uint32_t *lcd_bg_width, uint32_t *lcd_bg_height, uint32_t *pitch_nn);//verified
void SD_DeInit(void);
void SD_Start(void);
void SD_DisplayPipe_Start(uint8_t *display_pipe_dst);//verified
void SD_NNPipe_Start(uint8_t *nn_pipe_dst);//verified
void SD_IspUpdate(void);//verified
static void overlay_nn_to_lcd_top_left(void);
#endif
