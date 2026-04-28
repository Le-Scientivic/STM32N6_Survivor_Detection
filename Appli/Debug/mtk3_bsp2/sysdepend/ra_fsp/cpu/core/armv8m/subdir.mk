################################################################################
# Automatically-generated file. Do not edit!
# Toolchain: GNU Tools for STM32 (14.3.rel1)
################################################################################

# Add inputs and outputs from these tool invocations to the build variables 
C_SRCS += \
../mtk3_bsp2/sysdepend/ra_fsp/cpu/core/armv8m/cpu_cntl.c \
../mtk3_bsp2/sysdepend/ra_fsp/cpu/core/armv8m/exc_hdr.c \
../mtk3_bsp2/sysdepend/ra_fsp/cpu/core/armv8m/interrupt.c \
../mtk3_bsp2/sysdepend/ra_fsp/cpu/core/armv8m/sys_start.c 

S_UPPER_SRCS += \
../mtk3_bsp2/sysdepend/ra_fsp/cpu/core/armv8m/dispatch.S 

OBJS += \
./mtk3_bsp2/sysdepend/ra_fsp/cpu/core/armv8m/cpu_cntl.o \
./mtk3_bsp2/sysdepend/ra_fsp/cpu/core/armv8m/dispatch.o \
./mtk3_bsp2/sysdepend/ra_fsp/cpu/core/armv8m/exc_hdr.o \
./mtk3_bsp2/sysdepend/ra_fsp/cpu/core/armv8m/interrupt.o \
./mtk3_bsp2/sysdepend/ra_fsp/cpu/core/armv8m/sys_start.o 

S_UPPER_DEPS += \
./mtk3_bsp2/sysdepend/ra_fsp/cpu/core/armv8m/dispatch.d 

C_DEPS += \
./mtk3_bsp2/sysdepend/ra_fsp/cpu/core/armv8m/cpu_cntl.d \
./mtk3_bsp2/sysdepend/ra_fsp/cpu/core/armv8m/exc_hdr.d \
./mtk3_bsp2/sysdepend/ra_fsp/cpu/core/armv8m/interrupt.d \
./mtk3_bsp2/sysdepend/ra_fsp/cpu/core/armv8m/sys_start.d 


