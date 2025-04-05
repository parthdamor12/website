// Generate a temporary ID
const userId = Math.random().toString(36).substring(2, 10);
document.getElementById('userId').textContent = userId;

let userName = '';
let selectedFriend = null;
let messages = []; // Store messages in an array

// Simulated friends list
const fakeFriends = [
    { id: 'friend1', name: 'Amit' },
    { id: 'friend2', name: 'Priya' }
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
    
    const allFriends = [{ id: userId, name: userName }, ...fakeFriends];
    allFriends.forEach(friend => {
        if (friend.name) {
            const li = document.createElement('li');
            li.textContent = `${friend.name} (${friend.id})`;
            li.onclick = () => selectFriend(friend);
            friendsList.appendChild(li);
        }
    });
}

// Select a friend to chat with
function selectFriend(friend) {
    selectedFriend = friend;
    document.getElementById('chatWith').textContent = friend.name;
    renderMessages(); // Show existing messages for this friend
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

// Send message (simulated)
function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value;
    
    if (message && selectedFriend) {
        // Add your message to the array
        messages.push({ sender: 'You', text: message });
        renderMessages(); // Update chat display
        
        // Simulate a reply from the friend after 1 second
        setTimeout(() => {
            messages.push({ sender: selectedFriend.name, text: `Hi! You said: ${message}` });
            renderMessages(); // Update chat display again
        }, 1000);
        
        input.value = ''; // Clear input
    }
}

// Initial friends list update
updateFriendsList();
