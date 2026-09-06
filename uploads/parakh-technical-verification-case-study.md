# Technical Verification — Parakh

*Rebuilding the technical valuation workflow inside Piramal's Parakh platform: from an email-and-Excel relay into a field-first, self-scoring pipeline.*

---

## Snapshot

| | |
|---|---|
| **Platform** | Parakh — Piramal Capital's collateral verification platform for secured lending (Home Loans / LAP) |
| **Workstream** | Technical Verification (the physical/technical valuation of pledged property) |
| **My role** | Design lead — end-to-end: process mapping, workflow design, IA, interaction design, vendor/scoring logic |
| **Team** | `[FILL: your 5-person team split — e.g. 2 PM, 2 eng, 1 you / plus BTM + vendor stakeholders]` |
| **Timeline** | `[FILL: e.g. 8 weeks discovery + design, Q_ 2025]` |
| **Contribution** | `[FILL: what YOU owned vs. team — be specific, recruiters read this line closely]` |

> **One-liner for the hero:** I redesigned technical verification from a manual email → print → sign → scan → re-upload relay into a mobile field-capture flow that auto-generates a signed, scored report and hands it straight to underwriting — removing two entire manual "download-and-re-upload" legs.

---

## Context — where this sits

Parakh is the collateral verification layer in Piramal's secured-lending journey. Before a home loan or LAP case can be sanctioned, the pledged property has to clear two independent checks:

- **Legal verification** — is the title clean and enforceable?
- **Technical verification** — does the property physically exist as described, and what is it actually worth?

This case study is about the **technical** side. It's the step that decides how much the bank can safely lend against the asset — so its accuracy and turnaround directly affect both risk and customer experience. A slow or sloppy technical report either delays a sanction or lets a bad valuation through.

`[FILL: 1 line on scale — e.g. "~X technical cases/month across Y branches and Z vendor agencies"]`

---

## The problem — the "before" process

Technical verification ran as a long chain of manual handoffs stitched together over email and WhatsApp. There were **two routes**, and both leaked time at every seam.

### Who's involved
- **CPA** — initiates and coordinates the case; the human glue of the whole process
- **Internal Technical Verifiers** — in-house verification team (Route A)
- **Branch Technical Manager (BTM)** — reviews and approves internal reports
- **External Technical Manager + External Technical Verifier** — vendor agency doing verification (Route B)
- **Sales** — supplies clarifications when queries are raised
- **Credit Team** — the downstream recipient who consumes the final report

