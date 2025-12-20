################################################################################
# Automatically-generated file. Do not edit!
# Toolchain: GNU Tools for STM32 (13.3.rel1)
################################################################################

# Add inputs and outputs from these tool invocations to the build variables 
C_SRCS += \
../STM32Cube_FW_N6/Utilities/Fonts/font12.c \
../STM32Cube_FW_N6/Utilities/Fonts/font16.c \
../STM32Cube_FW_N6/Utilities/Fonts/font20.c \
../STM32Cube_FW_N6/Utilities/Fonts/font24.c \
../STM32Cube_FW_N6/Utilities/Fonts/font8.c 

OBJS += \
./STM32Cube_FW_N6/Utilities/Fonts/font12.o \
./STM32Cube_FW_N6/Utilities/Fonts/font16.o \
./STM32Cube_FW_N6/Utilities/Fonts/font20.o \
./STM32Cube_FW_N6/Utilities/Fonts/font24.o \
./STM32Cube_FW_N6/Utilities/Fonts/font8.o 

C_DEPS += \
./STM32Cube_FW_N6/Utilities/Fonts/font12.d \
./STM32Cube_FW_N6/Utilities/Fonts/font16.d \
./STM32Cube_FW_N6/Utilities/Fonts/font20.d \
./STM32Cube_FW_N6/Utilities/Fonts/font24.d \
./STM32Cube_FW_N6/Utilities/Fonts/font8.d 


# Each subdirectory must supply rules for building sources it contributes
STM32Cube_FW_N6/Utilities/Fonts/%.o STM32Cube_FW_N6/Utilities/Fonts/%.su STM32Cube_FW_N6/Utilities/Fonts/%.cyclo: ../STM32Cube_FW_N6/Utilities/Fonts/%.c STM32Cube_FW_N6/Utilities/Fonts/subdir.mk
	arm-none-eabi-gcc "$<" -mcpu=cortex-m55 -std=gnu11 -g3 -DDEBUG -DSTM32N6570_DK_REV -D_STM32CUBE_DISCOVERY_N657_ -DUSE_HAL_DRIVER -DSTM32N657xx -c -I../Core/Inc -I"/home/supun_g/STM32CubeIDE/workspace_1.19.0/STM32N6_MTK_Person_Detection/Appli/STM32Cube_FW_N6/Drivers/BSP/STM32N6570-DK" -I"/home/supun_g/STM32CubeIDE/workspace_1.19.0/STM32N6_MTK_Person_Detection/Appli/STM32Cube_FW_N6/Utilities/lcd" -I"/home/supun_g/STM32CubeIDE/workspace_1.19.0/STM32N6_MTK_Person_Detection/Appli/STM32Cube_FW_N6/Drivers/BSP/Components/Common" -I"/home/supun_g/STM32CubeIDE/workspace_1.19.0/STM32N6_MTK_Person_Detection/Appli/mtk3_bsp2" -I"/home/supun_g/STM32CubeIDE/workspace_1.19.0/STM32N6_MTK_Person_Detection/Appli/mtk3_bsp2/config" -I"/home/supun_g/STM32CubeIDE/workspace_1.19.0/STM32N6_MTK_Person_Detection/Appli/mtk3_bsp2/include" -I"/home/supun_g/STM32CubeIDE/workspace_1.19.0/STM32N6_MTK_Person_Detection/Appli/mtk3_bsp2/mtkernel/kernel/knlinc" -I../../Secure_nsclib -I../../Drivers/STM32N6xx_HAL_Driver/Inc -I../../Drivers/CMSIS/Device/ST/STM32N6xx/Include -I../../Drivers/STM32N6xx_HAL_Driver/Inc/Legacy -I../../Drivers/CMSIS/Include -O0 -ffunction-sections -fdata-sections -Wall -fstack-usage -fcyclomatic-complexity -mcmse -MMD -MP -MF"$(@:%.o=%.d)" -MT"$@" --specs=nano.specs -mfpu=fpv5-d16 -mfloat-abi=hard -mthumb -o "$@"

clean: clean-STM32Cube_FW_N6-2f-Utilities-2f-Fonts

clean-STM32Cube_FW_N6-2f-Utilities-2f-Fonts:
	-$(RM) ./STM32Cube_FW_N6/Utilities/Fonts/font12.cyclo ./STM32Cube_FW_N6/Utilities/Fonts/font12.d ./STM32Cube_FW_N6/Utilities/Fonts/font12.o ./STM32Cube_FW_N6/Utilities/Fonts/font12.su ./STM32Cube_FW_N6/Utilities/Fonts/font16.cyclo ./STM32Cube_FW_N6/Utilities/Fonts/font16.d ./STM32Cube_FW_N6/Utilities/Fonts/font16.o ./STM32Cube_FW_N6/Utilities/Fonts/font16.su ./STM32Cube_FW_N6/Utilities/Fonts/font20.cyclo ./STM32Cube_FW_N6/Utilities/Fonts/font20.d ./STM32Cube_FW_N6/Utilities/Fonts/font20.o ./STM32Cube_FW_N6/Utilities/Fonts/font20.su ./STM32Cube_FW_N6/Utilities/Fonts/font24.cyclo ./STM32Cube_FW_N6/Utilities/Fonts/font24.d ./STM32Cube_FW_N6/Utilities/Fonts/font24.o ./STM32Cube_FW_N6/Utilities/Fonts/font24.su ./STM32Cube_FW_N6/Utilities/Fonts/font8.cyclo ./STM32Cube_FW_N6/Utilities/Fonts/font8.d ./STM32Cube_FW_N6/Utilities/Fonts/font8.o ./STM32Cube_FW_N6/Utilities/Fonts/font8.su

.PHONY: clean-STM32Cube_FW_N6-2f-Utilities-2f-Fonts

