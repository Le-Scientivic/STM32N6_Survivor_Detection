################################################################################
# Automatically-generated file. Do not edit!
# Toolchain: GNU Tools for STM32 (13.3.rel1)
################################################################################

# Add inputs and outputs from these tool invocations to the build variables 
C_SRCS += \
../mtk3_bsp2/mtkernel/device/ser/sysdepend/stm32l4/ser_stm32l4.c 

OBJS += \
./mtk3_bsp2/mtkernel/device/ser/sysdepend/stm32l4/ser_stm32l4.o 

C_DEPS += \
./mtk3_bsp2/mtkernel/device/ser/sysdepend/stm32l4/ser_stm32l4.d 


# Each subdirectory must supply rules for building sources it contributes
mtk3_bsp2/mtkernel/device/ser/sysdepend/stm32l4/%.o mtk3_bsp2/mtkernel/device/ser/sysdepend/stm32l4/%.su mtk3_bsp2/mtkernel/device/ser/sysdepend/stm32l4/%.cyclo: ../mtk3_bsp2/mtkernel/device/ser/sysdepend/stm32l4/%.c mtk3_bsp2/mtkernel/device/ser/sysdepend/stm32l4/subdir.mk
	arm-none-eabi-gcc "$<" -mcpu=cortex-m55 -std=gnu11 -g3 -DDEBUG -DSTM32N657xx -D_STM32CUBE_DISCOVERY_N657_ -DUSE_FULL_ASSERT -DUSE_FULL_LL_DRIVER -DVECT_TAB_SRAM -DUSE_IMX335_SENSOR -DUSE_VD66GY_SENSOR -DUSE_VD55G1_SENSOR -DSTM32N6570_DK_REV -DTX_MAX_PARALLEL_NETWORKS=1 -DLL_ATON_PLATFORM=LL_ATON_PLAT_STM32N6 -DLL_ATON_OSAL=LL_ATON_OSAL_BARE_METAL -DLL_ATON_RT_MODE=LL_ATON_RT_ASYNC -DLL_ATON_SW_FALLBACK -DLL_ATON_DBG_BUFFER_INFO_EXCLUDED=1 -DAPP_HAS_PARALLEL_NETWORKS=0 -DSCR_LIB_USE_LTDC -DTRACKER_MODULE -c -I../Core/Inc -I"/home/supun_g/STM32CubeIDE/workspace_1.19.0/STM32N6_MTK_Person_Detection/Appli/mtk3_bsp2" -I"/home/supun_g/STM32CubeIDE/workspace_1.19.0/STM32N6_MTK_Person_Detection/Appli/mtk3_bsp2/config" -I"/home/supun_g/STM32CubeIDE/workspace_1.19.0/STM32N6_MTK_Person_Detection/Appli/mtk3_bsp2/include" -I"/home/supun_g/STM32CubeIDE/workspace_1.19.0/STM32N6_MTK_Person_Detection/Appli/mtk3_bsp2/mtkernel/kernel/knlinc" -I../../STM32Cube_FW_N6/Drivers/STM32N6xx_HAL_Driver/Inc -I../../STM32Cube_FW_N6/Drivers/STM32N6xx_HAL_Driver/Inc/Legacy -I../../STM32Cube_FW_N6/Drivers/CMSIS/Device/ST/STM32N6xx/Include -I../../STM32Cube_FW_N6/Drivers/CMSIS/Include -I../../STM32Cube_FW_N6/Drivers/CMSIS/DSP/Include -I../../STM32Cube_FW_N6/Drivers/BSP/Components/Common -I../../STM32Cube_FW_N6/Drivers/BSP/STM32N6570-DK -I../../STM32Cube_FW_N6/Utilities/lcd -I../../Lib/AI_Runtime/Inc -I../../Lib/AI_Runtime/Npu/ll_aton -I../../Lib/AI_Runtime/Npu/Devices/STM32N6XX -I../../Lib/lib_vision_models_pp/lib_vision_models_pp/Inc -I../../Lib/ai-postprocessing-wrapper -I../../Lib/Camera_Middleware -I../../Lib/Camera_Middleware/sensors -I../../Lib/Camera_Middleware/sensors/imx335 -I../../Lib/Camera_Middleware/sensors/vd55g1 -I../../Lib/Camera_Middleware/sensors/vd6g -I../../Lib/Camera_Middleware/ISP_Library/isp/Inc -I../../Lib/Camera_Middleware/ISP_Library/evision/Inc -I../../Lib/screenl/Inc -I../../Lib/tracker -I../../Model/STM32N6570-DK -Os -ffunction-sections -fdata-sections -Wall -fstack-usage -fcyclomatic-complexity -mcmse -MMD -MP -MF"$(@:%.o=%.d)" -MT"$@" --specs=nano.specs -mfpu=fpv5-d16 -mfloat-abi=hard -mthumb -o "$@"

clean: clean-mtk3_bsp2-2f-mtkernel-2f-device-2f-ser-2f-sysdepend-2f-stm32l4

clean-mtk3_bsp2-2f-mtkernel-2f-device-2f-ser-2f-sysdepend-2f-stm32l4:
	-$(RM) ./mtk3_bsp2/mtkernel/device/ser/sysdepend/stm32l4/ser_stm32l4.cyclo ./mtk3_bsp2/mtkernel/device/ser/sysdepend/stm32l4/ser_stm32l4.d ./mtk3_bsp2/mtkernel/device/ser/sysdepend/stm32l4/ser_stm32l4.o ./mtk3_bsp2/mtkernel/device/ser/sysdepend/stm32l4/ser_stm32l4.su

.PHONY: clean-mtk3_bsp2-2f-mtkernel-2f-device-2f-ser-2f-sysdepend-2f-stm32l4

