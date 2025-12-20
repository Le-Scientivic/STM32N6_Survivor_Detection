# μT-Kernel 3.0 BSP2 User's Manual <!-- omit in toc -->
## STM32Cube edition <!-- omit in toc -->
## Version 01.00.B6 <!-- omit in toc -->
## 2025.05.29 <!-- omit in toc -->

- [1. Introduction](#1-Introduction)
	- [1.1. Target microcomputer board](#11-target-microcomputer-board)
	- [1.2. Development Environment](#12-development-environment)
	- [1.3. Software Configuration](#13-software-configuration)
	- [1.4 TrustZone support](#14-trustzone-support)
- [2. BSP-specific Features](#2-bsp-specific-features)
  - [2.1. Debug Serial Output](#21-debug-serial-output)
  - [2.2. Using Standard Header Files](#22-using-standard-header-files)
  - [2.3. FPU Support](#23-fpu-support)
- [3. Device Drivers](#3-device-drivers)
  - [3.1. Sample Device Driver (A/DC)](#31-sample-device-driver-adc)
    - [3.1.1. Overview](#311-overview)
    - [3.1.2. How to Use Device Drivers](#312-how-to-use-device-drivers)
  - [3.2. Sample Device Driver (I2C)](#32-sample-device-driver-i2c)
    - [3.2.1. Overview](#321-overview)
    - [3.2.2. How to Use Device Drivers](#322-how-to-use-device-drivers)
- [4. Program Creation Procedure](#4-program-creation-procedure)
  - [4.1. Creating a Project Using STM32Cube IDE](#41-creating-a-project-using-stm32cube-ide)
  - [4.2. Incorporating μT-Kernel 3.0 BSP2](#42-incorporating-μt-kernel-30-bsp2)
    - [4.2.1. Incorporating Source Code](#421-incorporating-source-code)
    - [4.2.2. Adding Build Settings](#422-adding-build-settings)
    - [4.2.3. Calling OS Startup Process](#423-calling-os-startup-process)
  - [4.3. User Program](#43-user-program)
    - [4.3.1. Creating a User Program](#431-creating-a-user-program)
    - [4.3.2. Usermain Function](#432-usermain-function)
    - [4.3.3. Program Examples](#433-program-examples)
  - [4.4. Build and Run](#44-build-and-run)
    - [4.4.1. Building a Program](#441-building-a-program)
    - [4.4.2. Debugging Settings](#442-debugging-settings)
    - [4.4.3. Running a Program](#443-running-a-program)
- [5. Change History](#5-change-history)

# 1. Introduction
This document explains how to use μT-Kernel 3.0 BSP2.
μ T-Kernel 3.0 BSP2 is a BSP ( Board Support Package) for using the real-time OS μT-Kernel 3.0 with the development environment and tools for microcontrollers provided by microcontroller manufacturers, as well as utilizing firmware and other similarly provided software .  

This document explains the μT-Kernel 3.0 BSP2 for the microcontroller board equipped with the STM32 microcontroller from STMicroelectronics.

## 1.1. Target microcomputer board
μT-Kernel 3.0 BSP2 supports the following STM32 microcontroller boards:

| Microcomputer Board | Microcomputer | CPU Core | Notes |
| ------------- | ----------- | ------------- | ---------- |
| NUCLEO-L476RG | STM32L476RG | Arm Cortex-M4 | STMicroelectronics Nucleo-64 |
| NUCLEO-L4R5ZI | STM32L476RG | Arm Cortex-M4 | STMicroelectronics Nucleo-64 |
| NUCLEO-F401RE | STM32F401RE | Arm Cortex-M4 | STMicroelectronics Nucleo-64 |
| NUCLEO-F411RE | STM32L411RE | Arm Cortex-M4 | STMicroelectronics Nucleo-64 |
| NUCLEO-F446RE | STM32F446RE | Arm Cortex-M4 | STMicroelectronics Nucleo-64 |
| NUCLEO-G431KB | STM32G431KB | Arm Cortex-M4 | STMicroelectronics Nucleo-64 |
| NUCLEO-G491RE | STM32G491RE | Arm Cortex-M4 | STMicroelectronics Nucleo-64 |
| NUCLEO-F767ZI | STM32F767ZI | Arm Cortex-M7 | STMicroelectronics Nucleo-144 |
| NUCLEO-H723ZG | STM32H723ZG | Arm Cortex-M7 | STMicroelectronics Nucleo-144 |
| STM32N6570-DK | STM32N657X0H3Q | Arm Cortex-M55 | STMicroelectronics Discovery kit |

## 1.2. Development Environment
The development environment used is the STM32Cube IDE, an integrated development environment from STMicroelectronics.
In addition, various STM32Cube software is used as firmware.
This document has been verified to work with the following versions:

`STM32CubeIDE Version: 1.18.1`

For more information, please visit the following website.

Integrated development environment for STM32
https://www.st.com/ja/development-tools/stm32cubeide.html

## 1.3. Software Configuration
μT-Kernel 3.0 BSP2 consists of the real-time OS μT-Kernel 3.0, dependent programs for the target microcontroller board, and sample device drivers.
μT-Kernel 3.0 uses the following versions:

- μT-Kernel 3.0 (v3.00.08)

The file structure of μT-Kernel 3.0 BSP2 is shown below.

- mtk3_bsp2 root directory
- config configuration definition file
- include include file
- mtkernel OS source code
- sysdepend Microcontroller dependent source code
- stm32_cube Source code for STM32 microcontrollers and STM32Cube
- CPU CPU (ARM core) dependent source code
- lib library hardware dependent parts
- device sample device driver
-doc documentation

The mtkernel directory is a Git submodule of μT-Kernel 3.0, which has been released by TRON Forum. The source code under the mtkernel directory only uses common code that is not hardware-dependent.
The source code that depends on the microcontroller board and firmware is in the sysdepend directory.
The device directory contains a sample device driver program using STM32Cube. Basic I2C and A/DC functions are available .  

## 1.4 TrustZone support
Please note the following points for microcontrollers that have the TrustZone function enabled.
This version of μT-Kernel 3.0 BSP2 only supports secure execution. It is intended to be used in a configuration consisting of only FSBL (First Stage Boot loader) and secure applications. Applications consisting of both secure and non-secure applications will be supported in future versions.
In TrustZone-enabled development using STM32CubeIDE, a project consists of multiple subprojects, such as FSBL, secure application, non-secure application, etc. μT-Kernel 3.0 BSP2 can only be incorporated into subprojects that run in the secure state.

# 2. BSP-specific features
## 2.1. Debug Serial Output
Serial output for debugging is available.
This feature can be enabled or disabled by changing the following in the configuration file (config/config.h) and building.

```c
/*---------------------------------------------------------------------- */
/* Use T-Monitor Compatible API Library & Message to terminal.
* 1: Valid 0: Invalid
*/
#define 	USE_TMONITOR 		(1)/* T-Monitor API */
```

For debugging serial output, you can use the T-Monitor compatible API tm_printf. tm_printf has almost the same functionality as the standard C function printf, but it cannot use floating-point numbers.
The serial output settings are as follows:

| Item | Value |
|-------- | --------- |
| Speed | 115200bps |
| Data length | 8bit |
| Parity | None |
| Stop Bit | 1 bit |
| Flow Control | None |

The serial signal is connected to the board's debugger ST-LINK micro USB connector. Specifically, the following microcontroller peripherals are used:

| Microcomputer Board | Peripherals |
| ------------- | ----------- |
| NUCLEO-L476RG | USART2 |
| NUCLEO-L4R5ZI | LPUART1|
| NUCLEO-F401RE | USART2 |
| NUCLEO-F411RE | USART2 |
| NUCLEO-F446RE | USART2 |
| NUCLEO-G431KB | LPUART1|
| NUCLEO-G491RE | LPUART1|
| NUCLEO-F767ZI | USART3 |
| NUCLEO-H723ZG | USART3 |
| STM32N6570-DK | USART1 |

## 2.2. Using standard header files
It is possible to use standard header files for C. μT-Kernel 3.0 programs also use <stddef.h> and <stdint.h>.
or not to use the standard header files by changing the following in the configuration file (config/config.h) . If you do not use them, an error may occur when you include the standard header files from your program.

```C
/*---------------------------------------------------------------------- */
/*
* 	Use Standard C include file
*/
#define USE_STDINC_STDDEF 	(1)/* Use <stddef.h> */
#define USE_STDINC_STDINT 	(1) /* Use <stdint.h> */
```

FPU support
This BSP supports the FPU built into the microcontroller. The task context information includes information about the FPU registers, etc.
You can specify whether to use or not use the FPU by changing the following in the configuration file (config/config.h) . However, since the FSP enables the FPU , FPU support in this BSP must always be enabled.  

```C
/*---------------------------------------------------------------------- */
/* Use Co-Processor.
* 1: Valid 0: Invalid
*/
#define 	USE_FPU 			(1)/* Use FPU */
```

Tasks that use the FPU must specify TA_FPU as a task attribute. However, in the development environment for this microcontroller, it is not possible to specify whether or not to use the FPU for part of a program. Therefore, if you are using the FPU , we recommend that you specify TA_FPU as an attribute for all tasks .  
By setting the following in the configuration file (config/config.h) to 1, all tasks can be made FPU-enabled regardless of the task attribute value.

```C
#define 	ALWAYS_FPU_ATR 		(1)/* Always set the TA_FPU attribute on all tasks */
```

# 3. Device Drivers
## 3.1. Sample Device Driver (A/DC)
Overview
The A/DC device driver can control the A/D converter built into the microcontroller.
This BSP has A/DC device drivers for the following devices:

| Device Name | BSP Device Name | Description |
| ----- | --------- | ---------------------------- |
| ADC | hadc | Analog-to-digital converters |

The device driver uses STM32CubeFW for internal processing. This device driver is a sample program that shows how to use STM32CubeFW with μT-Kernel 3.0, and only supports the basic functions of the device.
Below is the source code for the A/DC device driver.
 
```mtk3_bsp2/sysdepend/stm32_cube/device/hal_adc```

This device driver can be enabled or disabled by changing the following in the BSP configuration file (config/config_bsp/stm32_cube/config_bsp.h) and building the file.

```C
/* ------------------------------------------------------------------------ */
/* Device usage settings
* 	1: Use 0: Do not use
*/
#define DEVCNF_USE_HAL_ADC 		1// A/D conversion device
```

This device driver calls STM32CubeFW internally, so when using it, first configure STM32CubeFW for the target device. The association between STM32CubeFW and the device driver is explained in the next section.

### 3.1.2. How to use device drivers
(1) STM32CubeFW settings
Configure the A/D converter to be used from the A/DC device driver using STM32CubeIDE.
The file with the extension ioc in the project is the configuration file. Open this file in STM32CubeIDE.
Set the A/D converter pin to be used in `Pinout` of `Pinout & Configuration`.

(Reference) The correspondence between the analog inputs (A0 to A5) of the Arduino compatible interface of each board and the inputs of the A/D converter of the microcontroller is as follows.

| Arduino Analog Input | F401, F411 | F446 | L476 |
| ------------- | --------- | ----------- | ---------- |
| A0 | ADC1_0 | ADC123_IN0 | ADC12_IN5 |
| A1 | ADC1_1 | ADC123_IN1 | ADC12_IN6 |
| A2 | ADC1_4 | ADC12_IN4 | ADC12_IN9 |
| A3 | ADC1_8 | ADC12_IN8 | ADC12_IN15 |
| A4 | ADC1_11 | ADC123_IN11 | ADC123_IN2 |
| A5 | ADC1_10 | ADC123_IN10 | ADC123_IN1 |


| Arduino Analog Input | H723 | F767 | L4R5 | G431, G491 |
| ------------- | ------------ | ----------- | ---------- | ---------------------- |
| A0 | ADC12_INP15 | ADC123_IN3 | ADC12_IN8 | ADC12_IN1 |
| A1 | ADC123_INP10 | ADC123_IN10 | ADC123_IN1 | ADC12_IN2 |
| A2 | ADC12_INP13 | ADC123_IN13 | ADC123_IN4 | ADC2_IN17 |
| A3 | ADC12_INP5 | ADC3_IN9 | ADC123_IN2 | ADC3_IN12 or ADC1_IN15 |
| A4 | ADC123_INP12 | ADC3_IN15 | ADC12_IN13 | ADC12_IN7 |
| A5 | ADC3_INP6 | ADC3_IN8 | ADC12_IN14 | ADC12_IN6 |

| Arduino Analog Input | STM32N6570-DK | |
| ------------- | ------------ | --- |
| A0 | ADC2_18 | |
| A1 | ADC1_10 | |
| A2 | ADC1_11 | |
| A3 | ADC1_13 | |
| A4 | ADC1_16 | |
| A5 | ADC1_8 | |

In `Pinout & Configuration`, select the A/D converter you want to use from `Analog` in `Software Packs` and configure it.
In `Mode`, set the input used by the A/D converter to `Single-ended`.
Enable interrupts in `NVIC Settings` under `Configuration`, other settings assume default settings.
To set the interrupt priority, select `NVIC` from `System Core`.
After setting it up, save the ioc file and the STM32CubeFW source code will be automatically generated.

* When using TrustZone
To use TrustZone, please configure it for the subproject that incorporates μT-Kernel 3.0 (in the current version, this can only be done in secure applications).

* STM32N6570 settings
The STM32N6570 has TrustZone enabled. To use the A/D converter from a secure environment, you need to configure RIFSC.
Add the following setting code to the `USER CODE BEGIN ADC1_Init 1` area in the MX_ADC1_Init function of the main.c file generated by STM32CubeMX.

```C
/* USER CODE BEGIN ADC1_Init 1 */
__HAL_RCC_RIFSC_CLK_ENABLE();
RIFSC->RISC_SECCFGRx[2] |= 0x1;
/* USER CODE END ADC1_Init 1 */
```

(2) Initializing the device driver
To use the A/DC device driver, first initialize it with the `dev_init_hal_adc` function. This will generate an A/DC device driver with an associated HAL. This function is defined as follows:

```C
ER dev_init_hal_adc(
UW unit, // Device unit number (0 to DEV_HAL_ADC_UNITNM)
ADC_HandleTypeDef *hadc // ADC handler structure
);
```

The parameter unit must be specified in order starting from 0. Numbers cannot be skipped.
The parameter hadc is information automatically generated by STM32CubeIDE.
If initialization is successful, a device driver with the device name `hadc*` will be created. The `*` in the device name will be assigned an alphabetical character starting from `a`. The device name for unit number 0 will be `hadca`, and the device name for unit number 1 will be `hadcb`.

The device driver is initialized by the `knl_start_device` function in the μT-Kernel 3.0 BSP2 startup process. The knl_start_device function is written in the following file.

`mtk3_bsp2/sysdepend/stm32_cube/devinit.c`

The contents of the knl_start_device function are shown below. Here, it initializes the device drivers used for the analog input of the Arduino-compatible interface for each board. A μT-Kernel 3.0 device driver associated with `hadc1`, `hadc2`, and `hadc3` of the STM32CubeFW is generated.
Please change it according to the A/D converter you are actually using.

```C
EXPORT ER knl_start_device( void )
{
	ERerr = E_OK;

//partially omitted

#if DEVCNF_USE_HAL_ADC
	IMPORT ADC_HandleTypeDefhadc1;
	err = dev_init_hal_adc(DEV_HAL_ADC1, &hadc1);
	if(err < E_OK) return err;

#if defined(MTKBSP_NUCLEO_STM32H723) || defined(MTKBSP_NUCLEO_STM32F767)
	IMPORT ADC_HandleTypeDefhadc3;
	
	err = dev_init_hal_adc(DEV_HAL_ADC2, NULL);// hadc2 is not used
	if(err < E_OK) return err;
	err = dev_init_hal_adc(DEV_HAL_ADC3, &hadc3);
	if(err < E_OK) return err;

#elif defined(MTKBSP_NUCLEO_STM32G431) || defined(MTKBSP_NUCLEO_STM32G491)|| defined(MTKBSP_DISCOVERY_STM32N657)
	IMPORT ADC_HandleTypeDefhadc2;
	
	err = dev_init_hal_adc(DEV_HAL_ADC2, &hadc2);
	if(err < E_OK) return err;
	err = dev_init_hal_adc(DEV_HAL_ADC3, NULL);// hadc3 is not used.
	if(err < E_OK) return err;
#else
//#elif defined(MTKBSP_NUCLEO_STM32L476) || defined(MTKBSP_NUCLEO_STM32F401) || defined(MTKBSP_NUCLEO_STM32F411) || defined(MTKBSP_NUCLEO_STM32F446)
	err = dev_init_hal_adc(DEV_HAL_ADC2, NULL);// hadc2 is not used
	if(err < E_OK) return err;
	err = dev_init_hal_adc(DEV_HAL_ADC3, NULL);// hadc3 is not used
	if(err < E_OK) return err;

#endif
#endif 	/* DEVCNF_USE_HAL_ADC */

	return err;
}
```

(3) Device driver operation
The μT-Kernel 3.0 device management API allows you to operate device drivers. For details about the API, refer to the μT-Kernel 3.0 specifications.
First, specify the target device name using the open API tk_opn_dev to open the device.
After opening, data can be obtained using the synchronous read API tk_srea_dev. Specify the A/DC channel in the parameter data start position.
This device driver can only obtain one piece of data from one channel at a time.

Below is a sample program using the A/DC device driver.  
This program is an execution function for a task that acquires data from A/DC channel 9 and channel 0 at 500ms intervals and sends the values to the debug serial output. Match the channel numbers to the A/D converter you are actually using.

```C
LOCAL void task_1(INT stacd, void *exinf)
{
UW 	adc_val1, adc_val2;
	IDdd; // Device descriptor
	ERerr; // Error code

	dd = tk_opn_dev((UB*)"hadca", TD_UPDATE); // Open the device
	while(1) {
		err = tk_srea_dev(dd, 9, &adc_val1, 1, NULL); // Get data from A/DC channel 9
		err = tk_srea_dev(dd, 0, &adc_val2, 1, NULL); // Get data from A/DC channel 0
		tm_printf((UB*)"A/DC A0 =%06d A/DC A1 =%06d\n", adc_val1, adc_val2); // Debug output
		tk_dly_tsk(1000); // Wait 500ms
	}
}
```

## 3.2. Sample Device Driver (I2C)
Overview
The I2C device driver can control the I2C communication device built into the microcontroller.
This BSP has I2C device drivers for the following devices:

| Device Name | BSP Device Name | Description |
| ------- | --------- | ---------------------------------------- |
| I2C | hiic | Inter-integrated circuit (I2C) interface |

The device driver uses STM32CubeFW for internal processing. This device driver is a sample program that shows how to use STM32CubeFW with μT-Kernel 3.0, and supports only the basic functions of the device.
Below is the source code for the I2C device driver.

```mtk3_bsp2/sysdepend/stm32_cube/device/hal_i2c```

This device driver can be enabled or disabled by changing the following in the BSP configuration file (config/config_bsp/stm32_cube/config_bsp.h) and building the file.

```C
/* ------------------------------------------------------------------------ */
/* Device usage settings
* 	1: Use 0: Do not use
*/
#define DEVCNF_USE_HAL_IIC 		1// I2C communication device
```

The I2C device driver uses STM32CubeFW, so please enable I2C in STM32CubeFW. The association between STM32CubeFW and this device driver will be explained in the next section.

### 3.2.2. How to use device drivers
(1) STM32CubeFW settings
Use STM32CubeIDE to configure the A/D converter terminals used by the I2C device driver.
the extension ioc in the project is the configuration file. Open this file in STM32CubeIDE.
Set the I2C converter pin to be used in `Pinout` of `Pinout & Configuration`.

(Reference) The correspondence between the I2C signals of the Arduino compatible interface of each board and the I2C terminals of the microcontroller is as follows.

| Board I2C Signals | STM32N6570-DK | Other Boards |
|--------------- | ------------- | ------------ |
| Arduino I2C SCL | PH9/I2C1_SCL | PB8/I2C1_SCL |
| Arduino I2C SDA | PC1/I2C1_SDA | PB9/I2C1_SDA |

In `Pinout & Configuration`, select the I2C you want to use from `Connectivity` in `Software Packs` and configure it.
Set the I2C mode to `I2C` in `Mode`.
Enable interrupts in `NVIC Settings` under `Configuration`, other settings assume default settings.
To set the interrupt priority, select `NVIC` from `System Core`.
After setting it up, save the ioc file and the STM32CubeFW source code will be automatically generated.

* When using TrustZone
To use TrustZone, please configure it for the subproject that incorporates μT-Kernel 3.0 (in the current version, this can only be done in secure applications).

(2)) Initializing the device driver
To use the I2C device driver, first initialize it with the `dev_init_hal_i2c` function. This will generate an I2C device driver associated with the specified HAL. This function is defined as follows:

```C
ER dev_init_hal_i2c(
UW unit, // Device unit number (0 to DEV_HAL_ADC_UNITNM)
I2C_HandleTypeDef *hi2c // I2C handle structure
);
```
The parameter unit must be specified in order starting from 0. Numbers cannot be skipped.
The parameter hai2c is the I2C information that is automatically generated when you configure STM32Cube.
If initialization is successful, a device driver with the device name `hiic*` will be generated. The `*` in the device name will be assigned an alphabetical character starting from `a`. The device name for unit number 0 will be `hiica`, and the device name for unit number 1 will be `hiicb`.

The device driver is initialized by the knl_start_device function in the μT-Kernel 3.0 BSP2 startup process. The knl_start_device function is written in the following file:

`mtk3_bsp2/sysdepend/stm32_cube/devinit.c`

The contents of the knl_start_device function are shown below. Please change this according to the actual device driver you are using.

```C
EXPORT ER knl_start_device( void )
{
ER 	err = E_OK;

#if DEVCNF_USE_HAL_IIC
	IMPORT I2C_HandleTypeDefhi2c1;

	err = dev_init_hal_i2c(DEV_HAL_I2C1, &hi2c1);
	if(err < E_OK) return err;
#endif
//Omit the following
}
```

(3) Device driver operation
The μT-Kernel 3.0 device management API allows you to operate device drivers. For details about the API, refer to the μT-Kernel 3.0 specifications.
This device driver only supports I2C controller (master) mode.
First, specify the target device name using the open API tk_opn_dev to open the device.
After opening, data can be received using the synchronous read API tk_srea_dev, and data can be sent using the synchronous write API tk_swri_dev. Specify the target (slave) address in the data start position of the parameter.

(4) Device register access
The following functions are available for accessing registers in target devices connected via I2C. These correspond to the relatively commonly used procedures for accessing registers in devices. However, please note that they may not be available for all devices.

The register read function sends the register address value (1 byte) to the target device, and then receives the data (1 byte).

```C
/* Register read function */
ER i2c_read_reg(
ID dd, // Device descriptor
UW sadr, // target address
UW radr, // Register address (only the lower 8 bits are valid)
UB *data // Read data (1 byte)
);

```
The register write function sends the value of the register address (1 byte) to the target device, followed by data (1 byte).

```C
/* Register write function */
ER i2c_write_reg(
ID dd, // Device descriptor
UW sadr, // target address
UW radr, // Register address (only the lower 8 bits are valid)
UB data // Data to write (1 byte)
);
```

# 4. Program Creation Procedure
This article explains the steps to create a program project in the STM32Cube IDE, incorporate the μT-Kernel 3.0 BSP2, build it, and run it.

## 4.1. Creating a project with STM32Cube IDE
Follow the steps below to create a project for the target microcontroller board. This is the standard procedure for STM32Cube IDE.

(1) Select [File] → [New] → [STM32 Project] from the menu.
(2) Select the target microcontroller board.
(3) Create a project with the following settings:
- Target Language: C
- Target Binary Type: Executable
- Target Project Type: STM32Cube

The microcontroller pin settings and basic configuration settings have been completed, so please make the necessary settings depending on the application you are developing.

* When using TrustZone
This version of μT-Kernel 3.0 BSP2 only supports secure application execution. When creating a project, please set the `Project Structure` as follows:

- Secure domain only
- Check `FSBL` and `Appli`

Two sub-modules will be generated: FSBL and the secure application. μT-Kernel 3.0 BSP2 will be incorporated into the secure application sub-project.

## 4.2. Incorporation of μT-Kernel 3.0 BSP2
### 4.2.1. Embedding Source Code
Incorporate the μT-Kernel 3.0 BSP2 source code into the created project.
Obtain μT-Kernel 3.0 BSP2 from the GitHub repository below and place the μT-Kernel 3.0 BSP2 source code directory mtk3_bsp2 in the project directory.

`https://github.com/tron-forum/mtk3_bsp2.git`

If you want to use git commands, make the project directory the current directory and run the following command.

`git clone --recursive https://github.com/tron-forum/mtk3_bsp2.git`

μT-Kernel 3.0 BSP2 includes the μT-Kernel 3.0 repository as a git submodule, so --recursive is required to obtain the entire source code.

The imported μT-Kernel 3.0 BSP2 directory may be set as an exception for building with STM32Cube IDE, so change the properties.
If `Exclude resource from build` is checked, uncheck it.

### 4.2.2. Adding Build Settings
Add the settings to build the μT-Kernel 3.0 BSP2 source code to the project properties.
Set the following in [C/C++ Built] → [Settings] → [Tool Settings].

(1) [MCU GCC Compiler] → [Preprocessor]
Set the target name of the target microcontroller board in [Define symbols].

|Microcontroller board|Target name|
|-|-|
| NUCLEO-L476RG | \_STM32CUBE_NUCLEO_L476_ |
| NUCLEO-L4R5ZI | \_STM32CUBE_NUCLEO_L4R5_ |
| NUCLEO-F401RE | \_STM32CUBE_NUCLEO_F401_ |
| NUCLEO-F411RE | \_STM32CUBE_NUCLEO_F411_ |
| NUCLEO-F446RE | \_STM32CUBE_NUCLEO_F446_ |
| NUCLEO-G431KB | \_STM32CUBE_NUCLEO_G431_ |
| NUCLEO-G491RE | \_STM32CUBE_NUCLEO_G491_ |
| NUCLEO-F767ZI | \_STM32CUBE_NUCLEO_F767_ |
| NUCLEO-H723ZG | \_STM32CUBE_NUCLEO_H723_ |
| STM32N6570-DK | \_STM32CUBE_DISCOVERY_N657_ |

(2) [MCU GCC Compiler]→[include paths]
Set the following in [Include paths]:
It is assumed that the μ T-Kernel 3.0 BSP2 directory mtk3_bsp2 is located directly under the project directory .

```
"${workspace_loc:/${ProjName}/mtk3_bsp2}"
"${workspace_loc:/${ProjName}/mtk3_bsp2/config}"
"${workspace_loc:/${ProjName}/mtk3_bsp2/include}"
"${workspace_loc:/${ProjName}/mtk3_bsp2/mtkernel/kernel/knlinc}"
```

(3) [MCU GCC Assembler]→[Preprocessor]
Make the same settings as in (1).

(4) [MCU GCC Assembler]→[include paths]
Make the same settings as in (2).

### 4.2.3. Calling the OS startup process
The generated project executes the main function after initializing the hardware.
Add code to execute the μT-Kernel 3.0 startup process knl_start_mtkernel function from the main function.
The main function is written in the following file:

`<project directory>/Core/Src/main.c`

Write the following between `/* USER CODE BEGIN 2 */` and `/* USER CODE END 2 */` in the main function.

```C
int main(void)
{
/* USER CODE BEGIN 1 */

/* USER CODE END 1 */

/* MCU Configuration-----------------------------------------------------*/

/* Reset of all peripherals, Initializes the Flash interface and the Systick. */
HAL_Init();

/* USER CODE BEGIN Init */

/* USER CODE END Init */

/* Configure the system clock */
SystemClock_Config();

/* USER CODE BEGIN SysInit */

/* USER CODE END SysInit */

/* Initialize all configured peripherals */
MX_GPIO_Init();
MX_USART2_UART_Init();
MX_I2C1_Init();
MX_ADC1_Init();
/* USER CODE BEGIN 2 */
  
void knl_start_mtkernel(void); << Add
knl_start_mtkernel(); << Add

/* USER CODE END 2 */

/** The following omitted **/
```
User Program
### 4.3.1. Creating a user program
Create a user program that runs on μT-Kernel 3.0.
You can create a directory with any name and location for your user program. For example, create a directory named "application" at the top of the project directory tree .

### 4.3.2. usermain function
When μT-Kernel 3.0 starts up, it executes the usermain function of the user program, so please define the usermain function.
The usermain function has the following format:

```C
INT usermain(void);
```

The usermain function is called from the task (initial task) that is first created and executed by μT-Kernel 3.0.
Also, μT-Kernel 3.0 shuts down when the usermain function ends. Therefore, normally the usermain function is not terminated, but is put into a wait state using μT-Kernel 3.0 task suspend API tk_slp_tsk or similar.
The initial task has a high priority, so no other tasks will run while the usermain function is running.

If the user program does not define a usermain function, the default usermain function written in the following file will be executed.
This usermain function will exit without doing anything, so μT-Kernel 3.0 will shut down immediately.

`mtk3_bsp2/mtkernel/kernel/usermain/usermain.c`

The default usermain function has the weak attribute specified, so if a user program has a usermain function, it will be invalid. There is no need to change the file.

### 4.3.3. Example Program
Below is an example of a user program. This program executes two tasks. Both tasks display a string to the debug serial output at regular intervals.

```C
#include <tk/tkernel.h>
#include <tm/tmonitor.h>

LOCAL void task_1(INT stacd, void *exinf); 	// task execution function
LOCAL ID 	tskid_1; 			// Task ID number
LOCAL T_CTSK ctsk_1 = { 				// Task creation information
	.itskpri= 10,
	.stksz 		= 1024,
	.task 		= task_1,
	.tskatr 		= TA_HLNG | TA_RNG3,
};

LOCAL void task_2(INT stacd, void *exinf); 	// task execution function
LOCAL ID 	tskid_2; 			// Task ID number
LOCAL T_CTSK ctsk_2 = { 				// Task creation information
	.itskpri 	= 10,
	.stksz 		= 1024,
	.task 		= task_2,
	.tskatr 		= TA_HLNG | TA_RNG3,
};

LOCAL void task_1(INT stacd, void *exinf)
{
	while(1) {
		tm_printf((UB*)"task 1\n");
		tk_dly_tsk(500);
	}
}

LOCAL void task_2(INT stacd, void *exinf)
{
	while(1) {
		tm_printf((UB*)"task 2\n");
		tk_dly_tsk(700);
	}
}

/* usermain function */
EXPORT INT usermain(void)
{
	tm_putstring((UB*)"Start User-main program.\n");

	/* Create & Start Tasks */
	tskid_1 = tk_cre_tsk(&ctsk_1);
	tk_sta_tsk(tskid_1, 0);

	tskid_2 = tk_cre_tsk(&ctsk_2);
	tk_sta_tsk(tskid_2, 0);
	
	tk_slp_tsk(TMO_FEVR);

	return 0;
}
```

## 4.4. Build and Run
### 4.4.1. Building the program
Select the project and build it by selecting [Projects] → [Build project] from the menu or by right-clicking the project.
If the process completes successfully without any errors, an executable program (ELF file) will be generated.

Debugging Settings
Configure the debug settings depending on the debugger you are using.
On STM32 Nucleo boards the debugger is on-board.

### 4.4.3. Running the Program
Connect the microcontroller board to your PC, select [RUn] → [Debug configurations] from the menu, check the settings, and then click the [Debug] button. The execution program will be transferred to the microcontroller board and debugging will begin.
Also, by selecting [Run] → [Debug] from the menu, you can debug-run the execution program that was previously debugged again.
The execution program is written to the flash memory of the microcontroller board, so if you turn on the microcontroller board with the debugger disconnected, it will run as is.
Please note that depending on the microcontroller board, you may need to set switches on the board in order to debug. Please refer to the manual for the microcontroller board.  

* When using TrustZone
When using TrustZone, a project consists of multiple subprojects. When debugging, you need to associate the executable files of the subprojects. Please refer to the manuals for each microcontroller and STM32CubeIDE.


# 5. Change History

| Version | Date | Contents |
| ------- | ---------- | ---- |
| 1.00.B6 | 2025.05.29 | OS and IDE version updates, etc. |
| 1.00.B5 | 2025.03.28 | Added information about STM32N6570-DK and TrustZone |
| 1.00.B4 | 2025.03.13 | Added STM32N6570-DK to the supported boards. Related information added |
| 1.00.B3 | 2024.05.24 | Error correction |
| 1.00.B2 | 2024.04.19 | Error correction |
| 1.00.B1 | 2024.03.21 | </br>- Added NUCLEO-L4R5ZI to the supported boards. Related information added</br>- Added explanation for "2. BSP-specific functions." Updated the contents, including changes to device driver names. |
| 1.00.B0 | 2023.12.15 | New |
