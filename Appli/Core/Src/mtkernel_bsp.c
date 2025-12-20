/**
 ******************************************************************************
 * @file    mtkernel_bsp.c
 * @brief   µT-Kernel BSP compatibility layer
 ******************************************************************************
 * @attention
 *
 * Copyright (c) 2025 STMicroelectronics.
 * All rights reserved.
 *
 * This software is licensed under terms that can be found in the LICENSE file
 * in the root directory of this software component.
 * If no LICENSE file comes with this software, it is provided AS-IS.
 *
 ******************************************************************************
 */

#include <assert.h>
#include <stdint.h>
#include "cmsis_compiler.h"
#include "stm32n6xx_hal.h"

#define IS_IRQ_MODE() (__get_IPSR() != 0U)

/* Forward declarations for µT-Kernel types and functions */
typedef struct {
  uint32_t hi;  /* High 32 bits of current time */
  uint32_t lo;  /* Low 32 bits of current time */
} SYSTIM;

extern void tk_dly_tsk(int32_t dlytim);
extern int32_t tk_get_tim(SYSTIM *pk_tim);

static TIM_HandleTypeDef tim4;

/**
 * @brief Returns the current tick count in milliseconds
 * @retval Tick count in milliseconds
 */
uint32_t HAL_GetTick(void)
{
  SYSTIM tim;
  tk_get_tim(&tim);
  /* Return low 32 bits as milliseconds */
  return tim.lo;
}

/**
 * @brief µT-Kernel compatible HAL_Delay implementation
 * @param Delay specifies the delay time length, in milliseconds
 * @retval None
 */
void HAL_Delay(uint32_t Delay)
{
  if (IS_IRQ_MODE())
    assert(0);

  tk_dly_tsk(Delay);
}

/**
 * @brief Initialize HAL time base (no-op for µT-Kernel)
 * @param TickPriority Tick interrupt priority
 * @retval HAL status
 */
HAL_StatusTypeDef HAL_InitTick(uint32_t TickPriority)
{
  /* µT-Kernel manages its own tick - nothing to do here */
  return HAL_OK;
}

/**
 * @brief Configure TIM4 as a high-resolution timer
 * @retval None
 */
void TIM4_Config(void)
{
  const uint32_t tmr_clk_freq = 100000;
  int ret;

  __HAL_RCC_TIM4_CLK_ENABLE();

  tim4.Instance = TIM4;
  tim4.Init.Period = ~0;
  tim4.Init.Prescaler = (HAL_RCC_GetPCLK1Freq() / tmr_clk_freq) - 1;
  tim4.Init.ClockDivision = 0;
  tim4.Init.CounterMode = TIM_COUNTERMODE_UP;
  ret = HAL_TIM_Base_Init(&tim4);
  assert(ret == HAL_OK);

  ret = HAL_TIM_Base_Start(&tim4);
  assert(ret == HAL_OK);
}

/**
 * @brief Get current TIM4 counter value
 * @retval Counter value
 */
uint32_t TIM4_Get_Value(void)
{
  return __HAL_TIM_GET_COUNTER(&tim4);
}
