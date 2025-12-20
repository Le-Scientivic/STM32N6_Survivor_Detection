################################################################################
# Automatically-generated file. Do not edit!
# Toolchain: GNU Tools for STM32 (13.3.rel1)
################################################################################

# Add inputs and outputs from these tool invocations to the build variables 
C_SRCS += \
../STM32Cube_FW_N6/Drivers/CMSIS/Device/ST/STM32N6xx/Source/Templates/arm/startup_stm32n645xx.c \
../STM32Cube_FW_N6/Drivers/CMSIS/Device/ST/STM32N6xx/Source/Templates/arm/startup_stm32n645xx_fsbl.c \
../STM32Cube_FW_N6/Drivers/CMSIS/Device/ST/STM32N6xx/Source/Templates/arm/startup_stm32n647xx.c \
../STM32Cube_FW_N6/Drivers/CMSIS/Device/ST/STM32N6xx/Source/Templates/arm/startup_stm32n647xx_fsbl.c \
../STM32Cube_FW_N6/Drivers/CMSIS/Device/ST/STM32N6xx/Source/Templates/arm/startup_stm32n655xx.c \
../STM32Cube_FW_N6/Drivers/CMSIS/Device/ST/STM32N6xx/Source/Templates/arm/startup_stm32n655xx_fsbl.c \
../STM32Cube_FW_N6/Drivers/CMSIS/Device/ST/STM32N6xx/Source/Templates/arm/startup_stm32n657xx.c \
../STM32Cube_FW_N6/Drivers/CMSIS/Device/ST/STM32N6xx/Source/Templates/arm/startup_stm32n657xx_fsbl.c 

OBJS += \
./STM32Cube_FW_N6/Drivers/CMSIS/Device/ST/STM32N6xx/Source/Templates/arm/startup_stm32n645xx.o \
./STM32Cube_FW_N6/Drivers/CMSIS/Device/ST/STM32N6xx/Source/Templates/arm/startup_stm32n645xx_fsbl.o \
./STM32Cube_FW_N6/Drivers/CMSIS/Device/ST/STM32N6xx/Source/Templates/arm/startup_stm32n647xx.o \
./STM32Cube_FW_N6/Drivers/CMSIS/Device/ST/STM32N6xx/Source/Templates/arm/startup_stm32n647xx_fsbl.o \
./STM32Cube_FW_N6/Drivers/CMSIS/Device/ST/STM32N6xx/Source/Templates/arm/startup_stm32n655xx.o \
./STM32Cube_FW_N6/Drivers/CMSIS/Device/ST/STM32N6xx/Source/Templates/arm/startup_stm32n655xx_fsbl.o \
./STM32Cube_FW_N6/Drivers/CMSIS/Device/ST/STM32N6xx/Source/Templates/arm/startup_stm32n657xx.o \
./STM32Cube_FW_N6/Drivers/CMSIS/Device/ST/STM32N6xx/Source/Templates/arm/startup_stm32n657xx_fsbl.o 

C_DEPS += \
./STM32Cube_FW_N6/Drivers/CMSIS/Device/ST/STM32N6xx/Source/Templates/arm/startup_stm32n645xx.d \
./STM32Cube_FW_N6/Drivers/CMSIS/Device/ST/STM32N6xx/Source/Templates/arm/startup_stm32n645xx_fsbl.d \
./STM32Cube_FW_N6/Drivers/CMSIS/Device/ST/STM32N6xx/Source/Templates/arm/startup_stm32n647xx.d \
./STM32Cube_FW_N6/Drivers/CMSIS/Device/ST/STM32N6xx/Source/Templates/arm/startup_stm32n647xx_fsbl.d \
./STM32Cube_FW_N6/Drivers/CMSIS/Device/ST/STM32N6xx/Source/Templates/arm/startup_stm32n655xx.d \
./STM32Cube_FW_N6/Drivers/CMSIS/Device/ST/STM32N6xx/Source/Templates/arm/startup_stm32n655xx_fsbl.d \
./STM32Cube_FW_N6/Drivers/CMSIS/Device/ST/STM32N6xx/Source/Templates/arm/startup_stm32n657xx.d \
./STM32Cube_FW_N6/Drivers/CMSIS/Device/ST/STM32N6xx/Source/Templates/arm/startup_stm32n657xx_fsbl.d 


