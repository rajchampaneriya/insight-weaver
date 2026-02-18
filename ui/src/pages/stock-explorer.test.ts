import { describe, it, expect } from "vitest";

// Extract parseBrief logic for testing
function parseBrief(content: string) {
  const sections = { story: "", numbers: "", moat: "", risks: "" };

  const heading = (label: string) =>
    new RegExp(
      `(?:#{1,3}\\s*|\\*\\*)?(?:(?:\\d+\\.?\\s*)?)${label}\\**[:\\s]*`,
      "i"
    );

  const storyIdx = content.search(heading("The Story"));
  const numbersIdx = content.search(heading("The Numbers"));
  const moatIdx = content.search(heading("The Moat"));
  const risksIdx = content.search(heading("The Risks"));

  const found: { key: keyof typeof sections; idx: number }[] = [
    { key: "story", idx: storyIdx },
    { key: "numbers", idx: numbersIdx },
    { key: "moat", idx: moatIdx },
    { key: "risks", idx: risksIdx },
  ]
    .filter((s) => s.idx >= 0)
    .sort((a, b) => a.idx - b.idx);

  for (let i = 0; i < found.length; i++) {
    const headingMatch = content.slice(found[i].idx).match(heading(
      found[i].key === "story" ? "The Story" :
      found[i].key === "numbers" ? "The Numbers" :
      found[i].key === "moat" ? "The Moat" : "The Risks"
    ));
    const startOffset = headingMatch ? headingMatch[0].length : 0;
    const start = found[i].idx + startOffset;
    const end = i + 1 < found.length ? found[i + 1].idx : content.length;
    let text = content.slice(start, end).trim();
    if (i === found.length - 1) {
      text = text.replace(
        /\n*(?:---\n*)?(?:This is AI-generated|Disclaimer:)[\s\S]*$/i,
        ""
      ).trim();
    }
    sections[found[i].key] = text;
  }

  if (found.length === 0 && content.trim().length > 0) {
    const cleaned = content.replace(
      /\n*(?:---\n*)?(?:This is AI-generated|Disclaimer:)[\s\S]*$/i,
      ""
    ).trim();
    const quarter = Math.ceil(cleaned.length / 4);
    sections.story = cleaned.slice(0, quarter).trim();
    sections.numbers = cleaned.slice(quarter, quarter * 2).trim();
    sections.moat = cleaned.slice(quarter * 2, quarter * 3).trim();
    sections.risks = cleaned.slice(quarter * 3).trim();
  }

  return sections;
}

describe("parseBrief", () => {
  it("parses bold markdown heading format (**The Story**)", () => {
    const content = `**The Story**
Infosys is a global IT services company.

**The Numbers**
Revenue: 41,764 Cr. PAT: 6,806 Cr.

**The Moat**
Strong brand and client relationships.

**The Risks**
Currency fluctuations and attrition.

This is AI-generated analysis for informational purposes only. Not investment advice.`;

    const result = parseBrief(content);
    expect(result.story).toContain("Infosys is a global IT services");
    expect(result.numbers).toContain("Revenue: 41,764 Cr");
    expect(result.moat).toContain("Strong brand");
    expect(result.risks).toContain("Currency fluctuations");
    expect(result.risks).not.toContain("AI-generated");
  });

  it("parses bold headings with colons (**The Story:**)", () => {
    const content = `**The Story:** Infosys provides IT services.

**The Numbers:** Revenue is growing steadily.

**The Moat:** Deep client relationships.

**The Risks:** Macro headwinds exist.`;

    const result = parseBrief(content);
    expect(result.story).toContain("Infosys provides IT services");
    expect(result.numbers).toContain("Revenue is growing");
    expect(result.moat).toContain("Deep client");
    expect(result.risks).toContain("Macro headwinds");
  });

  it("parses markdown heading format (## The Story)", () => {
    const content = `## The Story
Infosys was founded in 1981.

## The Numbers
Strong financials across the board.

## The Moat
Brand recognition in global IT.

## The Risks
Dependence on US market.`;

    const result = parseBrief(content);
    expect(result.story).toContain("founded in 1981");
    expect(result.numbers).toContain("Strong financials");
    expect(result.moat).toContain("Brand recognition");
    expect(result.risks).toContain("Dependence on US");
  });

  it("parses numbered section format (1. **The Story**)", () => {
    const content = `1. **The Story**
IT services giant from Bangalore.

2. **The Numbers**
Consistent double-digit growth.

3. **The Moat**
Multi-decade client relationships.

4. **The Risks**
AI disruption risk to traditional services.`;

    const result = parseBrief(content);
    expect(result.story).toContain("IT services giant");
    expect(result.numbers).toContain("double-digit growth");
    expect(result.moat).toContain("Multi-decade");
    expect(result.risks).toContain("AI disruption");
  });

  it("falls back to quarter-splitting when no headings found", () => {
    const content = "ABCD EFGH IJKL MNOP";
    const result = parseBrief(content);
    expect(result.story.length).toBeGreaterThan(0);
    expect(result.numbers.length).toBeGreaterThan(0);
    expect(result.moat.length).toBeGreaterThan(0);
    expect(result.risks.length).toBeGreaterThan(0);
  });

  it("handles empty content", () => {
    const result = parseBrief("");
    expect(result.story).toBe("");
    expect(result.numbers).toBe("");
    expect(result.moat).toBe("");
    expect(result.risks).toBe("");
  });

  it("strips disclaimer from the last section", () => {
    const content = `**The Story**
Company overview.

**The Numbers**
Financial data.

**The Moat**
Competitive edge.

**The Risks**
Key concerns here.

---
This is AI-generated analysis for informational purposes only. Not investment advice.`;

    const result = parseBrief(content);
    expect(result.risks).toBe("Key concerns here.");
    expect(result.risks).not.toContain("AI-generated");
  });
});
