let localConnection;
let remoteConnection;
let sendChannel;
let receiveChannel;
let localStream;
let remoteStream;
let messagesArea = document.getElementById('messages');
let messageInput = document.getElementById('messageInput');

// Function to start a call
function startCall() {
    // Setting up the peer-to-peer connection
    localConnection = new RTCPeerConnection();
    remoteConnection = new RTCPeerConnection();

    // Setting up the data channels
    sendChannel = localConnection.createDataChannel("sendDataChannel");
    sendChannel.onopen = () => console.log("Data channel open");
    sendChannel.onclose = () => console.log("Data channel closed");

    // Receiving the data on the remote connection
    remoteConnection.ondatachannel = event => {
        receiveChannel = event.channel;
        receiveChannel.onmessage = (event) => {
            displayMessage(event.data);
        };
    };

    // Connecting the two peers
    localConnection.onicecandidate = e => handleICECandidate(e, remoteConnection);
    remoteConnection.onicecandidate = e => handleICECandidate(e, localConnection);

    localConnection.createOffer()
        .then(offer => {
            return localConnection.setLocalDescription(offer);
        })
        .then(() => remoteConnection.setRemoteDescription(localConnection.localDescription))
        .then(() => remoteConnection.createAnswer())
        .then(answer => remoteConnection.setLocalDescription(answer))
        .then(() => localConnection.setRemoteDescription(remoteConnection.localDescription))
        .catch(error => console.error(error));
}

// Function to handle ICE candidates (for P2P connection)
function handleICECandidate(event, connection) {
    if (event.candidate) {
        connection.addIceCandidate(event.candidate);
    }
}

// Function to send message
function sendMessage() {
    let message = messageInput.value;
    if (message) {
        sendChannel.send(message);  // Send the message through the data channel
        displayMessage(message);    // Display message locally
        messageInput.value = '';    // Clear the input
    }
}

// Function to display received messages
function displayMessage(message) {
    messagesArea.value += message + '\n';
    messagesArea.scrollTop = messagesArea.scrollHeight;
}

// Function to hang up the call
function hangUp() {
    localConnection.close();
    remoteConnection.close();
    sendChannel.close();
    receiveChannel.close();
    localConnection = null;
    remoteConnection = null;
    console.log("Call ended");
}
