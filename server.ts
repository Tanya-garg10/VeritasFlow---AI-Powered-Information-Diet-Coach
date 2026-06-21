import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

// Enable JSON body parsing
app.use(express.json());

// Enable CORS for Chrome Extension integration
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, DELETE");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

// Initialize Gemini SDK with User-Agent for tracking
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
  console.log("Gemini API initialized successfully.");
} else {
  console.warn("Warning: GEMINI_API_KEY is missing or set to placeholder. Running with smart local analysis simulator.");
}

// In-Memory Database for demonstration content
let contentItems: any[] = [
  {
    id: "seed-1",
    title: "Why the New Residential Speed Limits Are a Blatant Overreach of State Control",
    url: "https://socialnetwork.com/posts/speed-limit-conspiracy",
    content: "Unbelievable! City hall is forcing a 20mph speed limit across all residential zones now. This is another blatant, authoritarian overreach designed to control commuters, track drivers with cameras, and tax us into oblivion with speed traps. They're trying to take away our standard mobility. Stand up for your freedom!",
    platform: "X / Twitter",
    timeSpent: 12,
    category: "Politics",
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(), // 5 hrs ago
    sentiment: {
      score: -0.85,
      label: "Negative",
      emotionalImpact: "High"
    },
    biasAnalysis: {
      biasLevel: "Extreme Right",
      biasScore: 88,
      primaryFrame: "Conspiratorial / Anti-Government",
      explanation: "Uses charged victimhood frames and absolute statements. Portrays pedestrian safety policies as part of an orchestrated invasion of basic civil freedoms without offering evidence."
    },
    filterBubbleMetric: {
      isRepetitive: true,
      bubbleIndex: 82,
      bubbleRiskExplanation: "Heavily echoes isolated anti-mobility clusters. Reinforces views which claim local hazard mitigations are malicious containment schemes."
    },
    alternativePerspectives: [
      {
        source: "World Health Organization Data Hub",
        title: "Pedestrian Survival Rates at 20 mph vs. 30 mph",
        stance: "Public Safety Statistics",
        summary: "Empirical studies show that a pedestrian hit by a vehicle traveling at 20 mph has a 90% survival rate, compared to under 50% survival rate at 30 mph.",
        credibleUrlFallback: "https://www.who.int/roadsafety"
      },
      {
        source: "European Transport Safety Council Report",
        title: "Economic Impact Analysis of Traffic Calming Initiatives",
        stance: "Socio-Economic Balance",
        summary: "Comprehensive assessments showed that lowering limits leads to 20% fewer accidents, significantly reducing municipal healthcare costs while adding less than 95 seconds to average commuter durations.",
        credibleUrlFallback: "https://etsc.eu"
      }
    ]
  },
  {
    id: "seed-2",
    title: "Software development is dead: we will all be replaced in 12 months",
    url: "https://reddit.com/r/tech/comments/replaced-already",
    content: "There is literally no point attending university or practicing coding anymore. Models like Gemini and Claude can write entire websites in 10 seconds. Within 12 months, every single entry-level developer role will be completely deprecated. High-tech is finished and we've all been sold out.",
    platform: "Reddit",
    timeSpent: 25,
    category: "Technology",
    timestamp: new Date(Date.now() - 3600000 * 20).toISOString(), // 20 hrs ago
    sentiment: {
      score: -0.9,
      label: "Negative",
      emotionalImpact: "High"
    },
    biasAnalysis: {
      biasLevel: "Polarized / Unbalanced",
      biasScore: 75,
      primaryFrame: "Existential Defeatism",
      explanation: "Relies on sweeping doom-scrolling panic instead of gradual engineering metrics. Ignores the expanding scope of architectural design and complexity control."
    },
    filterBubbleMetric: {
      isRepetitive: true,
      bubbleIndex: 78,
      bubbleRiskExplanation: "Increases psychological stress. Matches a circular doom loop of tech replacement and survivalist anxiety."
    },
    alternativePerspectives: [
      {
        source: "Association for Computing Machinery (ACM)",
        title: "The Complementary Evolution of Human Code and Artificial Intelligence",
        stance: "Technological Pragmatism",
        summary: "Argues that language models shift the programmer's role from raw manual syntax typing to higher-order systems integration, verification, and critical validation.",
        credibleUrlFallback: "https://www.acm.org"
      }
    ]
  },
  {
    id: "seed-3",
    title: "International Biologists Re-engineer Crop Enzyme to Boost Arid Yields by 15%",
    url: "https://sciencedaily.org/articles/rubisco-arid-wheat",
    content: "A global consortium of agriculture biochemists has reconfigured the photosynthetic enzyme RuBisCO in drylands wheat varieties. The modified enzyme reduces water evaporation losses under heat waves, leading to verified yield improvements of 15% in test fields in Rajasthan and Sudan.",
    platform: "News Outlets",
    timeSpent: 10,
    category: "Science",
    timestamp: new Date(Date.now() - 3600000 * 30).toISOString(), // 30 hrs ago
    sentiment: {
      score: 0.65,
      label: "Positive",
      emotionalImpact: "Medium"
    },
    biasAnalysis: {
      biasLevel: "Neutral / Objective",
      biasScore: 8,
      primaryFrame: "Scientific Progress",
      explanation: "Highly standard reporting focusing on empirical testing, collaborative data sources, and agricultural peer reviews."
    },
    filterBubbleMetric: {
      isRepetitive: false,
      bubbleIndex: 12,
      bubbleRiskExplanation: "Expands exposure outside polarized cycles. Brings constructive science facts in to break fatigue loops."
    },
    alternativePerspectives: [
      {
        source: "Ecology & Land Reform Quarterly",
        title: "Ecological Implications of Genetically Reengineered Strains in Dry Soils",
        stance: "Bio-Diversity Conservation",
        summary: "Recommends careful monitoring of soil biome responses and local water table usage when importing optimized agricultural strains.",
        credibleUrlFallback: "https://ecology.org"
      }
    ]
  },
  {
    id: "seed-4",
    title: "Why the global interest rate hikes are a localized blessing",
    url: "https://financejournal.com/opinions/rates-hike",
    content: "While popular news cries about rising mortgage rates, the truth is that raising rates is the only way to rescue our monetary base. Leftist spenders have inflated our salaries away. Hiking rates corrects the bubble and rewards prudent savers over speculative tech gamblers.",
    platform: "Medium / Blogs",
    timeSpent: 15,
    category: "Finance & Economy",
    timestamp: new Date(Date.now() - 3600000 * 48).toISOString(), // 2 days ago
    sentiment: {
      score: 0.1,
      label: "Neutral",
      emotionalImpact: "Medium"
    },
    biasAnalysis: {
      biasLevel: "Left Leaning" as any, // Seed setting left/right bias
      biasScore: 55,
      primaryFrame: "Fiscal Conservatism",
      explanation: "Applies severe partisan economic tags ('leftist spenders', 'speculative gamblers') rather than analyzing systemic central bank variables evenly."
    },
    filterBubbleMetric: {
      isRepetitive: false,
      bubbleIndex: 45,
      bubbleRiskExplanation: "Moderate repetition. Demonstrates a preference for anti-Keynesian central asset paradigms."
    },
    alternativePerspectives: [
      {
        source: "International Labor Review",
        title: "The Wage-Squeeze and Inflation: Assessing Monetary Policy Impacts on Vulnerable Incomes",
        stance: "Labor-Scale Perspective",
        summary: "Argues that rapid interest hikes unevenly penalize lower-income earners via job losses and rental spikes while failing to address supply-side logistics pressure.",
        credibleUrlFallback: "https://ilo.org"
      }
    ]
  }
];

