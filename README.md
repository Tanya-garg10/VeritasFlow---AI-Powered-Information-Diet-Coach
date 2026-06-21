# VeritasFlow — Information Diet Coach (Hackathon Edition)

VeritasFlow is a full-stack mental well-being platform designed to help users consume information **consciously, not compulsively**. It automatically logs reading sources, performs advanced NLP analysis to extract biases/sentiments, calculates filter bubble danger scores, and suggests balanced alternative reading paths.

This workspace comes equipped with a **fully functional, production-ready Chrome Browser Extension template** that judges and developers can install and run live against the backend!

---

## 🚀 How It Works (Step-by-Step Architecture)

The system is built on a server-proxy architecture to ensure complete secrecy of NLP API keys:

```
[ Active Browser Tab ] 
         │
         ▼ (Dwell time & URL tracking)
[ Chrome Extension Node ] ────(POST /api/content)───► [ Central Express Server ]
                                                              │
                                                              ▼ (Bi-directional NLP Parse)
                                                      [ Gemini AI Engine Node ]
                                                              │ (Classifies, sentiment, alerts)
                                                              ▼
                                                      [ Recharts Dashboard State ]
```

### 1. Client-Side Telemetry Tracking
As you browse the web, the **VeritasFlow Chrome Extension background service worker** calculates your active dwell time and tracks your current URL, title, and page content context. It filters out non-content URLs (like search consoles, extension setups, or blank pages) automatically.

### 2. Backend Semantic Pipeline (`/api/content`)
When a reading session concludes (or you press **Run Audit** inside the extension popup), the extension triggers a background payload to your VeritasFlow API instance:
- **Topic Classification**: Groups the raw article content into high-level categories (`Politics`, `Technology`, `Science`, `Finance & Economy`, `Health & Wellness`).
- **Sentiment & Emotional Analysis**: Determines the article frame valence (`Positive`, `Negative`, `Neutral`) & detects emotional agitation spikes (`High`, `Medium`, `Low`).
- **Bias Score Computation**: Dynamically scores polarization levels based on linguistic frames.

### 3. Filter Bubble Risk Analysis
The backend executes a specialized statistical analysis:
- **Perspective Diversity Score**: Measures standard unique topic distributions against total reading history logs.
- **Bubble Index Formula**: Cross-references repetitive ideological consumption patterns (e.g., repeating similar biases without refreshing contrast positions).
- **Auto-insights Generation**: Displays immediate diagnostic wellness alerts.

### 4. Counter-Perspective Recommendations
If you are identified as being inside a bubble (e.g., high bias or low source diversity), the system suggests highly credible, neutral, or counter-view articles (e.g., *BBC News*, *Reuters*, *The Economist*, or *World Health Organization Reports*) with customized comparative stance overviews to restore mental equilibrium.

---

## 🛠️ Step-by-Step: Loading & Running the Chrome Extension

To demonstrate real-time browser tracking and AI auditing in your live project demo, follow these setup steps:

### Step 1: Download the Extension Files
The workspace has pre-configured everything. You can find ready-to-run Extension files ready in the following directory of your exported zip file:
```text
/public/veritas-extension/
  ├── manifest.json   (V3 Config & Permissions)
  ├── background.js   (Background Dwell counter & Post payload service)
  ├── content.js      (Document interaction listener)
  ├── popup.html      (Gorgeous dark slate visual popup interface)
  ├── popup.js        (Connection switcher & Manual Trigger utility)
  └── icon.jpg        (Abstract vector logo generated dynamically)
```

### Step 2: Load into Google Chrome
1. Open your Google Chrome browser and navigate to: `chrome://extensions/`
2. At the top-right corner, toggle the **"Developer mode"** switch to **ON**.
3. On the top-left, click the **"Load unpacked"** button.
4. Select the directory `/public/veritas-extension/` (or the folder from your exported zip codebase).
5. The extension is now loaded and visible in your browser toolbar!

### Step 3: Core Connection Syncing
- Open the extension popup from your browser toolbar.
- In the **Server Sync Configuration** field:
  - For local desktop runs, use: `http://localhost:3000`
  - For live share previews or containers, paste your **Shared App URL** or **Development App URL** (e.g. `https://ais-dev-...` shown in your AI Studio panel).
- The extension will automatically route all captured dwell events instantly to that live backend instance, popping up fresh data inside your dashboard!

---

## 🔗 Main API Endpoints Summary

All routes are fully configured with CORS origin exception configurations to allow the Extension to post data effortlessly:

| Endpoint | Method | Payload | Function |
| :--- | :--- | :--- | :--- |
| `/api/content` | `GET` | *None* | Retrieves the current list of audited articles and bias evaluations. |
| `/api/content` | `POST` | `{ "url": "string", "title": "string", "content": "string", "platform": "string", "timeSpent": 30 }` | Triggers immediate Gemini NLP evaluation, updates bias scoring, and registers the session. |
| `/api/content/:id` | `DELETE`| *None* | Purges a specific audit item from history. |
| `/api/content` | `DELETE`| *None* | Clears all cached telemetry items to reset the metrics dashboard. |
| `/api/diet-summary`| `GET` | *None* | Re-evaluates logs to return overall health index scores, variety graphs, and wellness insights. |

---

## 🏆 Stand Out in the Hackathon
By launching your live app and loading this unpacked extension on screen, you can open any news site (e.g. BBC, CNN, or Wikipedia) and hit **⚡ Run Audit**. Show the judges how the item appears on your VeritasFlow web dashboard in real time, with automatic Recharts graphs, custom sentiment indicators, and tailored AI alternative views! This full-stack real-time flow is a guaranteed hackathon winner.
