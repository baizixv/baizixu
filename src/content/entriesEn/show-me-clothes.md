---
title: ShowMeClothes / AI try-on
description: Upload a photo, pick a garment and generate a 10-second try-on video.
label: AI app · Web
---

## About the project

ShowMeClothes is an AI try-on MVP: one photo → AI try-on → a 10-second dynamic try-on video. The user uploads a photo and picks a garment; the system runs a two-step pipeline of virtual try-on and video generation in the background, then returns the resulting video to the browser.

The goal is not a full e-commerce fitting room, but to get the real “try-on + video” AI pipeline working end to end, and to keep credit consumption under control on a public deployment with cost guardrails.

## Flow

1. Upload a photo (JPG / PNG / WebP, ≤ 8MB);
2. Choose a garment from the catalog;
3. Submit the task and watch the progress polling on the page;
4. Get a dynamic try-on video of about 10 seconds.

Photos are used only for that generation and are not made public during the MVP stage.

## AI pipeline

A background worker consumes the task queue and runs two steps:

- **Try-on**: generate a try-on image from the person photo plus garment;
- **Video**: turn the try-on image into a 10-second dynamic video.

Both capabilities are abstracted behind independent providers, so swapping a model or vendor only requires a new implementation — the API, worker and frontend stay unchanged.

### Available routes

- **Zhipu BigModel (default, zero cost)**: `glm-4v-flash` reads the photo and describes the person → `cogview-3-flash` generates the try-on image from text → `cogvideox-flash` turns the image into video. The free route essentially redraws the person from a description: the face is similar, but pixel-level identity is not guaranteed.
- **Replicate real try-on (paid)**: uses a dedicated VTON model (`prunaai/p-image-try-on`) that preserves face shape, pose and body, while the video step can still use the free `cogvideox-flash`.

Providers must be configured explicitly. A missing or wrong configuration raises an error instead of silently falling back to a mock.

## Stack

Next.js App Router · React · TypeScript · Node worker · single-machine JSON queue · Docker

## Privacy and cost guardrails

On a public deployment, several layers of protection can be enabled through environment variables:

- **Access passphrase**: generation and retry must carry a passphrase; the server stores only the hash, and nothing is embedded in the frontend;
- **Kill switch**: pause the worker in one step as a way to stop the bleeding;
- **Daily quota**: cap the number of new tasks per day;
- **Retry limit**: cap how many times a single task is processed, so failed tasks do not retry forever.

These switches act on task creation, task retry and worker claim respectively, and take effect after restarting the web and worker processes.
