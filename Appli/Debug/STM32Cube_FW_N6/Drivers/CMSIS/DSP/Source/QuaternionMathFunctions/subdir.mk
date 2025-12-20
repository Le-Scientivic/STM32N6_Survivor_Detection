################################################################################
# Automatically-generated file. Do not edit!
# Toolchain: GNU Tools for STM32 (13.3.rel1)
################################################################################

# Add inputs and outputs from these tool invocations to the build variables 
C_SRCS += \
../STM32Cube_FW_N6/Drivers/CMSIS/DSP/Source/QuaternionMathFunctions/QuaternionMathFunctions.c \
../STM32Cube_FW_N6/Drivers/CMSIS/DSP/Source/QuaternionMathFunctions/arm_quaternion2rotation_f32.c \
../STM32Cube_FW_N6/Drivers/CMSIS/DSP/Source/QuaternionMathFunctions/arm_quaternion_conjugate_f32.c \
../STM32Cube_FW_N6/Drivers/CMSIS/DSP/Source/QuaternionMathFunctions/arm_quaternion_inverse_f32.c \
../STM32Cube_FW_N6/Drivers/CMSIS/DSP/Source/QuaternionMathFunctions/arm_quaternion_norm_f32.c \
../STM32Cube_FW_N6/Drivers/CMSIS/DSP/Source/QuaternionMathFunctions/arm_quaternion_normalize_f32.c \
../STM32Cube_FW_N6/Drivers/CMSIS/DSP/Source/QuaternionMathFunctions/arm_quaternion_product_f32.c \
../STM32Cube_FW_N6/Drivers/CMSIS/DSP/Source/QuaternionMathFunctions/arm_quaternion_product_single_f32.c \
../STM32Cube_FW_N6/Drivers/CMSIS/DSP/Source/QuaternionMathFunctions/arm_rotation2quaternion_f32.c 

OBJS += \
./STM32Cube_FW_N6/Drivers/CMSIS/DSP/Source/QuaternionMathFunctions/QuaternionMathFunctions.o \
./STM32Cube_FW_N6/Drivers/CMSIS/DSP/Source/QuaternionMathFunctions/arm_quaternion2rotation_f32.o \
./STM32Cube_FW_N6/Drivers/CMSIS/DSP/Source/QuaternionMathFunctions/arm_quaternion_conjugate_f32.o \
./STM32Cube_FW_N6/Drivers/CMSIS/DSP/Source/QuaternionMathFunctions/arm_quaternion_inverse_f32.o \
./STM32Cube_FW_N6/Drivers/CMSIS/DSP/Source/QuaternionMathFunctions/arm_quaternion_norm_f32.o \
./STM32Cube_FW_N6/Drivers/CMSIS/DSP/Source/QuaternionMathFunctions/arm_quaternion_normalize_f32.o \
./STM32Cube_FW_N6/Drivers/CMSIS/DSP/Source/QuaternionMathFunctions/arm_quaternion_product_f32.o \
./STM32Cube_FW_N6/Drivers/CMSIS/DSP/Source/QuaternionMathFunctions/arm_quaternion_product_single_f32.o \
./STM32Cube_FW_N6/Drivers/CMSIS/DSP/Source/QuaternionMathFunctions/arm_rotation2quaternion_f32.o 

C_DEPS += \
./STM32Cube_FW_N6/Drivers/CMSIS/DSP/Source/QuaternionMathFunctions/QuaternionMathFunctions.d \
./STM32Cube_FW_N6/Drivers/CMSIS/DSP/Source/QuaternionMathFunctions/arm_quaternion2rotation_f32.d \
./STM32Cube_FW_N6/Drivers/CMSIS/DSP/Source/QuaternionMathFunctions/arm_quaternion_conjugate_f32.d \
./STM32Cube_FW_N6/Drivers/CMSIS/DSP/Source/QuaternionMathFunctions/arm_quaternion_inverse_f32.d \
./STM32Cube_FW_N6/Drivers/CMSIS/DSP/Source/QuaternionMathFunctions/arm_quaternion_norm_f32.d \
./STM32Cube_FW_N6/Drivers/CMSIS/DSP/Source/QuaternionMathFunctions/arm_quaternion_normalize_f32.d \
./STM32Cube_FW_N6/Drivers/CMSIS/DSP/Source/QuaternionMathFunctions/arm_quaternion_product_f32.d \
./STM32Cube_FW_N6/Drivers/CMSIS/DSP/Source/QuaternionMathFunctions/arm_quaternion_product_single_f32.d \
./STM32Cube_FW_N6/Drivers/CMSIS/DSP/Source/QuaternionMathFunctions/arm_rotation2quaternion_f32.d 


