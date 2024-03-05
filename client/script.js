document.addEventListener("DOMContentLoaded", function() {
    const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");
    const sendBtn = document.getElementById("send-btn");

    sendBtn.addEventListener("click", async function() {
        const userMessage = userInput.value.trim();
        if (!userMessage) return;

        appendMessage(userMessage, true);
        userInput.value = "";

        try {
            const response = await fetch("http://localhost:8000/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ chat: userMessage })
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
        }
    });

    function appendMessage(message, isUser) {
        const messageDiv = document.createElement("div");
        messageDiv.className = isUser ? "message user" : "message ai";
        messageDiv.textContent = message;
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }
});
