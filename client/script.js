document.addEventListener("DOMContentLoaded", function () {
  const chatBox = document.getElementById("chat-box");
  const userInput = document.getElementById("user-input");
  const sendBtn = document.getElementById("send-btn");
  const sendText = document.getElementById("send-text");
  const spinner = document.getElementById("loading-spinner");

  sendBtn.addEventListener("click", async function () {
    const userMessage = userInput.value.trim();
    if (!userMessage) return;

    disableInput();
    appendMessage(userMessage, true);
    userInput.value = "";

    try {
      const response = await fetch(`http://178.63.133.204:8084/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chat: userMessage }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from server");
      }

      const responseData = await response.json();
      const aiResponse = responseData.response;
      appendMessage(aiResponse, false);
    } catch (error) {
      console.error("Error:", error.message);
      appendMessage("An error occurred. Please try again.", false);
    } finally {
      enableInput();
    }
  });

  function disableInput() {
    userInput.disabled = true;
    sendText.classList.add("hidden");
    spinner.classList.remove("hidden");
  }

  function enableInput() {
    userInput.disabled = false;
    sendText.classList.remove("hidden");
    spinner.classList.add("hidden");
  }

  function appendMessage(message, isUser) {
    const messageDiv = document.createElement("div");
    const timestamp = new Date().toLocaleString();
    const label = isUser ? "User" : "AI";

    messageDiv.className = `message ${isUser ? "user" : "ai"} bg-${
      isUser ? "blue" : "gray"
    }-500 text-white rounded-lg p-2 mb-2`;
    messageDiv.innerHTML = `<span class="font-bold">${timestamp}</span><br><span class="font-bold">${label}: </span>${message}`;

    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
  }
});
