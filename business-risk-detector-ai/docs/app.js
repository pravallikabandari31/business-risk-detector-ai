const form = document.getElementById("chatForm");
const input = document.getElementById("messageInput");
const messages = document.getElementById("messages");
const sendBtn = document.getElementById("sendBtn");
const suggestions = document.getElementById("suggestions");
const clearBtn = document.getElementById("clearBtn");
const newChatBtn = document.getElementById("newChatBtn");

const welcomeMessage = "Hi there! I'm your business risk assistant.\n\nTell me what's happening in your business, and I'll help you identify potential risks, understand warning signs, and plan practical next steps.\n\nFor your privacy, please don't include passwords, payment details, or confidential customer information.";

function addMessage(text, who, options = {}) {
  const article = document.createElement("article");
  article.className = `message ${who}`;

  const avatar = document.createElement("div");
  avatar.className = "message-avatar";
  avatar.textContent = who === "assistant" ? "✦" : "YOU";

  const body = document.createElement("div");
  body.className = "message-body";
  const meta = document.createElement("div");
  meta.className = "message-meta";
  const name = document.createElement("strong");
  name.textContent = who === "assistant" ? "Riskwise AI" : "You";
  const time = document.createElement("time");
  time.textContent = options.pending ? "Working…" : "Just now";
  meta.append(name, time);

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  const paragraph = document.createElement("p");
  paragraph.textContent = text;
  bubble.appendChild(paragraph);
  body.append(meta, bubble);
  article.append(avatar, body);
  messages.appendChild(article);
  messages.scrollTop = messages.scrollHeight;
  return article;
}

function resetConversation(message = "Screen cleared. Start a fresh analysis whenever you're ready.") {
  messages.replaceChildren();
  addMessage(message, "assistant");
  suggestions.hidden = false;
  input.value = "";
  input.style.height = "auto";
  input.focus();
}

async function sendMessage(message) {
  const trimmed = message.trim();
  if (!trimmed || sendBtn.disabled) return;

  addMessage(trimmed, "user");
  input.value = "";
  input.style.height = "auto";
  suggestions.hidden = true;
  sendBtn.disabled = true;
  sendBtn.querySelector("span").textContent = "Analyzing…";
  const pending = addMessage("Reviewing the situation and preparing practical next steps…", "assistant", { pending: true });
  const pendingText = pending.querySelector(".bubble p");

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: trimmed })
    });
    let data;
    try {
      data = await response.json();
    } catch {
      throw new Error("The server returned an unreadable response.");
    }
    if (!response.ok) {
      const detail = typeof data.detail === "string" ? data.detail : "Please check the server and try again.";
      throw new Error(detail);
    }
    pendingText.textContent = data.reply || "No response received. Please try asking in a different way.";
    pending.querySelector("time").textContent = "Just now";
  } catch (error) {
    pendingText.textContent = error.message === "Failed to fetch"
      ? "Couldn't connect to the backend. Make sure the FastAPI server is running, then refresh this page and try again."
      : `I couldn't complete that request. ${error.message || "Please check the backend configuration and try again."}`;
    pending.querySelector("time").textContent = "Connection notice";
  } finally {
    sendBtn.disabled = false;
    sendBtn.querySelector("span").textContent = "Analyze risk";
    input.focus();
    messages.scrollTop = messages.scrollHeight;
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  sendMessage(input.value);
});

input.addEventListener("input", () => {
  input.style.height = "auto";
  input.style.height = `${Math.min(input.scrollHeight, 130)}px`;
});

input.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    form.requestSubmit();
  }
});

document.querySelectorAll(".prompt-card").forEach((button) => {
  button.addEventListener("click", () => sendMessage(button.dataset.prompt || ""));
});

clearBtn.addEventListener("click", () => resetConversation());
newChatBtn.addEventListener("click", () => resetConversation("New analysis started. Tell me about a business situation you'd like to assess."));

// Intentionally do not use localStorage, sessionStorage, IndexedDB, or cookies for chat history.
