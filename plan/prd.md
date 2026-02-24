PRD: The Idea Factory (Azure AI Insights for Indian Equities) 1.1 Problem statement The Enterprise Problem: Innovation in financial analytics often stalls due to "budget friction." Architects cannot test AI hypotheses (e.g., "Can we summarize sentiment for NSE stocks?") without a full business case, leading to stagnation.

The Domain Problem: Retail investors in India struggle to interpret large volumes of fundamentals, price time series, and news, leading to emotion-driven decisions. There is a need for a compliant, explainable, AI-assisted insight layer.

The "Idea Factory" Approach: This project is a sanctioned local experiment. It aims to prove that an AI insight layer can be built rapidly using existing Azure credits/sandbox environments to generate evidence (data) rather than theoretical business cases.

1.2 Product vision and goals Vision: Provide near real-time, AI-driven insights for Indian stocks using Azure AI services. This serves as the first "Blueprint" for the Idea Factory methodology—demonstrating how to move from "Idea to Evidence" in 4 weeks.

Goals:

Innovation Velocity: Reduce "idea-to-prototype" time from 6 weeks to 2 weeks. Prudence: Build a solution that aligns with responsible AI guidance and SEBI expectations (risk disclosures, non-solicitation) from Day 1, ensuring the experiment is "Governance Ready." Efficiency: Reduce manual research time per stock idea by 90% by aggregating data into a single adaptive insight surface. 

1.3 Target users and scenarios Primary Personas:

Retail Trader: Needs a quick “explain this stock today” summary before placing an order. 
Technical Validator (Enterprise Architect/Raj): Needs to verify that the Azure RAG architecture(https://learn.microsoft.com/en-us/azure/search/agentic-retrieval-overview?tabs=quickstarts&source=docs) is scalable, cost-efficient, and secure within the experiment boundaries. 

Key Scenarios:

“What changed today?”: 
Intraday explanation of unusual price/volume moves with linked news and sector context. 

“Should I explore this stock?”: A 1-page AI-generated investment brief (Peter Lynch style) summarizing business model, metrics, and risks—generated without giving prescriptive buy/sell calls. 

1.4 Non-goals and constraints (Prudence Controls) 
No Advisory Status: The product will not generate explicit trading recommendations to avoid SEBI IA regulations. This is an "Information Tool," not an "Advisory Engine." 
Controlled Boundaries: In line with Idea Factory principles, this experiment runs with resource limits (spending caps) and data boundaries (publicly available data only). 

Scope: Focus on cash equities on NSE and BSE in Phase 1; derivatives are out of scope. 

1.5 High-level capabilities (aligned to AI‑102 & Idea Factory Layers) 

Capability Azure AI-102 Area Description (The Blueprint) 

News & Filings Summarization	
Azure AI Language, NLP	Summarize company news, detect sentiment. 

Layer 2: Evidence Collection. Earnings & PDF Parsing	

Document Intelligence	Extract metrics from reports. 

Layer 1: Experiment Execution. 

Trend & Anomaly Explanation	Decision Support, Azure Functions	Explain unusual modes. 

Layer 3: Decision Support. 
Conversational Assistant	
Conversational Language 
Understanding	Natural language 

Q&A over stock profile.

 Governance & Audit	
Azure Monitor, 

Policy	Prudence Control: 

Log prompts/outputs for compliance.

1.6 Azure services and architecture (The Blueprint) Logical components:

Ingestion & Storage: Azure Data Factory / Azure Data Explorer for price data. Azure Storage for historical candles and PDFs. Language & Insights Layer: Azure AI Language for sentiment. Azure AI Document Intelligence for PDF parsing. Azure AI Search for indexing. Generative Layer: Azure OpenAI for prompt-flow–based RAG, tuned for “inform, not advise”. Governance Layer (The "Adult Conversation"): Azure Key Vault for secrets. Managed Identities for security. All resources deployed in India regions (Central/South) for data residency. 

1.7 Functional requirements (Evidence Generation) As a user, I can search for an NSE/BSE ticker and get an AI-generated “Today’s view” card. As an Architect, I can view a "Governance Report" showing that no investment advice was generated and all data sources are compliant. As a user, I can ask free-form questions (“What are the main risks for TCS?”) and receive grounded answers with citations. 1.8 Non-functional requirements Latency: P95 response time < 3 seconds. Cost Control: Hard limits on Azure resource spending per month (Prudence Control). Availability: 99.9% for APIs during the pilot phase. 1.9 Success metrics Innovation Metric: "Time to Evidence" – How fast can a new stock insight be generated? (Target: < 48 hours for new signal integration). User Metric: Reduction in research time (Target ≥50%). Governance Metric: Zero policy violations.