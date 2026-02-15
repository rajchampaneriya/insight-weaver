# Day 4: The Method

**Theme:** The "How" -- Technical Depth
**Goal:** Hook Principal Engineers and Lead Architects. Show the technical depth that makes this work. Reference the methodological approach (Juval Lowy-style clarity).
**Format:** Text Post + Architecture Diagram Image

---

## Visual Brief

**Image:** `Day-4 Image.png`

**Required Visual:** A layered architecture diagram on midnight blue (#0A192F) background. Three horizontal layers stacked vertically with clear boundaries and labeled interfaces between them.

**Layer 1 -- Experiment Execution (Top):**
Three components: "Isolated Runtime" | "Resource Quotas" | "Cleanup Protocols"
Teal (#64FFDA) border. White labels. Each component has a small icon (container, gauge, broom).

**Interface:** Downward arrow labeled "Structured Output"

**Layer 2 -- Evidence Collection (Middle):**
Three components: "Output Formatter" | "Metric Aggregator" | "Baseline Comparator"
Teal border. White labels.

**Interface:** Downward arrow labeled "Decision Inputs"

**Layer 3 -- Decision Support (Bottom):**
Three components: "ADR Integration" | "Scale Recommendations" | "Risk Assessment"
Teal border. White labels.

**Style Notes:**
- Juval Lowy-inspired: explicit component boundaries, no overlapping responsibilities
- Each layer is a self-contained unit with defined inputs/outputs
- Use dotted lines for optional paths, solid lines for mandatory flows
- No 3D effects, no gradients, no shadows

---

## Post Copy

```
Good architecture should feel invisible to users and obvious to engineers.

The Idea Factory follows a methodical layered approach:

Layer 1 -- Experiment Execution
- Isolated runtime environments
- Resource quotas and time limits
- Automatic cleanup protocols

Layer 2 -- Evidence Collection
- Structured output formats
- Metric aggregation
- Comparison baselines

Layer 3 -- Decision Support
- ADR (Architecture Decision Record) integration
- Scaling recommendations
- Risk assessment

The principle: Make experimentation as routine as testing.

When architects can run controlled experiments without friction, innovation becomes systematic -- not serendipitous.

#SoftwareArchitecture #Engineering #Methodology #DotNet
```

---

## Character Count

~600 characters

## Engagement Hooks

- **Opening line** ("Good architecture should feel invisible...") is a quotable aphorism. Engineers screenshot and share these.
- **Three-layer structure** mirrors how architects actually think about systems. This validates their mental model and signals "this person thinks like me."
- **"Systematic -- not serendipitous"** is the key reframe. Innovation at most companies is accidental. This post positions Raj's approach as deliberate and repeatable.
- **ADR reference** is a deliberate signal to senior architects. Junior engineers skip over it; senior architects recognize it as a sign of genuine methodology.

## Posting Notes

- Post on Friday 8:00 AM IST.
- This is the "architect magnet" post. Expect fewer likes but higher-quality engagement (comments from Staff+ engineers and architects).
- In the first comment, add the tech stack: ".NET 10, Aspire orchestration, IBM Carbon UI, Microsoft.Extensions.AI abstraction. The boring stack that ships."
- Do not over-explain the diagram in the post. Let the engineers study it. Complexity in the image, simplicity in the text.
