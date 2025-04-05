// Get DOM elements
const chatbox = document.getElementById("chatbox");
const messageInput = document.getElementById("message");

// Function to send a message
function sendMessage() {
    const message = messageInput.value.trim();
    if (message !== "") {
        // Store message in localStorage
        let messages = JSON.parse(localStorage.getItem("messages")) || [];
        messages.push(message);
        localStorage.setItem("messages", JSON.stringify(messages));
        
        // Display message in chatbox
        displayMessages();
        
        // Clear input field
        messageInput.value = "";
    }
}

// Function to display messages
function displayMessages() {
    chatbox.innerHTML = "";
    let messages = JSON.parse(localStorage.getItem("messages")) || [];
    messages.forEach(msg => {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message");
        messageDiv.innerText = msg;
        chatbox.appendChild(messageDiv);
    });
}

// Function to clear chat
function clearChat() {
    localStorage.removeItem("messages");
    displayMessages();
}

// Load existing messages from localStorage on page load
window.onload = function() {
    displayMessages();
};
