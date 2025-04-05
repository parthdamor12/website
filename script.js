// Generate a simple unique ID based on device data
const deviceData = navigator.userAgent;
const userId = btoa(deviceData).substring(0, 8); // Simple hash-like ID from device
document.getElementById('userId').textContent = userId;

let userName = 'Unknown';
let messages = sessionStorage.getItem('chatMessages') ? JSON.parse(sessionStorage.getItem('chatMessages')) : [];

// Simulated "unknown" users
const fakeUsers = [
    { id: 'unknown1', name: 'Stranger1' },
    { id: 'unknown2', name: 'Stranger2' }
];

// Random responses for simulation
const responses = [
    "Hey, what’s up?",
    "Cool, tell me more!",
    "Haha, nice one!",
    "What’s on your mind?",
    "Good to chat!"
];

// Update username
document.getElementById('userName').addEventListener('change', (e) => {
    userName = e.target.value || 'Unknown';
    renderMessages(); // Refresh chat with new name
});

// Render messages
function renderMessages() {
    const messagesDiv = document.getElementById('messages');
    messagesDiv.innerHTML = '';
    messages.forEach(msg => {
        messagesDiv.innerHTML += `<p>${msg.sender}: ${msg.text}</p>`;
    });
    messagesDiv.scrollTop = messagesDiv.scrollHeight; // Auto-scroll to bottom
    sessionStorage.setItem('chatMessages', JSON.stringify(messages)); // Store in session
}

// Send message
function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value;
    
    if (message) {
        // Add your message
        messages.push({ sender: userName, text: message });
        renderMessages();
        
        // Simulate a random "unknown" user replying
        setTimeout(() => {
            const randomUser = fakeUsers[Math.floor(Math.random() * fakeUsers.length)];
            const response = `${responses[Math.floor(Math.random() * responses.length)]}`;
            messages.push({ sender: randomUser.name, text: response });
            renderMessages();
        }, 1000 + Math.random() * 2000); // Reply after 1-3 seconds
        
        input.value = '';
    }
}

// Simulate random messages from "unknown" users
setInterval(() => {
    const randomUser = fakeUsers[Math.floor(Math.random() * fakeUsers.length)];
    const randomMsg = responses[Math.floor(Math.random() * responses.length)];
    messages.push({ sender: randomUser.name, text: randomMsg });
    renderMessages();
}, 7000); // Every 7 seconds

// Initial render
renderMessages();
