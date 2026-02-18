namespace IdeaFactory.Api.Services;

/// <summary>
/// Provides pre-generated AI insight responses for demo tickers (INFY, TCS, RELIANCE).
/// Used as a fallback when GitHub Models is unavailable or rate-limited.
/// </summary>
public interface IFallbackInsightProvider
{
    string? GetFallbackResponse(string ticker, string insightType);
    IReadOnlyDictionary<(string Ticker, string InsightType), string> GetAllFallbacks();
}

public class FallbackInsightProvider : IFallbackInsightProvider
{
    private static readonly Dictionary<(string Ticker, string InsightType), string> Fallbacks = new()
    {
        // ---------------------------------------------------------------
        // INFY (Infosys)
        // ---------------------------------------------------------------
        [("INFY", "today")] = """
            Infosys (INFY) on NSE showed notable activity in today's session, trading at Rs 1,892.30 with a gain of Rs 45.60 (+2.47%). The stock opened at Rs 1,855.00 and touched an intraday high of Rs 1,898.50, supported by broad-based buying in the IT sector.

            Volume was elevated at 8.9 million shares against the 20-day average of 6.2 million, suggesting institutional participation. The NIFTY IT index advanced 0.75%, providing a favourable sectoral tailwind.

            Key observations:
            - Infosys recently announced a $2 billion deal with a European financial services firm, which has provided positive sentiment.
            - The stock is trading within its 52-week range of Rs 1,358.35 - Rs 1,989.40, currently positioned in the upper half of this range.
            - Foreign Institutional Investors (FIIs) have been net buyers in the IT sector over the past five sessions.
            - The rupee weakened marginally against the US dollar, which historically benefits IT exporters like Infosys.

            Sector context: Indian IT services companies are navigating a mixed demand environment. While discretionary spending remains cautious globally, large deal wins have provided revenue visibility for select players.

            This is AI-generated analysis for informational purposes only. Not investment advice.
            """,

        [("INFY", "brief")] = """
            **The Story**

            Infosys Limited (NSE: INFY) is India's second-largest IT services company by revenue, founded in 1981 in Pune and now headquartered in Bengaluru. The company provides consulting, technology, and outsourcing services to clients across financial services, retail, manufacturing, and healthcare sectors globally.

            What makes Infosys an interesting study is its position at the intersection of two structural trends: the ongoing digital transformation of global enterprises and the cost arbitrage that Indian IT services firms have historically leveraged. Under CEO Salil Parekh's leadership since 2018, the company has pivoted toward higher-margin digital services (now comprising over 62% of revenue), which includes cloud migration, data analytics, AI/ML implementations, and cybersecurity services.

            The company serves over 1,800 clients across 56 countries, with its top 10 clients contributing roughly 35% of revenue. This concentration has gradually decreased over the past decade, reflecting a deliberate diversification strategy.

            **The Numbers**

            For FY25 (trailing four quarters), Infosys reported consolidated revenue of approximately Rs 1,53,670 crore, representing year-over-year growth of 4.7% in constant currency terms. Operating margins (EBIT) have stabilized in the 20-21% band after the margin compression seen industry-wide during the post-pandemic normalization.

            Key financial metrics:
            - Market capitalization: Rs 7.8 lakh crore
            - Price-to-Earnings ratio: 29.8x (trailing twelve months)
            - Return on Equity: 32.4%
            - Debt-to-Equity ratio: 0.11 (essentially debt-free)
            - Dividend yield: approximately 2.3%
            - Free cash flow conversion: 85% of net profit
            - Cash and equivalents on balance sheet: Rs 34,200 crore

            The company's large deal Total Contract Value (TCV) for the trailing four quarters stands at $11.2 billion, providing reasonable revenue visibility for the coming 12-18 months. Attrition has normalized to 12.5% from the peak of 28% seen in FY23.

            **The Moat**

            Infosys benefits from several structural advantages. First, client switching costs in enterprise IT services are substantial -- migrating a complex technology environment from one service provider to another involves significant risk, cost, and business disruption. This creates natural retention once Infosys is embedded in a client's operations.

            Second, the company's talent pool of over 3,17,000 employees, combined with its training infrastructure (the Mysuru campus can train 15,000 employees simultaneously), provides a scale advantage that smaller competitors cannot easily replicate.

            Third, the Infosys brand carries significant weight in enterprise procurement decisions. The company consistently ranks in the top quadrant of analyst evaluations (Gartner, Forrester, ISG) across multiple service lines, which matters in risk-averse enterprise buying cycles.

            However, the moat is narrower than it appears. Indian IT services fundamentally remain a people-arbitrage business, and the rise of generative AI poses a medium-term structural question about the volume of human effort required for the same unit of technology delivery.

            **The Risks**

            The most immediate risk is macroeconomic uncertainty in Infosys's key markets. North America contributes approximately 61% of revenue, and any slowdown in US enterprise technology spending directly impacts the company's growth trajectory.

            Currency risk is a double-edged factor. While a weakening rupee boosts reported margins, the company hedges 65-70% of its net exposure, limiting the upside from sharp currency moves.

            The generative AI disruption is the most significant long-term risk. If AI tools reduce the volume of human effort needed for software development, testing, and maintenance -- which collectively represent a large portion of Infosys's revenue base -- the company's current pricing model (largely effort-based) faces structural pressure. Infosys has launched its Topaz AI platform to address this, but whether this fully offsets the cannibalisation risk remains an open question.

            Regulatory risks include potential changes to H-1B visa policies in the United States and evolving data protection regulations (GDPR, DPDP Act) that increase compliance costs for cross-border service delivery.

            This is AI-generated analysis for informational purposes only. Not investment advice.
            """,

        [("INFY", "explain")] = """
            Infosys (INFY) on NSE is showing an unusual upward move of +2.47% today on elevated volume (8.9M shares vs 6.2M average). Several factors may be contributing:

            1. **Large deal announcement**: Infosys recently disclosed a $2 billion engagement with a European financial services firm. Large deal wins of this magnitude typically provide revenue visibility for 5-7 years and are viewed positively by institutional investors.

            2. **Sector rotation into IT**: The NIFTY IT index is up 0.75% today, suggesting the move is partially sector-driven rather than purely stock-specific. A weaker rupee and expectations of stable US interest rates tend to benefit Indian IT exporters.

            3. **Quarterly earnings expectations**: With the next quarterly results approaching, analyst consensus estimates have been revised upward modestly. The management's guidance of 4-7% revenue growth in constant currency for FY25 appears achievable based on the deal pipeline.

            4. **FII buying pattern**: Foreign Institutional Investors have been net buyers in the IT sector over the past five trading sessions, which aligns with the elevated volume profile seen today.

            5. **Technical factors**: The stock recently bounced off its 100-day moving average near Rs 1,820, which may have attracted momentum-based buying. The relative strength index (RSI) moved from oversold territory back into neutral, which sometimes precedes short-term upward moves.

            It is worth noting that the volume, while elevated, is not at levels that would suggest a material information asymmetry. The move appears consistent with a combination of positive fundamental news and favourable sector sentiment rather than any single catalyst.

            This is AI-generated analysis for informational purposes only. Not investment advice.
            """,

        // ---------------------------------------------------------------
        // TCS (Tata Consultancy Services)
        // ---------------------------------------------------------------
        [("TCS", "today")] = """
            Tata Consultancy Services (TCS) on NSE traded at Rs 4,128.75 today, declining Rs 62.15 (-1.48%) in a session marked by selective profit-booking in IT heavyweights. The stock opened at Rs 4,175.00 and slipped to an intraday low of Rs 4,112.40 before recovering partially.

            Volume at 4.8 million shares was in line with the 20-day average of 4.5 million, suggesting the selling pressure was orderly rather than panic-driven.

            Key observations:
            - TCS management recently cautioned about a slower deal pipeline amid global macroeconomic uncertainty, which has weighed on sentiment.
            - The stock is trading at a P/E of 32.1x, which is at a premium to the NIFTY IT median of 27x, reflecting the market's quality premium for India's largest IT services firm.
            - The company maintained its dividend payout with a final dividend of Rs 28 per share for FY24, translating to a yield of approximately 1.8%.
            - The NIFTY IT index gained 0.75% today, indicating TCS underperformed the sector. This divergence is likely attributable to the company-specific commentary on deal pipeline softness.

            The broader context for TCS remains one of stable but moderating growth. The company reported Q3 FY25 revenue of Rs 64,259 crore, up 5.6% year-over-year, with an operating margin of 19.3%.

            This is AI-generated analysis for informational purposes only. Not investment advice.
            """,

        [("TCS", "brief")] = """
            **The Story**

            Tata Consultancy Services (NSE: TCS) is India's largest IT services company and a flagship entity of the Tata Group. Founded in 1968, TCS has grown from a domestic technology provider into a global IT services leader with operations spanning 55 countries and over 6,14,000 employees.

            TCS occupies a distinctive position in Indian IT: it is the most diversified by geography, industry vertical, and service line. The company generates roughly 52% of revenue from North America, 32% from Europe, and the remainder from Asia-Pacific, India, and other markets. Its client roster includes many of the world's largest banks, retailers, manufacturers, and telecommunications companies.

            The study of TCS is essentially a study of the Indian IT services industry itself. As the sector's bellwether, TCS's performance, guidance, and commentary on demand trends set the tone for the entire industry. Its ability to sustain growth at scale (Rs 2.4 lakh crore in annual revenue) while maintaining margins above 24% (EBITDA) makes it a reference point for capital efficiency in services businesses.

            **The Numbers**

            TCS delivered revenue of Rs 64,259 crore in Q3 FY25, representing 5.6% year-over-year growth. Full-year FY25 revenue is tracking toward approximately Rs 2,53,000 crore. The growth rate has moderated from the double-digit levels seen during the post-pandemic digital spending boom, reflecting a global normalization of IT budgets.

            Key financial metrics:
            - Market capitalization: Rs 14.9 lakh crore (India's most valuable IT company)
            - Price-to-Earnings ratio: 32.1x (trailing twelve months)
            - Return on Equity: 48.2% (consistently one of the highest in Indian IT)
            - Debt-to-Equity ratio: 0.04 (virtually zero leverage)
            - Dividend yield: approximately 1.8%
            - Free cash flow conversion: over 100% of net profit (due to working capital discipline)
            - Cash on balance sheet: Rs 48,700 crore

            Total Contract Value (TCV) for the trailing four quarters stands at $29.4 billion, the highest in the Indian IT industry. However, the mix has shifted toward smaller deals, with mega-deals (>$100M) showing some softness in the most recent quarter.

            **The Moat**

            TCS's competitive advantages are rooted in scale, client relationships, and execution consistency. The company has served several of its top 10 clients for over 20 years, a testament to deep integration in client operations and high switching costs.

            The Tata brand provides a trust premium in enterprise sales, particularly in risk-averse industries like banking and insurance. TCS's track record of large-scale program delivery (it modernized the UK's national insurance system and runs core banking for several global banks) serves as a powerful reference in competitive bids.

            TCS's margin profile is among the best in the industry, driven by a pyramid-shaped workforce (heavy on junior engineers), proprietary platforms that reduce delivery effort, and operational discipline in utilization rates and subcontractor management.

            The company's investment in its ignio cognitive automation platform and its Pace innovation labs positions it to capture emerging demand in AI and cloud-native services, though the monetization of these investments relative to their cost is still evolving.

            **The Risks**

            TCS faces concentration risk at the industry vertical level: Banking, Financial Services, and Insurance (BFSI) contributes approximately 34% of revenue. A prolonged downturn in financial services technology spending would disproportionately impact TCS.

            The company's premium valuation (32.1x P/E vs sector median of 27x) leaves limited margin of safety. Any sustained miss on growth or margin expectations could lead to a meaningful derating.

            Attrition management remains an ongoing challenge. While LTM attrition has normalized to 12.3%, the cyclical nature of talent markets means that the next up-cycle could again pressure margins through wage inflation and recruitment costs.

            The generative AI disruption is sector-wide, but TCS's exposure is arguably the largest in absolute terms given its revenue scale. The company has proactively trained over 3,50,000 employees in generative AI skills, but the impact on future effort-based billing remains the most significant strategic uncertainty for the company.

            This is AI-generated analysis for informational purposes only. Not investment advice.
            """,

        [("TCS", "explain")] = """
            TCS (NSE: TCS) is trading down -1.48% today at Rs 4,128.75, underperforming the NIFTY IT index which is up 0.75%. This divergence from the sector warrants examination. Several factors may explain this:

            1. **Management commentary on deal pipeline**: TCS management recently warned of a slower deal pipeline amid global macroeconomic uncertainty. This company-specific commentary is weighing on sentiment even as the broader IT sector benefits from rupee weakness and sector rotation.

            2. **Profit-booking at premium valuations**: At 32.1x trailing P/E, TCS trades at a premium to the NIFTY IT median (27x). When sector sentiment is mixed, the highest-valued names often see profit-booking first as investors rotate toward relatively cheaper peers.

            3. **Sector divergence is noteworthy but not unusual**: TCS has historically traded with a lower beta to sector moves. Its underperformance on a sector up-day may reflect relative value rotation within IT, where mid-cap IT names or companies with stronger recent deal wins are seeing incremental buying.

            4. **Institutional rebalancing**: The orderly volume pattern (4.8M shares vs 4.5M average) suggests the selling is measured and likely driven by portfolio rebalancing rather than a fundamental reassessment.

            5. **Global macro signals**: Recent US Federal Reserve commentary suggesting a "higher for longer" interest rate environment has led some analysts to temper expectations for the timing of a discretionary IT spending recovery, which is particularly relevant for TCS given its large BFSI exposure.

            The magnitude of the decline (-1.48%) is within normal daily volatility for TCS and does not appear to signal a material negative development. The stock remains well within its established trading range.

            This is AI-generated analysis for informational purposes only. Not investment advice.
            """,

        // ---------------------------------------------------------------
        // RELIANCE (Reliance Industries)
        // ---------------------------------------------------------------
        [("RELIANCE", "today")] = """
            Reliance Industries (RELIANCE) on NSE advanced Rs 87.30 (+3.05%) to trade at Rs 2,945.60 in today's session, making it one of the strongest performers among NIFTY 50 constituents. The stock touched an intraday high of Rs 2,962.00, driven by broad-based buying across the conglomerate's business verticals.

            Volume was robust at 15.2 million shares, significantly above the 20-day average of 10.8 million, indicating strong institutional and retail participation.

            Key observations:
            - Reliance Jio recently crossed the 500 million subscriber milestone, with Average Revenue Per User (ARPU) rising 12% quarter-over-quarter. This milestone reinforces Jio's position as India's largest telecom operator.
            - The energy segment is benefiting from stable crude oil prices and improved refining margins (Singapore GRM at $7.2/barrel).
            - Reliance Retail continues its aggressive expansion, with over 18,000 stores across formats. The retail segment reported revenue growth of 18% in the most recent quarter.
            - The stock's weight in the NIFTY 50 index (~10.4%) means large passive flows when FIIs increase India allocations, which has been the case recently.

            The broader market context is constructive, with the NIFTY 50 advancing 0.58% and the SENSEX gaining 468 points. Reliance's outperformance relative to the index (+3.05% vs +0.58%) suggests stock-specific catalysts are driving the move.

            This is AI-generated analysis for informational purposes only. Not investment advice.
            """,

        [("RELIANCE", "brief")] = """
            **The Story**

            Reliance Industries Limited (NSE: RELIANCE) is India's largest company by market capitalization and revenue, founded by Dhirubhai Ambani in 1966 as a textiles manufacturer. Under Chairman Mukesh Ambani's leadership, the company has transformed into a diversified conglomerate spanning energy (oil refining, petrochemicals, oil & gas exploration), digital services (Jio Platforms), and retail (Reliance Retail Ventures).

            The Reliance story in 2025 is fundamentally a narrative of business model transition. The company is systematically shifting its earnings composition from legacy hydrocarbon businesses toward consumer-facing digital and retail platforms. Jio Platforms, launched in 2016 with free 4G data that disrupted the Indian telecom market, now serves over 500 million subscribers and has expanded into broadband (JioFiber), enterprise connectivity, and cloud services.

            Reliance Retail, India's largest organised retail chain with over 18,000 stores, operates across grocery (Smart Bazaar, JioMart), electronics (Reliance Digital), fashion (Trends, AJIO), and pharmacy (Netmeds) formats. The combined consumer business (Jio + Retail) now contributes over 45% of consolidated EBITDA, up from negligible levels a decade ago. This transition is what makes Reliance a compelling study in corporate reinvention.

            **The Numbers**

            Reliance reported Q3 FY25 consolidated revenue of Rs 2,35,800 crore, with net profit of Rs 18,540 crore. The company's scale is staggering -- annualized revenue exceeds Rs 9 lakh crore, placing it among the top 100 companies globally by revenue.

            Key financial metrics:
            - Market capitalization: Rs 19.9 lakh crore (India's most valuable company)
            - Price-to-Earnings ratio: 28.4x (trailing twelve months)
            - Return on Equity: 9.2% (moderated by the massive capital employed in new energy and telecom)
            - Net Debt-to-EBITDA ratio: 0.7x (manageable given the asset base)
            - Dividend yield: approximately 0.3% (Reliance prioritizes reinvestment over payouts)
            - Free cash flow: Rs 32,400 crore (FY24), though capex remains elevated at Rs 1,42,000 crore

            Segment-wise EBITDA mix: Oil-to-Chemicals (O2C) contributes approximately 42%, Jio Platforms 28%, Reliance Retail 17%, and Oil & Gas Exploration 8%. The remaining 5% comes from new energy ventures and financial services.

            **The Moat**

            Reliance's competitive advantages are multi-layered. In refining, the Jamnagar complex (the world's largest single-location refinery with 1.4 million barrels per day capacity) enjoys structural cost advantages from scale and integration with the petrochemicals complex. The refinery's Nelson Complexity Index of 12.7 (among the world's highest) allows it to process heavier, cheaper crude grades and produce higher-value products.

            In telecom, Jio's moat stems from its greenfield 4G/5G network (no legacy 2G/3G infrastructure), a subscriber base of 500 million, and ownership of fibre and tower assets. The integration of telecom, broadband, and digital services under one platform creates cross-selling opportunities that standalone competitors cannot replicate.

            In retail, Reliance's advantage is a combination of real estate access (via group relationships), supply chain scale, and the omnichannel integration with JioMart and AJIO for online commerce. The private label strategy across categories further strengthens margin control.

            The overarching moat, however, is capital access. Reliance's ability to raise equity capital (the 2020 rights issue and Jio Platforms stake sales raised over Rs 2.6 lakh crore) and deploy it at scale into emerging sectors is a capability moat that very few Indian companies possess.

            **The Risks**

            The most significant risk is execution complexity. Managing a simultaneous transition across energy, telecom, retail, and new energy while investing Rs 75,000 crore in green energy (solar, hydrogen, battery storage) requires extraordinary organizational bandwidth. Any sustained underperformance in a key segment could impact the consolidated risk perception.

            Regulatory risk spans multiple sectors. Telecom tariff regulation, retail FDI policy changes, and the energy transition policy framework all directly impact Reliance's business lines. The company's scale also attracts regulatory scrutiny on competition grounds.

            The petrochemicals business faces cyclical risk from global supply additions, particularly from Middle Eastern and Chinese producers. O2C margins are inherently volatile and tied to global crude-product spreads that Reliance cannot control.

            Valuation risk is present given the 28.4x P/E multiple. The market is pricing in successful execution of the consumer business transition and the new energy pivot. If subscriber ARPU growth in Jio stalls, or if retail margin expansion slows, the premium valuation could face pressure.

            Finally, succession planning remains a long-term consideration. While the next generation of the Ambani family has taken operational roles, the transition of a founder-driven conglomerate of this scale is inherently complex.

            This is AI-generated analysis for informational purposes only. Not investment advice.
            """,

        [("RELIANCE", "explain")] = """
            Reliance Industries (NSE: RELIANCE) is showing a notable upward move of +3.05% today at Rs 2,945.60, outperforming the NIFTY 50 (+0.58%) by a significant margin on elevated volume (15.2M shares vs 10.8M average). Multiple factors appear to be converging:

            1. **Jio subscriber milestone**: Reliance Jio crossing 500 million subscribers is a significant psychological and fundamental milestone. The accompanying 12% QoQ rise in ARPU suggests that the subscriber base is monetizing more effectively, which directly impacts Jio Platforms' revenue trajectory.

            2. **Refining margin improvement**: Singapore benchmark Gross Refining Margins (GRM) have firmed to $7.2/barrel, up from $5.8/barrel a month ago. Given Jamnagar's scale and complexity advantage, Reliance's realized GRM is typically $2-3/barrel above the benchmark, making this improvement meaningful for the O2C segment.

            3. **Index weight effect**: RELIANCE carries approximately 10.4% weight in the NIFTY 50. When FIIs increase India allocations, passive and semi-passive flows disproportionately benefit the highest-weight constituents. Recent FII flow data shows net buying of Rs 3,200 crore in the last five sessions.

            4. **Retail expansion momentum**: The recent quarter showed Reliance Retail revenue growing 18% year-over-year, driven by new store additions and improving same-store sales. The integration of JioMart with physical stores is creating omnichannel synergies that analysts are beginning to model more explicitly.

            5. **Technical breakout**: The stock crossed above its 50-day moving average of Rs 2,880, which may have triggered momentum-based and systematic trading flows. The relative strength is improving on both daily and weekly timeframes.

            The volume profile (15.2M shares, well above average) confirms institutional participation in this move. The breadth of catalysts across multiple business segments suggests this is a fundamental re-rating move rather than short-term speculation.

            This is AI-generated analysis for informational purposes only. Not investment advice.
            """,
    };

    public string? GetFallbackResponse(string ticker, string insightType)
    {
        var key = (ticker.ToUpperInvariant(), insightType.ToLowerInvariant());
        return Fallbacks.TryGetValue(key, out var response) ? response.Trim() : null;
    }

    public IReadOnlyDictionary<(string Ticker, string InsightType), string> GetAllFallbacks()
    {
        return Fallbacks;
    }
}
