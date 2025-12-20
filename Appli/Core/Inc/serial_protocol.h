/**
 ******************************************************************************
 * @file    serial_protocol.h
 * @brief   Structured serial output protocol for external system integration
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

#ifndef SERIAL_PROTOCOL_H
#define SERIAL_PROTOCOL_H

#include <stdint.h>
#include "tm/tmonitor.h"

/* Serial output format selection */
#define FORMAT_DEBUG  0  /* Human-readable debug format (original) */
#define FORMAT_JSON   1  /* Machine-parseable JSON format */
#define FORMAT_BOTH   2  /* Output both formats */

/* Configure output format here */
#ifndef SERIAL_OUTPUT_FORMAT
#define SERIAL_OUTPUT_FORMAT FORMAT_JSON
#endif

/* Message levels */
#define LEVEL_INFO    "INFO"
#define LEVEL_DATA    "DATA"
#define LEVEL_PERF    "PERF"
#define LEVEL_WARN    "WARN"
#define LEVEL_ERROR   "ERROR"
#define LEVEL_DEBUG   "DEBUG"

/* Message modules */
#define MODULE_INIT     "INIT"
#define MODULE_RTOS     "RTOS"
#define MODULE_CAMERA   "CAMERA"
#define MODULE_DETECT   "DETECT"
#define MODULE_TRACK    "TRACK"
#define MODULE_DISPLAY  "DISPLAY"
#define MODULE_NN       "NN"
#define MODULE_PP       "PP"
#define MODULE_PERF     "PERF"

/* Event types */
#define EVENT_SYSTEM_START      "SYSTEM_START"
#define EVENT_SYSTEM_READY      "SYSTEM_READY"
#define EVENT_NVIC_CONFIG       "NVIC_CONFIG"
#define EVENT_RAM_INIT          "RAM_INIT"
#define EVENT_FLASH_INIT        "FLASH_INIT"
#define EVENT_CLOCKS_CONFIG     "CLOCKS_CONFIG"
#define EVENT_RTOS_START        "RTOS_START"
#define EVENT_TASK_CREATE       "TASK_CREATE"
#define EVENT_TASK_START        "TASK_START"
#define EVENT_TASK_READY        "TASK_READY"
#define EVENT_CAMERA_INIT       "CAMERA_INIT"
#define EVENT_DETECTION_RESULT  "DETECTION_RESULT"
#define EVENT_TRACKING_UPDATE   "TRACKING_UPDATE"
#define EVENT_BBOX_DRAW         "BBOX_DRAW"
#define EVENT_FRAME_START       "FRAME_START"
#define EVENT_FRAME_COMPLETE    "FRAME_COMPLETE"
#define EVENT_INFERENCE_START   "INFERENCE_START"
#define EVENT_INFERENCE_COMPLETE "INFERENCE_COMPLETE"
#define EVENT_TIMING            "TIMING"
#define EVENT_CPU_LOAD          "CPU_LOAD"
#define EVENT_WARNING           "WARNING"
#define EVENT_ERROR             "ERROR"

/**
 * @brief Print structured message header
 * @param level Message level (INFO, DATA, PERF, etc.)
 * @param module Module name (INIT, DETECT, etc.)
 * @param event Event type
 */
#define SERIAL_MSG_HEADER(level, module, event) \
  tm_printf((UB *)"[%08u] [%s] [%s] [%s] ", HAL_GetTick(), level, module, event)

/**
 * @brief Print simple message (no JSON data)
 */
#define SERIAL_MSG(level, module, event) \
  do { \
    SERIAL_MSG_HEADER(level, module, event); \
    tm_printf((UB *)"{}\n"); \
  } while(0)

/**
 * @brief Print message with single key-value pair (integer)
 */
#define SERIAL_MSG_INT(level, module, event, key, value) \
  do { \
    SERIAL_MSG_HEADER(level, module, event); \
    tm_printf((UB *)"{\"" key "\":%d}\n", (int)(value)); \
  } while(0)

/**
 * @brief Print message with single key-value pair (unsigned)
 */
#define SERIAL_MSG_UINT(level, module, event, key, value) \
  do { \
    SERIAL_MSG_HEADER(level, module, event); \
    tm_printf((UB *)"{\"" key "\":%u}\n", (uint32_t)(value)); \
  } while(0)

/**
 * @brief Print message with single key-value pair (string)
 */
#define SERIAL_MSG_STR(level, module, event, key, value) \
  do { \
    SERIAL_MSG_HEADER(level, module, event); \
    tm_printf((UB *)"{\"" key "\":\"%s\"}\n", value); \
  } while(0)

/**
 * @brief Print message with two key-value pairs (name, id)
 */
#define SERIAL_MSG_TASK(level, module, event, name, id) \
  do { \
    SERIAL_MSG_HEADER(level, module, event); \
    tm_printf((UB *)"{\"name\":\"%s\",\"id\":%d}\n", name, (int)(id)); \
  } while(0)

