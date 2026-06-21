export interface SentimentAnalysis {
  score: number; // -1 to +1
  label: 'Positive' | 'Negative' | 'Neutral';
  emotionalImpact: 'High' | 'Medium' | 'Low';
}

export interface BiasAnalysis {
  biasLevel: 'Extreme Left' | 'Left Leaning' | 'Neutral / Objective' | 'Right Leaning' | 'Extreme Right' | 'Polarized / Unbalanced';
  biasScore: number; // 0 (unbiased) to 100 (heavily polarized)
  primaryFrame: string; // e.g. "Sensationalist", "Doom-mongering", "Alternative-skeptic"
  explanation: string;
}

export interface FilterBubbleMetric {
  isRepetitive: boolean;
  bubbleIndex: number; // 0 to 100 scale of bubble severity
  bubbleRiskExplanation: string;
}

export interface AlternativePerspective {
  source: string;
  title: string;
  stance: string;
  summary: string;
  credibleUrlFallback: string;
}

export interface ContentItem {
  id: string;
  title: string;
  url: string;
  content: string;
  platform: 'X / Twitter' | 'Reddit' | 'YouTube' | 'News Outlets' | 'Medium / Blogs' | 'Other';
  timeSpent: number; // in minutes
  category: 'Politics' | 'Technology' | 'Science' | 'Health & Wellness' | 'Climate & Environment' | 'Finance & Economy' | 'Social Issues' | 'Other';
  timestamp: string; // ISO string
  sentiment: SentimentAnalysis;
  biasAnalysis: BiasAnalysis;
  filterBubbleMetric: FilterBubbleMetric;
  alternativePerspectives: AlternativePerspective[];
}

export interface DietSummary {
  overallScore: number; // 0 to 100 information quality score
  diversityScore: number; // 0 to 100 perspective diversity
  streakDays: number;
  totalTime: number; // aggregate minutes
  bubbleRisk: 'Low' | 'Moderate' | 'High';
  insights: string[]; // key wellness recommendations
}
