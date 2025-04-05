// Generate a temporary ID
const userId = Math.random().toString(36).substring(2, 10);
document.getElementById('userId').textContent = userId;

let userName = '';
let selectedFriend = null;

// Simulated friends list (since no backend)
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
    
    // Add current user and fake friends
    const allFriends = [{ id: userId, name: userName }, ...fakeFriends];
    allFriends.forEach(friend => {
        if (friend.name) { // Only show if name exists
            const li = document.createElement('li');
            li.textContent = `${friend.name} (${friend.id})`;
            li.onclick = () => selectFriend(friend);
            friendsList.appendChild(li);
        }
    });
}

// Select a friend to "chat" with
function selectFriend(friend) {
    selectedFriend = friend;
    document.getElementById('chatWith').textContent = friend.name;
    document.getElementById('messages').innerHTML = ''; // Clear previous chat
}

// Send message (simulated)
function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value;
    const messages = document.getElementById('messages');
    
    if (message && selectedFriend) {
        // Show your message
        messages.innerHTML += `<p>You: ${message}</p>`;
        
        // Simulate a reply from the selected friend after 1 second
        setTimeout(() => {
            messages.innerHTML += `<p>${selectedFriend.name}: Hi! You said: ${message}</p>`;
            messages.scrollTop = messages.scrollHeight;
        }, 1000);
        
        messages.scrollTop = messages.scrollHeight;
        input.value = '';
    }
}

// Initial friends list update
updateFriendsList();