# Each subdirectory must supply rules for building sources it contributes
STM32Cube_FW_N6/Drivers/CMSIS/Device/ST/STM32N6xx/Source/Templates/arm/%.o STM32Cube_FW_N6/Drivers/CMSIS/Device/ST/STM32N6xx/Source/Templates/arm/%.su STM32Cube_FW_N6/Drivers/CMSIS/Device/ST/STM32N6xx/Source/Templates/arm/%.cyclo: ../STM32Cube_FW_N6/Drivers/CMSIS/Device/ST/STM32N6xx/Source/Templates/arm/%.c STM32Cube_FW_N6/Drivers/CMSIS/Device/ST/STM32N6xx/Source/Templates/arm/subdir.mk
	arm-none-eabi-gcc "$<" -mcpu=cortex-m55 -std=gnu11 -g3 -DDEBUG -DSTM32N6570_DK_REV -D_STM32CUBE_DISCOVERY_N657_ -DUSE_HAL_DRIVER -DSTM32N657xx -c -I../Core/Inc -I"/home/supun_g/STM32CubeIDE/workspace_1.19.0/STM32N6_MTK_Person_Detection/Appli/STM32Cube_FW_N6/Drivers/BSP/STM32N6570-DK" -I"/home/supun_g/STM32CubeIDE/workspace_1.19.0/STM32N6_MTK_Person_Detection/Appli/STM32Cube_FW_N6/Utilities/lcd" -I"/home/supun_g/STM32CubeIDE/workspace_1.19.0/STM32N6_MTK_Person_Detection/Appli/STM32Cube_FW_N6/Drivers/BSP/Components/Common" -I"/home/supun_g/STM32CubeIDE/workspace_1.19.0/STM32N6_MTK_Person_Detection/Appli/mtk3_bsp2" -I"/home/supun_g/STM32CubeIDE/workspace_1.19.0/STM32N6_MTK_Person_Detection/Appli/mtk3_bsp2/config" -I"/home/supun_g/STM32CubeIDE/workspace_1.19.0/STM32N6_MTK_Person_Detection/Appli/mtk3_bsp2/include" -I"/home/supun_g/STM32CubeIDE/workspace_1.19.0/STM32N6_MTK_Person_Detection/Appli/mtk3_bsp2/mtkernel/kernel/knlinc" -I../../Secure_nsclib -I../../Drivers/STM32N6xx_HAL_Driver/Inc -I../../Drivers/CMSIS/Device/ST/STM32N6xx/Include -I../../Drivers/STM32N6xx_HAL_Driver/Inc/Legacy -I../../Drivers/CMSIS/Include -O0 -ffunction-sections -fdata-sections -Wall -fstack-usage -fcyclomatic-complexity -mcmse -MMD -MP -MF"$(@:%.o=%.d)" -MT"$@" --specs=nano.specs -mfpu=fpv5-d16 -mfloat-abi=hard -mthumb -o "$@"

clean: clean-STM32Cube_FW_N6-2f-Drivers-2f-CMSIS-2f-Device-2f-ST-2f-STM32N6xx-2f-Source-2f-Templates-2f-arm

