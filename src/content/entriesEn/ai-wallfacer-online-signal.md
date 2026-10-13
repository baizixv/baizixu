---
title: "AI Wallfacer: an online market state lab"
description: Use isolated, forced-diverse families of simulated strategies to observe market states in a daily competition with no look-ahead data; the output is a risk signal for trend, chop or panic — never a buy or sell instruction.
label: Online meta-learning
status: Concept
versionLabel: Strictly online competition concept
---

# AI Wallfacer: an Online Market State Lab

**Version**: V1.0 (strictly online competition concept)
**Status**: Concept
**Positioning**: A locally run paper-trading and market-state observation tool. It uses no real money and gives no investment advice.

## One-line definition

Put a set of simulated strategies with different “world-view constraints” into a competition that settles daily, eliminates daily, and never peeks at the next trading day. What you observe in the end is not what a strategy should buy tomorrow, but which kind of strategy survives more easily in the current market structure.

The daily output may only be one of three risk states:

- **0 / Trend**: trend-following families with longer holding periods are more stable overall;
- **1 / Chop**: hedging, balanced and low-turnover strategies have the edge;
- **2 / Panic**: defensive, volatility-filtered and light-position strategies survive noticeably better.

> It is a “market mood meter”, not a predictor, and certainly not an auto-trading system.

## Core principles

| Principle | Constraint |
| --- | --- |
| Strictly online | A decision on any trading day may only read data available as of the previous day’s close. |
| Auditable in time | Every quote, feature, signal, order and settlement records an `as_of` time and may not be overwritten afterwards. |
| Simulation first | Paper trading only; no broker keys are stored and no real orders are produced. |
| Diversity first | Each role’s holding period, risk budget and allowed actions are locked by its track and cannot be flattened out by evolution. |
| Compete within a track | Elimination and reproduction happen only inside the same role type, so a short-term windfall cannot eliminate a defensive strategy. |
| Risk control first | The final state evaluation weighs drawdown, stability and family survival over single-day return. |
| Falsifiable | Input snapshots and decision results are kept daily; any result can be replayed against what was visible that day. |

## The daily “guillotine” timeline

The example below uses trading day **T**. Exact timestamps must follow the target market’s real calendar and must not be hard-coded.

| Stage | Time | Allowed | Explicitly forbidden |
| --- | --- | --- | --- |
| Settlement | After T’s close | Write closing prices, NAV, fills, drawdown, ranking and elimination results. | Correcting T’s decisions with T+1 data. |
| Data sealing | After T’s close | Timestamp each source and build the T-day visible snapshot. | Overwriting past snapshots or back-filling orders already made that day. |
| Evolution window | T’s close to T+1 pre-open | Update strategy parameters and generate T+1 orders using only the sealed snapshot. | Reading T+1 open, intraday, close or revised data. |
| Execution | T+1 intraday | Match simulated orders using rules frozen before the open, applying slippage, fees and fill limits. | Changing strategy, cancelling or re-pricing based on intraday results. |
| Re-settlement | After T+1’s close | Begin the next settlement round. | Back-filling hindsight performance as pre-open knowledge. |

### Rules for enforcing the data cutoff

1. Each run batch creates an immutable `decision_snapshot_id`.
2. Feature queries must carry a `published_at <= cutoff_at` condition, not merely filter by trading date.
3. Orders store `created_at`, `effective_date`, `snapshot_id` and the strategy version hash.
4. The settlement program may only read the market snapshot for the matching date, never a “latest data” endpoint.
5. If a data vendor revises history, raw responses must be archived by day; revisions may only feed data-quality reports, never rewrite a finished competition.

## Roles and locked tracks

Roles are not UI skins. They are genetic locks that stop every family from converging into the same short-term noise strategy. The first version opens only three tracks, each with 20–100 variants.

### Track A: Long-period Grey

- **Starting paper capital**: 1,000,000;
- **World view**: markets have sustainable but slow trends, and frequent trading erodes the edge;
- **Hard constraints**: minimum holding period of 5 trading days; exceeding a turnover cap loses points or fails;
- **Mutable genes**: sector preference, trend-confirmation threshold, position cap, stop-loss/reduction threshold;
- **Scoring focus**: rolling drawdown, holding stability, risk-adjusted return.

### Track B: Arbitrage Cat

