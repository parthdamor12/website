// ✅ Approved Device IDs
const allowedDevices = [
  "WkJhbGctMlF==", // ← Replace these with real friend IDs
  "dXNlci1pZC0xMjM=",
];

// ✅ Generate Device ID (based on user device info)
function generateDeviceId() {
  const raw = `${navigator.userAgent}-${screen.width}-${screen.height}`;
  return btoa(raw).slice(0, 12); // Short ID
}

// ✅ Copy Device ID
function copyDeviceId() {
  const id = document.getElementById("device-id").textContent;
  navigator.clipboard.writeText(id).then(() => alert("Device ID copied!"));
}

// ✅ Check if Device is Allowed
function isAllowedDevice(deviceId) {
  return allowedDevices.includes(deviceId);
}

// ✅ Load Video from URL param (?v=VIDEO_ID)
function showVideoFromURL() {
  const params = new URLSearchParams(window.location.search);
  const videoId = params.get("v");
  if (videoId) {
    const iframe = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1"
                    frameborder="0" allowfullscreen></iframe>`;
    document.getElementById("video-container").innerHTML = iframe;
  }
}

// ✅ Extract YouTube Video ID from pasted link
function extractYouTubeId(url) {
  const regex = /(?:youtube\.com.*(?:v=|\/embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

// ✅ Load video when user clicks
function loadVideo() {
  const url = document.getElementById("youtube-url").value;
  const videoId = extractYouTubeId(url);
  if (videoId) {
    window.location.href = `${window.location.pathname}?v=${videoId}`;
  } else {
    alert("Please enter a valid YouTube URL.");
  }
}

// ✅ Simple Chat (local only)
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

// ✅ Main Run
const deviceId = generateDeviceId();

// Check access
if (!isAllowedDevice(deviceId)) {
  document.body.innerHTML = `<div style="text-align:center; margin-top:100px;">
    <h2 style="color:red;">❌ Access Denied</h2>
    <p>Your device is not authorized to view this video.</p>
    <p><strong>Device ID:</strong> ${deviceId}</p>
    <p>Please contact the admin to grant access.</p>
  </div>`;
} else {
  document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("device-id").textContent = deviceId;
    showVideoFromURL();
  });
}