# Each subdirectory must supply rules for building sources it contributes
STM32Cube_FW_N6/Drivers/CMSIS/DSP/Source/QuaternionMathFunctions/%.o STM32Cube_FW_N6/Drivers/CMSIS/DSP/Source/QuaternionMathFunctions/%.su STM32Cube_FW_N6/Drivers/CMSIS/DSP/Source/QuaternionMathFunctions/%.cyclo: ../STM32Cube_FW_N6/Drivers/CMSIS/DSP/Source/QuaternionMathFunctions/%.c STM32Cube_FW_N6/Drivers/CMSIS/DSP/Source/QuaternionMathFunctions/subdir.mk
	arm-none-eabi-gcc "$<" -mcpu=cortex-m55 -std=gnu11 -g3 -DDEBUG -DSTM32N6570_DK_REV -D_STM32CUBE_DISCOVERY_N657_ -DUSE_HAL_DRIVER -DSTM32N657xx -c -I../Core/Inc -I"/home/supun_g/STM32CubeIDE/workspace_1.19.0/STM32N6_MTK_Person_Detection/Appli/STM32Cube_FW_N6/Drivers/BSP/STM32N6570-DK" -I"/home/supun_g/STM32CubeIDE/workspace_1.19.0/STM32N6_MTK_Person_Detection/Appli/STM32Cube_FW_N6/Utilities/lcd" -I"/home/supun_g/STM32CubeIDE/workspace_1.19.0/STM32N6_MTK_Person_Detection/Appli/STM32Cube_FW_N6/Drivers/BSP/Components/Common" -I"/home/supun_g/STM32CubeIDE/workspace_1.19.0/STM32N6_MTK_Person_Detection/Appli/mtk3_bsp2" -I"/home/supun_g/STM32CubeIDE/workspace_1.19.0/STM32N6_MTK_Person_Detection/Appli/mtk3_bsp2/config" -I"/home/supun_g/STM32CubeIDE/workspace_1.19.0/STM32N6_MTK_Person_Detection/Appli/mtk3_bsp2/include" -I"/home/supun_g/STM32CubeIDE/workspace_1.19.0/STM32N6_MTK_Person_Detection/Appli/mtk3_bsp2/mtkernel/kernel/knlinc" -I../../Secure_nsclib -I../../Drivers/STM32N6xx_HAL_Driver/Inc -I../../Drivers/CMSIS/Device/ST/STM32N6xx/Include -I../../Drivers/STM32N6xx_HAL_Driver/Inc/Legacy -I../../Drivers/CMSIS/Include -O0 -ffunction-sections -fdata-sections -Wall -fstack-usage -fcyclomatic-complexity -mcmse -MMD -MP -MF"$(@:%.o=%.d)" -MT"$@" --specs=nano.specs -mfpu=fpv5-d16 -mfloat-abi=hard -mthumb -o "$@"

clean: clean-STM32Cube_FW_N6-2f-Drivers-2f-CMSIS-2f-DSP-2f-Source-2f-QuaternionMathFunctions