- **Starting paper capital**: 1,000,000;
- **World view**: single-direction bets are unreliable; structural hedging matters more than directional bets;
- **Hard constraints**: hold at least 3 instruments meeting predefined correlation or exposure constraints; net exposure and single-instrument weight are capped;
- **Mutable genes**: hedge ratio, correlation window, rebalance threshold, sector-neutral weights;
- **Scoring focus**: volatility, maximum drawdown, net-exposure stability and post-cost NAV.

### Track C: Panic Old Man

- **Starting paper capital**: 10,000,000;
- **World view**: when uncertainty rises, preserving capital matters more than chasing return;
- **Hard constraints**: may add positions only when predefined panic/volatility indicators rise versus yesterday; otherwise it may only stay in cash or a light position;
- **Mutable genes**: panic threshold, add size, risky-asset cap, exit speed;
- **Scoring focus**: stress-day loss, tail drawdown, risk exposure and survival rate.

> The first version must fix the target market and tradable universe first. If the Chinese market is used, VIX cannot be the only condition; choose a local volatility proxy that can be reliably obtained with a clear publication time, or write the time zone and visibility of cross-market indicators into the rules.

## Competition, elimination and reproduction

### Daily settlement metrics

After the close, each agent computes:

- Daily and cumulative NAV;
- Maximum drawdown and rolling volatility;
- Trading cost, slippage and turnover;
- Number of rule violations;
- Standardized score within its track;
- Family survival rate and strategy dispersion.

Use a rolling multi-metric score rather than single-day return ranking:

```text
score = risk-adjusted return
      - drawdown penalty
      - cost penalty
      - rule-violation penalty
      - penalty for being too similar to the same track
```

### Elimination and replenishment

1. Rank each track independently and mark the bottom 20% for elimination;
2. Keep the top 20% of each track as parent candidates, not just the single winner;
3. Children may inherit only the parameters a track allows to change; hard constraints never mutate;
4. Use small perturbations plus random new blood so children do not all copy the same parameters;
5. Record parents, mutated parameters, random seed and creation time;
6. Set a minimum observation period, e.g. no elimination from single-day performance within 20 trading days, to reduce noise-driven “evolution”.

## Market state signals

The system publishes no “buy/sell/symbol”, only observation signals. An explainable first-version rule:

| State | Trigger tendency | Output meaning |
| --- | --- | --- |
| Trend / 0 | Grey’s median score, survival rate and NAV smoothness stay dominant | Long-period trend logic fits the current sample better. |
| Chop / 1 | Arbitrage Cat’s risk-adjusted performance and dispersion lead | Hedging and low directional exposure fit relatively well. |
| Panic / 2 | Panic Old Man cuts drawdown on stress days and survival keeps rising | Risk control is more resilient; raise the frequency of manual review. |
| Unconfirmed | Track signals diverge, or the sample/data quality is insufficient | Draw no conclusion; show the uncertainty only. |

A signal must always show: track survival rates over the last N days, each track’s median drawdown, state confidence, data completeness and the reason for “unconfirmed”. Three consecutive days is only an observation window and must not be packaged as a certain position recommendation.

## Minimal technical architecture

Target a single machine and a single process first; introduce Ray only when agent count or feature computation genuinely needs parallelism.

```text
market / calendar sources
      ↓ (scheduled fetch and raw archive)
Python task scheduler
      ├── data cutoff and snapshots
      ├── strategy / role engine
      ├── simulated matching and risk control
      ├── track scoring, elimination and mutation
      └── state signal generation
      ↓
SQLite (first version)
      ↓
FastAPI (read-only query and config API)
      ↓
lightweight dashboard (Streamlit or a standalone page on this site)
```

### Components not introduced in version one

- Real trading APIs, broker credentials and automated order placement;
- Ray clusters, Redis, microservices and PostgreSQL;
- LLMs freely generating trading code or making intraday decisions;
- Stock tips for others, return promises or automated investment advice.

## Minimal data model

| Table / entity | Key fields | Purpose |
| --- | --- | --- |
| `market_snapshots` | `snapshot_id`, `symbol`, `published_at`, `cutoff_at`, raw response path | Prove what data was visible at decision time. |
| `agents` | `agent_id`, `track`, `genome`, `parent_ids`, `created_at` | Record role, parameters and lineage. |
| `decisions` | `agent_id`, `snapshot_id`, `effective_date`, `strategy_hash`, `orders` | Freeze pre-open decisions. |
| `fills` | `order_id`, `filled_at`, `price`, `slippage`, `fee` | Explainable simulated fills. |
| `daily_metrics` | `agent_id`, `trade_date`, `nav`, `drawdown`, `turnover`, `score` | Daily NAV and within-track score. |
| `evolution_events` | `trade_date`, `track`, `eliminated_ids`, `child_ids`, `seed` | Elimination and reproduction audit. |
| `regime_signals` | `trade_date`, `state`, `confidence`, `evidence` | The final observation shown on the dashboard. |

