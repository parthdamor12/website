<script>
const allowedDevices = [
    "f728d21ad0b3ff...", // your hashed device ID here
];

async function getDeviceId() {
    const data = [
        navigator.userAgent,
        navigator.platform,
        navigator.language,
        screen.width + 'x' + screen.height,
        Intl.DateTimeFormat().resolvedOptions().timeZone
    ].join('|');

    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

window.onload = async () => {
    const deviceId = await getDeviceId();
    if (!allowedDevices.includes(deviceId)) {
        alert("Access Denied: This device is not registered.");
        document.body.innerHTML = "<h2 style='color:red; text-align:center;'>❌ Access Blocked</h2>";
    } else {
        console.log("✅ Device Verified");
        initializeApp();
    }
};

function initializeApp() {
    let player;
    const ytPlayer = document.getElementById('ytPlayer');
    const urlParams = new URLSearchParams(window.location.search);
    const groupId = urlParams.get('group') || Math.random().toString(36).substr(2, 8);
    const videoId = urlParams.get('v');
    const channel = new BroadcastChannel(`watch-together-${groupId}`);

    if (!urlParams.get('group')) {
        const newUrl = `${window.location.pathname}?group=${groupId}`;
        history.replaceState({}, '', newUrl);
    }

    window.onYouTubeIframeAPIReady = function () {
        if (videoId) {
            ytPlayer.src = `https://www.youtube.com/embed/${videoId}?enablejsapi=1`;
        }
    }

    function loadVideo() {
        const input = document.getElementById('youtubeLink').value.trim();
        let vid = "";
        if (input.includes("youtu.be/")) {
            vid = input.split("youtu.be/")[1].split("?")[0];
        } else if (input.includes("v=")) {
            vid = input.split("v=")[1].split("&")[0];
        }

        if (vid) {
            const newUrl = `${window.location.pathname}?group=${groupId}&v=${vid}`;
            history.replaceState({}, '', newUrl);
            ytPlayer.src = `https://www.youtube.com/embed/${vid}?enablejsapi=1`;

            const shareLink = `${window.location.origin}${window.location.pathname}?group=${groupId}&v=${vid}`;
            document.getElementById('shareLink').value = shareLink;
            document.getElementById('shareSection').style.display = 'block';

            channel.postMessage({ type: 'load', videoId: vid });
        }
    }

    function sendControl(action) {
        channel.postMessage({ type: 'control', action: action });
        controlVideo(action);
    }

    function controlVideo(action) {
        ytPlayer.contentWindow.postMessage(JSON.stringify({
            event: "command",
            func: action + "Video",
            args: []
        }), "*");
    }

    function sendMessage() {
        const msg = document.getElementById('chatMsg').value;
        if (msg.trim() === '') return;
        channel.postMessage({ type: 'chat', msg });
        appendMessage("You: " + msg);
        document.getElementById('chatMsg').value = '';
    }

    function appendMessage(msg) {
        const messagesDiv = document.getElementById('messages');
        messagesDiv.innerHTML += `<div>${msg}</div>`;
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    channel.onmessage = (event) => {
        const data = event.data;
        if (data.type === 'load') {
            ytPlayer.src = `https://www.youtube.com/embed/${data.videoId}?enablejsapi=1`;
        }

        if (data.type === 'control') {
            controlVideo(data.action);
        }

        if (data.type === 'chat') {
            appendMessage("Friend: " + data.msg);
        }
    };

    // Bind functions to window for button onclicks
    window.loadVideo = loadVideo;
    window.sendControl = sendControl;
    window.sendMessage = sendMessage;
}
</script>