# Each subdirectory must supply rules for building sources it contributes
mtk3_bsp2/sysdepend/ra_fsp/cpu/core/armv8m/%.o mtk3_bsp2/sysdepend/ra_fsp/cpu/core/armv8m/%.su mtk3_bsp2/sysdepend/ra_fsp/cpu/core/armv8m/%.cyclo: ../mtk3_bsp2/sysdepend/ra_fsp/cpu/core/armv8m/%.c mtk3_bsp2/sysdepend/ra_fsp/cpu/core/armv8m/subdir.mk
	arm-none-eabi-gcc "$<" -mcpu=cortex-m55 -std=gnu11 -g3 -DDEBUG -DSTM32N657xx -D_STM32CUBE_DISCOVERY_N657_ -DUSE_FULL_ASSERT -DUSE_FULL_LL_DRIVER -DVECT_TAB_SRAM -DUSE_IMX335_SENSOR -DUSE_VD66GY_SENSOR -DUSE_VD55G1_SENSOR -DSTM32N6570_DK_REV -DTX_MAX_PARALLEL_NETWORKS=1 -DLL_ATON_PLATFORM=LL_ATON_PLAT_STM32N6 -DLL_ATON_OSAL=LL_ATON_OSAL_BARE_METAL -DLL_ATON_RT_MODE=LL_ATON_RT_ASYNC -DLL_ATON_SW_FALLBACK -DLL_ATON_DBG_BUFFER_INFO_EXCLUDED=1 -DAPP_HAS_PARALLEL_NETWORKS=0 -DSCR_LIB_USE_LTDC -DTRACKER_MODULE -c -I../Core/Inc -I"/home/icam/repos/STM32N6_Survivor_Detection/Appli/mtk3_bsp2" -I"/home/icam/repos/STM32N6_Survivor_Detection/Appli/mtk3_bsp2/config" -I"/home/icam/repos/STM32N6_Survivor_Detection/Appli/mtk3_bsp2/include" -I"/home/icam/repos/STM32N6_Survivor_Detection/Appli/mtk3_bsp2/mtkernel/kernel/knlinc" -I../../STM32Cube_FW_N6/Drivers/STM32N6xx_HAL_Driver/Inc -I../../STM32Cube_FW_N6/Drivers/STM32N6xx_HAL_Driver/Inc/Legacy -I../../STM32Cube_FW_N6/Drivers/CMSIS/Device/ST/STM32N6xx/Include -I../../STM32Cube_FW_N6/Drivers/CMSIS/Include -I../../STM32Cube_FW_N6/Drivers/CMSIS/DSP/Include -I../../STM32Cube_FW_N6/Drivers/BSP/Components/Common -I../../STM32Cube_FW_N6/Drivers/BSP/STM32N6570-DK -I../../STM32Cube_FW_N6/Utilities/lcd -I../../Lib/AI_Runtime/Inc -I../../Lib/AI_Runtime/Npu/ll_aton -I../../Lib/AI_Runtime/Npu/Devices/STM32N6XX -I../../Lib/lib_vision_models_pp/lib_vision_models_pp/Inc -I../../Lib/ai-postprocessing-wrapper -I../../Lib/Camera_Middleware -I../../Lib/Camera_Middleware/sensors -I../../Lib/Camera_Middleware/sensors/imx335 -I../../Lib/Camera_Middleware/sensors/vd55g1 -I../../Lib/Camera_Middleware/sensors/vd6g -I../../Lib/Camera_Middleware/ISP_Library/isp/Inc -I../../Lib/Camera_Middleware/ISP_Library/evision/Inc -I../../Lib/screenl/Inc -I../../Lib/tracker -I../../Model/STM32N6570-DK -Os -ffunction-sections -fdata-sections -Wall -fstack-usage -fcyclomatic-complexity -mcmse -MMD -MP -MF"$(@:%.o=%.d)" -MT"$@" --specs=nano.specs -mfpu=fpv5-d16 -mfloat-abi=hard -mthumb -o "$@"
mtk3_bsp2/sysdepend/ra_fsp/cpu/core/armv8m/%.o: ../mtk3_bsp2/sysdepend/ra_fsp/cpu/core/armv8m/%.S mtk3_bsp2/sysdepend/ra_fsp/cpu/core/armv8m/subdir.mk
	arm-none-eabi-gcc -mcpu=cortex-m55 -g3 -DDEBUG -DSTM32N657xx -D_STM32CUBE_DISCOVERY_N657_ -DUSE_FULL_ASSERT -DUSE_FULL_LL_DRIVER -DVECT_TAB_SRAM -DUSE_IMX335_SENSOR -DUSE_VD66GY_SENSOR -DUSE_VD55G1_SENSOR -DSTM32N6570_DK_REV -DTX_MAX_PARALLEL_NETWORKS=1 -DLL_ATON_PLATFORM=LL_ATON_PLAT_STM32N6 -DLL_ATON_OSAL=LL_ATON_OSAL_BARE_METAL -DLL_ATON_RT_MODE=LL_ATON_RT_ASYNC -DLL_ATON_SW_FALLBACK -DLL_ATON_DBG_BUFFER_INFO_EXCLUDED=1 -DAPP_HAS_PARALLEL_NETWORKS=0 -DSCR_LIB_USE_LTDC -DTRACKER_MODULE -c -I../Core/Inc -I"/home/icam/repos/STM32N6_Survivor_Detection/Appli/mtk3_bsp2" -I"/home/icam/repos/STM32N6_Survivor_Detection/Appli/mtk3_bsp2/config" -I"/home/icam/repos/STM32N6_Survivor_Detection/Appli/mtk3_bsp2/include" -I"/home/icam/repos/STM32N6_Survivor_Detection/Appli/mtk3_bsp2/mtkernel/kernel/knlinc" -I../../STM32Cube_FW_N6/Drivers/STM32N6xx_HAL_Driver/Inc -I../../STM32Cube_FW_N6/Drivers/STM32N6xx_HAL_Driver/Inc/Legacy -I../../STM32Cube_FW_N6/Drivers/CMSIS/Device/ST/STM32N6xx/Include -I../../STM32Cube_FW_N6/Drivers/CMSIS/Include -I../../STM32Cube_FW_N6/Drivers/CMSIS/DSP/Include -I../../STM32Cube_FW_N6/Drivers/BSP/Components/Common -I../../STM32Cube_FW_N6/Drivers/BSP/STM32N6570-DK -I../../STM32Cube_FW_N6/Utilities/lcd -I../../Lib/AI_Runtime/Inc -I../../Lib/AI_Runtime/Npu/ll_aton -I../../Lib/AI_Runtime/Npu/Devices/STM32N6XX -I../../Lib/lib_vision_models_pp/lib_vision_models_pp/Inc -I../../Lib/ai-postprocessing-wrapper -I../../Lib/Camera_Middleware -I../../Lib/Camera_Middleware/sensors -I../../Lib/Camera_Middleware/sensors/imx335 -I../../Lib/Camera_Middleware/sensors/vd55g1 -I../../Lib/Camera_Middleware/sensors/vd6g -I../../Lib/Camera_Middleware/ISP_Library/isp/Inc -I../../Lib/Camera_Middleware/ISP_Library/evision/Inc -I../../Lib/screenl/Inc -I../../Lib/tracker -I../../Model/STM32N6570-DK -x assembler-with-cpp -MMD -MP -MF"$(@:%.o=%.d)" -MT"$@" --specs=nano.specs -mfpu=fpv5-d16 -mfloat-abi=hard -mthumb -o "$@" "$<"