## Phased implementation plan

### Phase 0: rules and data contract (1 week)

- [ ] Fix a single target market, trading calendar, tradable universe and single data source;
- [ ] Define each data type’s publication time, time zone, revision rules and missing-data handling;
- [ ] Write the inviolable online data-cutoff test cases;
- [ ] Define matching assumptions: open/close fills, slippage, fees, limit-up/down and suspension rules;
- [ ] Clarify the source of the “panic indicator” and how it adapts to the local market.

**Acceptance**: for any decision, the full set of inputs visible at that time can be listed.

### Phase 1: single-role paper-trading skeleton (1–2 weeks)

- [ ] Build snapshot, order, fill and NAV tables with Python + SQLite;
- [ ] Implement one Grey agent with frozen rules;
- [ ] Run across consecutive trading days with a simulated clock and verify T+1 data cannot be read;
- [ ] Output daily logs and a NAV CSV.

**Acceptance**: after deleting future quotes, every past order is unchanged.

### Phase 2: three tracks and simulated matching (2–3 weeks)

- [ ] Add the hard constraints of Arbitrage Cat and Panic Old Man;
- [ ] Implement unified cost, slippage, position and violation checks;
- [ ] Create a small family per track, e.g. 20 agents each;
- [ ] Implement within-track scoring, observation periods, elimination and constrained mutation.

**Acceptance**: no child can break its track’s hard constraints; each track ranks independently.

### Phase 3: daily jobs and dashboard (1–2 weeks)

- [ ] Configure local scheduled jobs and failure retries;
- [ ] Expose read-only NAV, ranking, lineage and signal APIs via FastAPI;
- [ ] Show the track panels with Streamlit or a standalone page;
- [ ] Display data cutoff time, strategy version, state evidence and job logs.

**Acceptance**: when a daily run fails, lacks data or is late, the dashboard clearly shows “unconfirmed” and produces no fake signal.

### Phase 4: long-term online observation (at least 3–6 months)

- [ ] Run every day in real time, never tuning with hindsight data;
- [ ] Periodically check family similarity, data quality and rule violations;
- [ ] Record observation conclusions only, without expanding complexity from short-term results;
- [ ] Review the system itself monthly rather than back-filling review results into decisions already made.

**Acceptance**: an auditable run archive plus NAV/drawdown/survival curves for all three tracks.

## Main risks and guardrails

| Risk | Guardrail |
| --- | --- |
| Look-ahead bias | Immutable snapshots, decision hashes, `published_at` queries, automated cutoff tests. |
| Overfitting recent noise | Minimum observation periods, rolling scores, mutation caps, multi-parent reproduction. |
| Strategy homogenization | Hard track constraints, similarity penalties, random new blood, overlap monitoring. |
| Over-optimistic fills | Conservative slippage, fees, fill caps, suspension and untradeable-order handling. |
| Unstable data sources | Raw response archive, missing markers, job retries; output only “unconfirmed” when incomplete. |
| Mistaking signals for advice | Fixed disclaimer; the UI shows no order button and no concrete buy/sell instruction. |
| Premature complexity | Start with single-machine SQLite; consider Ray, Redis or PostgreSQL only after a clear bottleneck. |

## Current decisions

- [x] Simulation trading and market-state observation only, no real money;
- [x] Define “no look-ahead” as an auditable hard constraint on data and decisions;
- [x] Use three isolated tracks: Long-period Grey, Arbitrage Cat, Panic Old Man;
- [x] Eliminate and reproduce within a track, avoiding cross-style short-term return races;
- [ ] Fix the first market, universe and reliable data source;
- [ ] Finish the Phase 0 cutoff tests;
- [ ] Implement the single-role paper-trading skeleton;
- [ ] Decide whether Ray and a richer frontend are needed only after running online continuously.

---

*What really needs testing is not “whether AI can guess tomorrow”, but: under conditions that strictly refuse to peek at the future and force diversity, which kind of risk logic better explains the market structure in front of us.*
