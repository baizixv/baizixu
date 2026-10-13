---
title: A Million Chickens / Chicken Legs
description: Each time, pick a random chicken that still has legs and cut off one leg. See how many intact chickens remain.
label: Probability sim · Math game
status: Live
---

## Rules

There are a million chickens, each with two legs. Each step picks one chicken uniformly at random from all chickens that still have at least one leg and cuts off one of its legs; a chicken with no legs left drops out of the pool. Repeat a million times and observe the final state.

You can change the number of chickens and run a local random simulation. The program counts:

- Intact chickens that still have two legs
- Chickens with one leg left
- Chickens with no legs left

## Reading the result

When the number of chickens is large enough and the number of operations equals the number of chickens, the share of intact chickens approaches `0.317844`. Because only one leg is cut each time, the counts of two-legged and legless chickens end up very close, with one-legged chickens in between.

This is a small experiment for understanding random processes, expectation and the law of large numbers through play, not a rigorous mathematical proof. Each simulation differs slightly because of randomness.

## Source

The question and discussion come from a Zhihu answer; this site reimplements it as a local simulation you can run directly in the browser.
