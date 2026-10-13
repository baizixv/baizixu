---
title: One in 21,425,712
description: The jackpot odds are 1/21,425,712 at 2 yuan per ticket. Set how often you buy per week, how many tickets each time and your age range, then simulate N parallel worlds to see how much you spend and how long it takes to win once.
label: Probability sim · Parallel worlds
status: Live
---

## Rules

The jackpot odds are **1/21,425,712**, each ticket costs **2 yuan**, and there are 3 draws a week (Monday, Wednesday, Saturday).

You can set your own plan:

- The ages you buy between (30–50 by default)
- How many times a week you buy (1 by default, choose 1/2/3)
- How many tickets each time (1 by default)
- The jackpot is fixed at **10 million yuan** (the basic-bet jackpot figure, no adjustment needed)

After that, simulate N parallel worlds. Each world buys strictly according to the plan for a whole life, and every ticket is judged independently. The page reports how many draws and tickets each world bought, how much it spent, and across all N worlds the total spend, number of wins, total winnings and net result. When someone wins, it shows **the age at which the jackpot was hit**.

## Lucky numbers: a real, verifiable random source

Each win derives a number that is collected on the **lucky number board** until all 5 front-area numbers (01–35) and 2 back-area numbers (01–12) are gathered. The numbers are not generated after the fact:

- The random source is a **public Bitcoin block hash** (fetched from mempool.space at run time)
- Each number is **deterministically derived** as `SHA-256(block hash:world index:ticket number)` with rejection sampling to avoid bias; ≤35 goes to the front area and >35 to the back area
- The win overlay shows **block height + hash + ticket number**, so anyone can recompute and verify it locally with the same formula

Collecting all 7 numbers triggers an extra celebration. Duplicates do not count, so every win is worth waiting for.

## What the odds mean

With the default plan (ages 30–50, once a week, one ticket each time):

- A life buys **1,040 times**, **1,040 tickets**, spending **2,080 yuan**
- The chance of never hitting the jackpot in a life is about **99.9951%**
- On average you need about **20,602 parallel worlds** (each living a whole life) for one to hit the jackpot

On expectation alone: each world spends 2,080 yuan for a fixed 10 million jackpot, so expected winnings are about 485 yuan and the long-run return is about 23% — **you still lose more than two thirds**. **The more you spend and the longer you live, the more you lose** — probability never lies; most people just do not multiply it by the number of attempts.

## Implementation

The simulation judges every ticket independently with uniform random numbers, without approximations; the number of parallel worlds ranges from 1 to 100,000, run in chunks with progress for large counts. Cumulative spend, wins and net result are stored locally in the browser and survive a refresh.
