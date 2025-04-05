// Generate or retrieve a fixed unique ID
let userId = localStorage.getItem('userId');
if (!userId) {
    userId = crypto.randomUUID ? crypto.randomUUID().substring(0, 8) : `${Date.now()}${Math.random().toString(36).substring(2, 5)}`;
    localStorage.setItem('userId', userId);
}
document.getElementById('userId').textContent = userId;

let userName = 'Unknown';
let messages = sessionStorage.getItem('chatMessages') ? JSON.parse(sessionStorage.getItem('chatMessages')) : [];
let peer = new Peer(userId, { host: 'peerjs-server.herokuapp.com', secure: true, port: 443 });
let connections = {};
let selectedFriendId = null;

// Update username
document.getElementById('userName').addEventListener('change', (e) => {
    userName = e.target.value || 'Unknown';
    updateFriendsList();
});

// When peer is ready
peer.on('open', () => {
    console.log('Peer ID:', userId);
    updateFriendsList();
});

// Handle incoming connections
peer.on('connection', (conn) => {
    connections[conn.peer] = conn;
    conn.on('data', (data) => {
        messages.push({ sender: conn.metadata.name || 'Unknown', text: data });
        renderMessages();
    });
    updateFriendsList();
});

// Render messages
function renderMessages() {
    const messagesDiv = document.getElementById('messages');
    messagesDiv.innerHTML = '';
    messages.forEach(msg => {
        messagesDiv.innerHTML += `<p>${msg.sender}: ${msg.text}</p>`;
    });
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
    sessionStorage.setItem('chatMessages', JSON.stringify(messages));
}

// Update friends list
function updateFriendsList() {
    const friendsList = document.getElementById('friendsList');
    friendsList.innerHTML = '';
    Object.keys(connections).forEach(friendId => {
        const li = document.createElement('li');
        const friendName = connections[friendId].metadata?.name || 'Unknown';
        li.textContent = `${friendName} (${friendId})`;
        li.onclick = () => selectFriend(friendId);
        friendsList.appendChild(li);
    });
}

// Select a friend to chat with
function selectFriend(friendId) {
    selectedFriendId = friendId;
    document.getElementById('chatWith').textContent = connections[friendId].metadata?.name || 'Unknown';
    renderMessages();
}

// Connect to another user
function connectToFriend(friendId) {
    if (!connections[friendId]) {
        const conn = peer.connect(friendId, { metadata: { name: userName } });
        connections[friendId] = conn;
        conn.on('open', () => {
            console.log('Connected to', friendId);
            updateFriendsList();
        });
        conn.on('data', (data) => {
            messages.push({ sender: conn.metadata.name || 'Unknown', text: data });
            renderMessages();
        });
    }
}

// Send message
function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value;
    
    if (message && selectedFriendId && connections[selectedFriendId]) {
        connections[selectedFriendId].send(message);
        messages.push({ sender: userName, text: message });
        renderMessages();
        input.value = '';
    } else if (message) {
        // If no friend selected, prompt to connect
        const friendId = prompt('Enter the ID of the person you want to chat with:');
        if (friendId && friendId !== userId) {
            connectToFriend(friendId);
            setTimeout(() => {
                if (connections[friendId]) {
                    connections[friendId].send(message);
                    messages.push({ sender: userName, text: message });
                    renderMessages();
                    input.value = '';
                }
            }, 1000); // Wait for connection
        }
    }
}

// Initial render
renderMessages();
