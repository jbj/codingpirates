const storageKey = "codingpirates.github-vibecoding.steps.v1";
const checkboxes = [...document.querySelectorAll("[data-step]")];
const progress = document.querySelector("#progress");
const progressText = document.querySelector("#progress-text");
const progressMessage = document.querySelector("#progress-message");
const finishMessage = document.querySelector("#finish-message");
const storageStatus = document.querySelector("#storage-status");
const confetti = document.querySelector("#confetti");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const messages = [
  "Every great game starts with a first step.",
  "Your idea has a home. Onward!",
  "Your workshop is ready. Let’s power it up.",
  "Tools ready. Time for your first launch.",
  "It’s alive! Now give it something fun to do.",
  "One more mission: take your creation for a spin.",
  "All missions complete. You’re a game creator!",
];

try {
  const saved = JSON.parse(localStorage.getItem(storageKey) ?? "[]");
  if (Array.isArray(saved)) {
    for (const checkbox of checkboxes) {
      checkbox.checked = saved.includes(checkbox.dataset.step);
    }
  }
} catch {
  storageStatus.textContent = "Saved progress unavailable; you can still follow along";
}

function updateProgress() {
  const completed = checkboxes.filter((checkbox) => checkbox.checked).length;
  progress.value = completed;
  progress.textContent = `${completed} of ${checkboxes.length}`;
  progressText.textContent = `${completed} of ${checkboxes.length} missions complete`;
  progressMessage.textContent = messages[completed];
  finishMessage.hidden = completed !== checkboxes.length;
  for (const checkbox of checkboxes) {
    checkbox.closest(".mission").classList.toggle("is-complete", checkbox.checked);
  }
}

function celebrate() {
  if (reducedMotion.matches) return;
  confetti.replaceChildren();
  const colors = ["#6942ce", "#ffcf56", "#8abf50", "#e76894"];
  for (let index = 0; index < 45; index += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.backgroundColor = colors[index % colors.length];
    piece.style.animationDelay = `${Math.random() * 0.3}s`;
    piece.addEventListener("animationend", () => piece.remove(), { once: true });
    confetti.append(piece);
  }
}

for (const checkbox of checkboxes) {
  checkbox.addEventListener("change", () => {
    updateProgress();
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify(checkboxes.filter((step) => step.checked).map((step) => step.dataset.step)),
      );
      storageStatus.textContent = "Progress saved on this browser";
    } catch {
      storageStatus.textContent = "Storage unavailable — progress lasts until you leave this page";
    }
    if (checkbox.checked) celebrate();
  });
}

for (const button of document.querySelectorAll("[data-copy]")) {
  button.addEventListener("click", async () => {
    const text = document.getElementById(button.dataset.copy).textContent;
    const status = document.querySelector("#copy-status");
    try {
      await navigator.clipboard.writeText(text);
      status.textContent = button.dataset.copy === "commands"
        ? "Commands copied. Paste them into the Copilot App terminal."
        : "Prompt copied. Paste it into your repository’s Copilot chat.";
    } catch {
      status.textContent = "Clipboard unavailable. Select the text above and copy it manually.";
    }
  });
}

updateProgress();
