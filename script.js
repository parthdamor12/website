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
let onlineUsers = [];

// Update username
document.getElementById('userName').addEventListener('change', (e) => {
    userName = e.target.value || 'Unknown';
    broadcastPresence();
    updateShareLink();
});

// Update share link
function updateShareLink() {
    const shareLink = document.getElementById('shareLink');
    const url = `${window.location.origin}${window.location.pathname}`;
    shareLink.href = url;
    shareLink.textContent = url;
    shareLink.onclick = () => navigator.clipboard.writeText(url);
}

// When peer is ready
peer.on('open', () => {
    console.log('Peer ID:', userId);
    updateShareLink();
    broadcastPresence();
    setInterval(broadcastPresence, 5000); // Refresh presence every 5 seconds
});

// Handle incoming connections
peer.on('connection', (conn) => {
    connections[conn.peer] = conn;
    conn.on('data', (data) => {
        if (data.type === 'presence') {
            updateOnlineUsers(conn.peer, data.name);
        } else {
            messages.push({ sender: data.name || 'Unknown', text: data.message });
            renderMessages();
        }
    });
    conn.on('close', () => {
        delete connections[conn.peer];
        onlineUsers = onlineUsers.filter(u => u.id !== conn.peer);
        updateFriendsList();
    });
});

// Broadcast presence to all peers
function broadcastPresence() {
    Object.values(connections).forEach(conn => {
        if (conn.open) {
            conn.send({ type: 'presence', name: userName });
        }
    });
}

// Update online users list
function updateOnlineUsers(peerId, name) {
    if (!onlineUsers.find(u => u.id === peerId)) {
        onlineUsers.push({ id: peerId, name });
    } else {
        onlineUsers = onlineUsers.map(u => u.id === peerId ? { id: peerId, name } : u);
    }
    updateFriendsList();
}

// Render online users
function updateFriendsList() {
    const friendsList = document.getElementById('friendsList');
    friendsList.innerHTML = '';
    onlineUsers.forEach(user => {
        const li = document.createElement('li');
        li.textContent = `${user.name} (${user.id})`;
        friendsList.appendChild(li);
    });
}

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

// Connect to another user
function connectToFriend(friendId) {
    if (!connections[friendId] && friendId !== userId) {
        const conn = peer.connect(friendId, { metadata: { name: userName } });
        connections[friendId] = conn;
        conn.on('open', () => {
            console.log('Connected to', friendId);
            conn.send({ type: 'presence', name: userName });
        });
        conn.on('data', (data) => {
            if (data.type === 'presence') {
                updateOnlineUsers(friendId, data.name);
            } else {
                messages.push({ sender: data.name || 'Unknown', text: data.message });
                renderMessages();
            }
        });
        conn.on('close', () => {
            delete connections[friendId];
            onlineUsers = onlineUsers.filter(u => u.id !== friendId);
            updateFriendsList();
        });
    }
}

// Send message to all connected peers
function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value;
    
    if (message) {
        const data = { name: userName, message };
        Object.values(connections).forEach(conn => {
            if (conn.open) {
                conn.send(data);
            }
        });
        messages.push({ sender: userName, text: message });
        renderMessages();
        input.value = '';
    }
}

// Initial render
renderMessages();

// Prompt to connect to at least one user initially
setTimeout(() => {
    const friendId = prompt('Enter a friend’s ID to join the chat (or share your link):');
    if (friendId && friendId !== userId) {
        connectToFriend(friendId);
    }
}, 1000);
