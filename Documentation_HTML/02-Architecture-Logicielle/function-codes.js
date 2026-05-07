window.FUNCTION_CODES = {
  "main": `int main(void)
{
  MEMSYSCTL->MSCR |= MEMSYSCTL_MSCR_ICACTIVE_Msk;
  __HAL_RCC_CPUCLK_CONFIG(RCC_CPUCLKSOURCE_HSI);
  __HAL_RCC_SYSCLK_CONFIG(RCC_SYSCLKSOURCE_HSI);

  HAL_Init();
  SCB_EnableICache();

#if defined(USE_DCACHE)
  MEMSYSCTL->MSCR |= MEMSYSCTL_MSCR_DCACTIVE_Msk;
  SCB_EnableDCache();
#endif

  CONSOLE_Config();
  SystemClock_Config();
  NPURam_enable();
  Fuse_Programming();
  NPUCache_config();
  Security_Config();
  IAC_Config();

  void knl_start_mtkernel(void);
  knl_start_mtkernel();

  while (1)
  {
  }
}`,
  "usermain": `EXPORT INT usermain(void)
{
  SERIAL_MSG(LEVEL_INFO, MODULE_RTOS, EVENT_RTOS_START);

  SERIAL_MSG_STR(LEVEL_INFO, MODULE_RTOS, EVENT_TASK_CREATE, "task", "main_thread");
  T_CTSK task_config;

  task_config.itskpri = 15;
  task_config.stksz = MAIN_TASK_STACK_SIZE;
  task_config.task = main_thread_fct;
  task_config.tskatr = TA_HLNG | TA_RNG3 | TA_USERBUF;
  task_config.bufptr = main_thread_stack;

  main_task_id = tk_cre_tsk(&task_config);

  SERIAL_MSG_TASK(LEVEL_INFO, MODULE_RTOS, EVENT_TASK_START, "main_thread", main_task_id);
  tk_sta_tsk(main_task_id, 0);

  SERIAL_MSG_TASK(LEVEL_INFO, MODULE_RTOS, EVENT_TASK_READY, "main_thread", main_task_id);

  tk_slp_tsk(TMO_FEVR);

  return 0;
}`,
  "main_thread_fct": `static void main_thread_fct(INT stacd, void *exinf)
{
  SERIAL_MSG(LEVEL_INFO, MODULE_INIT, EVENT_SYSTEM_START);

  SERIAL_MSG(LEVEL_INFO, MODULE_INIT, EVENT_NVIC_CONFIG);
  uint32_t preemptPriority;
  uint32_t subPriority;
  IRQn_Type i;

  HAL_NVIC_GetPriority(SysTick_IRQn, HAL_NVIC_GetPriorityGrouping(), &preemptPriority, &subPriority);
  for (i = PVD_PVM_IRQn; i <= LTDC_UP_ERR_IRQn; i++)
    HAL_NVIC_SetPriority(i, preemptPriority, subPriority);

  SERIAL_MSG(LEVEL_INFO, MODULE_INIT, EVENT_RAM_INIT);
  BSP_XSPI_RAM_Init(0);
  BSP_XSPI_RAM_EnableMemoryMappedMode(0);

  SERIAL_MSG(LEVEL_INFO, MODULE_INIT, EVENT_FLASH_INIT);
  BSP_XSPI_NOR_Init_t NOR_Init;
  NOR_Init.InterfaceMode = BSP_XSPI_NOR_OPI_MODE;
  NOR_Init.TransferRate = BSP_XSPI_NOR_DTR_TRANSFER;
  BSP_XSPI_NOR_Init(0, &NOR_Init);
  BSP_XSPI_NOR_EnableMemoryMappedMode(0);

  SERIAL_MSG(LEVEL_INFO, MODULE_INIT, EVENT_CLOCKS_CONFIG);
  LL_BUS_EnableClockLowPower(~0);
  LL_MEM_EnableClockLowPower(~0);
  LL_AHB1_GRP1_EnableClockLowPower(~0);
  LL_AHB2_GRP1_EnableClockLowPower(~0);
  LL_AHB3_GRP1_EnableClockLowPower(~0);
  LL_AHB4_GRP1_EnableClockLowPower(~0);
  LL_AHB5_GRP1_EnableClockLowPower(~0);
  LL_APB1_GRP1_EnableClockLowPower(~0);
  LL_APB1_GRP2_EnableClockLowPower(~0);
  LL_APB2_GRP1_EnableClockLowPower(~0);
  LL_APB4_GRP1_EnableClockLowPower(~0);
  LL_APB4_GRP2_EnableClockLowPower(~0);
  LL_APB5_GRP1_EnableClockLowPower(~0);
  LL_MISC_EnableClockLowPower(~0);

  SERIAL_MSG(LEVEL_INFO, MODULE_INIT, EVENT_SYSTEM_READY);
  app_run();

  SERIAL_MSG(LEVEL_INFO, MODULE_INIT, "APP_EXIT");
  tk_ext_tsk();
}`,
  "CONSOLE_Config": `static void CONSOLE_Config()
{
  GPIO_InitTypeDef gpio_init;

  __HAL_RCC_USART1_CLK_ENABLE();
  __HAL_RCC_GPIOE_CLK_ENABLE();

  gpio_init.Mode = GPIO_MODE_AF_PP;
  gpio_init.Pull = GPIO_PULLUP;
  gpio_init.Speed = GPIO_SPEED_FREQ_HIGH;
  gpio_init.Pin = GPIO_PIN_5 | GPIO_PIN_6;
  gpio_init.Alternate = GPIO_AF7_USART1;
  HAL_GPIO_Init(GPIOE, &gpio_init);

  huart1.Instance = USART1;
  huart1.Init.BaudRate = 115200;
  huart1.Init.Mode = UART_MODE_TX_RX;
  huart1.Init.Parity = UART_PARITY_NONE;
  huart1.Init.WordLength = UART_WORDLENGTH_8B;
  huart1.Init.StopBits = UART_STOPBITS_1;
  huart1.Init.HwFlowCtl = UART_HWCONTROL_NONE;
  huart1.Init.OverSampling = UART_OVERSAMPLING_8;
  if (HAL_UART_Init(&huart1) != HAL_OK)
  {
    while (1)
      ;
  }
}`,
  "SystemClock_Config": `static void SystemClock_Config(void)
{
  RCC_ClkInitTypeDef RCC_ClkInitStruct = {0};
  RCC_OscInitTypeDef RCC_OscInitStruct = {0};
  RCC_PeriphCLKInitTypeDef RCC_PeriphCLKInitStruct = {0};

  BSP_SMPS_Init(SMPS_VOLTAGE_OVERDRIVE);
  HAL_Delay(1);

  RCC_OscInitStruct.OscillatorType = RCC_OSCILLATORTYPE_NONE;
  RCC_OscInitStruct.PLL1.PLLState = RCC_PLL_ON;
  RCC_OscInitStruct.PLL1.PLLSource = RCC_PLLSOURCE_HSI;
  RCC_OscInitStruct.PLL1.PLLM = 2;
  RCC_OscInitStruct.PLL1.PLLN = 25;
  RCC_OscInitStruct.PLL1.PLLFractional = 0;
  RCC_OscInitStruct.PLL1.PLLP1 = 1;
  RCC_OscInitStruct.PLL1.PLLP2 = 1;

  RCC_OscInitStruct.PLL2.PLLState = RCC_PLL_ON;
  RCC_OscInitStruct.PLL2.PLLSource = RCC_PLLSOURCE_HSI;
  RCC_OscInitStruct.PLL2.PLLM = 8;
  RCC_OscInitStruct.PLL2.PLLFractional = 0;
  RCC_OscInitStruct.PLL2.PLLN = 125;
  RCC_OscInitStruct.PLL2.PLLP1 = 1;
  RCC_OscInitStruct.PLL2.PLLP2 = 1;

  RCC_OscInitStruct.PLL3.PLLState = RCC_PLL_ON;
  RCC_OscInitStruct.PLL3.PLLSource = RCC_PLLSOURCE_HSI;
  RCC_OscInitStruct.PLL3.PLLM = 8;
  RCC_OscInitStruct.PLL3.PLLN = 225;
  RCC_OscInitStruct.PLL3.PLLFractional = 0;
  RCC_OscInitStruct.PLL3.PLLP1 = 1;
  RCC_OscInitStruct.PLL3.PLLP2 = 2;

  RCC_OscInitStruct.PLL4.PLLState = RCC_PLL_ON;
  RCC_OscInitStruct.PLL4.PLLSource = RCC_PLLSOURCE_HSI;
  RCC_OscInitStruct.PLL4.PLLM = 8;
  RCC_OscInitStruct.PLL4.PLLFractional = 0;
  RCC_OscInitStruct.PLL4.PLLN = 225;
  RCC_OscInitStruct.PLL4.PLLP1 = 6;
  RCC_OscInitStruct.PLL4.PLLP2 = 6;

  if (HAL_RCC_OscConfig(&RCC_OscInitStruct) != HAL_OK)
  {
    while (1)
      ;
  }

  RCC_ClkInitStruct.ClockType = (RCC_CLOCKTYPE_CPUCLK | RCC_CLOCKTYPE_SYSCLK |
                                 RCC_CLOCKTYPE_HCLK | RCC_CLOCKTYPE_PCLK1 |
                                 RCC_CLOCKTYPE_PCLK2 | RCC_CLOCKTYPE_PCLK4 |
                                 RCC_CLOCKTYPE_PCLK5);

  RCC_ClkInitStruct.CPUCLKSource = RCC_CPUCLKSOURCE_IC1;
  RCC_ClkInitStruct.SYSCLKSource = RCC_SYSCLKSOURCE_IC2_IC6_IC11;
  RCC_ClkInitStruct.IC1Selection.ClockSelection = RCC_ICCLKSOURCE_PLL1;
  RCC_ClkInitStruct.IC1Selection.ClockDivider = 1;

  RCC_ClkInitStruct.IC2Selection.ClockSelection = RCC_ICCLKSOURCE_PLL1;
  RCC_ClkInitStruct.IC2Selection.ClockDivider = 2;

  RCC_ClkInitStruct.IC6Selection.ClockSelection = RCC_ICCLKSOURCE_PLL2;
  RCC_ClkInitStruct.IC6Selection.ClockDivider = 1;

  RCC_ClkInitStruct.IC11Selection.ClockSelection = RCC_ICCLKSOURCE_PLL3;
  RCC_ClkInitStruct.IC11Selection.ClockDivider = 1;

  RCC_ClkInitStruct.AHBCLKDivider = RCC_HCLK_DIV2;
  RCC_ClkInitStruct.APB1CLKDivider = RCC_APB1_DIV1;
  RCC_ClkInitStruct.APB2CLKDivider = RCC_APB2_DIV1;
  RCC_ClkInitStruct.APB4CLKDivider = RCC_APB4_DIV1;
  RCC_ClkInitStruct.APB5CLKDivider = RCC_APB5_DIV1;

  if (HAL_RCC_ClockConfig(&RCC_ClkInitStruct) != HAL_OK)
  {
    while (1)
      ;
  }

  RCC_PeriphCLKInitStruct.PeriphClockSelection = 0;

  RCC_PeriphCLKInitStruct.PeriphClockSelection |= RCC_PERIPHCLK_XSPI1;
  RCC_PeriphCLKInitStruct.Xspi1ClockSelection = RCC_XSPI1CLKSOURCE_HCLK;

  RCC_PeriphCLKInitStruct.PeriphClockSelection |= RCC_PERIPHCLK_XSPI2;
  RCC_PeriphCLKInitStruct.Xspi2ClockSelection = RCC_XSPI2CLKSOURCE_HCLK;

  if (HAL_RCCEx_PeriphCLKConfig(&RCC_PeriphCLKInitStruct) != HAL_OK)
  {
    while (1)
      ;
  }
}`,
  "NPURam_enable": `static void NPURam_enable()
{
  __HAL_RCC_NPU_CLK_ENABLE();
  __HAL_RCC_NPU_FORCE_RESET();
  __HAL_RCC_NPU_RELEASE_RESET();

  __HAL_RCC_AXISRAM3_MEM_CLK_ENABLE();
  __HAL_RCC_AXISRAM4_MEM_CLK_ENABLE();
  __HAL_RCC_AXISRAM5_MEM_CLK_ENABLE();
  __HAL_RCC_AXISRAM6_MEM_CLK_ENABLE();
  __HAL_RCC_RAMCFG_CLK_ENABLE();
  RAMCFG_HandleTypeDef hramcfg = {0};
  hramcfg.Instance = RAMCFG_SRAM3_AXI;
  HAL_RAMCFG_EnableAXISRAM(&hramcfg);
  hramcfg.Instance = RAMCFG_SRAM4_AXI;
  HAL_RAMCFG_EnableAXISRAM(&hramcfg);
  hramcfg.Instance = RAMCFG_SRAM5_AXI;
  HAL_RAMCFG_EnableAXISRAM(&hramcfg);
  hramcfg.Instance = RAMCFG_SRAM6_AXI;
  HAL_RAMCFG_EnableAXISRAM(&hramcfg);
}`,
  "NPUCache_config": `static void NPUCache_config()
{
  npu_cache_init();
  npu_cache_enable();
}`,
  "Security_Config": `static void Security_Config()
{
  __HAL_RCC_RIFSC_CLK_ENABLE();
  RIMC_MasterConfig_t RIMC_master = {0};
  RIMC_master.MasterCID = RIF_CID_1;
  RIMC_master.SecPriv = RIF_ATTRIBUTE_SEC | RIF_ATTRIBUTE_PRIV;
  HAL_RIF_RIMC_ConfigMasterAttributes(RIF_MASTER_INDEX_NPU, &RIMC_master);
  HAL_RIF_RIMC_ConfigMasterAttributes(RIF_MASTER_INDEX_DMA2D, &RIMC_master);
  HAL_RIF_RIMC_ConfigMasterAttributes(RIF_MASTER_INDEX_DCMIPP, &RIMC_master);
  HAL_RIF_RIMC_ConfigMasterAttributes(RIF_MASTER_INDEX_LTDC1, &RIMC_master);
  HAL_RIF_RIMC_ConfigMasterAttributes(RIF_MASTER_INDEX_LTDC2, &RIMC_master);
  HAL_RIF_RIMC_ConfigMasterAttributes(RIF_MASTER_INDEX_OTG1, &RIMC_master);
  HAL_RIF_RISC_SetSlaveSecureAttributes(RIF_RISC_PERIPH_INDEX_NPU, RIF_ATTRIBUTE_SEC | RIF_ATTRIBUTE_PRIV);
  HAL_RIF_RISC_SetSlaveSecureAttributes(RIF_RISC_PERIPH_INDEX_DMA2D, RIF_ATTRIBUTE_SEC | RIF_ATTRIBUTE_PRIV);
  HAL_RIF_RISC_SetSlaveSecureAttributes(RIF_RISC_PERIPH_INDEX_CSI, RIF_ATTRIBUTE_SEC | RIF_ATTRIBUTE_PRIV);
  HAL_RIF_RISC_SetSlaveSecureAttributes(RIF_RISC_PERIPH_INDEX_DCMIPP, RIF_ATTRIBUTE_SEC | RIF_ATTRIBUTE_PRIV);
  HAL_RIF_RISC_SetSlaveSecureAttributes(RIF_RISC_PERIPH_INDEX_LTDC, RIF_ATTRIBUTE_SEC | RIF_ATTRIBUTE_PRIV);
  HAL_RIF_RISC_SetSlaveSecureAttributes(RIF_RISC_PERIPH_INDEX_LTDCL1, RIF_ATTRIBUTE_SEC | RIF_ATTRIBUTE_PRIV);
  HAL_RIF_RISC_SetSlaveSecureAttributes(RIF_RISC_PERIPH_INDEX_LTDCL2, RIF_ATTRIBUTE_SEC | RIF_ATTRIBUTE_PRIV);
  HAL_RIF_RISC_SetSlaveSecureAttributes(RIF_RISC_PERIPH_INDEX_OTG1HS, RIF_ATTRIBUTE_SEC | RIF_ATTRIBUTE_PRIV);
  HAL_RIF_RISC_SetSlaveSecureAttributes(RIF_RISC_PERIPH_INDEX_SPI5, RIF_ATTRIBUTE_SEC | RIF_ATTRIBUTE_PRIV);
}`,
  "IAC_Config": `static void IAC_Config(void)
{
  __HAL_RCC_IAC_CLK_ENABLE();
  __HAL_RCC_IAC_FORCE_RESET();
  __HAL_RCC_IAC_RELEASE_RESET();
}`,
  "MX_DCMIPP_ClockConfig": `HAL_StatusTypeDef MX_DCMIPP_ClockConfig(DCMIPP_HandleTypeDef *hdcmipp)
{
  RCC_PeriphCLKInitTypeDef RCC_PeriphCLKInitStruct = {0};
  HAL_StatusTypeDef ret;

  RCC_PeriphCLKInitStruct.PeriphClockSelection = RCC_PERIPHCLK_DCMIPP;
  RCC_PeriphCLKInitStruct.DcmippClockSelection = RCC_DCMIPPCLKSOURCE_IC17;
  RCC_PeriphCLKInitStruct.ICSelection[RCC_IC17].ClockSelection = RCC_ICCLKSOURCE_PLL2;
  RCC_PeriphCLKInitStruct.ICSelection[RCC_IC17].ClockDivider = 3;
  ret = HAL_RCCEx_PeriphCLKConfig(&RCC_PeriphCLKInitStruct);
  if (ret)
    return ret;

  RCC_PeriphCLKInitStruct.PeriphClockSelection = RCC_PERIPHCLK_CSI;
  RCC_PeriphCLKInitStruct.ICSelection[RCC_IC18].ClockSelection = RCC_ICCLKSOURCE_PLL1;
  RCC_PeriphCLKInitStruct.ICSelection[RCC_IC18].ClockDivider = 40;
  ret = HAL_RCCEx_PeriphCLKConfig(&RCC_PeriphCLKInitStruct);
  if (ret)
    return ret;

  return HAL_OK;
}`,
  "HAL_CACHEAXI_MspInit": `void HAL_CACHEAXI_MspInit(CACHEAXI_HandleTypeDef *hcacheaxi)
{
  __HAL_RCC_CACHEAXIRAM_MEM_CLK_ENABLE();
  __HAL_RCC_CACHEAXI_CLK_ENABLE();
  __HAL_RCC_CACHEAXI_FORCE_RESET();
  __HAL_RCC_CACHEAXI_RELEASE_RESET();
}`,
  "HAL_CACHEAXI_MspDeInit": `void HAL_CACHEAXI_MspDeInit(CACHEAXI_HandleTypeDef *hcacheaxi)
{
  __HAL_RCC_CACHEAXIRAM_MEM_CLK_DISABLE();
  __HAL_RCC_CACHEAXI_CLK_DISABLE();
  __HAL_RCC_CACHEAXI_FORCE_RESET();
}`,
  "Error_Handler": `void Error_Handler(void)
{
  __disable_irq();
  while (1)
  {
  }
}`,
  "assert_failed": `void assert_failed(uint8_t *file, uint32_t line)
{
}`,
  "is_cache_enable": `static int is_cache_enable()
{
#if defined(USE_DCACHE)
  return 1;
#else
  return 0;
#endif
}`,
  "cpuload_init": `static void cpuload_init(cpuload_info_t *cpu_load)
{
  memset(cpu_load, 0, sizeof(cpuload_info_t));
}`,
  "cpuload_update": `static void cpuload_update(cpuload_info_t *cpu_load)
{
  int i;

  cpu_load->history[1] = cpu_load->history[0];
  cpu_load->history[0].total = HAL_GetTick();
  cpu_load->history[0].thread = HAL_GetTick();
  cpu_load->history[0].tick = HAL_GetTick();

  if (cpu_load->history[1].tick - cpu_load->history[2].tick < 1000)
    return;

  for (i = 0; i < CPU_LOAD_HISTORY_DEPTH - 2; i++)
    cpu_load->history[CPU_LOAD_HISTORY_DEPTH - 1 - i] = cpu_load->history[CPU_LOAD_HISTORY_DEPTH - 1 - i - 1];
}`,
  "cpuload_get_info": `static void cpuload_get_info(cpuload_info_t *cpu_load, float *cpu_load_last, float *cpu_load_last_second,
                             float *cpu_load_last_five_seconds)
{
  if (cpu_load_last)
    *cpu_load_last = 100.0 * (cpu_load->history[0].thread - cpu_load->history[1].thread) /
                     (cpu_load->history[0].total - cpu_load->history[1].total);
  if (cpu_load_last_second)
    *cpu_load_last_second = 100.0 * (cpu_load->history[2].thread - cpu_load->history[3].thread) /
                            (cpu_load->history[2].total - cpu_load->history[3].total);
  if (cpu_load_last_five_seconds)
    *cpu_load_last_five_seconds = 100.0 * (cpu_load->history[2].thread - cpu_load->history[7].thread) /
                                  (cpu_load->history[2].total - cpu_load->history[7].total);
}`,
  "bqueue_init": `static int bqueue_init(bqueue_t *bq, int buffer_nb, uint8_t **buffers)
{
  int i;

  if (buffer_nb > BQUEUE_MAX_BUFFERS)
    return -1;

  T_CSEM sem_config;
  sem_config.sematr = TA_TFIFO;
  sem_config.exinf = NULL;

  sem_config.isemcnt = buffer_nb;
  sem_config.maxsem = buffer_nb;
  bq->free = tk_cre_sem(&sem_config);
  if (bq->free <= 0)
    goto free_sem_error;

  sem_config.isemcnt = 0;
  sem_config.maxsem = buffer_nb;
  bq->ready = tk_cre_sem(&sem_config);
  if (bq->ready <= 0)
    goto ready_sem_error;

  bq->buffer_nb = buffer_nb;
  for (i = 0; i < buffer_nb; i++)
  {
    assert(buffers[i]);
    bq->buffers[i] = buffers[i];
  }
  bq->free_idx = 0;
  bq->ready_idx = 0;

  return 0;

ready_sem_error:
  tk_del_sem(bq->free);
free_sem_error:
  return -1;
}`,
  "bqueue_get_free": `static uint8_t *bqueue_get_free(bqueue_t *bq, int is_blocking)
{
  uint8_t *res;
  ER ret;

  ret = tk_wai_sem(bq->free, 1, is_blocking ? TMO_FEVR : TMO_POL);
  if (ret != E_OK)
    return NULL;

  res = bq->buffers[bq->free_idx];
  bq->free_idx = (bq->free_idx + 1) % bq->buffer_nb;

  return res;
}`,
  "bqueue_put_free": `static void bqueue_put_free(bqueue_t *bq)
{
  ER ret;

  ret = tk_sig_sem(bq->free, 1);
  assert(ret == E_OK);
}`,
  "bqueue_get_ready": `static uint8_t *bqueue_get_ready(bqueue_t *bq)
{
  uint8_t *res;
  ER ret;

  ret = tk_wai_sem(bq->ready, 1, TMO_FEVR);
  assert(ret == E_OK);

  res = bq->buffers[bq->ready_idx];
  bq->ready_idx = (bq->ready_idx + 1) % bq->buffer_nb;

  return res;
}`,
  "bqueue_put_ready": `static void bqueue_put_ready(bqueue_t *bq)
{
  ER ret;

  ret = tk_sig_sem(bq->ready, 1);
  assert(ret == E_OK);
}`,
  "reload_bg_layer": `static void reload_bg_layer(int next_disp_idx)
{
  int ret;

  ret = SCRL_SetAddress_NoReload(lcd_bg_buffer[next_disp_idx], SCRL_LAYER_0);
  assert(ret == 0);
  ret = SCRL_ReloadLayer(SCRL_LAYER_0);
  assert(ret == 0);

  ret = SRCL_Update();
  assert(ret == 0);
}`,
  "app_main_pipe_frame_event": `static void app_main_pipe_frame_event()
{
  int next_disp_idx = (lcd_bg_buffer_disp_idx + 1) % DISPLAY_BUFFER_NB;
  int next_capt_idx = (lcd_bg_buffer_capt_idx + 1) % DISPLAY_BUFFER_NB;
  int ret;

  ret = HAL_DCMIPP_PIPE_SetMemoryAddress(CMW_CAMERA_GetDCMIPPHandle(), DCMIPP_PIPE1,
                                         DCMIPP_MEMORY_ADDRESS_0, (uint32_t)lcd_bg_buffer[next_capt_idx]);
  assert(ret == HAL_OK);

  reload_bg_layer(next_disp_idx);
  lcd_bg_buffer_disp_idx = next_disp_idx;
  lcd_bg_buffer_capt_idx = next_capt_idx;
}`,
  "app_ancillary_pipe_frame_event": `static void app_ancillary_pipe_frame_event()
{
  uint8_t *next_buffer;
  int ret;

  next_buffer = bqueue_get_free(&nn_input_queue, 0);
  if (next_buffer)
  {
    ret = HAL_DCMIPP_PIPE_SetMemoryAddress(CMW_CAMERA_GetDCMIPPHandle(), DCMIPP_PIPE2,
                                           DCMIPP_MEMORY_ADDRESS_0, (uint32_t)next_buffer);
    assert(ret == HAL_OK);
    bqueue_put_ready(&nn_input_queue);
  }
}`,
  "app_main_pipe_vsync_event": `static void app_main_pipe_vsync_event()
{
  ER ret;

  ret = tk_sig_sem(isp_sem, 1);
  assert(ret == E_OK);
}`,
  "clamp_point": `static int clamp_point(int *x, int *y)
{
  int xi = *x;
  int yi = *y;

  if (*x < 0)
    *x = 0;
  if (*y < 0)
    *y = 0;
  if (*x >= lcd_bg_area.XSize)
    *x = lcd_bg_area.XSize - 1;
  if (*y >= lcd_bg_area.YSize)
    *y = lcd_bg_area.YSize - 1;

  return (xi != *x) || (yi != *y);
}`,
  "convert_length": `static void convert_length(float32_t wi, float32_t hi, int *wo, int *ho)
{
  *wo = (int)(lcd_bg_area.XSize * wi);
  *ho = (int)(lcd_bg_area.YSize * hi);
}`,
  "convert_point": `static void convert_point(float32_t xi, float32_t yi, int *xo, int *yo)
{
  *xo = (int)(lcd_bg_area.XSize * xi);
  *yo = (int)(lcd_bg_area.YSize * yi);
}`,
  "Display_Detection": `static void Display_Detection(od_pp_outBuffer_t *detect)
{
  int xc, yc;
  int x0, y0;
  int x1, y1;
  int w, h;

  convert_point(detect->x_center, detect->y_center, &xc, &yc);
  convert_length(detect->width, detect->height, &w, &h);
  x0 = xc - (w + 1) / 2;
  y0 = yc - (h + 1) / 2;
  x1 = xc + (w + 1) / 2;
  y1 = yc + (h + 1) / 2;
  clamp_point(&x0, &y0);
  clamp_point(&x1, &y1);

  UTIL_LCD_DrawRect(x0, y0, x1 - x0, y1 - y0, colors[detect->class_index % NUMBER_COLORS]);
  UTIL_LCDEx_PrintfAt(x0 + 1, y0 + 1, LEFT_MODE, classes_table[detect->class_index]);
}`,
  "Display_NetworkOutput_NoTracking": `static void Display_NetworkOutput_NoTracking(display_info_t *info)
{
  od_pp_outBuffer_t *rois = info->detects;
  uint32_t nb_rois = info->nb_detect;
  float cpu_load_one_second;
  int line_nb = 0;
  float nn_fps;
  int i;
  static uint32_t frame_count = 0;

  /* Output structured detection data */
  SERIAL_DETECTION_START(frame_count, nb_rois, 0);
  for (i = 0; i < nb_rois; i++)
  {
    int xc, yc, w, h, x0, y0;
    convert_point(rois[i].x_center, rois[i].y_center, &xc, &yc);
    convert_length(rois[i].width, rois[i].height, &w, &h);
    x0 = xc - (w + 1) / 2;
    y0 = yc - (h + 1) / 2;
    clamp_point(&x0, &y0);
    SERIAL_DETECTION_OBJECT(i == 0, classes_table[rois[i].class_index],
                           x0, y0, w, h);
  }
  SERIAL_DETECTION_END();
  frame_count++;

  /* clear previous ui */
  UTIL_LCD_FillRect(lcd_fg_area.X0, lcd_fg_area.Y0, lcd_fg_area.XSize, lcd_fg_area.YSize, 0x00000000);

  /* cpu load */
  cpuload_update(&cpu_load);
  cpuload_get_info(&cpu_load, NULL, &cpu_load_one_second, NULL);

  /* draw metrics */
  nn_fps = 1000.0 / info->nn_period_ms;
#if 1
  UTIL_LCDEx_PrintfAt(0, LINE(line_nb), RIGHT_MODE, "Inference");
  line_nb += 1;
  UTIL_LCDEx_PrintfAt(0, LINE(line_nb), RIGHT_MODE, "   %ums", info->inf_ms);
  line_nb += 2;
  UTIL_LCDEx_PrintfAt(0, LINE(line_nb), RIGHT_MODE, " Persons %u", nb_rois);
  line_nb += 1;
#else
  (void)nn_fps;
  UTIL_LCDEx_PrintfAt(0, LINE(line_nb), RIGHT_MODE, "Cpu load");
  line_nb += 1;
  UTIL_LCDEx_PrintfAt(0, LINE(line_nb), RIGHT_MODE, "   %.1f%%", cpu_load_one_second);
  line_nb += 1;
  UTIL_LCDEx_PrintfAt(0, LINE(line_nb), RIGHT_MODE, "nn period");
  line_nb += 1;
  UTIL_LCDEx_PrintfAt(0, LINE(line_nb), RIGHT_MODE, "   %ums", info->nn_period_ms);
  line_nb += 1;
  UTIL_LCDEx_PrintfAt(0, LINE(line_nb), RIGHT_MODE, "Inference");
  line_nb += 1;
  UTIL_LCDEx_PrintfAt(0, LINE(line_nb), RIGHT_MODE, "   %ums", info->inf_ms);
  line_nb += 1;
  UTIL_LCDEx_PrintfAt(0, LINE(line_nb), RIGHT_MODE, "Post process");
  line_nb += 1;
  UTIL_LCDEx_PrintfAt(0, LINE(line_nb), RIGHT_MODE, "   %ums", info->pp_ms);
  line_nb += 1;
  UTIL_LCDEx_PrintfAt(0, LINE(line_nb), RIGHT_MODE, "Display");
  line_nb += 1;
  UTIL_LCDEx_PrintfAt(0, LINE(line_nb), RIGHT_MODE, "   %ums", info->disp_ms);
  line_nb += 1;
  UTIL_LCDEx_PrintfAt(0, LINE(line_nb), RIGHT_MODE, " Persons %u", nb_rois);
  line_nb += 1;
#endif

  /* Draw bounding boxes */
  for (i = 0; i < nb_rois; i++)
    Display_Detection(&rois[i]);
}`,
  "model_get_output_nb": `static int model_get_output_nb(const LL_Buffer_InfoTypeDef *nn_out_info)
{
  int nb = 0;

  while (nn_out_info->name)
  {
    nb++;
    nn_out_info++;
  }

  return nb;
}`,
  "Display_TrackingBox": `static void Display_TrackingBox(tbox_info *tbox)
{
  int xc, yc;
  int x0, y0;
  int x1, y1;
  int w, h;

  convert_point(tbox->cx, tbox->cy, &xc, &yc);
  convert_length(tbox->w, tbox->h, &w, &h);
  x0 = xc - (w + 1) / 2;
  y0 = yc - (h + 1) / 2;
  x1 = xc + (w + 1) / 2;
  y1 = yc + (h + 1) / 2;
  clamp_point(&x0, &y0);
  clamp_point(&x1, &y1);

  UTIL_LCD_DrawRect(x0, y0, x1 - x0, y1 - y0, colors[tbox->id % NUMBER_COLORS]);
  UTIL_LCDEx_PrintfAt(x0 + 1, y0 + 1, LEFT_MODE, "%3d", tbox->id);
}`,
  "Display_NetworkOutput_Tracking": `static void Display_NetworkOutput_Tracking(display_info_t *info)
{
  float cpu_load_one_second;
  int line_nb = 0;
  float nn_fps;
  int i;
  static uint32_t frame_count = 0;

  /* Output structured tracking data */
  SERIAL_DETECTION_START(frame_count, info->tboxes_valid_nb, 1);
  for (i = 0; i < info->tboxes_valid_nb; i++)
  {
    int xc, yc, w, h, x0, y0;
    convert_point(info->tboxes[i].cx, info->tboxes[i].cy, &xc, &yc);
    convert_length(info->tboxes[i].w, info->tboxes[i].h, &w, &h);
    x0 = xc - (w + 1) / 2;
    y0 = yc - (h + 1) / 2;
    clamp_point(&x0, &y0);
    SERIAL_TRACKING_OBJECT(i == 0, info->tboxes[i].id, "person",
                          x0, y0, w, h);
  }
  SERIAL_DETECTION_END();
  frame_count++;

  /* clear previous ui */
  UTIL_LCD_FillRect(lcd_fg_area.X0, lcd_fg_area.Y0, lcd_fg_area.XSize, lcd_fg_area.YSize, 0x00000000);

  /* cpu load */
  cpuload_update(&cpu_load);
  cpuload_get_info(&cpu_load, NULL, &cpu_load_one_second, NULL);

  /* draw metrics */
  nn_fps = 1000.0 / info->nn_period_ms;
#if 1
  UTIL_LCDEx_PrintfAt(0, LINE(line_nb), RIGHT_MODE, "Inference");
  line_nb += 1;
  UTIL_LCDEx_PrintfAt(0, LINE(line_nb), RIGHT_MODE, "   %ums", info->inf_ms);
  line_nb += 2;
  UTIL_LCDEx_PrintfAt(0, LINE(line_nb), RIGHT_MODE, " Persons %u", info->tboxes_valid_nb);
  line_nb += 1;
#else
  (void)nn_fps;
  UTIL_LCDEx_PrintfAt(0, LINE(line_nb), RIGHT_MODE, "Cpu load");
  line_nb += 1;
  UTIL_LCDEx_PrintfAt(0, LINE(line_nb), RIGHT_MODE, "   %.1f%%", cpu_load_one_second);
  line_nb += 1;
  UTIL_LCDEx_PrintfAt(0, LINE(line_nb), RIGHT_MODE, "nn period");
  line_nb += 1;
  UTIL_LCDEx_PrintfAt(0, LINE(line_nb), RIGHT_MODE, "   %ums", info->nn_period_ms);
  line_nb += 1;
  UTIL_LCDEx_PrintfAt(0, LINE(line_nb), RIGHT_MODE, "Inference");
  line_nb += 1;
  UTIL_LCDEx_PrintfAt(0, LINE(line_nb), RIGHT_MODE, "   %ums", info->inf_ms);
  line_nb += 1;
  UTIL_LCDEx_PrintfAt(0, LINE(line_nb), RIGHT_MODE, "Post process");
  line_nb += 1;
  UTIL_LCDEx_PrintfAt(0, LINE(line_nb), RIGHT_MODE, "   %ums", info->pp_ms);
  line_nb += 1;
  UTIL_LCDEx_PrintfAt(0, LINE(line_nb), RIGHT_MODE, "Display");
  line_nb += 1;
  UTIL_LCDEx_PrintfAt(0, LINE(line_nb), RIGHT_MODE, "   %ums", info->disp_ms);
  line_nb += 1;
  UTIL_LCDEx_PrintfAt(0, LINE(line_nb), RIGHT_MODE, " Persons %u", info->tboxes_valid_nb);
  line_nb += 1;
#endif

  /* Draw bounding boxes */
  for (i = 0; i < info->tboxes_valid_nb; i++)
  {
    Display_TrackingBox(&info->tboxes[i]);
  }
}`,
  "Display_NetworkOutput": `static void Display_NetworkOutput(display_info_t *info)
{
  if (info->tracking_enabled)
    Display_NetworkOutput_Tracking(info);
  else
    Display_NetworkOutput_NoTracking(info);
}`,
  "nn_thread_fct": `static void nn_thread_fct(INT stacd, void *exinf)
{
  SERIAL_MSG_STR(LEVEL_INFO, MODULE_NN, EVENT_TASK_START, "thread", "nn_inference");
  const LL_Buffer_InfoTypeDef *nn_out_info = LL_ATON_Output_Buffers_Info(&NN_Instance_Default);
  const LL_Buffer_InfoTypeDef *nn_in_info = LL_ATON_Input_Buffers_Info(&NN_Instance_Default);
  uint32_t nn_period_ms;
  uint32_t nn_period[2];
  uint8_t *nn_pipe_dst;
  uint32_t nn_in_len;
  uint32_t inf_ms;
  uint32_t ts;
  int ret;
  int i;

  /* Initialize Cube.AI/ATON ... */
  LL_ATON_RT_RuntimeInit();
  /* ... and model instance */
  LL_ATON_RT_Init_Network(&NN_Instance_Default);

  /* setup buffers size */
  nn_in_len = LL_Buffer_len(&nn_in_info[0]);
  assert(NN_OUT_NB == model_get_output_nb(nn_out_info));
  for (i = 0; i < NN_OUT_NB; i++)
    assert(LL_Buffer_len(&nn_out_info[i]) == nn_out_len_user[i]);

  /*** App Loop ***************************************************************/
  nn_period[1] = HAL_GetTick();

  nn_pipe_dst = bqueue_get_free(&nn_input_queue, 0);
  assert(nn_pipe_dst);
  CAM_NNPipe_Start(nn_pipe_dst, CMW_MODE_CONTINUOUS);
  SERIAL_MSG_STR(LEVEL_INFO, MODULE_NN, EVENT_TASK_READY, "thread", "nn_inference");
  while (1)
  {
    uint8_t *capture_buffer;
    uint8_t *out[NN_OUT_NB];
    uint8_t *output_buffer;
    int i;

    nn_period[0] = nn_period[1];
    nn_period[1] = HAL_GetTick();
    nn_period_ms = nn_period[1] - nn_period[0];

    capture_buffer = bqueue_get_ready(&nn_input_queue);
    assert(capture_buffer);
    output_buffer = bqueue_get_free(&nn_output_queue, 1);
    assert(output_buffer);
    out[0] = output_buffer;
    for (i = 1; i < NN_OUT_NB; i++)
      out[i] = out[i - 1] + ALIGN_VALUE(nn_out_len_user[i - 1], 32);

    /* run ATON inference */
    ts = HAL_GetTick();
    /* Note that we don't need to clean/invalidate those input buffers since they are only access in hardware */
    ret = LL_ATON_Set_User_Input_Buffer_Default(0, capture_buffer, nn_in_len);
    assert(ret == LL_ATON_User_IO_NOERROR);
    /* Invalidate output buffer before Hw access it */
    CACHE_OP(SCB_InvalidateDCache_by_Addr(output_buffer, sizeof(nn_output_buffers[0])));
    for (i = 0; i < NN_OUT_NB; i++)
    {
      ret = LL_ATON_Set_User_Output_Buffer_Default(i, out[i], nn_out_len_user[i]);
      assert(ret == LL_ATON_User_IO_NOERROR);
    }
    Run_Inference(&NN_Instance_Default);
    inf_ms = HAL_GetTick() - ts;

    /* release buffers */
    bqueue_put_free(&nn_input_queue);
    bqueue_put_ready(&nn_output_queue);

    /* update display stats */
    ret = tk_loc_mtx(disp.lock, TMO_FEVR);
    assert(ret == E_OK);
    disp.info.inf_ms = inf_ms;
    disp.info.nn_period_ms = nn_period_ms;
    ret = tk_unl_mtx(disp.lock);
    assert(ret == E_OK);
  }
  tk_ext_tsk();
}`,
  "TRK_Init": `static int TRK_Init()
{
  const trk_conf_t cfg = {
      .track_thresh = 0.25,
      .det_thresh = 0.8,
      .sim1_thresh = 0.8,
      .sim2_thresh = 0.5,
      .tlost_cnt = 30,
  };

  return trk_init(&trk_ctx, (trk_conf_t *)&cfg, ARRAY_NB(tboxes), tboxes);
}`,
  "update_and_capture_tracking_enabled": `static int update_and_capture_tracking_enabled()
{
  static int prev_button_state = GPIO_PIN_RESET;
  static int tracking_enabled = 1;
  int cur_button_state;
  int ret;

  cur_button_state = BSP_PB_GetState(BUTTON_TOGGLE_TRACKING);
  if (cur_button_state == GPIO_PIN_SET && prev_button_state == GPIO_PIN_RESET)
  {
    tracking_enabled = !tracking_enabled;
    if (tracking_enabled)
    {
      printf("Enable tracking\\n");
      ret = TRK_Init();
      assert(ret == 0);
    }
    else
      printf("Disable tracking\\n");
  }
  prev_button_state = cur_button_state;

  return tracking_enabled;
}`,
  "roi_to_dbox": `static void roi_to_dbox(od_pp_outBuffer_t *roi, trk_dbox_t *dbox)
{
  dbox->conf = roi->conf;
  dbox->cx = roi->x_center;
  dbox->cy = roi->y_center;
  dbox->w = roi->width;
  dbox->h = roi->height;
}`,
  "app_tracking": `static int app_tracking(od_pp_out_t *pp)
{
  int tracking_enabled = update_and_capture_tracking_enabled();
  int ret;
  int i;

  if (!tracking_enabled)
    return 0;

  for (i = 0; i < pp->nb_detect; i++)
    roi_to_dbox(&pp->pOutBuff[i], &dboxes[i]);

  ret = trk_update(&trk_ctx, pp->nb_detect, dboxes);
  assert(ret == 0);

  return 1;
}`,
  "tbox_to_tbox_info": `static void tbox_to_tbox_info(trk_tbox_t *tbox, tbox_info *tinfo)
{
  tinfo->cx = tbox->cx;
  tinfo->cy = tbox->cy;
  tinfo->w = tbox->w;
  tinfo->h = tbox->h;
  tinfo->id = tbox->id;
}`,
  "pp_thread_fct": `static void pp_thread_fct(INT stacd, void *exinf)
{
  SERIAL_MSG_STR(LEVEL_INFO, MODULE_PP, EVENT_TASK_START, "thread", "postprocess");
#if POSTPROCESS_TYPE == POSTPROCESS_OD_YOLO_V2_UF
  od_yolov2_pp_static_param_t pp_params;
#elif POSTPROCESS_TYPE == POSTPROCESS_OD_YOLO_V5_UU
  od_yolov5_pp_static_param_t pp_params;
#elif POSTPROCESS_TYPE == POSTPROCESS_OD_YOLO_V8_UF || POSTPROCESS_TYPE == POSTPROCESS_OD_YOLO_V8_UI
  od_yolov8_pp_static_param_t pp_params;
#elif POSTPROCESS_TYPE == POSTPROCESS_OD_ST_YOLOX_UF
  od_st_yolox_pp_static_param_t pp_params;
#else
#error "PostProcessing type not supported"
#endif
  uint8_t *pp_input[NN_OUT_NB];
  od_pp_out_t pp_output;
  int tracking_enabled;
  uint32_t nn_pp[2];
  int ret;
  int i;

  (void)tracking_enabled;
  /* setup post process */
  app_postprocess_init(&pp_params, &NN_Instance_Default);
  while (1)
  {
    uint8_t *output_buffer;

    output_buffer = bqueue_get_ready(&nn_output_queue);
    assert(output_buffer);
    pp_input[0] = output_buffer;
    for (i = 1; i < NN_OUT_NB; i++)
      pp_input[i] = pp_input[i - 1] + ALIGN_VALUE(nn_out_len_user[i - 1], 32);
    pp_output.pOutBuff = NULL;

    nn_pp[0] = HAL_GetTick();
    ret = app_postprocess_run((void **)pp_input, NN_OUT_NB, &pp_output, &pp_params);
    assert(ret == 0);
    tracking_enabled = app_tracking(&pp_output);

    nn_pp[1] = HAL_GetTick();

    /* update display stats and detection info */
    ret = tk_loc_mtx(disp.lock, TMO_FEVR);
    assert(ret == E_OK);

    /* Clamp nb_detect to prevent buffer overflow */
    if (pp_output.nb_detect > AI_OD_PP_MAX_BOXES_LIMIT)
    {
      SERIAL_MSG_HEADER(LEVEL_WARN, MODULE_PP, EVENT_WARNING);
      tm_printf((UB *)"{\\"msg\\":\\"detection_overflow\\",\\"detected\\":%u,\\"limit\\":%d}\\n",
                pp_output.nb_detect, AI_OD_PP_MAX_BOXES_LIMIT);
      disp.info.nb_detect = AI_OD_PP_MAX_BOXES_LIMIT;
    }
    else
    {
      disp.info.nb_detect = pp_output.nb_detect;
    }
    for (i = 0; i < disp.info.nb_detect; i++)
    {
      disp.info.detects[i] = pp_output.pOutBuff[i];
    }
#ifdef TRACKER_MODULE
    disp.info.tracking_enabled = tracking_enabled;
    disp.info.tboxes_valid_nb = 0;
    for (i = 0; i < ARRAY_NB(tboxes); i++)
    {
      if (!tboxes[i].is_tracking || tboxes[i].tlost_cnt)
        continue;
      tbox_to_tbox_info(&tboxes[i], &disp.info.tboxes[disp.info.tboxes_valid_nb]);
      disp.info.tboxes_valid_nb++;
    }
#endif
    disp.info.pp_ms = nn_pp[1] - nn_pp[0];
    ret = tk_unl_mtx(disp.lock);
    assert(ret == E_OK);

    bqueue_put_free(&nn_output_queue);
    /* It's possible xqueue is empty if display is slow. So don't check error code that may by E_QOVR in that case */
    tk_sig_sem(disp.update, 1);
  }
  tk_ext_tsk();
}`,
  "dp_update_drawing_area": `static void dp_update_drawing_area()
{
  int ret;
  int write_idx;

  /* Toggle to the write buffer (the one NOT currently being displayed) */
  write_idx = 1 - lcd_fg_buffer_rd_idx;

  __disable_irq();
  ret = SCRL_SetAddress_NoReload(lcd_fg_buffer[write_idx], SCRL_LAYER_1);
  assert(ret == HAL_OK);
  __enable_irq();
}`,
  "dp_commit_drawing_area": `static void dp_commit_drawing_area()
{
  int ret;

  __disable_irq();
  ret = SCRL_ReloadLayer(SCRL_LAYER_1);
  assert(ret == HAL_OK);
  __enable_irq();

  /* Update the read index to point to the buffer we just committed */
  lcd_fg_buffer_rd_idx = 1 - lcd_fg_buffer_rd_idx;
}`,
  "dp_thread_fct": `static void dp_thread_fct(INT stacd, void *exinf)
{
  SERIAL_MSG_STR(LEVEL_INFO, MODULE_DISPLAY, EVENT_TASK_START, "thread", "display");
  uint32_t disp_ms = 0;
  display_info_t info;
  uint32_t ts;
  ER ret;
  static uint32_t frame_count = 0;

  while (1)
  {
    ret = tk_wai_sem(disp.update, 1, TMO_FEVR);
    assert(ret == E_OK);

    ret = tk_loc_mtx(disp.lock, TMO_FEVR);
    assert(ret == E_OK);
    info = disp.info;
    ret = tk_unl_mtx(disp.lock);
    assert(ret == E_OK);
    info.disp_ms = disp_ms;

    ts = HAL_GetTick();
    SERIAL_FRAME_EVENT(frame_count, info.nb_detect, info.tracking_enabled, lcd_fg_buffer_rd_idx);

    /* Set up the write buffer for drawing (the inactive buffer) */
    dp_update_drawing_area();
    UTIL_LCD_SetLayer(SCRL_LAYER_1);

    /* Draw to the write buffer */
    Display_NetworkOutput(&info);

    /* Clean cache for the write buffer (the one we just drew to) */
    int write_idx = 1 - lcd_fg_buffer_rd_idx;
    SCB_CleanDCache_by_Addr(lcd_fg_buffer[write_idx], LCD_FG_WIDTH * LCD_FG_HEIGHT * 2);

    /* Commit and swap buffers */
    dp_commit_drawing_area();
    disp_ms = HAL_GetTick() - ts;

    /* Output performance timing */
    SERIAL_PERF_TIMING(frame_count, info.inf_ms, info.pp_ms, disp_ms, info.nn_period_ms);
    frame_count++;
  }
  tk_ext_tsk();
}`,
  "isp_thread_fct": `static void isp_thread_fct(INT stacd, void *exinf)
{
  SERIAL_MSG_STR(LEVEL_INFO, MODULE_CAMERA, EVENT_TASK_START, "thread", "isp");
  ER ret;

  while (1)
  {
    ret = tk_wai_sem(isp_sem, 1, TMO_FEVR);
    assert(ret == E_OK);

    CAM_IspUpdate();
  }
  tk_ext_tsk();
}`,
  "Display_init": `static void Display_init()
{
  SCRL_LayerConfig layers_config[2] = {
      {
          .origin = {lcd_bg_area.X0, lcd_bg_area.Y0},
          .size = {lcd_bg_area.XSize, lcd_bg_area.YSize},
          .format = SCRL_RGB565,
          .address = lcd_bg_buffer[lcd_bg_buffer_disp_idx],
      },
      {
          .origin = {lcd_fg_area.X0, lcd_fg_area.Y0},
          .size = {lcd_fg_area.XSize, lcd_fg_area.YSize},
          .format = SCRL_ARGB4444,
          .address = lcd_fg_buffer[1],
      },
  };
  SCRL_ScreenConfig screen_config = {
      .size = {lcd_bg_area.XSize, lcd_bg_area.YSize},
#ifdef SCR_LIB_USE_SPI
      .format = SCRL_RGB565,
#else
      .format = SCRL_YUV422, /* Use SCRL_RGB565 if host support this format to reduce cpu load */
#endif
      .address = screen_buffer,
      .fps = CAMERA_FPS,
  };
  int ret;

  ret = SCRL_Init((SCRL_LayerConfig *[2]){&layers_config[0], &layers_config[1]}, &screen_config);
  assert(ret == 0);

  UTIL_LCD_SetLayer(SCRL_LAYER_1);
  UTIL_LCD_Clear(UTIL_LCD_COLOR_TRANSPARENT);
  UTIL_LCD_SetFont(&LCD_FONT);
  UTIL_LCD_SetTextColor(UTIL_LCD_COLOR_WHITE);
}`,
  "app_run": `void app_run()
{
  PRI isp_priority = 10;
  PRI nn_priority = 11;
  PRI pp_priority = 14;
  PRI dp_priority = 14;
  ER ret;

  SERIAL_MSG(LEVEL_INFO, MODULE_INIT, "APP_INIT_START");
  /* Enable DWT so DWT_CYCCNT works when debugger not attached */
  CoreDebug->DEMCR |= CoreDebug_DEMCR_TRCENA_Msk;

  /* screen init */
  memset(lcd_bg_buffer, 0, sizeof(lcd_bg_buffer));
  CACHE_OP(SCB_CleanInvalidateDCache_by_Addr(lcd_bg_buffer, sizeof(lcd_bg_buffer)));
  memset(lcd_fg_buffer, 0, sizeof(lcd_fg_buffer));
  CACHE_OP(SCB_CleanInvalidateDCache_by_Addr(lcd_fg_buffer, sizeof(lcd_fg_buffer)));
  Display_init();

  /* create buffer queues */
  ret = bqueue_init(&nn_input_queue, 2, (uint8_t *[2]){nn_input_buffers[0], nn_input_buffers[1]});
  assert(ret == 0);
  ret = bqueue_init(&nn_output_queue, 2, (uint8_t *[2]){nn_output_buffers[0], nn_output_buffers[1]});
  assert(ret == 0);

#ifdef TRACKER_MODULE
  ret = TRK_Init();
  assert(ret == 0);
  ret = BSP_PB_Init(BUTTON_TOGGLE_TRACKING, BUTTON_MODE_GPIO);
  assert(ret == BSP_ERROR_NONE);
#endif

  cpuload_init(&cpu_load);

  /*** Camera Init ************************************************************/
  SERIAL_MSG(LEVEL_INFO, MODULE_CAMERA, EVENT_CAMERA_INIT);
  CAM_Init();

  /* sems + mutex init */
  T_CSEM sem_config;
  sem_config.sematr = TA_TFIFO;
  sem_config.isemcnt = 0;
  sem_config.maxsem = 1;
  sem_config.exinf = NULL;

  isp_sem = tk_cre_sem(&sem_config);
  assert(isp_sem > 0);

  disp.update = tk_cre_sem(&sem_config);
  assert(disp.update > 0);

  T_CMTX mtx_config;
  mtx_config.mtxatr = TA_TFIFO;
  mtx_config.ceilpri = 0;
  mtx_config.exinf = NULL;

  disp.lock = tk_cre_mtx(&mtx_config);
  assert(disp.lock > 0);

  /* Start LCD Display camera pipe stream */
  CAM_DisplayPipe_Start(lcd_bg_buffer[0], CMW_MODE_CONTINUOUS);

  /* threads init */
  T_CTSK task_config;
  task_config.tskatr = TA_HLNG | TA_RNG3 | TA_USERBUF;
  task_config.stksz = 2 * UTKERNEL_STACK_SIZE;
  task_config.exinf = NULL;

  task_config.task = nn_thread_fct;
  task_config.itskpri = nn_priority;
  task_config.bufptr = nn_thread_stack;
  nn_task_id = tk_cre_tsk(&task_config);
  SERIAL_MSG_TASK(LEVEL_INFO, MODULE_RTOS, EVENT_TASK_CREATE, "nn_thread", nn_task_id);
  tk_sta_tsk(nn_task_id, 0);

  task_config.task = pp_thread_fct;
  task_config.itskpri = pp_priority;
  task_config.bufptr = pp_thread_stack;
  pp_task_id = tk_cre_tsk(&task_config);
  SERIAL_MSG_TASK(LEVEL_INFO, MODULE_RTOS, EVENT_TASK_CREATE, "pp_thread", pp_task_id);
  tk_sta_tsk(pp_task_id, 0);

  task_config.task = dp_thread_fct;
  task_config.itskpri = dp_priority;
  task_config.bufptr = dp_thread_stack;
  dp_task_id = tk_cre_tsk(&task_config);
  SERIAL_MSG_TASK(LEVEL_INFO, MODULE_RTOS, EVENT_TASK_CREATE, "dp_thread", dp_task_id);
  tk_sta_tsk(dp_task_id, 0);

  task_config.task = isp_thread_fct;
  task_config.itskpri = isp_priority;
  task_config.bufptr = isp_thread_stack;
  isp_task_id = tk_cre_tsk(&task_config);
  SERIAL_MSG_TASK(LEVEL_INFO, MODULE_RTOS, EVENT_TASK_CREATE, "isp_thread", isp_task_id);
  tk_sta_tsk(isp_task_id, 0);

  SERIAL_MSG(LEVEL_INFO, MODULE_INIT, "APP_INIT_COMPLETE");
}`,
  "CMW_CAMERA_PIPE_FrameEventCallback": `int CMW_CAMERA_PIPE_FrameEventCallback(uint32_t pipe)
{
  if (pipe == DCMIPP_PIPE1)
    app_main_pipe_frame_event();
  else if (pipe == DCMIPP_PIPE2)
    app_ancillary_pipe_frame_event();

  return HAL_OK;
}`,
  "CMW_CAMERA_PIPE_VsyncEventCallback": `int CMW_CAMERA_PIPE_VsyncEventCallback(uint32_t pipe)
{
  if (pipe == DCMIPP_PIPE1)
    app_main_pipe_vsync_event();

  return HAL_OK;
}`,
  "CAM_InitCropConfig": `static void CAM_InitCropConfig(CMW_Manual_roi_area_t *roi, int sensor_width, int sensor_height)
{
  const float ratiox = (float)sensor_width / LCD_BG_WIDTH;
  const float ratioy = (float)sensor_height / LCD_BG_HEIGHT;
  const float ratio = MIN(ratiox, ratioy);

  assert(ratio >= 1);
  assert(ratio < 64);

  roi->width = (uint32_t) MIN(LCD_BG_WIDTH * ratio, sensor_width);
  roi->height = (uint32_t) MIN(LCD_BG_HEIGHT * ratio, sensor_height);
  roi->offset_x = (sensor_width - roi->width + 1) / 2;
  roi->offset_y = (sensor_height - roi->height + 1) / 2;
}`,
  "DCMIPP_PipeInitDisplay": `static void DCMIPP_PipeInitDisplay(int sensor_width, int sensor_height)
{
  CMW_DCMIPP_Conf_t dcmipp_conf;
  uint32_t hw_pitch;
  int ret;

  assert(LCD_BG_WIDTH >= LCD_BG_HEIGHT);

  dcmipp_conf.output_width = LCD_BG_WIDTH;
  dcmipp_conf.output_height = LCD_BG_HEIGHT;
  dcmipp_conf.output_format = DISPLAY_FORMAT;
  dcmipp_conf.output_bpp = DISPLAY_BPP;
  dcmipp_conf.mode = CMW_Aspect_ratio_manual_roi;
  dcmipp_conf.enable_swap = 0;
  dcmipp_conf.enable_gamma_conversion = 0;
  CAM_InitCropConfig(&dcmipp_conf.manual_conf, sensor_width, sensor_height);
  ret = CMW_CAMERA_SetPipeConfig(DCMIPP_PIPE1, &dcmipp_conf, &hw_pitch);
  assert(ret == HAL_OK);
  assert(hw_pitch == dcmipp_conf.output_width * dcmipp_conf.output_bpp);
}`,
  "DCMIPP_PipeInitNn": `static void DCMIPP_PipeInitNn(int sensor_width, int sensor_height)
{
  CMW_DCMIPP_Conf_t dcmipp_conf;
  uint32_t hw_pitch;
  int ret;

  dcmipp_conf.output_width = NN_WIDTH;
  dcmipp_conf.output_height = NN_HEIGHT;
  dcmipp_conf.output_format = NN_FORMAT;
  dcmipp_conf.output_bpp = NN_BPP;
  dcmipp_conf.mode = CMW_Aspect_ratio_manual_roi;
  dcmipp_conf.enable_swap = 1;
  dcmipp_conf.enable_gamma_conversion = 0;
  CAM_InitCropConfig(&dcmipp_conf.manual_conf, sensor_width, sensor_height);
  ret = CMW_CAMERA_SetPipeConfig(DCMIPP_PIPE2, &dcmipp_conf, &hw_pitch);
  assert(ret == HAL_OK);
  assert(hw_pitch == dcmipp_conf.output_width * dcmipp_conf.output_bpp);
}`,
  "CAM_Init": `void CAM_Init(void)
{
  CMW_CameraInit_t cam_conf;
  int ret;

  /* Let sensor driver choose which width/height to use */
  cam_conf.width = 0;
  cam_conf.height = 0;
  cam_conf.fps = CAMERA_FPS;
  cam_conf.pixel_format = 0; /* Default; Not implemented yet */
  cam_conf.anti_flicker = 0;
  cam_conf.mirror_flip = CAMERA_FLIP;
  ret = CMW_CAMERA_Init(&cam_conf, NULL);
  assert(ret == CMW_ERROR_NONE);

  /* cam_conf.width / cam_conf.height now contains choose resolution */
  DCMIPP_PipeInitDisplay(cam_conf.width, cam_conf.height);
  DCMIPP_PipeInitNn(cam_conf.width, cam_conf.height);
}`,
  "CAM_DisplayPipe_Start": `void CAM_DisplayPipe_Start(uint8_t *display_pipe_dst, uint32_t cam_mode)
{
  int ret;

  ret = CMW_CAMERA_Start(DCMIPP_PIPE1, display_pipe_dst, cam_mode);
  assert(ret == CMW_ERROR_NONE);
}`,
  "CAM_NNPipe_Start": `void CAM_NNPipe_Start(uint8_t *nn_pipe_dst, uint32_t cam_mode)
{
  int ret;

  ret = CMW_CAMERA_Start(DCMIPP_PIPE2, nn_pipe_dst, cam_mode);
  assert(ret == CMW_ERROR_NONE);
}`,
  "CAM_IspUpdate": `void CAM_IspUpdate(void)
{
  int ret;

  ret = CMW_CAMERA_Run();
  assert(ret == CMW_ERROR_NONE);
}`,
  "HAL_GetTick": `uint32_t HAL_GetTick(void)
{
  SYSTIM tim;
  tk_get_tim(&tim);
  /* Return low 32 bits as milliseconds */
  return tim.lo;
}`,
  "HAL_Delay": `void HAL_Delay(uint32_t Delay)
{
  if (IS_IRQ_MODE())
    assert(0);

  tk_dly_tsk(Delay);
}`,
  "HAL_InitTick": `HAL_StatusTypeDef HAL_InitTick(uint32_t TickPriority)
{
  /* µT-Kernel manages its own tick - nothing to do here */
  return HAL_OK;
}`,
  "TIM4_Config": `void TIM4_Config(void)
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
}`,
  "TIM4_Get_Value": `uint32_t TIM4_Get_Value(void)
{
  return __HAL_TIM_GET_COUNTER(&tim4);
}`,
  "Fuse_Programming": `void Fuse_Programming(void)
{
  uint32_t fuse_id, bit_mask, data;

  BSEC_HandleTypeDef sBsecHandler;

  sBsecHandler.Instance = BSEC;

  /* Read current value of fuse */
  fuse_id = BSEC_FUSE_ADDRESS;
  if (HAL_BSEC_OTP_Read(&sBsecHandler, fuse_id, &data) == HAL_OK)
  {
    /* Check if bit has already been set */
    bit_mask = BSEC_FUSE_MASK;
    if ((data & bit_mask) != bit_mask)
    {
      data |= bit_mask;
      /* Bitwise programming of lower bits */
      if (HAL_BSEC_OTP_Program(&sBsecHandler, fuse_id, data, HAL_BSEC_NORMAL_PROG) == HAL_OK)
      {
        /* Read lower bits to verify the correct programming */
        if (HAL_BSEC_OTP_Read(&sBsecHandler, fuse_id, &data) == HAL_OK)
        {
          if ((data & bit_mask) != bit_mask)
          {
            /* Error : Fuse programming not taken in account */
            ErrorHandler();
          }
        }
        else
        {
          /* Error : Fuse read unsuccessful */
          ErrorHandler();
        }
      }
      else
      {
        /* Error : Fuse programming unsuccessful */
        ErrorHandler();
      }
    }
    else
    {
    }
  }
  else
  {
    /* Error  : Fuse read unsuccessful */
    ErrorHandler();
  }
}`,
  "ErrorHandler": `static void ErrorHandler(void)
{
  while (1)
    ;
}`,
  "HAL_MspInit": `void HAL_MspInit(void)
{

  /* USER CODE BEGIN MspInit 0 */

  /* USER CODE END MspInit 0 */

  /* System interrupt init*/

  HAL_PWREx_EnableVddIO2();

  HAL_PWREx_EnableVddIO3();

  HAL_PWREx_EnableVddIO4();

  HAL_PWREx_EnableVddIO5();

  /* USER CODE BEGIN MspInit 1 */

  /* USER CODE END MspInit 1 */
}`,
  "HAL_UART_MspInit": `void HAL_UART_MspInit(UART_HandleTypeDef* huart)
{
  GPIO_InitTypeDef GPIO_InitStruct = {0};
  RCC_PeriphCLKInitTypeDef PeriphClkInitStruct = {0};
  if(huart->Instance==USART1)
  {
    /* USER CODE BEGIN USART1_MspInit 0 */

    /* USER CODE END USART1_MspInit 0 */

  /** Initializes the peripherals clock
  */
    PeriphClkInitStruct.PeriphClockSelection = RCC_PERIPHCLK_USART1;
    PeriphClkInitStruct.Usart1ClockSelection = RCC_USART1CLKSOURCE_CLKP;
    if (HAL_RCCEx_PeriphCLKConfig(&PeriphClkInitStruct) != HAL_OK)
    {
      Error_Handler();
    }

    /* Peripheral clock enable */
    __HAL_RCC_USART1_CLK_ENABLE();

    __HAL_RCC_GPIOE_CLK_ENABLE();
    /**USART1 GPIO Configuration
    PE5     ------> USART1_TX
    PE6     ------> USART1_RX
    */
    GPIO_InitStruct.Pin = VCP_TX_Pin|VCP_RX_Pin;
    GPIO_InitStruct.Mode = GPIO_MODE_AF_PP;
    GPIO_InitStruct.Pull = GPIO_NOPULL;
    GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_LOW;
    GPIO_InitStruct.Alternate = GPIO_AF7_USART1;
    HAL_GPIO_Init(GPIOE, &GPIO_InitStruct);

    /* USER CODE BEGIN USART1_MspInit 1 */

    /* USER CODE END USART1_MspInit 1 */

  }

}`,
  "HAL_UART_MspDeInit": `void HAL_UART_MspDeInit(UART_HandleTypeDef* huart)
{
  if(huart->Instance==USART1)
  {
    /* USER CODE BEGIN USART1_MspDeInit 0 */

    /* USER CODE END USART1_MspDeInit 0 */
    /* Peripheral clock disable */
    __HAL_RCC_USART1_CLK_DISABLE();

    /**USART1 GPIO Configuration
    PE5     ------> USART1_TX
    PE6     ------> USART1_RX
    */
    HAL_GPIO_DeInit(GPIOE, VCP_TX_Pin|VCP_RX_Pin);

    /* USER CODE BEGIN USART1_MspDeInit 1 */

    /* USER CODE END USART1_MspDeInit 1 */
  }

}`,
  "NMI_Handler": `void NMI_Handler(void)
{
}`,
  "HardFault_Handler": `void HardFault_Handler(void)
{
  /* USER CODE BEGIN HardFault_IRQn 0 */

  /* USER CODE END HardFault_IRQn 0 */
  while (1)
  {
    /* USER CODE BEGIN W1_HardFault_IRQn 0 */
    /* USER CODE END W1_HardFault_IRQn 0 */
  }
}`,
  "MemManage_Handler": `void MemManage_Handler(void)
{
  /* USER CODE BEGIN MemoryManagement_IRQn 0 */

  /* USER CODE END MemoryManagement_IRQn 0 */
  while (1)
  {
    /* USER CODE BEGIN W1_MemoryManagement_IRQn 0 */
    /* USER CODE END W1_MemoryManagement_IRQn 0 */
  }
}`,
  "BusFault_Handler": `void BusFault_Handler(void)
{
  /* USER CODE BEGIN BusFault_IRQn 0 */

  /* USER CODE END BusFault_IRQn 0 */
  while (1)
  {
    /* USER CODE BEGIN W1_BusFault_IRQn 0 */
    /* USER CODE END W1_BusFault_IRQn 0 */
  }
}`,
  "SecureFault_Handler": `void SecureFault_Handler(void)
{
  /* USER CODE BEGIN SecureFault_IRQn 0 */

  /* USER CODE END SecureFault_IRQn 0 */
  while (1)
  {
    /* USER CODE BEGIN W1_SecureFault_IRQn 0 */
    /* USER CODE END W1_SecureFault_IRQn 0 */
  }
}`,
  "DebugMon_Handler": `void DebugMon_Handler(void)
{
  /* USER CODE BEGIN DebugMonitor_IRQn 0 */
  while (1)
  {
  }
  /* USER CODE END DebugMonitor_IRQn 0 */
  /* USER CODE BEGIN DebugMonitor_IRQn 1 */

  /* USER CODE END DebugMonitor_IRQn 1 */
}`,
  "SysTick_Handler": `void SysTick_Handler(void)
{
  /* USER CODE BEGIN SysTick_IRQn 0 */

  /* USER CODE END SysTick_IRQn 0 */
  HAL_IncTick();
  /* USER CODE BEGIN SysTick_IRQn 1 */

  /* USER CODE END SysTick_IRQn 1 */
}`,
  "CSI_IRQHandler": `void CSI_IRQHandler(void)
{
  HAL_DCMIPP_CSI_IRQHandler(CMW_CAMERA_GetDCMIPPHandle());
}`,
  "DCMIPP_IRQHandler": `void DCMIPP_IRQHandler(void)
{
  HAL_DCMIPP_IRQHandler(CMW_CAMERA_GetDCMIPPHandle());
}`,
  "UTIL_LCDEx_PrintfAtLine": `void UTIL_LCDEx_PrintfAtLine(uint16_t line, const char * format, ...)
{
  static char buffer[N_PRINTABLE_CHARS + 1];
  va_list args;
  va_start(args, format);
  vsnprintf(buffer, N_PRINTABLE_CHARS + 1, format, args);
  UTIL_LCD_DisplayStringAtLine(line, (uint8_t *) buffer);
  va_end(args);
}`,
  "UTIL_LCDEx_PrintfAt": `void UTIL_LCDEx_PrintfAt(uint32_t x_pos, uint32_t y_pos, Text_AlignModeTypdef mode, const char * format, ...)
{
  static char buffer[N_PRINTABLE_CHARS + 1];
  va_list args;
  va_start(args, format);
  vsnprintf(buffer, N_PRINTABLE_CHARS + 1, format, args);
  UTIL_LCD_DisplayStringAt(x_pos, y_pos, (uint8_t *) buffer, mode);
  va_end(args);
}`,
  "Run_Inference": `void Run_Inference(NN_Instance_TypeDef *network_instance)
{
  LL_ATON_RT_RetValues_t ll_aton_rt_ret;

  do {
    /* Execute first/next step of Cube.AI/ATON runtime */
    ll_aton_rt_ret = LL_ATON_RT_RunEpochBlock(network_instance);
    /* Wait for next event */
    if (ll_aton_rt_ret == LL_ATON_RT_WFE)
      LL_ATON_OSAL_WFE();
  } while (ll_aton_rt_ret != LL_ATON_RT_DONE);

  LL_ATON_RT_Reset_Network(network_instance);
}`,
  "initialise_monitor_handles": `void initialise_monitor_handles()
{
}`,
  "_getpid": `int _getpid(void)
{
  return 1;
}`,
  "_kill": `int _kill(int pid, int sig)
{
  (void)pid;
  (void)sig;
  errno = EINVAL;
  return -1;
}`,
  "_exit": `void _exit (int status)
{
  _kill(status, -1);
  while (1) {}    /* Make sure we hang here */
}`,
  "_read": `__attribute__((weak)) int _read(int file, char *ptr, int len)
{
  (void)file;
  int DataIdx;

  for (DataIdx = 0; DataIdx < len; DataIdx++)
  {
    *ptr++ = __io_getchar();
  }

  return len;
}`,
  "_write": `__attribute__((weak)) int _write(int file, char *ptr, int len)
{
  (void)file;
  int DataIdx;

  for (DataIdx = 0; DataIdx < len; DataIdx++)
  {
    __io_putchar(*ptr++);
  }
  return len;
}`,
  "_close": `int _close(int file)
{
  (void)file;
  return -1;
}`,
  "_fstat": `int _fstat(int file, struct stat *st)
{
  (void)file;
  st->st_mode = S_IFCHR;
  return 0;
}`,
  "_isatty": `int _isatty(int file)
{
  (void)file;
  return 1;
}`,
  "_lseek": `int _lseek(int file, int ptr, int dir)
{
  (void)file;
  (void)ptr;
  (void)dir;
  return 0;
}`,
  "_open": `int _open(char *path, int flags, ...)
{
  (void)path;
  (void)flags;
  /* Pretend like we always fail */
  return -1;
}`,
  "_wait": `int _wait(int *status)
{
  (void)status;
  errno = ECHILD;
  return -1;
}`,
  "_unlink": `int _unlink(char *name)
{
  (void)name;
  errno = ENOENT;
  return -1;
}`,
  "_times": `int _times(struct tms *buf)
{
  (void)buf;
  return -1;
}`,
  "_stat": `int _stat(char *file, struct stat *st)
{
  (void)file;
  st->st_mode = S_IFCHR;
  return 0;
}`,
  "_link": `int _link(char *old, char *new)
{
  (void)old;
  (void)new;
  errno = EMLINK;
  return -1;
}`,
  "_fork": `int _fork(void)
{
  errno = EAGAIN;
  return -1;
}`,
  "_execve": `int _execve(char *name, char **argv, char **env)
{
  (void)name;
  (void)argv;
  (void)env;
  errno = ENOMEM;
  return -1;
}`,
  "_sbrk": `void *_sbrk(ptrdiff_t incr)
{
  extern uint8_t _end; /* Symbol defined in the linker script */
  extern uint8_t _estack; /* Symbol defined in the linker script */
  extern uint32_t _Min_Stack_Size; /* Symbol defined in the linker script */
  const uint32_t stack_limit = (uint32_t)&_estack - (uint32_t)&_Min_Stack_Size;
  const uint8_t *max_heap = (uint8_t *)stack_limit;
  uint8_t *prev_heap_end;

  /* Initialize heap end at first call */
  if (NULL == __sbrk_heap_end)
  {
    __sbrk_heap_end = &_end;
  }

  /* Protect heap from growing into the reserved MSP stack */
  if (__sbrk_heap_end + incr > max_heap)
  {
    errno = ENOMEM;
    return (void *)-1;
  }

  prev_heap_end = __sbrk_heap_end;
  __sbrk_heap_end += incr;

  return (void *)prev_heap_end;
}`
};
