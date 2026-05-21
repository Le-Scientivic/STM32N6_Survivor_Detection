/**
 ******************************************************************************
 * @file    sd_capture.h
 * @brief   Generic SD card capture module — STM32N6570-DK  ** TEMPLATE **
 *
 * Stack:  FatFS (Middlewares/ThirdParty/FatFs)  +  diskio_sd.c
 *
 * ── What this module does ────────────────────────────────────────────────────
 * Provides a thin, project-agnostic layer on top of FatFS to:
 *   1. Mount the SD card and create a working directory.
 *   2. Convert pixel buffers (RGB565 / ARGB4444 / RGB888) to BMP 24bpp.
 *   3. Save files with automatic naming: SD_CAP_DIR/PREFIX_NNNN.BMP
 *
 * ── Two capture trigger modes ────────────────────────────────────────────────
 *
 *  MODE A — Frame-count interval  (SD_CAP_TRIGGER_MODE = SD_CAP_TRIGGER_FRAME)
 *  ─────────────────────────────────────────────────────────────────────────────
 *  Call SD_Capture_Tick() once per frame from the main loop.
 *  The module saves one set of buffers every SD_CAP_FRAME_INTERVAL frames.
 *  Suitable for: AI inference pipelines, LTDC-driven main loops.
 *
 *    // In main loop, once per rendered frame:
 *    SD_Capture_BufDesc bufs[2] = {
 *        { lcd_bg_buffer, 160, 0, 480, 480, 800, SD_CAP_FMT_RGB565,   "CI" },
 *        { lcd_fg_buffer,   0, 0, 800, 480, 800, SD_CAP_FMT_ARGB4444, "CO" },
 *    };
 *    SD_Capture_Tick(bufs, 2);
 *
 *
 *  MODE B — Time-based interval   (SD_CAP_TRIGGER_MODE = SD_CAP_TRIGGER_TIME)
 *  ─────────────────────────────────────────────────────────────────────────────
 *  Use SD_Capture_RequestFromISR() inside a DCMIPP / timer interrupt to copy a
 *  snapshot of the live DMA buffer and set a pending flag.
 *  Then call SD_Capture_ServicePending() from the main loop for the SD write
 *  (SD writes must NEVER happen inside an ISR).
 *  Suitable for: DCMIPP continuous mode, time-lapse, periodic image logging.
 *
 *    // Step 1 — register snapshot descriptor once after SD_Capture_Init():
 *    static SD_Capture_BufDesc snap_desc = {
 *        .data = (const uint8_t *)SD_SNAPSHOT_ADDR,
 *        .x0 = 0, .y0 = 0, .width = 800, .height = 480, .pitch = 800,
 *        .fmt = SD_CAP_FMT_RGB565, .prefix = "IMG",
 *    };
 *    SD_Capture_SetSnapshotDesc(&snap_desc);
 *
 *    // Step 2 — inside HAL_DCMIPP_PIPE_FrameEventCallback (ISR):
 *    SD_Capture_RequestFromISR(
 *        (const uint8_t *)BUFFER_ADDRESS,   // live DMA buffer (src)
 *        (uint8_t *)SD_SNAPSHOT_ADDR,        // snapshot buffer  (dst)
 *        800 * 480 * 2,                       // bytes to copy
 *        SD_CAP_SAVE_INTERVAL_MS              // min ms between captures
 *    );
 *
 *    // Step 3 — inside main while(1):
 *    SD_Capture_ServicePending();
 *
 * ── Supported pixel formats ──────────────────────────────────────────────────
 *   RGB565   (2 B/px) — DCMIPP / camera ISP output
 *   ARGB4444 (2 B/px) — LTDC foreground / overlay layer
 *   RGB888   (3 B/px) — already-expanded buffers
 *   → Add more formats by extending SD_Capture_PixFmt and the converter table
 *     in sd_capture.c.
 *
 * ── Integration checklist ────────────────────────────────────────────────────
 *   1. Copy sd_capture.h + sd_capture.c + diskio_sd.c to your project.
 *   2. Set SD_CAP_TRIGGER_MODE and the other constants below.
 *   3. In Hardware_init(): call BSP_SD_Init(0), then SD_Capture_Init().
 *   4. Follow the usage pattern for your chosen mode (see above).
 *
 * ── ffconf.h requirements ────────────────────────────────────────────────────
 *   FF_USE_LFN   0     (8.3 filenames — no Unicode needed)
 *   FF_CODE_PAGE 437   (US-ASCII)
 *
 ******************************************************************************
 */