clean: clean-mtk3_bsp2-2f-sysdepend-2f-ra_fsp-2f-cpu-2f-core-2f-armv8m

clean-mtk3_bsp2-2f-sysdepend-2f-ra_fsp-2f-cpu-2f-core-2f-armv8m:
	-$(RM) ./mtk3_bsp2/sysdepend/ra_fsp/cpu/core/armv8m/cpu_cntl.cyclo ./mtk3_bsp2/sysdepend/ra_fsp/cpu/core/armv8m/cpu_cntl.d ./mtk3_bsp2/sysdepend/ra_fsp/cpu/core/armv8m/cpu_cntl.o ./mtk3_bsp2/sysdepend/ra_fsp/cpu/core/armv8m/cpu_cntl.su ./mtk3_bsp2/sysdepend/ra_fsp/cpu/core/armv8m/dispatch.d ./mtk3_bsp2/sysdepend/ra_fsp/cpu/core/armv8m/dispatch.o ./mtk3_bsp2/sysdepend/ra_fsp/cpu/core/armv8m/exc_hdr.cyclo ./mtk3_bsp2/sysdepend/ra_fsp/cpu/core/armv8m/exc_hdr.d ./mtk3_bsp2/sysdepend/ra_fsp/cpu/core/armv8m/exc_hdr.o ./mtk3_bsp2/sysdepend/ra_fsp/cpu/core/armv8m/exc_hdr.su ./mtk3_bsp2/sysdepend/ra_fsp/cpu/core/armv8m/interrupt.cyclo ./mtk3_bsp2/sysdepend/ra_fsp/cpu/core/armv8m/interrupt.d ./mtk3_bsp2/sysdepend/ra_fsp/cpu/core/armv8m/interrupt.o ./mtk3_bsp2/sysdepend/ra_fsp/cpu/core/armv8m/interrupt.su ./mtk3_bsp2/sysdepend/ra_fsp/cpu/core/armv8m/sys_start.cyclo ./mtk3_bsp2/sysdepend/ra_fsp/cpu/core/armv8m/sys_start.d ./mtk3_bsp2/sysdepend/ra_fsp/cpu/core/armv8m/sys_start.o ./mtk3_bsp2/sysdepend/ra_fsp/cpu/core/armv8m/sys_start.su

.PHONY: clean-mtk3_bsp2-2f-sysdepend-2f-ra_fsp-2f-cpu-2f-core-2f-armv8m

