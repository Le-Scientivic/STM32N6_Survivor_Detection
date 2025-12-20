# STM32N6570 Survivor Detection with μT-Kernel 3.0

Real-time survivor detection system using the STM32N6570-DK Discovery board with AI/ML acceleration, camera processing, and object tracking.

## 📋 Table of Contents

- [Overview](#overview)
- [Hardware](#hardware)
- [Software Architecture](#software-architecture)
- [Project Structure](#project-structure)
- [Key Components](#key-components)
- [Build Instructions](#build-instructions)
- [Configuration](#configuration)
- [Development Guide](#development-guide)
- [Serial Protocol](#serial-protocol)
- [Performance](#performance)
- [Known Issues](#known-issues)
- [License](#license)

## Overview

This project implements a real-time survivor detection system on the STM32N6570-DK board using:

- **AI Model**: YOLO-X Nano (480x480, INT8 quantized) for survivor detection
- **RTOS**: μT-Kernel 3.0 BSP2 for real-time task management
- **Camera**: Multi-sensor support (IMX335, VD55G1, VD6G) with ISP processing
- **NPU**: Hardware Neural Processing Unit acceleration on STM32N6
- **Display**: 800x480 LCD with real-time bounding box visualization
- **Tracking**: Object tracking module for persistent survivor identification

### Features

- Real-time survivor detection at 30 FPS
- Hardware-accelerated AI inference on NPU
- Multi-pipeline DCMIPP camera processing (display + NN input)
- Object tracking with persistent IDs
- Live performance monitoring (CPU load, FPS)
- Configurable detection thresholds and limits
- Memory-mapped external XSPI RAM/NOR flash

## Hardware

### Target Board

**STM32N6570-DK Discovery Kit**

### MCU Specifications

- **Part Number**: STM32N657X0H3Q
- **Package**: VFBGA264
- **Core**: ARM Cortex-M55 @ 600 MHz
- **NPU**: Integrated Neural Processing Unit
- **FPU**: FPv5-D16 (double-precision)
- **Security**: ARM TrustZone, secure boot (FSBL)

### Peripherals Used

- **Camera Interface**: CSI-2 (2-lane MIPI)
- **DCMIPP**: Dual camera pipe (Pipe1: Display, Pipe2: NN input)
- **Display**: LTDC with 800x480 RGB565 LCD
- **Memory**:
  - XSPI1: External RAM (memory-mapped)
  - XSPI2: NOR Flash (memory-mapped, AI model storage)
  - Internal AXISRAM2 (FSBL execution)
- **Console**: USART1 @ 115200 baud (PE5/PE6)
- **I2C**: I2C1 and I2C2 for sensor control
- **ADC**: ADC1/ADC2 for analog sensing
- **Debug**: SWD interface

### Supported Camera Sensors

- Sony IMX335 (5MP, MIPI CSI-2)
- STMicroelectronics VD55G1
- STMicroelectronics VD66GY (VD6G)

## Software Architecture

### Boot Sequence

```
┌─────────────────┐
│   Power-On      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  FSBL (Secure)  │  First Stage Boot Loader
│  - Init HW      │  Runs in AXISRAM2
│  - Load Appli   │  Configures security
│  - Jump to App  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Application    │  Main Application
│  - μT-Kernel    │  Runs in external XSPI RAM
│  - Camera       │  Full detection pipeline
│  - AI Inference │
│  - Display      │
└─────────────────┘
```

### RTOS Architecture

**μT-Kernel 3.0 BSP2** (T-License 2.2)

- Real-time multitasking kernel
- Priority-based preemptive scheduling
- Semaphores, message queues for synchronization
- Memory pool management
- Hardware abstraction layer for STM32Cube

**Task Structure**:
1. **usermain()**: RTOS initialization, creates main task
2. **main_thread_fct()**: Hardware setup, launches app
3. **app_run()**: Main application loop
   - Camera acquisition
   - AI inference
   - Post-processing
   - Display rendering

### AI Pipeline

```
Camera Sensor
      │
      ▼
┌───────────────┐                     ┌──────────────┐
│  DCMIPP Pipe2 │ → 480x480 RGB888 →  │  NPU         │
│  (NN Input)   │                     │  Inference   │
└───────────────┘                     │  (YOLO-X)    │
                                      └──────┬───────┘
                                             │
                                             ▼
                                      ┌──────────────┐
                                      │ Post-Process │
                                      │ - NMS        │
                                      │ - Threshold  │
                                      └──────┬───────┘
                                             │
                                             ▼
                                      ┌──────────────┐
                                      │   Tracker    │
                                      │              │
                                      └──────┬───────┘
                                             │
                                             ▼
┌───────────────┐                    ┌──────────────┐
│  DCMIPP Pipe1 │ ────────────────►  │   Display    │
│  (800x480)    │    Overlay boxes   │   (LTDC)     │
└───────────────┘                    └──────────────┘
```

## Project Structure

```
STM32N6_MTK_Person_Detection/
├── Appli/                          # Main application
│   ├── Core/
│   │   ├── Src/
│   │   │   ├── main.c             # Entry point, system init
│   │   │   ├── app.c              # Main application loop
│   │   │   ├── app_cam.c          # Camera configuration
│   │   │   ├── mtkernel_bsp.c     # μT-Kernel BSP integration
│   │   │   ├── stm32_lcd_ex.c     # LCD utilities
│   │   │   └── utils.c            # Helper functions
│   │   └── Inc/
│   │       ├── app.h
│   │       ├── app_config.h       # Main configuration
│   │       └── main.h
│   ├── mtk3_bsp2/                 # μT-Kernel 3.0 BSP2
│   │   ├── config/                # RTOS configuration
│   │   ├── include/               # RTOS headers
│   │   ├── mtkernel/              # Kernel source
│   │   └── sysdepend/             # STM32Cube integration
│   ├── STM32N657X0HXQ_LRUN.ld    # Linker script (XSPI RAM)
│   └── .cproject                  # Eclipse project config
│
├── Lib/                           # Libraries (73 MB)
│   ├── AI_Runtime/                # STM32 NeuralART runtime (70 MB)
│   │   ├── Inc/                   # AI API headers
│   │   ├── Npu/                   # NPU low-level drivers
│   │   └── Lib/                   # Pre-built runtime libs
│   ├── Camera_Middleware/         # Camera & ISP (1.6 MB)
│   │   ├── ISP_Library/           # Image signal processor
│   │   └── sensors/               # Sensor drivers
│   ├── lib_vision_models_pp/      # Post-processing (500 KB)
│   ├── ai-postprocessing-wrapper/ # PP wrapper (180 KB)
│   ├── tracker/                   # Object tracking (108 KB)
│   └── screenl/                   # Screen library (520 KB)
│
├── Model/                         # AI Models
│   └── STM32N6570-DK/
│       ├── st_yolo_x_nano_480_1.0_0.25_3_st_int8.tflite
│       ├── network.c              # Generated network code
│       ├── network.h
│       ├── network_ecblobs.h      # Embedded constant blobs
│       ├── network_data.hex       # Model weights (3.6 MB)
│       ├── user_neuralart.json    # NeuralART config
│       └── generate-n6-model.sh   # Model generation script
│
├── STM32Cube_FW_N6/              # STM32N6 HAL/LL drivers
│   ├── Drivers/
│   │   ├── CMSIS/                # ARM CMSIS
│   │   ├── STM32N6xx_HAL_Driver/ # HAL drivers
│   │   └── BSP/STM32N6570-DK/    # Board support
│   ├── Middlewares/              # USB, RTOS (not used)
│   └── Utilities/                # LCD utilities
│
├── Binaries/                      # Build outputs
│   ├── ai_fsbl.hex                # FSBL hex file
│   ├── network_data-dk.hex        # Model data hex
│   └── STM32N6_MTK_Person_Detection_Appli-Trusted.bin
│
├── STM32N6_MTK_Person_Detection.ioc  # STM32CubeMX config
└── .project                       # Root project file
```

## Key Components

### 1. AI Model

**Model**: YOLO-X Nano (ST optimized)
- **Input**: 480x480 RGB888
- **Quantization**: INT8
- **Classes**: 2 (person, not_person)
- **File**: `st_yolo_x_nano_480_1.0_0.25_3_st_int8.tflite`
- **Size**: 1.6 MB
- **Storage**: External NOR flash via XSPI2

**NeuralART Configuration** (`user_neuralart.json`):
```json
{
  "memory_pool": "./my_mpools/stm32n6-app2.mpool",
  "options": "--enable-epoch-controller -O3 --all-buffers-info --mvei
              --cache-maintenance --Oalt-sched --native-float
              --enable-virtual-mem-pools --Omax-ca-pipe 4
              --Ocache-opt --Os"
}
```

### 2. Camera Middleware

**CMW_CAMERA API**:
- Sensor abstraction layer
- ISP (Image Signal Processor) integration
- DCMIPP dual-pipe configuration
- Mirror/flip control
- Auto white balance, exposure

**DCMIPP Pipes**:
- **Pipe1**: Display output (800x480 RGB565)
- **Pipe2**: NN input (480x480 RGB888)

### 3. Post-Processing

**YOLO-X Configuration**:
```c
#define AI_OD_ST_YOLOX_PP_IOU_THRESHOLD      0.5
#define AI_OD_ST_YOLOX_PP_CONF_THRESHOLD     0.6
#define AI_OD_ST_YOLOX_PP_MAX_BOXES_LIMIT    10
```

**Processing Pipeline**:
1. Raw NN output → Decode predictions
2. Non-Maximum Suppression (NMS)
3. Confidence filtering
4. Coordinate transformation
5. Bounding box rendering

### 4. Object Tracking 

Enabled with `TRACKER_MODULE` define:
- Assigns persistent IDs to detected persons
- Maintains tracking across frames
- Kalman filter-based motion prediction

### 5. Display Library (ScreenL)

**SCRL API**:
- LTDC hardware acceleration
- Double buffering
- RGB565/ARGB8888 formats
- Rectangle drawing, text rendering
- Overlay management

## Build Instructions

### Prerequisites

- **IDE**: STM32CubeIDE 1.19.0 or later
- **Toolchain**: ARM GCC (included with STM32CubeIDE)
- **Programmer**: STM32CubeProgrammer 2.20.0 or later
- **Target**: STM32N6570-DK board
- **Debugger**: ST-LINK (on-board)

## Steps to Run Program

### 1. Import Project

1. Open **STM32CubeIDE**.
2. Navigate to:

   ```
   File → Import → Existing Projects into Workspace
   ```
3. Select the project root directory.
4. Import the project:

   ```
   STM32N6_MTK_Person_Detection
   ```

### 2. Flash Signed Binaries

1. Set the **STM32N6570-DK** board to **Dev Boot Mode**:

   * **BOOT0 = LOW**
   * **BOOT1 = HIGH**
2. Open **STM32CubeProgrammer** and **connect** to the board.
3. Go to the **Erasing & Programming** tab.
4. Program the following binaries in order:

   1. **FSBL:**

      ```
      File: Binaries/ai_fsbl.hex
      Action: Start Programming
      ```
   2. **Network Weights:**

      ```
      File: Binaries/network_weights.hex
      Action: Start Programming
      ```
   3. **Trusted Application:**

      ```
      File: Binaries/STM32N6_MTK_Person_Detection_Appli-Trusted.bin
      Start Address: 0x70100000
      Action: Start Programming
      ```
5. **Disconnect** from the board.
6. Set the board to **Flash Boot Mode**:

   * **BOOT0 = LOW**
   * **BOOT1 = LOW**
7. **Reset** or **power cycle** the board.

### 3. Build and Launch Application

1. Set the **STM32N6570-DK** board to **Dev Boot Mode**:

   * **BOOT0 = LOW**
   * **BOOT1 = HIGH**
2. In **STM32CubeIDE**, right-click on the **Appli** project and go to:

   ```
   C/C++ Build → Settings → Build Steps
   ```
3. Modify the **post-build script** with the correct path to the **STM32_SigningTool_CLI** located in:

   ```
   STM32CubeProgrammer/bin
   ```
4. Right-click the **Appli** project and select:

   ```
   Build Project
   ```
5. Verify output file generation:

   ```
   Appli/Debug/STM32N6_MTK_Person_Detection_Appli-Trusted.bin
   ```
6. Click **Run** to launch the application.


### Build Configuration

**Optimization**: `-Os` (Optimize for size)

**Key Compiler Flags**:
```
-mcpu=cortex-m55
-mthumb
-mfpu=fpv5-d16
-mfloat-abi=hard
-mcmse              # ARM TrustZone secure mode
```

**Defines**:
```c
DEBUG
STM32N657xx
STM32N6570_DK_REV
USE_FULL_LL_DRIVER
USE_IMX335_SENSOR
USE_VD55G1_SENSOR
USE_VD66GY_SENSOR
TRACKER_MODULE
LL_ATON_PLATFORM=LL_ATON_PLAT_STM32N6
SCR_LIB_USE_LTDC
```

### Memory Layout

**FSBL** (AXISRAM2):
- Execution: Internal SRAM

**Application** (XSPI RAM):
- Linker: `Appli/STM32N657X0HXQ_LRUN.ld`
- Execution: External memory-mapped XSPI RAM

**AI Model Data** (XSPI NOR Flash):
- Location: Memory-mapped NOR flash
- Access: XIP (Execute-In-Place) mode

## Configuration

### Main Configuration

**File**: `Appli/Core/Inc/app_config.h`

```c
/* Camera */
#define CAMERA_FLIP           CMW_MIRRORFLIP_MIRROR
#define CAMERA_FPS            30

/* Display */
#define LCD_BG_WIDTH          800
#define LCD_BG_HEIGHT         480
#define DISPLAY_DELAY         1    // Frame delay

/* Neural Network */
#define NN_WIDTH              480
#define NN_HEIGHT             480
#define NN_FORMAT             DCMIPP_PIXEL_PACKER_FORMAT_RGB888_YUV444_1
#define NN_BPP                3

/* Classes */
#define NB_CLASSES            2
// ["person", "not_person"]

/* YOLO-X Post-Processing */
#define AI_OD_ST_YOLOX_PP_IOU_THRESHOLD      0.5
#define AI_OD_ST_YOLOX_PP_CONF_THRESHOLD     0.6
#define AI_OD_ST_YOLOX_PP_MAX_BOXES_LIMIT    10
```

### μT-Kernel Configuration

**Files**:
- `Appli/mtk3_bsp2/config/config_device.h`
- `Appli/mtk3_bsp2/config/config_bsp/stm32_cube/config_bsp.h`
- `Appli/mtk3_bsp2/config/config_tm.h`

**Key Settings**:
- Task stack sizes
- Priority levels (0-31, lower = higher priority)
- Interrupt configuration
- Timer tick rate

### Hardware Configuration

**STM32CubeMX** (`.ioc` file):
- Pinout configuration
- Clock tree (600 MHz CPU, peripheral clocks)
- Peripheral initialization
- DMA channels
- Interrupt priorities

To modify:
```
Open STM32N6_MTK_Person_Detection.ioc in STM32CubeMX
Make changes → Save → Generate Code
```

## Development Guide

### Entry Points

1. **main()** (`Appli/Core/Src/main.c:52`):
   - HAL initialization
   - System clock configuration
   - NPU RAM/cache setup
   - Security/IAC configuration
   - Start μT-Kernel

2. **usermain()** (`main.c:86`):
   - μT-Kernel user entry point
   - Create main application task
   - Start task scheduler

3. **main_thread_fct()** (`main.c:111`):
   - NVIC priority configuration
   - Initialize external RAM/NOR
   - Enable low-power clocks
   - Call app_run()

4. **app_run()** (`Appli/Core/Src/app.c`):
   - Main application loop
   - Camera initialization
   - AI inference pipeline
   - Display rendering

### μT-Kernel 3.0 Usage

This project uses **μT-Kernel 3.0 BSP2** (T-License 2.2), a lightweight RTOS designed for embedded systems. The RTOS provides real-time task scheduling, inter-task communication, and synchronization primitives.

#### Task Architecture

The application uses a multi-threaded architecture with the following tasks:

| Task | Priority | Stack Size | Description |
|------|----------|------------|-------------|
| **main_thread** | 15 | 4096 bytes | System initialization, hardware setup |
| **isp_thread** | 10 | 4096 bytes | Camera ISP processing |
| **nn_thread** | 11 | 4096 bytes | Neural network inference on NPU |
| **pp_thread** | 14 | 4096 bytes | Post-processing (NMS, tracking) |
| **dp_thread** | 14 | 4096 bytes | Display rendering and UI updates |

**Priority Levels**: Lower numbers = higher priority (1 is highest). The ISP thread has the highest priority to ensure camera frames are processed without delay.

#### RTOS Services Used

**Task Management**:
- `tk_cre_tsk()` - Create tasks
- `tk_sta_tsk()` - Start tasks
- `tk_slp_tsk()` - Sleep task (suspend execution)
- `tk_wup_tsk()` - Wake up task from sleep
- `tk_dly_tsk()` - Delay task for specified time

**Synchronization**:
- **Semaphores** (`tk_cre_sem()`, `tk_wai_sem()`, `tk_sig_sem()`):
  - `isp_sem` - Trigger camera ISP processing
  - `disp.update` - Synchronize display updates
  - Buffer queue semaphores (`bq->free`, `bq->ready`) - Manage NN input/output buffers

- **Mutexes** (`tk_cre_mtx()`, `tk_loc_mtx()`, `tk_unl_mtx()`):
  - `disp.lock` - Protect shared display info structure between threads

**Memory Management**:
- **Buffer Queues**: Custom circular buffer implementation using semaphores
  - `nn_input_queue` - NN input frame buffers
  - `nn_output_queue` - NN output result buffers
  - Zero-copy pipeline between camera, NN, and display

**Timing Services**:
- `tk_get_otm()` - Get system time for profiling
- `HAL_GetTick()` - Millisecond tick counter (STM32 HAL integration)

#### Task Flow

```
System Boot
    │
    ▼
┌─────────────────┐
│ main()          │ ← Hardware init, start μT-Kernel
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ usermain()      │ ← RTOS entry: create main_thread
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│ main_thread_fct()                                       │
│ - NVIC configuration                                    │
│ - Initialize external RAM/Flash                         │
│ - Create nn_thread, pp_thread, dp_thread, isp_thread    │
│ - Start all tasks                                       │
│ - Call app_run()                                        │
└────────┬────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────┐
│ Concurrent Task Execution (RTOS Scheduler)               │
│                                                          │
│  isp_thread ──► Camera Frame ──► nn_thread ──► NPU       │
│   (prio 10)     (via nn_input_queue)  (prio 11)          │
│                                         │                │
│                                         ▼                │
│                                    pp_thread             │
│                                    (prio 14)             │
│                                         │                │
│                                         ▼                │
│                                    dp_thread             │
│                                    (prio 14)             │
│                                         │                │
│                                         ▼                │
│                                    LCD Display           │
│                                                          │
│  Synchronization:                                        │
│  - nn_input/output_queue (buffer queues with semaphores) │
│  - disp.update (semaphore for display refresh)           │
│  - disp.lock (mutex for shared display info)             │
└──────────────────────────────────────────────────────────┘
```

#### Key RTOS Implementation Details

**File**: `Appli/Core/Src/app.c`
- Task creation and initialization in `app_run()` (line 1100-1132)
- Task priorities defined at line 1040-1043
- Buffer queue implementation with semaphores (line 280-330)
- Mutex and semaphore creation (line 1080-1095)
- Task functions: `nn_thread_fct()`, `pp_thread_fct()`, `dp_thread_fct()`, `isp_thread_fct()`

**File**: `Appli/Core/Src/main.c`
- `main()` starts the RTOS kernel with `knl_start()` (line 84)
- `usermain()` is the RTOS user entry point (line 86)
- Main task creation with priority 15 and 4096 byte stack (line 94-100)
- Hardware initialization before RTOS start

**File**: `Appli/Core/Src/mtkernel_bsp.c`
- μT-Kernel BSP2 integration with STM32Cube HAL
- System timer configuration for RTOS tick
- Interrupt priority group setup for RTOS compatibility

**Configuration Files**:
- `Appli/mtk3_bsp2/config/config_device.h` - Device-specific settings
- `Appli/mtk3_bsp2/config/config_bsp/stm32_cube/config_bsp.h` - BSP configuration
- Stack sizes, heap size, task priorities, timeout values

#### RTOS Benefits for This Application

1. **Deterministic Timing**: Priority-based preemptive scheduling ensures NN inference and camera tasks get CPU time when needed
2. **Pipeline Parallelism**: Camera acquisition, inference, post-processing, and display run concurrently
3. **Synchronization**: Semaphores ensure data consistency between pipeline stages
4. **Resource Management**: Fixed memory pools eliminate dynamic allocation overhead
5. **Real-Time Response**: High-priority tasks (camera ISP) preempt lower-priority tasks (display)

### Key Source Files

| File | Description |
|------|-------------|
| `main.c` | Entry point, system initialization |
| `app.c` | Main application loop, inference pipeline, RTOS task creation |
| `app_cam.c` | Camera and DCMIPP configuration |
| `mtkernel_bsp.c` | μT-Kernel BSP integration with STM32 HAL |
| `network.c` | Generated AI network code |
| `stm32_lcd_ex.c` | LCD drawing utilities |
| `utils.c` | CPU load monitoring, timing |

### Adding New Features

**Example: Modify Detection Threshold**

1. Edit `Appli/Core/Inc/app_config.h`:
   ```c
   #define AI_OD_ST_YOLOX_PP_CONF_THRESHOLD  0.7  // Was 0.6
   ```

2. Rebuild application

**Example: Change Display Resolution**

1. Update `app_config.h`:
   ```c
   #define LCD_BG_WIDTH   640
   #define LCD_BG_HEIGHT  480
   ```

2. Adjust LTDC configuration in `app.c`

3. Update DCMIPP Pipe1 output size

### Debugging

**Console Output** (USART1):
- Baud: 115200
- Pins: PE5 (TX), PE6 (RX)
- Function: `tm_printf()` (μT-Kernel monitor)

**Debug Prints**:
```c
tm_printf((UB *)"DEBUG: Message\n");
```

**ST-LINK Debugging**:
- Use STM32CubeIDE debugger
- Breakpoints, watches, memory view
- SWD interface (default config)

## Serial Protocol

The system outputs structured, machine-parseable JSON messages via USART1 (115200 baud) for easy integration with external systems.

### Message Format

All messages follow this format:
```
[TIMESTAMP] [LEVEL] [MODULE] [EVENT] {json_data}
```

**Components**:
- `TIMESTAMP`: Milliseconds since boot (8 digits, zero-padded)
- `LEVEL`: Message severity (INFO, DATA, PERF, WARN, ERROR, DEBUG)
- `MODULE`: Source module (INIT, RTOS, CAMERA, DETECT, TRACK, DISPLAY, NN, PP, PERF)
- `EVENT`: Event type (see below)
- `json_data`: JSON object with event-specific data

### Configuration

Edit `Appli/Core/Inc/serial_protocol.h` to change output format:

```c
#define SERIAL_OUTPUT_FORMAT FORMAT_JSON    // Machine-parseable JSON
// #define SERIAL_OUTPUT_FORMAT FORMAT_DEBUG // Human-readable debug
// #define SERIAL_OUTPUT_FORMAT FORMAT_BOTH  // Output both formats
```

### System Initialization Messages

**Boot Sequence**:
```json
[00000123] [INFO] [RTOS] [RTOS_START] {}
[00000145] [INFO] [RTOS] [TASK_CREATE] {"task":"main_thread"}
[00000167] [INFO] [RTOS] [TASK_START] {"name":"main_thread","id":1}
[00000189] [INFO] [RTOS] [TASK_READY] {"name":"main_thread","id":1}
[00000201] [INFO] [INIT] [SYSTEM_START] {}
[00000223] [INFO] [INIT] [NVIC_CONFIG] {}
[00000245] [INFO] [INIT] [RAM_INIT] {}
[00000267] [INFO] [INIT] [FLASH_INIT] {}
[00000289] [INFO] [INIT] [CLOCKS_CONFIG] {}
[00000311] [INFO] [INIT] [SYSTEM_READY] {}
```

**Application Initialization**:
```json
[00000333] [INFO] [INIT] [APP_INIT_START] {}
[00000355] [INFO] [CAMERA] [CAMERA_INIT] {}
[00000377] [INFO] [RTOS] [TASK_CREATE] {"name":"nn_thread","id":2}
[00000399] [INFO] [RTOS] [TASK_CREATE] {"name":"pp_thread","id":3}
[00000421] [INFO] [RTOS] [TASK_CREATE] {"name":"dp_thread","id":4}
[00000443] [INFO] [RTOS] [TASK_CREATE] {"name":"isp_thread","id":5}
[00000465] [INFO] [INIT] [APP_INIT_COMPLETE] {}
```

**Thread Startup**:
```json
[00000487] [INFO] [NN] [TASK_START] {"thread":"nn_inference"}
[00000509] [INFO] [PP] [TASK_START] {"thread":"postprocess"}
[00000531] [INFO] [DISPLAY] [TASK_START] {"thread":"display"}
[00000553] [INFO] [CAMERA] [TASK_START] {"thread":"isp"}
[00000575] [INFO] [NN] [TASK_READY] {"thread":"nn_inference"}
```

### Detection Messages

**Without Tracking**:
```json
[00012345] [DATA] [DETECT] [DETECTION_RESULT] {"frame":150,"count":2,"tracking":false,"objects":[{"class":"person","bbox":{"x":120,"y":85,"w":45,"h":120}},{"class":"person","bbox":{"x":450,"y":90,"w":50,"h":130}}]}
```

**With Tracking**:
```json
[00023456] [DATA] [DETECT] [DETECTION_RESULT] {"frame":250,"count":3,"tracking":true,"objects":[{"id":1,"class":"person","bbox":{"x":115,"y":82,"w":48,"h":125}},{"id":3,"class":"person","bbox":{"x":455,"y":88,"w":52,"h":135}},{"id":7,"class":"person","bbox":{"x":200,"y":150,"w":40,"h":110}}]}
```

**Detection Fields**:
- `frame`: Frame number (incrementing counter)
- `count`: Number of objects detected
- `tracking`: Boolean indicating if tracking is enabled
- `objects`: Array of detected objects
  - `id`: Tracking ID (only with tracking enabled)
  - `class`: Object class ("person")
  - `bbox`: Bounding box in display coordinates
    - `x`, `y`: Top-left corner (pixels)
    - `w`, `h`: Width and height (pixels)

### Performance Messages

**Frame Events**:
```json
[00012345] [DATA] [DISPLAY] [FRAME_START] {"frame":150,"count":2,"tracking":false,"buffer":0}
```

**Timing Metrics**:
```json
[00012389] [PERF] [PERF] [TIMING] {"frame":150,"inference_ms":32,"pp_ms":4,"display_ms":8,"period_ms":44,"fps":22}
```

**Timing Fields**:
- `frame`: Frame number
- `inference_ms`: Neural network inference time
- `pp_ms`: Post-processing time (NMS, tracking)
- `display_ms`: Display rendering time
- `period_ms`: Total frame period
- `fps`: Frames per second as integer (e.g., 22)

### Warning/Error Messages

**Detection Overflow**:
```json
[00034567] [WARN] [PP] [WARNING] {"msg":"detection_overflow","detected":15,"limit":10}
```

This warning occurs when the number of detected objects exceeds `AI_OD_PP_MAX_BOXES_LIMIT`. The system automatically clamps to the maximum.

### Example Parser (Python)

```python
#!/usr/bin/env python3
import serial
import json
import re

def parse_serial_message(line):
    """Parse structured serial message"""
    pattern = r'\[(\d+)\] \[(\w+)\] \[(\w+)\] \[(\w+)\] (.+)'
    match = re.match(pattern, line)
    if not match:
        return None

    timestamp, level, module, event, data = match.groups()
    try:
        json_data = json.loads(data)
        return {
            'timestamp': int(timestamp),
            'level': level,
            'module': module,
            'event': event,
            'data': json_data
        }
    except json.JSONDecodeError:
        return None

def main():
    # Open serial port
    port = serial.Serial('/dev/ttyUSB0', 115200, timeout=1)

    print("Listening for detection events...")

    while True:
        line = port.readline().decode('utf-8').strip()
        if not line:
            continue

        msg = parse_serial_message(line)
        if not msg:
            continue

        # Process detection results
        if msg['module'] == 'DETECT' and msg['event'] == 'DETECTION_RESULT':
            frame = msg['data']['frame']
            count = msg['data']['count']
            tracking = msg['data']['tracking']

            print(f"\nFrame {frame}: {count} person(s) detected")
            print(f"Tracking: {'ON' if tracking else 'OFF'}")

            for i, obj in enumerate(msg['data']['objects']):
                bbox = obj['bbox']
                if 'id' in obj:
                    print(f"  Person {i+1} (ID {obj['id']}): x={bbox['x']}, y={bbox['y']}, w={bbox['w']}, h={bbox['h']}")
                else:
                    print(f"  Person {i+1}: x={bbox['x']}, y={bbox['y']}, w={bbox['w']}, h={bbox['h']}")

        # Process performance metrics
        elif msg['module'] == 'PERF' and msg['event'] == 'TIMING':
            perf = msg['data']
            print(f"Frame {perf['frame']}: {perf['fps']} FPS (inf={perf['inference_ms']}ms, pp={perf['pp_ms']}ms, disp={perf['display_ms']}ms)")

if __name__ == '__main__':
    main()
```

### Integration Examples

**Node.js (Socket.io)**:
```javascript
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const io = require('socket.io')(3000);

const port = new SerialPort('/dev/ttyUSB0', { baudRate: 115200 });
const parser = port.pipe(new Readline({ delimiter: '\n' }));

parser.on('data', (line) => {
  const match = line.match(/\[(\d+)\] \[(\w+)\] \[(\w+)\] \[(\w+)\] (.+)/);
  if (!match) return;

  const [, timestamp, level, module, event, data] = match;
  try {
    const msg = {
      timestamp: parseInt(timestamp),
      level, module, event,
      data: JSON.parse(data)
    };

    // Broadcast to all connected clients
    if (module === 'DETECT' && event === 'DETECTION_RESULT') {
      io.emit('detection', msg.data);
    } else if (module === 'PERF' && event === 'TIMING') {
      io.emit('performance', msg.data);
    }
  } catch (e) {
    console.error('Parse error:', e);
  }
});
```

**MQTT Bridge**:
```python
import paho.mqtt.client as mqtt
import serial
import json
import re

client = mqtt.Client()
client.connect("mqtt.example.com", 1883)

port = serial.Serial('/dev/ttyUSB0', 115200)

while True:
    line = port.readline().decode('utf-8').strip()
    msg = parse_serial_message(line)  # Use function from above
    if not msg:
        continue

    # Publish to MQTT topics
    topic = f"stm32n6/survivor/{msg['module'].lower()}/{msg['event'].lower()}"
    client.publish(topic, json.dumps(msg['data']))

    # Special handling for detections
    if msg['module'] == 'DETECT' and msg['event'] == 'DETECTION_RESULT':
        client.publish("stm32n6/survivor/count", msg['data']['count'])
```

### Message Reference

| Level | Module | Event | Description |
|-------|--------|-------|-------------|
| INFO | RTOS | RTOS_START | RTOS kernel started |
| INFO | RTOS | TASK_CREATE | Task created |
| INFO | RTOS | TASK_START | Task started |
| INFO | RTOS | TASK_READY | Task ready |
| INFO | INIT | SYSTEM_START | System initialization started |
| INFO | INIT | NVIC_CONFIG | Interrupt controller configured |
| INFO | INIT | RAM_INIT | External RAM initialized |
| INFO | INIT | FLASH_INIT | External flash initialized |
| INFO | INIT | CLOCKS_CONFIG | Clock configuration complete |
| INFO | INIT | SYSTEM_READY | System ready, starting application |
| INFO | INIT | APP_INIT_START | Application initialization started |
| INFO | INIT | APP_INIT_COMPLETE | Application initialization complete |
| INFO | CAMERA | CAMERA_INIT | Camera initialized |
| INFO | CAMERA | TASK_START | Camera ISP thread started |
| INFO | NN | TASK_START | Neural network thread started |
| INFO | NN | TASK_READY | NN thread ready for inference |
| INFO | PP | TASK_START | Post-processing thread started |
| INFO | DISPLAY | TASK_START | Display thread started |
| DATA | DETECT | DETECTION_RESULT | Detection results with bounding boxes |
| DATA | DISPLAY | FRAME_START | Frame rendering started |
| PERF | PERF | TIMING | Frame timing and performance metrics |
| WARN | PP | WARNING | Post-processing warning |

## Performance

### Typical Metrics

- **Inference Time**: ~30-50ms per frame (NPU accelerated)
- **Frame Rate**: 25-30 FPS (camera + inference + display)
- **CPU Load**: 40-60% (with NPU offload)
- **Memory Usage**:
  - Code: ~700 KB
  - AI Model: 3.6 MB (external flash)
  - Runtime buffers: ~4 MB (external RAM)

### Optimization Tips

1. **NPU Acceleration**: Ensure NPU is properly initialized
2. **Cache Management**: Enable I/D-Cache for better performance
3. **DMA**: Use DMA for large memory transfers
4. **Memory Pools**: Configure optimal memory pool sizes
5. **Compiler Flags**: Use `-O3` or `-Os` optimization

### CPU Load Monitoring

Displayed on-screen:
- Real-time CPU usage percentage
- Frame timing statistics
- FPS counter

Implementation: `Appli/Core/Src/utils.c`
