---
kind: project
title: ShowMeClothes / AI 试穿
description: 上传一张照片、挑一件心仪的衣服，用 AI 生成一段 10 秒动态试穿视频。
date: 2026-09-23
label: AI 试穿 · Next.js / TypeScript
visual: clothes
image: /assets/project-show-me-clothes.svg
url: https://clothes.baizixu.com/
---

## 项目简介

ShowMeClothes 是一个 AI 试穿 MVP：一张照片 → AI 试穿 → 10 秒动态试穿视频。用户上传自己的照片、挑选一件衣服，系统在后台跑完换装和视频生成两步流水线，最后把结果视频返回给浏览器。

它的目标不是做完整的电商试衣间，而是先把「换装 + 视频」的真实 AI 链路跑通，并用成本护栏把公开部署时的额度消耗控制在可控范围内。

## 使用流程

1. 上传一张照片（JPG / PNG / WebP，≤ 8MB）；
2. 从服装库中挑一件衣服；
3. 提交任务，页面轮询进度；
4. 生成一段约 10 秒的动态试穿视频。

照片只用于本次生成，MVP 阶段不公开。

## AI 流水线

后台 worker 消费任务队列，按两步执行：

- **换装**：把「人物照片 + 服装」生成一张试穿图；
- **视频**：把试穿图转成一段 10 秒动态视频。

换装和视频能力都抽象成独立 provider，换模型或换厂商时只需要新增一个实现，API、worker 和前端都不用改。

### 可选链路

- **智谱 BigModel（默认，零成本）**：`glm-4v-flash` 读图描述人物 → `cogview-3-flash` 文生图换装 → `cogvideox-flash` 图生视频。纯免费链路是「按描述重绘人物」，人脸相似但不保证像素级一致。
- **Replicate 真试穿（收费）**：换装使用专用 VTON 模型（`prunaai/p-image-try-on`），保持脸型、姿势和身材，视频仍可走免费的 `cogvideox-flash`。

Provider 必须显式配置，未配置或写错会直接报错，不会静默降级成 mock。

## 技术栈

Next.js App Router · React · TypeScript · Node worker · 单机 JSON 任务队列 · Docker

## 隐私与成本护栏

公开部署时可通过环境变量开启多层保护：

- **访问口令**：生成和重试必须携带口令，服务端只保存密码，前端不内置；
- **急停开关**：一键暂停 worker 处理，作为止血手段；
- **每日额度**：限制每天新建任务数；
- **重试上限**：限制单个任务的处理次数，避免失败任务无限重试。

这些开关分别作用在创建任务、重试任务和 worker 认领任务的环节上，改完重启 web 与 worker 即生效。