// Helper to calculate overall statistics
function computeDietSummary(items: any[]): any {
  if (items.length === 0) {
    return {
      overallScore: 100,
      diversityScore: 100,
      streakDays: 1,
      totalTime: 0,
      bubbleRisk: "Low",
      insights: ["Log your first article or tweet to compile your digital health insights!"]
    };
  }

  const totalTime = items.reduce((sum, item) => sum + item.timeSpent, 0);
  
  // High quality score is decremented by high bias and repetitive bubbles
  const averageBias = items.reduce((sum, item) => sum + item.biasAnalysis.biasScore, 0) / items.length;
  const averageBubble = items.reduce((sum, item) => sum + item.filterBubbleMetric.bubbleIndex, 0) / items.length;
  
  // Score out of 100
  const overallScore = Math.round(Math.max(15, 100 - (averageBias * 0.4 + averageBubble * 0.4)));

  // Diversity score is high if we have diverse categories, diverse platforms and low bubbles
  const uniqueCategories = new Set(items.map(i => i.category)).size;
  const categoryRatio = uniqueCategories / 8; // out of maximum 8
  const diversityScore = Math.round(Math.min(100, Math.max(20, (categoryRatio * 60) + (100 - averageBubble) * 0.4)));

  let bubbleRisk: 'Low' | 'Moderate' | 'High' = 'Low';
  if (averageBubble > 65) {
    bubbleRisk = 'High';
  } else if (averageBubble > 40) {
    bubbleRisk = 'Moderate';
  }

  // Generate automatic structured insights fallback
  const insights = [
    bubbleRisk === 'High' 
      ? 'Critical filter bubble detected. Over 50% of your items represent repetitive, polarized political viewpoints.'
      : 'Your information diversity is stable, but can be improved with wider exposure.',
    totalTime > 45 
      ? 'Screen exposure is elevated. You spent over 45 minutes on highly engaging social channels today.'
      : 'Good mental pacing. Content reading time is controlled below cognitive fatigue thresholds.',
    'Alternative views are recommended. Explore the perspective card options below to balance opinion streams.'
  ];

  return {
    overallScore,
    diversityScore,
    streakDays: 4,
    totalTime,
    bubbleRisk,
    insights
  };
}

