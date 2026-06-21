// VeritasFlow Content Script

// This script runs silently in context of visited tabs 
// to assist in reading paragraph density and triggers raw text summary parses.
console.log("VeritasFlow cognitive monitoring active on this tab.");

// Detect when page text is copied or read for fine-grained dwell metrics
document.addEventListener("copy", () => {
  console.log("Veritas-Shield: User highlighted and recorded opinion statement.");
});