/**
 * @brief Print detection result message
 */
#define SERIAL_DETECTION_START(frame_num, count, tracking) \
  do { \
    SERIAL_MSG_HEADER(LEVEL_DATA, MODULE_DETECT, EVENT_DETECTION_RESULT); \
    tm_printf((UB *)"{\"frame\":%u,\"count\":%u,\"tracking\":%s,\"objects\":[", \
              (uint32_t)(frame_num), (uint32_t)(count), (tracking) ? "true" : "false"); \
  } while(0)

/**
 * @brief Print single detection object (no tracking)
 */
#define SERIAL_DETECTION_OBJECT(first, class_name, x, y, w, h) \
  do { \
    if (!(first)) tm_printf((UB *)","); \
    tm_printf((UB *)"{\"class\":\"%s\",\"bbox\":{\"x\":%d,\"y\":%d,\"w\":%d,\"h\":%d}}", \
              class_name, (int)(x), (int)(y), (int)(w), (int)(h)); \
  } while(0)

/**
 * @brief Print single detection object (with tracking)
 */
#define SERIAL_TRACKING_OBJECT(first, id, class_name, x, y, w, h) \
  do { \
    if (!(first)) tm_printf((UB *)","); \
    tm_printf((UB *)"{\"id\":%u,\"class\":\"%s\",\"bbox\":{\"x\":%d,\"y\":%d,\"w\":%d,\"h\":%d}}", \
              (uint32_t)(id), class_name, (int)(x), (int)(y), (int)(w), (int)(h)); \
  } while(0)

/**
 * @brief Close detection result message
 */
#define SERIAL_DETECTION_END() \
  tm_printf((UB *)"]}\n")

/**
 * @brief Print performance timing message
 * Note: FPS is output as integer to avoid float formatting
 */
#define SERIAL_PERF_TIMING(frame_num, inf_ms, pp_ms, disp_ms, period_ms) \
  do { \
    SERIAL_MSG_HEADER(LEVEL_PERF, MODULE_PERF, EVENT_TIMING); \
    uint32_t fps = ((period_ms) > 0) ? (1000 / (period_ms)) : 0; \
    tm_printf((UB *)"{\"frame\":%u,\"inference_ms\":%u,\"pp_ms\":%u,\"display_ms\":%u,\"period_ms\":%u,\"fps\":%u}\n", \
              (uint32_t)(frame_num), (uint32_t)(inf_ms), (uint32_t)(pp_ms), \
              (uint32_t)(disp_ms), (uint32_t)(period_ms), fps); \
  } while(0)

/**
 * @brief Print frame event message
 */
#define SERIAL_FRAME_EVENT(frame_num, nb_detect, tracking, buffer_idx) \
  do { \
    SERIAL_MSG_HEADER(LEVEL_DATA, MODULE_DISPLAY, EVENT_FRAME_START); \
    tm_printf((UB *)"{\"frame\":%u,\"count\":%u,\"tracking\":%s,\"buffer\":%d}\n", \
              (uint32_t)(frame_num), (uint32_t)(nb_detect), \
              (tracking) ? "true" : "false", (int)(buffer_idx)); \
  } while(0)

/**
 * @brief Compatibility macros for legacy code
 */
#if SERIAL_OUTPUT_FORMAT == FORMAT_DEBUG
  /* Keep original debug format */
  #define SERIAL_INIT(...)  tm_printf((UB *)"DEBUG: " __VA_ARGS__)
  #define SERIAL_INFO(...)  tm_printf((UB *)__VA_ARGS__)
  #define SERIAL_WARN(...)  tm_printf((UB *)"WARNING: " __VA_ARGS__)
  #define SERIAL_ERROR(...) tm_printf((UB *)"ERROR: " __VA_ARGS__)
#elif SERIAL_OUTPUT_FORMAT == FORMAT_JSON
  /* JSON format only - map to appropriate structured messages */
  #define SERIAL_INIT(...)  /* Use structured macros instead */
  #define SERIAL_INFO(...)  /* Use structured macros instead */
  #define SERIAL_WARN(...)  /* Use structured macros instead */
  #define SERIAL_ERROR(...) /* Use structured macros instead */
#elif SERIAL_OUTPUT_FORMAT == FORMAT_BOTH
  /* Output both formats */
  #define SERIAL_INIT(...)  tm_printf((UB *)"DEBUG: " __VA_ARGS__)
  #define SERIAL_INFO(...)  tm_printf((UB *)__VA_ARGS__)
  #define SERIAL_WARN(...)  tm_printf((UB *)"WARNING: " __VA_ARGS__)
  #define SERIAL_ERROR(...) tm_printf((UB *)"ERROR: " __VA_ARGS__)
#endif

#endif /* SERIAL_PROTOCOL_H */
