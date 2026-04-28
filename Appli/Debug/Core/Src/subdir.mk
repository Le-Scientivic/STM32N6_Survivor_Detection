################################################################################
# Automatically-generated file. Do not edit!
# Toolchain: GNU Tools for STM32 (14.3.rel1)
################################################################################

# Add inputs and outputs from these tool invocations to the build variables 
C_SRCS += \
../Core/Src/app.c \
../Core/Src/app_cam.c \
../Core/Src/app_fuseprogramming.c \
../Core/Src/main.c \
../Core/Src/mtkernel_bsp.c \
../Core/Src/secure_nsc.c \
../Core/Src/stm32_lcd_ex.c \
../Core/Src/stm32n6xx_hal_msp.c \
../Core/Src/stm32n6xx_it.c \
../Core/Src/syscalls.c \
../Core/Src/sysmem.c \
../Core/Src/utils.c 

OBJS += \
./Core/Src/app.o \
./Core/Src/app_cam.o \
./Core/Src/app_fuseprogramming.o \
./Core/Src/main.o \
./Core/Src/mtkernel_bsp.o \
./Core/Src/secure_nsc.o \
./Core/Src/stm32_lcd_ex.o \
./Core/Src/stm32n6xx_hal_msp.o \
./Core/Src/stm32n6xx_it.o \
./Core/Src/syscalls.o \
./Core/Src/sysmem.o \
./Core/Src/utils.o 

C_DEPS += \
./Core/Src/app.d \
./Core/Src/app_cam.d \
./Core/Src/app_fuseprogramming.d \
./Core/Src/main.d \
./Core/Src/mtkernel_bsp.d \
./Core/Src/secure_nsc.d \
./Core/Src/stm32_lcd_ex.d \
./Core/Src/stm32n6xx_hal_msp.d \
./Core/Src/stm32n6xx_it.d \
./Core/Src/syscalls.d \
./Core/Src/sysmem.d \
./Core/Src/utils.d 


# Each subdirectory must supply rules for building sources it contributes
Core/Src/%.o Core/Src/%.su Core/Src/%.cyclo: ../Core/Src/%.c Core/Src/subdir.mk
	arm-none-eabi-gcc "$<" -mcpu=cortex-m55 -std=gnu11 -g3 -DDEBUG -DSTM32N657xx -D_STM32CUBE_DISCOVERY_N657_ -DUSE_FULL_ASSERT -DUSE_FULL_LL_DRIVER -DVECT_TAB_SRAM -DUSE_IMX335_SENSOR -DUSE_VD66GY_SENSOR -DUSE_VD55G1_SENSOR -DSTM32N6570_DK_REV -DTX_MAX_PARALLEL_NETWORKS=1 -DLL_ATON_PLATFORM=LL_ATON_PLAT_STM32N6 -DLL_ATON_OSAL=LL_ATON_OSAL_BARE_METAL -DLL_ATON_RT_MODE=LL_ATON_RT_ASYNC -DLL_ATON_SW_FALLBACK -DLL_ATON_DBG_BUFFER_INFO_EXCLUDED=1 -DAPP_HAS_PARALLEL_NETWORKS=0 -DSCR_LIB_USE_LTDC -DTRACKER_MODULE -c -I../Core/Inc -I"/home/icam/repos/STM32N6_Survivor_Detection/Appli/mtk3_bsp2" -I"/home/icam/repos/STM32N6_Survivor_Detection/Appli/mtk3_bsp2/config" -I"/home/icam/repos/STM32N6_Survivor_Detection/Appli/mtk3_bsp2/include" -I"/home/icam/repos/STM32N6_Survivor_Detection/Appli/mtk3_bsp2/mtkernel/kernel/knlinc" -I../../STM32Cube_FW_N6/Drivers/STM32N6xx_HAL_Driver/Inc -I../../STM32Cube_FW_N6/Drivers/STM32N6xx_HAL_Driver/Inc/Legacy -I../../STM32Cube_FW_N6/Drivers/CMSIS/Device/ST/STM32N6xx/Include -I../../STM32Cube_FW_N6/Drivers/CMSIS/Include -I../../STM32Cube_FW_N6/Drivers/CMSIS/DSP/Include -I../../STM32Cube_FW_N6/Drivers/BSP/Components/Common -I../../STM32Cube_FW_N6/Drivers/BSP/STM32N6570-DK -I../../STM32Cube_FW_N6/Utilities/lcd -I../../Lib/AI_Runtime/Inc -I../../Lib/AI_Runtime/Npu/ll_aton -I../../Lib/AI_Runtime/Npu/Devices/STM32N6XX -I../../Lib/lib_vision_models_pp/lib_vision_models_pp/Inc -I../../Lib/ai-postprocessing-wrapper -I../../Lib/Camera_Middleware -I../../Lib/Camera_Middleware/sensors -I../../Lib/Camera_Middleware/sensors/imx335 -I../../Lib/Camera_Middleware/sensors/vd55g1 -I../../Lib/Camera_Middleware/sensors/vd6g -I../../Lib/Camera_Middleware/ISP_Library/isp/Inc -I../../Lib/Camera_Middleware/ISP_Library/evision/Inc -I../../Lib/screenl/Inc -I../../Lib/tracker -I../../Model/STM32N6570-DK -Os -ffunction-sections -fdata-sections -Wall -fstack-usage -fcyclomatic-complexity -mcmse -MMD -MP -MF"$(@:%.o=%.d)" -MT"$@" --specs=nano.specs -mfpu=fpv5-d16 -mfloat-abi=hard -mthumb -o "$@"

