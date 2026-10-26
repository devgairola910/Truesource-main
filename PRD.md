# Product Requirements Document: Truesource

## Product vision
SportShield AI is a cloud-based rights protection platform for sports organizations that helps them register official media, monitor public internet surfaces for likely unauthorized reuse, and act on high-confidence incidents with explainable evidence. The product vision is to make digital sports media traceable and enforceable at operational speed by combining provenance signals, resilient similarity matching, and scalable cloud infrastructure built on Google technologies.

## Problem statement
Sports organizations publish large volumes of high-value media across many channels, but once assets are copied, clipped, reposted, or modified, visibility drops sharply and manual enforcement becomes inefficient. A practical solution must detect likely misuse despite common transformations such as cropping, compression, overlays, and short clip extraction, while remaining low-cost enough to operate continuously at scale.

## Target users
The primary users are media rights managers, digital operations teams, and content protection staff at sports leagues, clubs, federations, broadcasters, and event organizers. Secondary users include legal or compliance reviewers who need incident evidence, and trusted distribution partners who may require whitelisting so legitimate reuse is not escalated as piracy.

## Product goals
The MVP is intended to validate one core workflow: official media registration, resilient fingerprint generation, public web scanning, and explainable alerting for suspected misuse. The product should prove that student-built infrastructure can detect common unauthorized reuse patterns with high practical precision, support human review, and scale economically using managed Google Cloud services.

## Scope
### In scope for MVP
The initial release includes image upload and registry management, basic video upload with shot-level indexing, optional invisible watermarking for distributed variants, perceptual and embedding-based matching, public web candidate ingestion from a limited source set, alert generation, reviewer workflow, domain whitelisting, and KPI instrumentation. The system will support evidence views that show matched assets, confidence breakdown, source URL, timestamp, and recommended action so reviewers can trust and triage alerts efficiently.

### Out of scope for MVP
The MVP excludes full-platform social integrations, automated takedown filing, mobile apps, broad DRM guarantees, closed-platform scraping, advanced legal workflow automation, multilingual policy engines, and full internet coverage claims. It also excludes any promise of foolproof protection against determined adversaries, because the product is intended to be resilient to common piracy tactics rather than theoretically impossible to evade.

## Core features
| Feature | Description | Priority |
|---|---|---|
| Asset registry | Upload official images and videos, assign metadata, and create a canonical source of truth | P0 |
| Fingerprinting pipeline | Generate perceptual hashes, embeddings, and shot-level video signatures for matching | P0 |
| Optional watermarking | Embed hidden provenance signals into distributed media variants for stronger attribution | P1 |
| Web scanning | Discover candidate public pages and extract media from a constrained monitored source list | P0 |
| Match engine | Retrieve likely matches using hash filtering and vector similarity, then risk-score incidents | P0 |
| Alert dashboard | Show suspicious incidents with evidence, severity, and review actions | P0 |
| Reviewer controls | Confirm, dismiss, or whitelist incidents and domains to reduce future noise | P0 |
| Analytics and KPIs | Track precision, review latency, scan volume, and detection throughput | P1 |

The prioritization reflects the fact that the MVP succeeds only if it can complete the end-to-end detection loop reliably. Watermarking and analytics are valuable, but the initial release should prioritize traceability, matching, and trustable alerts over secondary workflow polish.[cite:22][cite:24][cite:25]

## Key user journeys
### Register and protect official media
A rights manager signs in, creates a workspace, uploads official assets, and tags them with ownership and distribution metadata. The system stores originals, computes fingerprints, segments videos into searchable shots, and optionally creates a protected distribution variant carrying an invisible watermark payload.

### Detect suspected misuse
The scanning pipeline ingests public candidate pages from selected monitored sources, extracts candidate media, and compares them against the official asset registry. The system flags likely unauthorized reuse when multiple signals, such as embedding similarity, perceptual hash similarity, watermark verification, or logo consistency, exceed configured thresholds.

### Review and act on an incident
A reviewer opens an alert, sees the matched official asset, suspected infringing asset, source URL, evidence summary, and confidence score breakdown. The reviewer then confirms the incident, dismisses it as a false positive, or whitelists the source if reuse is authorized, improving future operational precision.

