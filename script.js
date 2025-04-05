function extractYouTubeId(url) {
  const regex = /(?:youtube\.com.*(?:v=|\/embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

function loadVideo() {
  const url = document.getElementById("youtube-url").value;
  const videoId = extractYouTubeId(url);
  if (videoId) {
    window.location.href = `${window.location.pathname}?v=${videoId}`;
  } else {
    alert("Please enter a valid YouTube URL.");
  }
}

function showVideoFromURL() {
  const params = new URLSearchParams(window.location.search);
  const videoId = params.get("v");
  if (videoId) {
    const iframe = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1"
                    frameborder="0" allowfullscreen></iframe>`;
    document.getElementById("video-container").innerHTML = iframe;
  }
}

// Chat
function sendMessage() {
  const input = document.getElementById("chat-input");
  const msg = input.value.trim();
  if (msg) {
    const div = document.createElement("div");
    div.textContent = `You: ${msg}`;
    document.getElementById("messages").appendChild(div);
    input.value = "";
  }
}

// Device ID
function generateDeviceId() {
  const raw = `${navigator.userAgent}-${screen.width}-${screen.height}`;
  return btoa(raw).slice(0, 12);
}

function copyDeviceId() {
  const id = document.getElementById("device-id").textContent;
  navigator.clipboard.writeText(id).then(() => alert("Device ID copied!"));
}

document.getElementById("device-id").textContent = generateDeviceId();
showVideoFromURL();