### Route A — Internal
CPA assigns the case → Internal Verifier cross-checks collateral against ground data → (query loop to CPA + Sales if anything's missing) → generates the Technical Report → BTM reviews → **approve/rectify loop** → on approval, CPA **downloads the PDF from email, extracts required fields by hand, and uploads the report + fields to Salesforce** → report goes to Credit.

### Route B — External (vendor)
CPA routes to External Technical Manager → manager assigns to a field verifier → verifier cross-checks collateral vs. data → (query loop to managers + CPA) → generates report → manager reviews → either **signs & stamps** it, or **sends it back** for correction (loop repeats until clean).

### What actually happened on the ground (the pain)
This is where the process quietly bled hours and reliability:

1. **A 60–70 field Excel sheet** was the "system." Verifiers filled a sprawling spreadsheet by hand to produce each report. Long, error-prone, no validation.
2. **Physical sign & stamp theatre.** The manager would download the report, *print it*, sign and stamp the paper, *scan it back in*, and re-upload. A digital document taking a detour through a printer.
3. **The CPA as a human file-transfer service.** Every approved report meant the CPA manually downloading from email, extracting fields, and re-keying them into Salesforce.
4. **Vendor allocation by vibes.** Cases were assigned to vendors based on the BTM's *word of mouth* — no data on who was actually accurate or on-time.
5. **Communication scattered across email + WhatsApp.** Query loops, report handoffs, and rectifications had no single source of truth.
6. **No prioritisation.** Cases weren't ordered by urgency or value — the CPA just worked through whatever was in front of them.

`[FILL: quantify at least 2 of these — e.g. "avg X touches per case", "report generation took ~Y hours", "Z% rework rate". Even rough internal estimates beat none.]`

---

## Why it mattered

Every one of those manual legs added turnaround time to a sanction the customer was waiting on, and every hand-keyed field was a chance to introduce a valuation error into a *credit decision*. The process wasn't just annoying — it was a risk-and-TAT problem wearing an operations costume.

`[FILL: tie to the Parakh-level outcome you're claiming — e.g. how TV contributed to the ₹5 Cr savings / 2-hr p75 TAT story. This is your credibility anchor.]`

---

## Discovery

`[FILL — this is currently your weakest evidence area. Recruiters want to see HOW you learned the process. Add whatever's true:]`
- Shadowed / interviewed CPAs, BTMs, and vendor managers (`[how many, over how long]`)
- Mapped the full AS-IS process across both routes (the map in the "before" section)
- `[Any artifacts: journey maps, service blueprint, the pain-point matrix]`

> Even 2–3 lines of "I sat with N CPAs and walked every case type" transforms this from *"I had an idea"* to *"I understood the system."* Add it.

---

## Problem synthesis

Clustering the pain, four problems were really doing the damage:

1. **Data was re-entered instead of reused** — sales already captured collateral details; verifiers rebuilt them in Excel; CPAs re-keyed them into Salesforce.
2. **Physical steps trapped inside a digital process** — print/sign/stamp/scan.
3. **No intelligence in routing or prioritisation** — neither which case to do first, nor which vendor to trust.
4. **No feedback signal** — nothing measured vendor quality or flagged a weak report before it reached credit.

Everything I designed maps back to one of these four.

---

## Design goals

- **Reuse every piece of data that already exists.** A field should be entered once, by whoever's closest to the truth.
- **Delete the physical detours.** No printing, no scanning, no manual re-upload.
- **Make the system decide the boring stuff** — priority order and vendor allocation — from data, not memory.
- **Move quality control upstream** — catch a weak report *before* a human has to.

---

## The solution

Eight connected moves, roughly following a case's life.

### 1. Smart case prioritisation — one button, not a list
Instead of showing the CPA a raw queue, I built a **"Start a new case"** button. Behind it, cases are ranked by two signals:
- **Loan amount** (business value)
- **Sanction-readiness** — how accurate the customer's KYC is, i.e. how quickly they can actually be sanctioned

The highest-priority case surfaces on click. A **search** overrides the queue when Sales flags something urgent by case or customer name.

> **Design rationale:** a list invites cherry-picking and decision fatigue. A single prioritised action removes the "what should I pick?" tax and quietly enforces the business's priority order.

### 2. Leverage the data sales already captured
Sales users already enter the collateral details during onboarding. So the CPA screen **pre-fills** those — the CPA only supplies the 2–3 fields sales can't know (**Revenue Office name**, **SRO name**), and can edit the rest if needed.

> **Rationale:** entering a field twice is a bug, not a step. Whoever is closest to the source of truth enters it once; everyone downstream inherits it.

### 3. Unified document handling
The CPA uploads documents digitally for verifiers, and can **mark documents for physical pickup** (mostly for legal, which needs originals). Crucially, a single upload can serve **both legal and technical** verification at once — no duplicate uploads for the two tracks.

### 4. One-click initiation + intelligent vendor routing
The CPA initiates legal *and* technical verification in one click. The system **suggests the vendor** based on:
- the **pin code** of the collateral, and
- that vendor's **measured performance** on that pin code

Today vendors are prioritised by the BTM's word of mouth. The new system **measures each vendor's correctness and punctuality** and feeds that back into routing — so allocation gets smarter with every case instead of relying on memory.

> **Rationale:** this turns a static, opinion-based directory into a self-improving allocation engine. It's also the source of the quality signal used later in scoring.

### 5. Field-first mobile capture — killing the 60–70 field Excel
This is the heart of it. The verifier's Excel sheet becomes a **structured mobile app**:
- On onboarding, the **vendor manager uploads their sign & stamp once** (PNG/JPG).
- The manager sees cases by **pin code / area**, **multi-selects**, and **bulk-assigns** to a verifier — far easier to track than one-by-one.
- The verifier reaches the site and taps **"Start verification"** → the app **auto-captures lat/long** and fills the geo field itself (no manual entry, and it's tamper-resistant proof of presence).
- The 60–70 Excel fields become **native input fields grouped into the same sections** — the verifier types on the ground, and inputs become structured data instead of spreadsheet cells.
- Photos and every detail are captured **on location**, then submitted.

> **Rationale:** capturing at the point of observation kills the "fill the Excel back at the desk" gap where memory and errors creep in. Structured fields also unlock validation and — later — scoring.

### 6. Auto-generated, digitally signed report
On submission, the report is **generated automatically** from the verifier's structured entry, and the **pre-stored sign & stamp PNG is appended** at the bottom.

> **This deletes an entire manual leg:** the download → print → sign → stamp → scan → re-upload dance is gone, because the signature is already digital and the report builds itself from data.

### 7. Manager review — approve or send back
The manager gets a clean decision: **Approve** or **Send back**.
- **Send back** returns the case to the verifier with a **remark** describing the required rectification (the correction loop, now inside the system instead of over email).
- **Approve** triggers the auto-signed report.

### 8. Scoring engine + straight-to-credit hand-off
After the manager submits, the BTM doesn't wade through the full report — they see a **generated score**: how strong the report is, its **red flags**, and its **good areas**. The system **recommends approve/reject**, and the structured data flows **directly into the credit underwriting system (the grid)**.

> **This deletes the second manual leg:** the CPA no longer downloads the PDF, extracts fields, and re-uploads to Salesforce. The data was structured from the start, so it just moves.

---

## Before → After

| | Before | After |
|---|---|---|
| **Report authoring** | 60–70 field Excel, by hand | Structured mobile fields, captured on-site |
| **Sign & stamp** | Print → sign → stamp → scan → upload | Pre-stored PNG auto-appended |
| **Geo proof** | None / manual | Auto lat/long on "Start verification" |
| **Vendor allocation** | BTM's word of mouth | Data-driven by pin code + measured performance |
| **CPA → Salesforce** | Manual download, extract, re-upload | Structured data flows to credit automatically |
| **Prioritisation** | None | Ranked by loan value + sanction-readiness |
| **Query & rectification** | Email + WhatsApp | In-system loops with remarks |
| **Quality check** | Human reads full report | Auto-score + red flags + recommendation |

**Two full manual legs eliminated:** (1) vendor manager's physical print/sign/stamp/scan, and (2) CPA's download-and-re-upload to Salesforce.

---

## Impact

`[FILL — this section is what recruiters scan first. You currently have zero numbers here. Get at least 3:]`
- **TAT:** `[before → after, e.g. "technical report TAT cut from X to Y"]`
- **Manual touches removed:** `[e.g. "2 handoff legs and ~N clicks/case eliminated"]`
- **Error / rework:** `[e.g. "report rework rate down X%"]`
- **Vendor quality:** `[e.g. "routing now data-driven across N vendors"]`
- **Contribution to Parakh's ₹5 Cr / 2-hr p75 story:** `[how much of that traces to TV]`

> If you genuinely don't have hard post-launch numbers yet, say so honestly and frame them as *projected* / *design targets* — a labelled estimate is credible; a vague claim is not.

---

## Challenges & trade-offs

`[FILL with the real ones — this is what separates a senior case study from a feature list. Candidates:]`
- **Vendor adoption:** field verifiers moving off familiar Excel onto a mobile app — how did you handle training / resistance?
- **Trusting an auto-generated signature:** did compliance/legal push back on removing the physical stamp? How did you make the digital sign auditable?
- **Scoring trust:** how do you stop the BTM from rubber-stamping the auto-recommendation? What's the human-in-the-loop safeguard?
- **Connectivity:** field verifiers in low-signal areas — does capture work offline?

> Pick 2–3, state the tension honestly, and say what you decided and why. This is the highest-signal section for a senior/lead role.

---

## What's next

`[FILL — e.g. closing the loop so measured vendor scores auto-tune routing weights; extending the scoring model; applying the same field-capture pattern to legal verification.]`

---

## Appendix — the field-mapping reference

The legacy 60–70 field Excel sheet (used to instruct verifiers how to fill each field) is the source artifact behind the structured mobile form in Move #5. `[Attach / link the Excel here, or a cleaned screenshot showing the scale of what got replaced — it's strong visual proof of the "before."]`

---

### Notes to self before publishing (delete this block)
- Replace every `[FILL: …]` — especially **Impact**, **Discovery**, and **Contribution**.
- Add visuals: AS-IS process map, the mobile capture screens, before/after of the report, the scoring view.
- Keep tone consistent with your Parakh anchor case (Inter + IBM Plex Mono, defensible metrics).
- Decide framing: is this a standalone case study, or a deep-dive module *inside* the Parakh case study? I've written it to work either way, but the hero line and Snapshot should match whichever you choose.