clean: clean-Core-2f-Src

clean-Core-2f-Src:
	-$(RM) ./Core/Src/app.cyclo ./Core/Src/app.d ./Core/Src/app.o ./Core/Src/app.su ./Core/Src/app_cam.cyclo ./Core/Src/app_cam.d ./Core/Src/app_cam.o ./Core/Src/app_cam.su ./Core/Src/app_fuseprogramming.cyclo ./Core/Src/app_fuseprogramming.d ./Core/Src/app_fuseprogramming.o ./Core/Src/app_fuseprogramming.su ./Core/Src/main.cyclo ./Core/Src/main.d ./Core/Src/main.o ./Core/Src/main.su ./Core/Src/mtkernel_bsp.cyclo ./Core/Src/mtkernel_bsp.d ./Core/Src/mtkernel_bsp.o ./Core/Src/mtkernel_bsp.su ./Core/Src/secure_nsc.cyclo ./Core/Src/secure_nsc.d ./Core/Src/secure_nsc.o ./Core/Src/secure_nsc.su ./Core/Src/stm32_lcd_ex.cyclo ./Core/Src/stm32_lcd_ex.d ./Core/Src/stm32_lcd_ex.o ./Core/Src/stm32_lcd_ex.su ./Core/Src/stm32n6xx_hal_msp.cyclo ./Core/Src/stm32n6xx_hal_msp.d ./Core/Src/stm32n6xx_hal_msp.o ./Core/Src/stm32n6xx_hal_msp.su ./Core/Src/stm32n6xx_it.cyclo ./Core/Src/stm32n6xx_it.d ./Core/Src/stm32n6xx_it.o ./Core/Src/stm32n6xx_it.su ./Core/Src/syscalls.cyclo ./Core/Src/syscalls.d ./Core/Src/syscalls.o ./Core/Src/syscalls.su ./Core/Src/sysmem.cyclo ./Core/Src/sysmem.d ./Core/Src/sysmem.o ./Core/Src/sysmem.su ./Core/Src/utils.cyclo ./Core/Src/utils.d ./Core/Src/utils.o ./Core/Src/utils.su

.PHONY: clean-Core-2f-Src

