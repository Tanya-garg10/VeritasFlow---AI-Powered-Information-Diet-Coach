// VeritasFlow Popup script

document.addEventListener("DOMContentLoaded", () => {
  const currentTitleEl = document.getElementById("current-title");
  const currentDwellEl = document.getElementById("current-dwell");
  const currentStatusEl = document.getElementById("current-status");
  const auditBtn = document.getElementById("audit-btn");
  const backendInput = document.getElementById("backend-input");
  const successAlert = document.getElementById("success-alert");
  const logsListEl = document.getElementById("logs-list");

  // Load saved backend URL config or fallback to default localhost
  chrome.storage.local.get(["backendUrl", "historyLogs"], (data) => {
    if (data.backendUrl) {
      backendInput.value = data.backendUrl;
    } else {
      // Safely default to the local sandbox or let user supply custom host
      backendInput.placeholder = "http://localhost:3000";
    }

    // Load recent history items
    if (data.historyLogs && data.historyLogs.length > 0) {
      renderRecentLogs(data.historyLogs);
    }
  });

  // Track key strikes inside backend input to save on the fly
  backendInput.addEventListener("input", () => {
    const val = backendInput.value.trim();
    if (val) {
      chrome.storage.local.set({ backendUrl: val });
    } else {
      chrome.storage.local.remove("backendUrl");
    }
  });

  // Query background worker for current tab state
  function updateTabState() {
    chrome.runtime.sendMessage({ action: "getCurrentTabStatus" }, (response) => {
      if (chrome.runtime.lastError || !response) {
        currentTitleEl.textContent = "Inactive Browser Tab";
        currentStatusEl.textContent = "Unbounded";
        return;
      }

      if (response.isTrackable) {
        currentTitleEl.textContent = response.title || "Active Webpage";
        currentDwellEl.textContent = response.activeDuration + "s";
        currentStatusEl.textContent = "Eligible (Active telemetry enabled)";
        currentStatusEl.style.color = "#34d399";
        auditBtn.disabled = false;
        auditBtn.style.opacity = "1";
      } else {
        currentTitleEl.textContent = response.title ? response.title.substring(0, 30) + "..." : "System Utilities";
        currentDwellEl.textContent = "0s";
        currentStatusEl.textContent = "Skipped (Static or restricted protocols)";
        currentStatusEl.style.color = "#94a3b8";
        auditBtn.disabled = true;
        auditBtn.style.opacity = "0.4";
      }
    });
  }

  // Poll state every 1 second to make dwell counter look absolutely real and active!
  updateTabState();
  const stateInterval = setInterval(updateTabState, 1000);

  // Handle cognitive check integration
  auditBtn.addEventListener("click", () => {
    auditBtn.disabled = true;
    auditBtn.textContent = "⏳ ANALYZING BIAS SPECTRUM...";

    chrome.runtime.sendMessage({ action: "triggerManualAudit" }, (response) => {
      if (response && response.success) {
        // Display toast alert
        showNotice("Audit dispatched to VeritasFlow central!");
        
        // Reload locally stored logs after a slight delay
        setTimeout(() => {
          chrome.storage.local.get("historyLogs", (data) => {
            if (data.historyLogs) {
              renderRecentLogs(data.historyLogs);
            }
          });
        }, 1200);
      } else {
        showNotice("Could not send data: " + (response?.message || "Verify API server is running on port 3000."));
      }

      // Reset button
      auditBtn.disabled = false;
      auditBtn.textContent = "⚡ RUN CONSCIOUS COGNITIVE AUDIT";
    });
  });

  // Helper notice display
  function showNotice(msg) {
    successAlert.textContent = msg;
    successAlert.style.display = "block";
    setTimeout(() => {
      successAlert.style.display = "none";
    }, 4000);
  }

  // Render logs nicely
  function renderRecentLogs(logs) {
    if (logs.length === 0) return;
    logsListEl.innerHTML = "";
    
    logs.slice(0, 5).forEach((item) => {
      const row = document.createElement("div");
      row.className = "log-item";
      
      const titleSpan = document.createElement("span");
      titleSpan.className = "log-title";
      titleSpan.textContent = item.title;
      titleSpan.title = item.url;

      const timeSpan = document.createElement("span");
      timeSpan.className = "log-time";
      timeSpan.textContent = `${item.timeSpent}s`;

      row.appendChild(titleSpan);
      row.appendChild(timeSpan);
      logsListEl.appendChild(row);
    });
  }

  // Clear interval on unload
  window.addEventListener("unload", () => {
    clearInterval(stateInterval);
  });
});