#ifndef SD_CAPTURE_H
#define SD_CAPTURE_H

#ifdef __cplusplus
extern "C" {
#endif

#include <stdint.h>

/* ===========================================================================
 * Trigger mode selector  ── EDIT THIS
 * =========================================================================== */

#define SD_CAP_TRIGGER_FRAME  0   /**< Save every N frames (frame counter)    */
#define SD_CAP_TRIGGER_TIME   1   /**< Save every N ms    (HAL_GetTick)       */

/**
 * Active trigger mode:
 *   SD_CAP_TRIGGER_FRAME  →  AI / LTDC pipelines
 *   SD_CAP_TRIGGER_TIME   →  DCMIPP continuous mode, time-lapse
 */
#define SD_CAP_TRIGGER_MODE   SD_CAP_TRIGGER_TIME

/* ===========================================================================
 * Configuration  ── EDIT THESE for your project
 * =========================================================================== */

/** Output directory on the SD card (8.3 format, no leading slash).
 *  Created automatically by SD_Capture_Init() if it does not exist.      */
#define SD_CAP_DIR              "CAPTURES"

/** MODE A only — save one capture set every N calls to SD_Capture_Tick().
 *  At 30 fps:  30 → ~1/sec,  150 → ~1/5 sec.                             */
#define SD_CAP_FRAME_INTERVAL   30U

/** MODE B only — minimum time between captures in milliseconds.
 *  Examples: 1000 = 1/sec, 12000 = every 12 sec, 60000 = every 1 min.   */
#define SD_CAP_SAVE_INTERVAL_MS 12000U

/** Maximum BMP files per session (0 = no limit).
 *  Prevents accidentally filling the SD card.                             */
#define SD_CAP_MAX_FILES        9999U

/* ===========================================================================
 * Pixel format descriptor
 * =========================================================================== */
typedef enum {
    SD_CAP_FMT_RGB565   = 0,  /**< 16bpp R5G6B5     — DCMIPP/camera output   */
    SD_CAP_FMT_ARGB4444 = 1,  /**< 16bpp A4R4G4B4   — LTDC foreground layer  */
    SD_CAP_FMT_RGB888   = 2,  /**< 24bpp R8G8B8     — pre-expanded buffer     */
} SD_Capture_PixFmt;

/* ===========================================================================
 * Status codes
 * =========================================================================== */
typedef enum {
    SD_CAP_OK           = 0,
    SD_CAP_ERR_MOUNT,     /**< f_mount() failed — check diskio_sd.c / SDMMC  */
    SD_CAP_ERR_DIR,       /**< Failed to create SD_CAP_DIR                    */
    SD_CAP_ERR_FILE,      /**< Failed to open file for writing                */
    SD_CAP_ERR_WRITE,     /**< f_write() error during BMP save                */
    SD_CAP_ERR_PARAM,     /**< NULL pointer, unsupported format, not mounted  */
    SD_CAP_ERR_LIMIT,     /**< SD_CAP_MAX_FILES reached                       */
} SD_Capture_Status;

/* ===========================================================================
 * Buffer descriptor
 * Fully describes one pixel buffer to be saved as a BMP file.
 * =========================================================================== */
typedef struct {
    const uint8_t    *data;    /**< Pointer to pixel data                      */
    uint32_t          x0;      /**< First active column in pixels (0 = none)  */
    uint32_t          y0;      /**< First active row    in pixels (0 = none)  */
    uint32_t          width;   /**< Active area width   in pixels             */
    uint32_t          height;  /**< Active area height  in pixels             */
    uint32_t          pitch;   /**< Full row stride     in pixels (>= width)  */
    SD_Capture_PixFmt fmt;     /**< Pixel format (see SD_Capture_PixFmt)      */
    const char       *prefix;  /**< Filename prefix, up to 6 chars: "IMG"    */
} SD_Capture_BufDesc;

/* ===========================================================================
 * Public API — common (both modes)
 * =========================================================================== */

/**
 * @brief  Mount the SD card and create SD_CAP_DIR.
 *         Call once after BSP_SD_Init(0) in Hardware_init() / main().
 */
SD_Capture_Status SD_Capture_Init(void);

/**
 * @brief  Unmount the SD card cleanly.
 *         Call before a software reset or entering low-power mode.
 */
void SD_Capture_DeInit(void);

/**
 * @brief  Save a single buffer to SD immediately as BMP 24bpp.
 *         File path: SD_CAP_DIR/<prefix><index:04d>.BMP
 *         The index is tracked per prefix string (compared by pointer address).
 *         Use this when you control the save timing manually.
 *
 * Example — 480×480 RGB565 crop (x0=160) from an 800-wide buffer:
 * @code
 *   SD_Capture_BufDesc d = {
 *       .data = (const uint8_t *)lcd_bg_buffer,
 *       .x0 = 160, .y0 = 0, .width = 480, .height = 480, .pitch = 800,
 *       .fmt = SD_CAP_FMT_RGB565, .prefix = "CI",
 *   };
 *   SD_Capture_SaveBuf(&d);
 * @endcode
 */
SD_Capture_Status SD_Capture_SaveBuf(const SD_Capture_BufDesc *desc);

/**
 * @brief  Save multiple buffers in a single call.
 *         Stops and returns on the first error.
 */
SD_Capture_Status SD_Capture_SaveBufs(const SD_Capture_BufDesc *descs,
                                       uint32_t count);

/**
 * @brief  Returns the total number of BMP files written this session.
 */
uint32_t SD_Capture_GetCount(void);

/* ===========================================================================
 * Public API — MODE A  (SD_CAP_TRIGGER_FRAME)
 * =========================================================================== */

/**
 * @brief  Frame-tick helper — call once per frame from the main loop.
 *         Saves all provided buffers every SD_CAP_FRAME_INTERVAL calls.
 *         Wraps SD_Capture_SaveBufs() internally.
 */
SD_Capture_Status SD_Capture_Tick(const SD_Capture_BufDesc *descs,
                                   uint32_t count);

/**
 * @brief  Reset the internal frame counter used by SD_Capture_Tick().
 *         Useful when restarting a capture session without re-mounting.
 */
void SD_Capture_ResetTick(void);

/* ===========================================================================
 * Public API — MODE B  (SD_CAP_TRIGGER_TIME)
 * =========================================================================== */

/**
 * @brief  Register the snapshot buffer descriptor for SD_Capture_ServicePending().
 *         Call once after SD_Capture_Init(), before the main loop.
 *         The descriptor must remain valid for the whole session.
 *
 * @param  desc  Descriptor whose .data points to the snapshot buffer (dst)
 *               used in SD_Capture_RequestFromISR().
 *
 * @code
 *   static const SD_Capture_BufDesc snap_desc = {
 *       .data = (const uint8_t *)SD_SNAPSHOT_ADDR,
 *       .x0 = 0, .y0 = 0, .width = 800, .height = 480, .pitch = 800,
 *       .fmt = SD_CAP_FMT_RGB565, .prefix = "IMG",
 *   };
 *   SD_Capture_SetSnapshotDesc(&snap_desc);
 * @endcode
 */
void SD_Capture_SetSnapshotDesc(const SD_Capture_BufDesc *desc);

/**
 * @brief  ISR-safe snapshot helper — call from DCMIPP / timer interrupt.
 *
 *         Checks whether `interval_ms` has elapsed since the last capture.
 *         If yes:
 *           1. Invalidates DCache for `src` (size `size` bytes).
 *           2. Copies `size` bytes from `src` to `dst`.
 *           3. Sets an internal pending flag.
 *         Does nothing if a capture is already pending (prevents overrun).
 *
 *         NEVER writes to SD from here — use SD_Capture_ServicePending()
 *         in the main loop for the actual file write.
 *
 * @param  src          Live DMA buffer  (e.g. (uint8_t *)BUFFER_ADDRESS)
 * @param  dst          Pre-allocated snapshot buffer (same size)
 * @param  size         Bytes to copy — width * height * bytes_per_pixel
 * @param  interval_ms  Minimum ms between captures (use SD_CAP_SAVE_INTERVAL_MS)
 */
void SD_Capture_RequestFromISR(const uint8_t *src,
                                uint8_t       *dst,
                                uint32_t       size,
                                uint32_t       interval_ms);

/**
 * @brief  Main-loop service — call once per iteration of while(1).
 *         Saves the snapshot to SD if a capture was requested by
 *         SD_Capture_RequestFromISR() and clears the pending flag.
 *         Returns SD_CAP_OK immediately if nothing is pending.
 *
 * @code
 *   while (1) {
 *       ISP_BackgroundProcess(&hcamera_isp);
 *       SD_Capture_ServicePending();
 *   }
 * @endcode
 */
SD_Capture_Status SD_Capture_ServicePending(void);

#ifdef __cplusplus
}
#endif
#endif /* SD_CAPTURE_H */