clean-STM32Cube_FW_N6-2f-Drivers-2f-CMSIS-2f-DSP-2f-Source-2f-QuaternionMathFunctions:
	-$(RM) ./STM32Cube_FW_N6/Drivers/CMSIS/DSP/Source/QuaternionMathFunctions/QuaternionMathFunctions.cyclo ./STM32Cube_FW_N6/Drivers/CMSIS/DSP/Source/QuaternionMathFunctions/QuaternionMathFunctions.d ./STM32Cube_FW_N6/Drivers/CMSIS/DSP/Source/QuaternionMathFunctions/QuaternionMathFunctions.o ./STM32Cube_FW_N6/Drivers/CMSIS/DSP/Source/QuaternionMathFunctions/QuaternionMathFunctions.su ./STM32Cube_FW_N6/Drivers/CMSIS/DSP/Source/QuaternionMathFunctions/arm_quaternion2rotation_f32.cyclo ./STM32Cube_FW_N6/Drivers/CMSIS/DSP/Source/QuaternionMathFunctions/arm_quaternion2rotation_f32.d ./STM32Cube_FW_N6/Drivers/CMSIS/DSP/Source/QuaternionMathFunctions/arm_quaternion2rotation_f32.o ./STM32Cube_FW_N6/Drivers/CMSIS/DSP/Source/QuaternionMathFunctions/arm_quaternion2rotation_f32.su ./STM32Cube_FW_N6/Drivers/CMSIS/DSP/Source/QuaternionMathFunctions/arm_quaternion_conjugate_f32.cyclo ./STM32Cube_FW_N6/Drivers/CMSIS/DSP/Source/QuaternionMathFunctions/arm_quaternion_conjugate_f32.d ./STM32Cube_FW_N6/Drivers/CMSIS/DSP/Source/QuaternionMathFunctions/arm_quaternion_conjugate_f32.o ./STM32Cube_FW_N6/Drivers/CMSIS/DSP/Source/QuaternionMathFunctions/arm_quaternion_conjugate_f32.su ./STM32Cube_FW_N6/Drivers/CMSIS/DSP/Source/QuaternionMathFunctions/arm_quaternion_inverse_f32.cyclo ./STM32Cube_FW_N6/Drivers/CMSIS/DSP/Source/QuaternionMathFunctions/arm_quaternion_inverse_f32.d ./STM32Cube_FW_N6/Drivers/CMSIS/DSP/Source/QuaternionMathFunctions/arm_quaternion_inverse_f32.o ./STM32Cube_FW_N6/Drivers/CMSIS/DSP/Source/QuaternionMathFunctions/arm_quaternion_inverse_f32.su ./STM32Cube_FW_N6/Drivers/CMSIS/DSP/Source/QuaternionMathFunctions/arm_quaternion_norm_f32.cyclo ./STM32Cube_FW_N6/Drivers/CMSIS/DSP/Source/QuaternionMathFunctions/arm_quaternion_norm_f32.d ./STM32Cube_FW_N6/Drivers/CMSIS/DSP/Source/QuaternionMathFunctions/arm_quaternion_norm_f32.o ./STM32Cube_FW_N6/Drivers/CMSIS/DSP/Source/QuaternionMathFunctions/arm_quaternion_norm_f32.su ./STM32Cube_FW_N6/Drivers/CMSIS/DSP/Source/QuaternionMathFunctions/arm_quaternion_normalize_f32.cyclo ./STM32Cube_FW_N6/Drivers/CMSIS/DSP/Source/QuaternionMathFunctions/arm_quaternion_normalize_f32.d ./STM32Cube_FW_N6/Drivers/CMSIS/DSP/Source/QuaternionMathFunctions/arm_quaternion_normalize_f32.o ./STM32Cube_FW_N6/Drivers/CMSIS/DSP/Source/QuaternionMathFunctions/arm_quaternion_normalize_f32.su ./STM32Cube_FW_N6/Drivers/CMSIS/DSP/Source/QuaternionMathFunctions/arm_quaternion_product_f32.cyclo ./STM32Cube_FW_N6/Drivers/CMSIS/DSP/Source/QuaternionMathFunctions/arm_quaternion_product_f32.d ./STM32Cube_FW_N6/Drivers/CMSIS/DSP/Source/QuaternionMathFunctions/arm_quaternion_product_f32.o ./STM32Cube_FW_N6/Drivers/CMSIS/DSP/Source/QuaternionMathFunctions/arm_quaternion_product_f32.su ./STM32Cube_FW_N6/Drivers/CMSIS/DSP/Source/QuaternionMathFunctions/arm_quaternion_product_single_f32.cyclo ./STM32Cube_FW_N6/Drivers/CMSIS/DSP/Source/QuaternionMathFunctions/arm_quaternion_product_single_f32.d ./STM32Cube_FW_N6/Drivers/CMSIS/DSP/Source/QuaternionMathFunctions/arm_quaternion_product_single_f32.o ./STM32Cube_FW_N6/Drivers/CMSIS/DSP/Source/QuaternionMathFunctions/arm_quaternion_product_single_f32.su ./STM32Cube_FW_N6/Drivers/CMSIS/DSP/Source/QuaternionMathFunctions/arm_rotation2quaternion_f32.cyclo ./STM32Cube_FW_N6/Drivers/CMSIS/DSP/Source/QuaternionMathFunctions/arm_rotation2quaternion_f32.d ./STM32Cube_FW_N6/Drivers/CMSIS/DSP/Source/QuaternionMathFunctions/arm_rotation2quaternion_f32.o ./STM32Cube_FW_N6/Drivers/CMSIS/DSP/Source/QuaternionMathFunctions/arm_rotation2quaternion_f32.su

.PHONY: clean-STM32Cube_FW_N6-2f-Drivers-2f-CMSIS-2f-DSP-2f-Source-2f-QuaternionMathFunctions

