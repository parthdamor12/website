// Generate a temporary ID
const userId = Math.random().toString(36).substring(2, 10);
document.getElementById('userId').textContent = userId;

let userName = '';
let selectedFriend = null;
let messages = []; // Store messages in an array

// Simulated friends list with "online" status
const fakeFriends = [
    { id: 'friend1', name: 'Amit', online: true },
    { id: 'friend2', name: 'Priya', online: true }
];

// Random responses for simulation
const friendResponses = [
    "Hey, how’s it going?",
    "Cool, tell me more!",
    "Haha, that’s funny!",
    "What do you think about this?",
    "Nice to chat with you!"
];

// Update username
document.getElementById('userName').addEventListener('change', (e) => {
    userName = e.target.value || 'Anonymous';
    updateFriendsList();
});

// Update friends list
function updateFriendsList() {
    const friendsList = document.getElementById('friendsList');
    friendsList.innerHTML = '';
    
    const allFriends = [{ id: userId, name: userName, online: true }, ...fakeFriends];
    allFriends.forEach(friend => {
        if (friend.name) {
            const li = document.createElement('li');
            li.textContent = `${friend.name} (${friend.id}) ${friend.online ? '[Online]' : '[Offline]'}`;
            li.onclick = () => selectFriend(friend);
            friendsList.appendChild(li);
        }
    });
}

// Select a friend to chat with
function selectFriend(friend) {
    if (friend.online) {
        selectedFriend = friend;
        document.getElementById('chatWith').textContent = friend.name;
        renderMessages(); // Show existing messages for this friend
        
        // Start simulating friend messages if not already started
        if (!friend.chatInterval) {
            friend.chatInterval = setInterval(() => simulateFriendMessage(), 5000); // Every 5 seconds
        }
    } else {
        alert(`${friend.name} is offline and can't chat right now!`);
    }
}

// Render messages in the chat box
function renderMessages() {
    const messagesDiv = document.getElementById('messages');
    messagesDiv.innerHTML = ''; // Clear current display
    messages.forEach(msg => {
        messagesDiv.innerHTML += `<p>${msg.sender}: ${msg.text}</p>`;
    });
    messagesDiv.scrollTop = messagesDiv.scrollHeight; // Auto-scroll to bottom
}

// Send message
function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value;
    
    if (message && selectedFriend && selectedFriend.online) {
        // Add your message to the array
        messages.push({ sender: 'You', text: message });
        renderMessages(); // Update chat display
        
        // Simulate a reply from the friend after 1-2 seconds
        setTimeout(() => {
            const response = `Hi! You said "${message}", right? ${friendResponses[Math.floor(Math.random() * friendResponses.length)]}`;
            messages.push({ sender: selectedFriend.name, text: response });
            renderMessages(); // Update chat display again
        }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
        
        input.value = ''; // Clear input
    }
}

// Simulate random messages from the selected friend
function simulateFriendMessage() {
    if (selectedFriend && selectedFriend.online) {
        const randomMsg = friendResponses[Math.floor(Math.random() * friendResponses.length)];
        messages.push({ sender: selectedFriend.name, text: randomMsg });
        renderMessages(); // Update chat display
    }
}

// Initial friends list update
updateFriendsList();