## High-level functional requirements
The system shall allow authenticated organization users to upload and manage official media assets with associated ownership metadata. The system shall generate and store image and video signatures, including perceptual fingerprints and embedding vectors, and use vector search to retrieve likely candidate matches efficiently.

The system shall process uploaded videos into shot-level units so short re-encoded clips can be matched more reliably than with full-file comparison alone. The system shall analyze candidate images or frames for visible brand cues such as logos to improve confidence and explainability where exact provenance is uncertain.

The system shall provide an alert queue with incident status, severity, evidence panel, reviewer decision controls, and source whitelisting. The system shall collect telemetry for scan throughput, detection precision, false positives, and review time so the team can evaluate whether the MVP meets product goals.

## Non-functional requirements
The MVP should be low-cost, cloud-native, and deployable within 4 to 6 weeks by a student team using managed Google Cloud services. The system should support staged processing, where inexpensive candidate filtering occurs first and more expensive vision or vector matching is applied only to narrowed candidates, in order to preserve scalability and cost efficiency.

The system should be resilient to common transformations including compression, resizing, cropping, overlay text, screenshot capture, and short clip extraction. The system should remain explainable to non-technical reviewers, because operational adoption depends not only on model quality but also on evidence clarity and reviewer trust.

## Success metrics
| KPI | MVP target | Why it matters |
|---|---|---|
| Precision on seeded infringement tests | Greater than 90 percent | Validates reviewer trust and practical utility |
| False positive rate in reviewer queue | Less than 10 percent of flagged incidents | Prevents alert fatigue |
| Time to alert after candidate ingestion | Less than 5 minutes for prioritized candidates | Supports near real-time monitoring |
| Scan throughput | 1 million discovered pages per day, with staged deep analysis on shortlisted candidates | Demonstrates scalable pipeline design |
| Reviewer triage time | Less than 2 minutes median per incident | Measures operational usability |
| Watermark survival rate | Greater than 70 percent after common transforms in seeded tests | Validates added provenance benefit |
| Partner whitelist accuracy | Greater than 95 percent correct suppression on known authorized domains | Reduces operational noise |

These metrics should be measured on a controlled benchmark set containing official assets, authorized reuse examples, and intentionally altered infringement samples. Claims about accuracy should be framed around defined evaluation scenarios rather than universal internet performance, because scoped metrics are more credible and easier to defend during judging.

## Assumptions
The PRD assumes sports organizations are willing to upload official assets and basic rights metadata into a cloud registry. It assumes monitoring will initially target permitted or seeded public sources rather than unrestricted access to every major closed platform, and it assumes human reviewers remain in the loop for final enforcement decisions.

It also assumes that layered signals outperform any single method in real-world conditions, especially when watermarking fails or is removed. Finally, it assumes BigQuery vector search and managed Google APIs provide sufficient scale and implementation speed for an MVP without requiring a custom retrieval stack.

## Risks and trade-offs
The primary technical risk is false positives in visually repetitive sports scenes, especially in broadcast footage where many clips share similar stadium views or overlays. This is mitigated through shot-sequence matching, score thresholds, metadata context, and reviewer confirmation, but increasing recall will usually increase alert volume, so threshold tuning is a central product trade-off.

A second risk is overreliance on watermarking. Invisible watermarks can strengthen attribution, but they should be treated as a reinforcing signal rather than the sole detection method because sophisticated edits or re-capture flows may degrade them.

A third risk is cloud cost escalation if every discovered candidate is deeply analyzed. The product therefore prioritizes a two-stage retrieval design, where cheap filtering narrows the search set before vector similarity or video analysis is applied, trading some implementation simplicity for much better cost control and scalability.

A fourth risk is source coverage. Restricting the MVP to a limited set of public sources reduces legal and engineering complexity, but it also limits detection breadth, which is an explicit trade-off in favor of demonstrable execution quality for the first release.

## MVP release priorities
The first release should prioritize five elements above all else: a reliable asset registry, robust image and shot-level fingerprinting, constrained web scanning, explainable incident review, and metrics collection. Optional watermarking, advanced reporting, broader source coverage, and automated downstream enforcement should only be included if the core detection loop is already reliable and demo-ready.

An MVP that performs one narrow workflow extremely well is more valuable than a broad but fragile product surface. The recommended release standard is therefore not maximal feature count, but demonstrable end-to-end effectiveness on realistic altered media examples with trusted reviewer evidence.
