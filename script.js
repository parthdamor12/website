// 🔐 DeviceID → YouTube VideoID mapping
const videoAccess = {
  "WkJhbGctMlF==": "dQw4w9WgXcQ",      // Your Device
  "dXNlci1pZC0xMjM=": "JGwWNGJdvx8"    // Friend's Device
  "TW96aWxsYS81": "dQw4w9WgXcQ", // Add your own video ID here
};

// ✅ Generate Device ID
function generateDeviceId() {
  const raw = `${navigator.userAgent}-${screen.width}-${screen.height}`;
  return btoa(raw).slice(0, 12); // Short and unique
}

// ✅ Copy Device ID
function copyDeviceId() {
  const id = document.getElementById("device-id").textContent;
  navigator.clipboard.writeText(id).then(() => alert("Device ID copied!"));
}

// ✅ Load Video for a Device ID
function loadVideoByDevice(deviceId) {
  const videoId = videoAccess[deviceId];
  if (videoId) {
    const iframe = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1"
                    frameborder="0" allowfullscreen></iframe>`;
    document.getElementById("video-container").innerHTML = iframe;
  } else {
    document.getElementById("video-container").innerHTML =
      `<p style="color:red;">❌ No video assigned to this Device ID.</p>`;
  }
}

// ✅ Manual Search
function searchDeviceAndLoad() {
  const inputId = document.getElementById("search-device-id").value.trim();
  loadVideoByDevice(inputId);
}

// ✅ Chat (local only)
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
const myDeviceId = generateDeviceId();

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("device-id").textContent = myDeviceId;
  loadVideoByDevice(myDeviceId);
});
