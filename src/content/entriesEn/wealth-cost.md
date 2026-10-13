---
title: Wealth Cost Simulator
description: You gain 100 million yuan every millisecond, but each second there is a one-in-a-hundred-million chance of immediate death. See how long you last across a crowd of parallel worlds.
label: Probability sim · Survival experiment
status: Live
---

## Rules

As the question sets it up, you gain 100 million yuan every millisecond, and once per second there is an independent check with a one-in-a-hundred-million chance of immediate death.

You can simulate 1, 100, 1,000 or 10,000 parallel worlds at once. Each person’s survival time follows a geometric distribution, and the page reports:

- Average and longest survival time
- Total wealth accumulated across all parallel worlds
- The number and share of people in different survival stages

## What the odds mean

“One in a hundred million” looks negligible on its own, but the check repeats every second. The theoretical average survival time is about 100 million seconds, or 3.17 years; the chance of surviving more than 10 years is about 4.27%.

Each simulation is just one random sample. The more people, the closer the distribution gets to the theoretical probability; a single result can be very extreme.

## Implementation

The question and the simulation idea come from a Zhihu discussion. This site implements it independently using inverse-transform sampling of the geometric distribution, without looping second by second and without any external chart library. Wealth is calculated strictly as “100 million yuan per millisecond”.
