const audio = document.getElementById("audio");
audio.addEventListener("error", (e) => {
  console.error("Error loading audio:", e);
  currentSong.textContent = "Error loading: " + playlist[currentIndex];
});

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioContext.createAnalyser();
const source = audioContext.createMediaElementSource(audio);
source.connect(analyser);
analyser.connect(audioContext.destination);

function visualize() {
  const canvas = document.getElementById("visualizer");
  const ctx = canvas.getContext("2d");
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  function draw() {
    requestAnimationFrame(draw);
    analyser.getByteFrequencyData(dataArray);

    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width / bufferLength) * 2.5;
    let barHeight;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      barHeight = dataArray[i];

      ctx.fillStyle = `rgb(${barHeight + 100}, 50, 50)`;
      ctx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);

      x += barWidth + 1;
    }
  }
  draw();
}

audio.addEventListener("play", () => {
  audioContext.resume().then(() => {
    visualize();
  });
});

const playPauseBtn = document.getElementById("play-pause");
const progressBar = document.getElementById("progress");
const volumeBar = document.getElementById("volume");
const currentSong = document.getElementById("current-song");
const playlist = [
  "music/song1.mp3",
  "music/song2.mp3",
  "music/song3.mp3",
  "music/song4.mp3",
];
let currentIndex = 0;
// Phát nhạc
function playSong() {
  try {
    if (!playlist[currentIndex]) {
      console.error("Invalid song index or empty playlist");
      return;
    }
    audio.src = playlist[currentIndex];
    currentSong.textContent = "Playing: " + playlist[currentIndex];
    let playPromise = audio.play();

    if (playPromise !== undefined) {
      playPromise
        .then((_) => {
          playPauseBtn.textContent = "⏸️";
        })
        .catch((error) => {
          console.error("Playback failed:", error);
          currentSong.textContent = "Error playing: " + playlist[currentIndex];
        });
    }
  } catch (error) {
    console.error("Error in playSong:", error);
  }
}

function pauseSong() {
  audio.pause();
  playPauseBtn.textContent = "▶️";
}

playPauseBtn.addEventListener("click", () => {
  audio.paused ? playSong() : pauseSong();
});

document.getElementById("next").onclick = () => {
  currentIndex = (currentIndex + 1) % playlist.length;
  playSong();
};
document.getElementById("prev").onclick = () => {
  currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
  playSong();
};

function selectSong(index) {
  currentIndex = index;
  playSong();
}

volumeBar.addEventListener("input", () => {
  audio.volume = volumeBar.value / 100;
});

function changePlaybackSpeed(speed) {
  audio.playbackRate = speed;
  document.querySelectorAll(".speed-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  document.querySelector(`[data-speed="${speed}"]`).classList.add("active");
}

audio.addEventListener("timeupdate", () => {
  if (!isNaN(audio.duration)) {
    progressBar.value = (audio.currentTime / audio.duration) * 100;
  }
});
progressBar.addEventListener("input", () => {
  audio.currentTime = (progressBar.value / 100) * audio.duration;
});

function seekAudio(seconds) {
  const newTime = audio.currentTime + seconds;
  audio.currentTime = Math.min(Math.max(0, newTime), audio.duration);
}

document
  .getElementById("seekBackward")
  .addEventListener("click", () => seekAudio(-10));
document
  .getElementById("seekForward")
  .addEventListener("click", () => seekAudio(10));

function toggleTheme() {
  const body = document.body;
  const isDark = body.classList.toggle("dark-mode");
  localStorage.setItem("darkMode", isDark);

  const themeBtn = document.getElementById("themeToggle");
  themeBtn.textContent = isDark ? "☀️" : "🌙";
}

function loadTheme() {
  const isDark = localStorage.getItem("darkMode") === "true";
  if (isDark) {
    document.body.classList.add("dark-mode");
    document.getElementById("themeToggle").textContent = "☀️";
  }
}

let sleepTimerId = null;

function setSleepTimer(minutes) {
  if (sleepTimerId) {
    clearTimeout(sleepTimerId);
    sleepTimerId = null;
  }

  if (minutes > 0) {
    sleepTimerId = setTimeout(() => {
      pauseSong();
      sleepTimerId = null;
      document.querySelectorAll(".timer-btn").forEach((btn) => {
        btn.classList.remove("active");
      });
    }, minutes * 60 * 1000);

    // Update UI
    document.querySelectorAll(".timer-btn").forEach((btn) => {
      btn.classList.remove("active");
    });
    document.querySelector(`[data-timer="${minutes}"]`).classList.add("active");
  }
}

window.addEventListener("load", loadTheme);
