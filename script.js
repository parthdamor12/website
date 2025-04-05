// Generate a temporary ID (random for simplicity, could use device info)
const userId = Math.random().toString(36).substring(2, 10);
document.getElementById('userId').textContent = userId;

let userName = '';
let friends = [];
let peer = null;
let conn = null;

// Update username
document.getElementById('userName').addEventListener('change', (e) => {
    userName = e.target.value || 'Anonymous';
});

// Simulate online users (since no backend, we'll fake it locally)
function updateFriendsList() {
    const friendsList = document.getElementById('friendsList');
    friendsList.innerHTML = '';
    friends.forEach(friend => {
        const li = document.createElement('li');
        li.textContent = `${friend.name} (${friend.id})`;
        li.onclick = () => startChat(friend.id);
        friendsList.appendChild(li);
    });
}

// Add a fake friend for demo (in real scenario, this would come from peers)
setInterval(() => {
    if (userName) {
        friends = [{ id: 'fake123', name: 'FakeUser' }, { id: userId, name: userName }];
        updateFriendsList();
    }
}, 2000);

// WebRTC for peer-to-peer chat
function startChat(friendId) {
    peer = new RTCPeerConnection();
    conn = peer.createDataChannel('chat');

    conn.onopen = () => console.log('Connection opened');
    conn.onmessage = (event) => {
        const messages = document.getElementById('messages');
        messages.innerHTML += `<p>${friendId}: ${event.data}</p>`;
        messages.scrollTop = messages.scrollHeight;
    };

    peer.onicecandidate = (event) => {
        if (event.candidate) {
            // Normally, you'd send this to the friend via a signaling server
            console.log('ICE Candidate:', event.candidate);
        }
    };

    peer.createOffer()
        .then(offer => peer.setLocalDescription(offer))
        .then(() => {
            // Normally, send this offer to the friend (via signaling)
            console.log('Offer created');
        });
}

// Send message
function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value;
    if (conn && message) {
        conn.send(message);
        const messages = document.getElementById('messages');
        messages.innerHTML += `<p>You: ${message}</p>`;
        messages.scrollTop = messages.scrollHeight;
        input.value = '';
    }
}
