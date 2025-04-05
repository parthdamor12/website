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
let onlineUsers = [];

// Update username
document.getElementById('userName').addEventListener('change', (e) => {
    userName = e.target.value || 'Unknown';
    broadcastPresence(); // Announce name change
});

// When peer is ready
peer.on('open', () => {
    console.log('Peer ID:', userId);
    broadcastPresence(); // Announce yourself to others
});

// Handle incoming connections
peer.on('connection', (conn) => {
    connections[conn.peer] = conn;
    conn.on('data', (data) => {
        if (data.type === 'presence') {
            onlineUsers = onlineUsers.filter(u => u.id !== conn.peer);
            onlineUsers.push({ id: conn.peer, name: data.name });
            updateFriendsList();
        } else {
            messages.push({ sender: conn.metadata.name || 'Unknown', text: data });
            renderMessages();
        }
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
    onlineUsers.forEach(user => {
        const li = document.createElement('li');
        li.textContent = `${user.name} (${user.id})`;
        li.onclick = () => selectFriend(user.id);
        friendsList.appendChild(li);
    });
}

// Select a friend to chat with
function selectFriend(friendId) {
    selectedFriendId = friendId;
    document.getElementById('chatWith').textContent = onlineUsers.find(u => u.id === friendId)?.name || 'Unknown';
    if (!connections[friendId]) {
        connectToFriend(friendId);
    }
    renderMessages();
}

// Connect to another user
function connectToFriend(friendId) {
    if (!connections[friendId]) {
        const conn = peer.connect(friendId, { metadata: { name: userName } });
        connections[friendId] = conn;
        conn.on('open', () => {
            console.log('Connected to', friendId);
            conn.send({ type: 'presence', name: userName }); // Send presence info
            updateFriendsList();
        });
        conn.on('data', (data) => {
            if (data.type === 'presence') {
                onlineUsers = onlineUsers.filter(u => u.id !== friendId);
                onlineUsers.push({ id: friendId, name: data.name });
                updateFriendsList();
            } else {
                messages.push({ sender: conn.metadata.name || 'Unknown', text: data });
                renderMessages();
            }
        });
    }
}

// Broadcast presence to all known peers
function broadcastPresence() {
    Object.values(connections).forEach(conn => {
        if (conn.open) {
            conn.send({ type: 'presence', name: userName });
        }
    });
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
    }
}

// Initial render
renderMessages();

// Simulate initial connection (you’d normally share IDs manually)
setTimeout(() => {
    const friendId = prompt('Enter a friend’s ID to start (or leave blank to wait):');
    if (friendId && friendId !== userId) {
        connectToFriend(friendId);
    }
}, 1000);