// REST APIs

// 1. Get logged content
app.get("/api/content", (req, res) => {
  res.json({ items: contentItems });
});

// 2. Clear content logs
app.delete("/api/content", (req, res) => {
  contentItems = [];
  res.json({ success: true, message: "History cleared successfully", items: [] });
});

// 3. Delete specific content item
app.delete("/api/content/:id", (req, res) => {
  const { id } = req.params;
  contentItems = contentItems.filter(item => item.id !== id);
  res.json({ success: true, message: "Item removed", items: contentItems });
});

// 4. Analyze and Add content
app.post("/api/content", async (req, res) => {
  const { url, content, platform, timeSpent } = req.body;

  if (!content || content.trim().length === 0) {
    return res.status(400).json({ error: "Content field is required" });
  }

  const duration = parseInt(timeSpent, 10) || 5;

  // Safe fallback if raw Gemini setup is blank or local testing environment is active
  if (!ai) {
    // Generate a beautiful, smart simulation that is reactive to length and keywords
    const textLower = content.toLowerCase();
    let category: any = "General";
    let title = content.substring(0, 60) + (content.length > 60 ? "..." : "");

    if (textLower.includes("president") || textLower.includes("election") || textLower.includes("leftist") || textLower.includes("rightist") || textLower.includes("government")) {
      category = "Politics";
    } else if (textLower.includes("ai") || textLower.includes("gpt") || textLower.includes("computer") || textLower.includes("code")) {
      category = "Technology";
    } else if (textLower.includes("climate") || textLower.includes("eco") || textLower.includes("earth") || textLower.includes("warming")) {
      category = "Climate & Environment";
    } else if (textLower.includes("health") || textLower.includes("vaccine") || textLower.includes("wellness") || textLower.includes("fitness")) {
      category = "Health & Wellness";
    } else if (textLower.includes("stock") || textLower.includes("inflation") || textLower.includes("interest") || textLower.includes("rate")) {
      category = "Finance & Economy";
    } else if (textLower.includes("science") || textLower.includes("space") || textLower.includes("study") || textLower.includes("research")) {
      category = "Science";
    }

    const hasPolarizedKeywords = textLower.includes("hate") || textLower.includes("fake") || textLower.includes("disaster") || textLower.includes("destroy") || textLower.includes("conspiracy") || textLower.includes("wake up") || textLower.includes("ruined");
    const biasLevel = hasPolarizedKeywords ? "Polarized / Unbalanced" : "Neutral / Objective";
    const biasScore = hasPolarizedKeywords ? 72 : 15;
    const sentimentLabel = hasPolarizedKeywords ? "Negative" : "Neutral";
    const sentimentScore = hasPolarizedKeywords ? -0.7 : 0.0;
    const bubbleIndex = hasPolarizedKeywords ? 65 : 20;

    const newItem = {
      id: "sim-" + Math.random().toString(36).substr(2, 9),
      title: title,
      url: url || "https://veritasflow.io/simulated-source",
      content,
      platform: platform || "News Outlets",
      timeSpent: duration,
      category,
      timestamp: new Date().toISOString(),
      sentiment: {
        score: sentimentScore,
        label: sentimentLabel,
        emotionalImpact: hasPolarizedKeywords ? "High" : "Medium"
      },
      biasAnalysis: {
        biasLevel,
        biasScore,
        primaryFrame: hasPolarizedKeywords ? "Sensational Exposure" : "Standard Informational",
        explanation: "Simulated review profile: The analysis indicates " + (hasPolarizedKeywords ? "heavy emotive framing designed to drive clicks." : "a balanced, low-activation layout of information.")
      },
      filterBubbleMetric: {
        isRepetitive: hasPolarizedKeywords,
        bubbleIndex,
        bubbleRiskExplanation: "Simulated analysis determined this has a " + (hasPolarizedKeywords ? "moderate representation of common echoing circles." : "highly distinct and constructive path profile.")
      },
      alternativePerspectives: [
        {
          source: "Pragmatic Information Clearing",
          title: "Balanced counterpart to: " + title,
          stance: "Analytical Alternative",
          summary: "Provides an objective summary showing counter-arguments to " + title + " to help round out cognitive understanding, avoid confirmation loops, and lower screen fatigue.",
          credibleUrlFallback: "https://www.reuters.com"
        }
      ]
    };

    contentItems.unshift(newItem);
    return res.json({
      success: true,
      simulation: true,
      item: newItem,
      items: contentItems
    });
  }

  // Real Gemini Analysis Loop!
  try {
    const prompt = `
Analyze the following media content article or tweet details. Output ONLY a valid, parseable JSON block matching the requested structure below do not wrap block in markdown backticks or any introductory text.

JSON Schema format requested:
{
  "title": "A concise clear summary title of the article or tweet",
  "category": "Must be exactly one of: 'Politics', 'Technology', 'Science', 'Health & Wellness', 'Climate & Environment', 'Finance & Economy', 'Social Issues', 'Other'",
  "sentiment": {
    "score": -0.75, // float from -1.0 to +1.0
    "label": "Positive", "Negative", or "Neutral" based on tone,
    "emotionalImpact": "High", "Medium", or "Low" (based on clickbaitiness/outrage factor)
  },
  "biasAnalysis": {
    "biasLevel": "Must be exactly one of: 'Extreme Left', 'Left Leaning', 'Neutral / Objective', 'Right Leaning', 'Extreme Right', 'Polarized / Unbalanced'",
    "biasScore": 45, // integer 0 to 100 where 0 is pristine scientific objectivity, and 100 is extreme unproven propaganda
    "primaryFrame": "Two word label of their primary perspective framing (e.g. 'Conspiracy Outrage', 'Market Optimism', 'Scientific Progress')",
    "explanation": "A concise 1-2 sentence breakdown of the underlying framing or confirmation bias tricks used in this text"
  },
  "filterBubbleMetric": {
    "isRepetitive": true or false (is this a common viral polarizing filter-bubble topic?),
    "bubbleIndex": 60, // integer 0 to 100 scale of bubble severity
    "bubbleRiskExplanation": "One sentence describing why consuming too much of this exact theme risks trapping the user in a filter bubble or doom-loop."
  },
  "alternativePerspectives": [
    {
      "source": "A credible, world-renowned independent source or research body (e.g., Pew Research, Brookings, Nature, Cochrane collaboration, etc.)",
      "title": "An evocative counter-perspective or balanced explanatory headline",
      "stance": "Objective Counter-argument / Factual balance",
      "summary": "A highly factual and educational 2-sentence summary of alternative data or balanced viewpoints that completely disproves, balances, or provides vital healthy nuance to the original outrage framing.",
      "credibleUrlFallback": "A real representative URL like https://nature.com, https://reuters.com, or similar"
    }
  ]
}

Content to analyze:
"${content}"
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const outputText = response.text || "{}";
    const parsedData = JSON.parse(outputText.trim());

    const newItem = {
      id: "ai-" + Math.random().toString(36).substr(2, 9),
      title: parsedData.title || content.substring(0, 50) + "...",
      url: url || "https://veritasflow.io/analyzed-entry",
      content,
      platform: platform || "News Outlets",
      timeSpent: duration,
      category: parsedData.category || "General",
      timestamp: new Date().toISOString(),
      sentiment: parsedData.sentiment || { score: 0, label: "Neutral", emotionalImpact: "Medium" },
      biasAnalysis: parsedData.biasAnalysis || { biasLevel: "Neutral", biasScore: 10, primaryFrame: "None", explanation: "Analyzed successfully." },
      filterBubbleMetric: parsedData.filterBubbleMetric || { isRepetitive: false, bubbleIndex: 20, bubbleRiskExplanation: "Low bubble index." },
      alternativePerspectives: parsedData.alternativePerspectives || []
    };

    contentItems.unshift(newItem);
    res.json({
      success: true,
      simulation: false,
      item: newItem,
      items: contentItems
    });

  } catch (error: any) {
    console.error("Gemini Live Analysis Error:", error);
    res.status(500).json({ error: "Failed to perform AI analysis. " + error.message });
  }
});

// 5. Ask Information Diet Coach advice
app.post("/api/coaching-recommend", async (req, res) => {
  const { userQuestion } = req.body;

  if (!userQuestion || userQuestion.trim().length === 0) {
    return res.status(400).json({ error: "Question is required" });
  }

  const currentSummary = computeDietSummary(contentItems);

  // Fallback context string
  const currentLogsStr = contentItems.map((item, idx) => {
    return `[${idx+1}] TITLE: ${item.title} (Category: ${item.category}, Stance: ${item.biasAnalysis.biasLevel}, Sentiment: ${item.sentiment.label}, Platform: ${item.platform}, ScreenTime: ${item.timeSpent} mins)\nSNIPPET: ${item.content.substring(0, 150)}...\n`;
  }).join("\n");

  if (!ai) {
    // Generate a high fidelity interactive simulator answer
    let responseText = "### VeritasFlow AI Diet Coach\n\nYour current history indicates an overall Information Quality Score of **" + currentSummary.overallScore + "%** with a perspective diversity of **" + currentSummary.diversityScore + "%**.\n\nBased on your question: *\"" + userQuestion + "\"*, here are my core recommendations:\n\n1. **Inject Counter-Framing**: You have multiple logged items concerning " + (contentItems[0]?.category || "your current subjects") + " which are classified with elevated emotional biases. Practice active reading by spending 10 minutes checking the alternative perspectives card shown below.\n2. **Break Screen Addiction Traps**: You have high-dwell alerts on " + (contentItems[0]?.platform || "social media") + ". I suggest setting a hard block of 15 minutes of quiet time between scrolling sessions to recover cognitive dopamine balance.\n3. **Engage with Factual Pulses**: Replace high-arousal social threads with cold, curated scientific repositories once daily.\n\n*Coach tip:* VeritasFlow works best when you consciously pause prior to reacting. Have you clicked any alternative sources today?";
    return res.json({ advice: responseText, simulation: true });
  }

  try {
    const prompt = `
You are the VeritasFlow AI Information Diet Coach. Your objective is to help the user build conscious, constructive, and mentally-enriching media consumption habits, actively steering them away from doomsaying, echo bubbles, and cognitive fatigue.

Current Diet Metrics:
- Quality Score: ${currentSummary.overallScore}/100
- Perspective Diversity: ${currentSummary.diversityScore}/100
- Bubble Risk State: ${currentSummary.bubbleRisk}

Logged Information Feed History:
${currentLogsStr}

User Question:
"${userQuestion}"

Provide a highly polished, helpful, and empathetic response. Include:
1. Direct response to their concern using principles of digital psychology.
2. Direct references to specific topics or bias framing from their actual tracked logs to ground your advice.
3. 2-3 specific, actionable steps to cleanse their visual diet (e.g. cognitive breaks, reading balanced alternative frames).
Use elegant Markdown with bullet points. Avoid clinical or dramatic language; act like a thoughtful, humble wellness mentor. Keep the answer to about 250-300 words.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    res.json({ advice: response.text, simulation: false });
  } catch (error: any) {
    console.error("Coaching endpoint error:", error);
    res.status(500).json({ error: "Failed to connect to AI Coach. " + error.message });
  }
});

