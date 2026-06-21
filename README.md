# VeritasFlow 🧠

**VeritasFlow** is an AI-powered Information Diet Coach that helps users consume information consciously rather than compulsively. It tracks reading habits, analyzes sentiment and bias using Gemini, detects filter bubbles, and recommends balanced perspectives to promote healthier information consumption.

## 🚀 Key Features

* 🌐 **Browser Activity Tracking** – Monitor reading habits and active dwell time through a Chrome Extension.
* 🤖 **Gemini-Powered NLP Analysis** – Analyze article sentiment, emotional tone, topics, and bias.
* 📊 **Filter Bubble Detection** – Identify repetitive information patterns and calculate a Bubble Risk Score.
* 📰 **Balanced Recommendations** – Suggest credible alternative viewpoints from trusted sources.
* 📈 **Interactive Dashboard** – Visualize reading diversity, sentiment trends, and wellness insights in real time.

## 🏗️ Architecture

```text
Active Browser Tab
        │
        ▼
Chrome Extension
        │
        ▼
Express.js Backend API
        │
        ▼
Google Gemini AI
        │
        ▼
Analytics Dashboard
```

The Chrome Extension collects browsing telemetry such as URL, page title, and reading duration. Data is securely sent to the backend API, where Gemini performs sentiment analysis, topic classification, and bias detection. The results are then visualized in an interactive dashboard.

## 🛠️ Tech Stack

### Frontend

* React.js
* Tailwind CSS
* Recharts

### Backend

* Node.js
* Express.js

### AI

* Google Gemini API
* Prompt Engineering

### Browser Extension

* Chrome Extension Manifest V3
* Service Workers

### Deployment

* Google Cloud Run
* Firebase Hosting

## 🔌 API Endpoints

| Endpoint            | Method | Description                           |
| ------------------- | ------ | ------------------------------------- |
| `/api/content`      | GET    | Fetch analyzed reading history        |
| `/api/content`      | POST   | Analyze and store a reading session   |
| `/api/content/:id`  | DELETE | Delete a specific record              |
| `/api/content`      | DELETE | Clear all records                     |
| `/api/diet-summary` | GET    | Get overall information diet insights |

## 🧩 Chrome Extension Setup

1. Open **chrome://extensions/**
2. Enable **Developer Mode**
3. Click **Load Unpacked**
4. Select the `veritas-extension` folder
5. Open the extension and configure the backend URL
6. Start browsing and run audits in real time

## 🎯 Use Case

Imagine reading multiple articles from similar viewpoints every day.

VeritasFlow detects:

* Overexposure to a single perspective
* Emotional or sensational content
* Low diversity in information sources

It then recommends balanced and credible alternatives to help users maintain a healthier and more informed information diet.

## 🔮 Future Improvements

* Voice-based news summaries
* Multi-language support
* Personalized wellness coaching
* Social media feed analysis
* Mobile application support
* AI-powered misinformation detection

## ❤️ Made By Tanya 

Built with passion for promoting healthier digital habits.

Powered by:

* Google Gemini
* Google Cloud
* React
* Express.js
* Chrome Extensions

✨ *Consume information consciously, not compulsively.*
