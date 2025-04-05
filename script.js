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

// Get friend ID from URL parameter
const urlParams = new URLSearchParams(window.location.search);
const friendIdFromUrl = urlParams.get('friend');

// Update username
document.getElementById('userName').addEventListener('change', (e) => {
    userName = e.target.value || 'Unknown';
    updateShareLink();
    renderMessages();
});

// Update share link
function updateShareLink() {
    const shareLink = document.getElementById('shareLink');
    const url = `${window.location.origin}${window.location.pathname}?friend=${userId}`;
    shareLink.href = url;
    shareLink.textContent = url;
    shareLink.onclick = () => navigator.clipboard.writeText(url);
}

// When peer is ready
peer.on('open', () => {
    console.log('Peer ID:', userId);
    updateShareLink();
    if (friendIdFromUrl && friendIdFromUrl !== userId) {
        connectToFriend(friendIdFromUrl);
    }
});

// Handle incoming connections
peer.on('connection', (conn) => {
    connections[conn.peer] = conn;
    conn.on('open', () => {
        selectedFriendId = conn.peer;
        document.getElementById('chatWith').textContent = conn.metadata?.name || 'Friend';
    });
    conn.on('data', (data) => {
        messages.push({ sender: conn.metadata?.name || 'Friend', text: data });
        renderMessages();
    });
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

// Connect to another user
function connectToFriend(friendId) {
    if (!connections[friendId]) {
        const conn = peer.connect(friendId, { metadata: { name: userName } });
        connections[friendId] = conn;
        conn.on('open', () => {
            console.log('Connected to', friendId);
            selectedFriendId = friendId;
            document.getElementById('chatWith').textContent = 'Friend';
        });
        conn.on('data', (data) => {
            messages.push({ sender: conn.metadata?.name || 'Friend', text: data });
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
    } else if (message && !selectedFriendId) {
        alert('Share your link with a friend to start chatting!');
    }
}

// Initial render
renderMessages();