clean-STM32Cube_FW_N6-2f-Drivers-2f-CMSIS-2f-Device-2f-ST-2f-STM32N6xx-2f-Source-2f-Templates-2f-arm:
	-$(RM) ./STM32Cube_FW_N6/Drivers/CMSIS/Device/ST/STM32N6xx/Source/Templates/arm/startup_stm32n645xx.cyclo ./STM32Cube_FW_N6/Drivers/CMSIS/Device/ST/STM32N6xx/Source/Templates/arm/startup_stm32n645xx.d ./STM32Cube_FW_N6/Drivers/CMSIS/Device/ST/STM32N6xx/Source/Templates/arm/startup_stm32n645xx.o ./STM32Cube_FW_N6/Drivers/CMSIS/Device/ST/STM32N6xx/Source/Templates/arm/startup_stm32n645xx.su ./STM32Cube_FW_N6/Drivers/CMSIS/Device/ST/STM32N6xx/Source/Templates/arm/startup_stm32n645xx_fsbl.cyclo ./STM32Cube_FW_N6/Drivers/CMSIS/Device/ST/STM32N6xx/Source/Templates/arm/startup_stm32n645xx_fsbl.d ./STM32Cube_FW_N6/Drivers/CMSIS/Device/ST/STM32N6xx/Source/Templates/arm/startup_stm32n645xx_fsbl.o ./STM32Cube_FW_N6/Drivers/CMSIS/Device/ST/STM32N6xx/Source/Templates/arm/startup_stm32n645xx_fsbl.su ./STM32Cube_FW_N6/Drivers/CMSIS/Device/ST/STM32N6xx/Source/Templates/arm/startup_stm32n647xx.cyclo ./STM32Cube_FW_N6/Drivers/CMSIS/Device/ST/STM32N6xx/Source/Templates/arm/startup_stm32n647xx.d ./STM32Cube_FW_N6/Drivers/CMSIS/Device/ST/STM32N6xx/Source/Templates/arm/startup_stm32n647xx.o ./STM32Cube_FW_N6/Drivers/CMSIS/Device/ST/STM32N6xx/Source/Templates/arm/startup_stm32n647xx.su ./STM32Cube_FW_N6/Drivers/CMSIS/Device/ST/STM32N6xx/Source/Templates/arm/startup_stm32n647xx_fsbl.cyclo ./STM32Cube_FW_N6/Drivers/CMSIS/Device/ST/STM32N6xx/Source/Templates/arm/startup_stm32n647xx_fsbl.d ./STM32Cube_FW_N6/Drivers/CMSIS/Device/ST/STM32N6xx/Source/Templates/arm/startup_stm32n647xx_fsbl.o ./STM32Cube_FW_N6/Drivers/CMSIS/Device/ST/STM32N6xx/Source/Templates/arm/startup_stm32n647xx_fsbl.su ./STM32Cube_FW_N6/Drivers/CMSIS/Device/ST/STM32N6xx/Source/Templates/arm/startup_stm32n655xx.cyclo ./STM32Cube_FW_N6/Drivers/CMSIS/Device/ST/STM32N6xx/Source/Templates/arm/startup_stm32n655xx.d ./STM32Cube_FW_N6/Drivers/CMSIS/Device/ST/STM32N6xx/Source/Templates/arm/startup_stm32n655xx.o ./STM32Cube_FW_N6/Drivers/CMSIS/Device/ST/STM32N6xx/Source/Templates/arm/startup_stm32n655xx.su ./STM32Cube_FW_N6/Drivers/CMSIS/Device/ST/STM32N6xx/Source/Templates/arm/startup_stm32n655xx_fsbl.cyclo ./STM32Cube_FW_N6/Drivers/CMSIS/Device/ST/STM32N6xx/Source/Templates/arm/startup_stm32n655xx_fsbl.d ./STM32Cube_FW_N6/Drivers/CMSIS/Device/ST/STM32N6xx/Source/Templates/arm/startup_stm32n655xx_fsbl.o ./STM32Cube_FW_N6/Drivers/CMSIS/Device/ST/STM32N6xx/Source/Templates/arm/startup_stm32n655xx_fsbl.su ./STM32Cube_FW_N6/Drivers/CMSIS/Device/ST/STM32N6xx/Source/Templates/arm/startup_stm32n657xx.cyclo ./STM32Cube_FW_N6/Drivers/CMSIS/Device/ST/STM32N6xx/Source/Templates/arm/startup_stm32n657xx.d ./STM32Cube_FW_N6/Drivers/CMSIS/Device/ST/STM32N6xx/Source/Templates/arm/startup_stm32n657xx.o ./STM32Cube_FW_N6/Drivers/CMSIS/Device/ST/STM32N6xx/Source/Templates/arm/startup_stm32n657xx.su ./STM32Cube_FW_N6/Drivers/CMSIS/Device/ST/STM32N6xx/Source/Templates/arm/startup_stm32n657xx_fsbl.cyclo ./STM32Cube_FW_N6/Drivers/CMSIS/Device/ST/STM32N6xx/Source/Templates/arm/startup_stm32n657xx_fsbl.d ./STM32Cube_FW_N6/Drivers/CMSIS/Device/ST/STM32N6xx/Source/Templates/arm/startup_stm32n657xx_fsbl.o ./STM32Cube_FW_N6/Drivers/CMSIS/Device/ST/STM32N6xx/Source/Templates/arm/startup_stm32n657xx_fsbl.su

.PHONY: clean-STM32Cube_FW_N6-2f-Drivers-2f-CMSIS-2f-Device-2f-ST-2f-STM32N6xx-2f-Source-2f-Templates-2f-arm

