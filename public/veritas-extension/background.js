// VeritasFlow - Background Service Worker

let activeTabId = null;
let activeTabStartTime = Date.now();
let activeTabUrl = "";
let activeTabTitle = "";

// Default backend API endpoint (can be edited from the popup)
const DEFAULT_API_URL = "http://localhost:3000";

// Helper to determine if a URL is a trackable news/opinion website
function isTrackableUrl(url) {
  if (!url) return false;
  const lower = url.toLowerCase();
  
  // Skip browser internals and blank settings pages
  if (lower.startsWith("chrome://") || 
      lower.startsWith("chrome-extension://") || 
      lower.startsWith("about:") || 
      lower.startsWith("edge://") ||
      lower.startsWith("localhost") ||
      lower.startsWith("http://localhost")) {
    return false;
  }
  return lower.startsWith("http://") || lower.startsWith("https://");
}

// Track tab activation switches
chrome.tabs.onActivated.addListener((activeInfo) => {
  handleTabChange(activeInfo.tabId);
});

// Track page content reloads/navigation updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tabId === activeTabId) {
    handleTabChange(tabId);
  }
});

// Process dwell time computation on tab changes
function handleTabChange(newTabId) {
  const now = Date.now();
  const timeDifferenceInSeconds = Math.round((now - activeTabStartTime) / 1000);

  // If previous tab was a trackable article, flush its metrics to the database
  if (timeDifferenceInSeconds >= 5 && isTrackableUrl(activeTabUrl)) {
    saveReadingTelemetry(activeTabUrl, activeTabTitle, timeDifferenceInSeconds);
  }

  // Reset counters for the new tab focus
  chrome.tabs.get(newTabId, (tab) => {
    if (chrome.runtime.lastError || !tab) {
      activeTabId = null;
      activeTabUrl = "";
      activeTabTitle = "";
      return;
    }

    activeTabId = newTabId;
    activeTabStartTime = Date.now();
    activeTabUrl = tab.url;
    activeTabTitle = tab.title;

    console.log(`Focus shifted to: ${tab.title} (${tab.url})`);
  });
}

// Extract content and post to VeritasFlow's Express server API
async function saveReadingTelemetry(url, title, timeSpent) {
  chrome.storage.local.get(["backendUrl", "customPlatform"], async (settings) => {
    const apiServer = settings.backendUrl || DEFAULT_API_URL;
    const platform = settings.customPlatform || getPlatformNameFromUrl(url);

    // Prepare content payload mock for browser extension automation
    // For the hackathon, we fetch the title and clean text to execute auto-classification
    const cleanContent = `This is a trackable session on ${title}. The user browsed and read this specific webpage. Simulated grab was linked through extension. Context: ${url}`;

    const payload = {
      url: url,
      title: title,
      content: cleanContent,
      platform: platform,
      timeSpent: timeSpent
    };

    console.log("Posting extension log to VeritasFlow server:", payload);

    try {
      const response = await fetch(`${apiServer}/api/content`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Telemetry accepted by central engine:", result);
        
        // Save to extension history log so popup can show recent items
        chrome.storage.local.get({ historyLogs: [] }, (data) => {
          const logs = data.historyLogs;
          logs.unshift({
            url: url,
            title: title,
            timeSpent: timeSpent,
            timestamp: new Date().toISOString()
          });
          // Limit to last 15 items in storage
          chrome.storage.local.set({ historyLogs: logs.slice(0, 15) });
        });
      } else {
        console.error("API server rejected request:", response.statusText);
      }
    } catch (err) {
      console.warn("Connection with VeritasFlow central backend failed. Make sure server is running on port 3000.", err);
    }
  });
}

// Utility to parse human readable labels
function getPlatformNameFromUrl(url) {
  try {
    const domain = new URL(url).hostname.replace("www.", "");
    if (domain.includes("twitter.com") || domain.includes("x.com")) return "X / Twitter";
    if (domain.includes("reddit.com")) return "Reddit";
    if (domain.includes("medium.com")) return "Medium / Blogs";
    if (domain.includes("facebook.com")) return "Facebook";
    if (domain.includes("youtube.com")) return "YouTube";
    return domain;
  } catch (e) {
    return "Web Articles";
  }
}

// Listen for messages from popup or content script triggers
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getCurrentTabStatus") {
    // Return tracking information
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs[0]) {
        const tab = tabs[0];
        const currentDuration = Math.round((Date.now() - activeTabStartTime) / 1000);
        sendResponse({
          url: tab.url,
          title: tab.title,
          activeDuration: isTrackableUrl(tab.url) ? currentDuration : 0,
          isTrackable: isTrackableUrl(tab.url)
        });
      } else {
        sendResponse({ isTrackable: false });
      }
    });
    return true; // async compliance
  }

  if (request.action === "triggerManualAudit") {
    // Send telemetry instantly on demand
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs[0] && isTrackableUrl(tabs[0].url)) {
        const currentDuration = Math.round((Date.now() - activeTabStartTime) / 1000);
        saveReadingTelemetry(tabs[0].url, tabs[0].title, Math.max(5, currentDuration))
          .then(() => {
            sendResponse({ success: true, message: "Telemetry pushed to dashboard!" });
            // reset start timer to present
            activeTabStartTime = Date.now();
          })
          .catch((err) => {
            sendResponse({ success: false, error: err.message });
          });
      } else {
        sendResponse({ success: false, message: "This URL is not trackable." });
      }
    });
    return true; // async compliance
  }
});