// 6. Direct Counter-Argument Explorer (Quick Search helper)
app.post("/api/alternative-lookup", async (req, res) => {
  const { topic } = req.body;

  if (!topic || topic.trim().length === 0) {
    return res.status(400).json({ error: "Topic is required" });
  }

  if (!ai) {
    return res.json({
      topic,
      sides: [
        {
          perspective: "Mainstream / Sensation Narrative",
          coreArguments: ["Relies on immediate fear responses", "Framed around emergency response constraints"],
          rebuttal: "Often overlooks underlying systemic or incremental structural data."
        },
        {
          perspective: "Balanced Alternative Frame",
          coreArguments: ["Emphasizes long-term policy adjustments", "Highlights cross-country statistical controls"],
          rebuttal: "May sometimes fail to register acute immediate stress impact on target demographics."
        }
      ],
      coachingAdvice: "Try to balance emotive claims with structural statistics.",
      simulation: true
    });
  }

  try {
    const prompt = `
The user is curious about the balanced arguments representing different sides of the following topic: "${topic}".
Generate a structured, unbiased evaluation of the major competing viewpoints. Include primary framings, key evidence each side uses, and a concise coaching tip on how to read about this without falling into confirmation loops.

Output the response in this clean JSON structure:
{
  "topic": "${topic}",
  "sides": [
    {
      "perspective": "Short title of Stance A (e.g. Keynesian Expansion)",
      "coreArguments": ["Bullet point detail 1", "Bullet point detail 2"],
      "rebuttal": "One sentence explaining standard limitation or valid critique of this stance"
    },
    {
      "perspective": "Short title of Stance B (e.g. Classical Monetarism)",
      "coreArguments": ["Bullet point detail 1", "Bullet point detail 2"],
      "rebuttal": "One sentence explaining standard limitation or valid critique of this stance"
    }
  ],
  "coachingAdvice": "One sentence of mental training advice on how to consume this topic safely."
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    res.json(JSON.parse((response.text || "{}").trim()));
  } catch (error: any) {
    res.status(500).json({ error: "Could not generate lookup. " + error.message });
  }
});

// 7. Core Summary route
app.get("/api/diet-summary", (req, res) => {
  const summary = computeDietSummary(contentItems);
  res.json(summary);
});


// FRONTEND SERVING

if (process.env.NODE_ENV !== "production") {
  createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  }).then((vite) => {
    app.use(vite.middlewares);
    
    // Fallback everything else to index.html in dev
    app.get("*", (req, res, next) => {
      res.sendFile(path.join(process.cwd(), "index.html"));
    });
    
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`[DEV SERVER] running on http://localhost:${PORT}`);
    });
  });
} else {
  // Serve static files in production
  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));
  
  // SPA fallback
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
  
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[PROD SERVER] running on port ${PORT}`);
  });
}
