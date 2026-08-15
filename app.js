/* ==========================================================================
   CASEY PORTFOLIO — Unified macOS Desktop & Authentic iOS 18 Mobile Engine
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  let highestZIndex = 200;
  let activeWindows = {};
  let currentSpringBoardPage = 0;

  // Initialize Core Elements
  const desktopGrid = document.getElementById("desktop-grid");
  const windowStack = document.getElementById("window-stack");
  const widgetsLayer = document.getElementById("desktop-widgets-layer");
  const loginScreen = document.getElementById("mac-login-screen");
  const loginInputBox = document.getElementById("login-input-box");
  const loginHintsBox = document.getElementById("login-hints-box");
  const bootProgressContainer = document.getElementById("boot-progress-container");
  const bootProgressFill = document.getElementById("boot-progress-fill");
  const bootStatusText = document.getElementById("boot-status-text");
  const loginClock = document.getElementById("login-clock");
  const iosLockClock = document.getElementById("ios-lock-clock");
  const iosLockDate = document.getElementById("ios-lock-date");
  const iosStatusTime = document.getElementById("ios-status-time");
  const menuClock = document.getElementById("menu-clock");
  const islandSongTitle = document.getElementById("island-song-title");
  const islandEq = document.getElementById("island-eq");

  // ==========================================================================
  // 1. Live Clock & Calendar Date Synchronization
  // ==========================================================================
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  function updateAllClocks() {
    const now = new Date();
    
    // Time Strings
    const time12 = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    const timeSimple = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: false });
    const timeStatus = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: false });
    
    // Date Strings
    const dateLong = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    const dateShort = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    const dateWidget = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    const dayName = daysOfWeek[now.getDay()];
    const dateNum = now.getDate();

    if (menuClock) menuClock.textContent = dateShort;
    if (loginClock) loginClock.textContent = time12;
    if (iosLockClock) iosLockClock.textContent = timeSimple;
    if (iosLockDate) iosLockDate.textContent = dateLong;
    if (iosStatusTime) iosStatusTime.textContent = timeStatus;

    // Desktop Widgets
    const widgetTimeEl = document.getElementById("widget-digital-time");
    const widgetDateEl = document.getElementById("widget-date-display");
    if (widgetTimeEl) widgetTimeEl.textContent = time12;
    if (widgetDateEl) widgetDateEl.textContent = dateWidget;

    // Dynamic Calendar Icon on Home Screen
    const calDayEl = document.getElementById("dynamic-cal-day");
    const calDateEl = document.getElementById("dynamic-cal-date");
    if (calDayEl) calDayEl.textContent = dayName;
    if (calDateEl) calDateEl.textContent = dateNum;

    // Live Analog Clock Icon Hands
    const hrHand = document.getElementById("clock-hr-hand");
    const minHand = document.getElementById("clock-min-hand");
    const secHand = document.getElementById("clock-sec-hand");
    if (hrHand && minHand && secHand) {
      const s = now.getSeconds();
      const m = now.getMinutes() + s / 60;
      const h = (now.getHours() % 12) + m / 60;
      hrHand.setAttribute("transform", `rotate(${h * 30} 30 30)`);
      minHand.setAttribute("transform", `rotate(${m * 6} 30 30)`);
      secHand.setAttribute("transform", `rotate(${s * 6} 30 30)`);
    }
  }

  updateAllClocks();
  setInterval(updateAllClocks, 1000);

  window.toggleMacWidgets = function() {
    if (!widgetsLayer) return;
    widgetsLayer.classList.toggle("is-hidden");
  };

  // ==========================================================================
  // 2. Real HTML5 Audio & Spotify Engine (Dynamic Island Sync)
  // ==========================================================================
  // ==========================================================================
  // 2. Music Player Engine (YouTube Music Full Playlist & Audio Mode)
  // ==========================================================================
  const portfolioData = window.PORTFOLIO_DATA || (typeof PORTFOLIO_DATA !== "undefined" ? PORTFOLIO_DATA : {});
  const spotifyTracks = (portfolioData.youtubeTracks && portfolioData.youtubeTracks.length > 0)
    ? portfolioData.youtubeTracks
    : [
        {
          title: "I Smoked Away My Brain",
          artist: "A$AP Rocky (I'm God x Demons)",
          cover: "https://i.ytimg.com/vi/kSUmxeLL-ak/hqdefault.jpg",
          videoId: "kSUmxeLL-ak",
          audioUrl: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3",
          duration: 191
        },
        {
          title: "STOLE YA FLOW",
          artist: "A$AP Rocky",
          cover: "https://i.ytimg.com/vi/8-CeCO0GzVg/hqdefault.jpg",
          videoId: "8-CeCO0GzVg",
          audioUrl: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3",
          duration: 200
        },
        {
          title: "White Ferrari",
          artist: "Frank Ocean",
          cover: "https://i.ytimg.com/vi/ToO4VFCoR7U/hqdefault.jpg",
          videoId: "ToO4VFCoR7U",
          audioUrl: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a8d184.mp3",
          duration: 249
        },
        {
          title: "PRIDE.",
          artist: "Kendrick Lamar",
          cover: "https://i.ytimg.com/vi/J87pJrxvJ5E/hqdefault.jpg",
          videoId: "J87pJrxvJ5E",
          audioUrl: "https://cdn.pixabay.com/download/audio/2021/11/24/audio_3316d97c72.mp3",
          duration: 276
        }
      ];

  let currentTrackIdx = 0;
  let currentTrackTime = 0;
  let isSpotifyPlaying = false;
  let spotifyInterval = null;

  const realAudio = new Audio();
  realAudio.loop = true;
  realAudio.volume = 0.5;

  // Background YouTube Audio Engine (Zero Video UI)
  let ytAudioPlayer = null;
  let isYtReady = false;

  function initYtAudioEngine() {
    if (!document.getElementById("yt-audio-container")) {
      const container = document.createElement("div");
      container.id = "yt-audio-container";
      container.style.cssText = "position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;opacity:0;pointer-events:none;z-index:-999;overflow:hidden;";
      container.innerHTML = `<div id="yt-audio-iframe-target"></div>`;
      document.body.appendChild(container);

      if (!window.YT) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(tag);
      }
    }
  }

  window.onYouTubeIframeAPIReady = function() {
    if (typeof YT !== "undefined" && YT.Player) {
      ytAudioPlayer = new YT.Player("yt-audio-iframe-target", {
        height: "1",
        width: "1",
        playerVars: {
          playsinline: 1,
          enablejsapi: 1,
          autoplay: 0,
          controls: 0,
          origin: window.location.origin
        },
        events: {
          onReady: () => {
            isYtReady = true;
          },
          onStateChange: (event) => {
            if (event.data === YT.PlayerState.PLAYING) {
              isSpotifyPlaying = true;
            } else if (event.data === YT.PlayerState.PAUSED) {
              isSpotifyPlaying = false;
            } else if (event.data === YT.PlayerState.ENDED) {
              window.spotifyNextTrack();
            }
            updateSpotifyDisplay();
          }
        }
      });
    }
  };

  initYtAudioEngine();

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  function playCurrentAudio() {
    const track = spotifyTracks[currentTrackIdx];
    if (ytAudioPlayer && isYtReady && track && track.videoId) {
      realAudio.pause();
      try {
        ytAudioPlayer.loadVideoById({
          videoId: track.videoId,
          startSeconds: currentTrackTime || 0
        });
        ytAudioPlayer.playVideo();
      } catch (e) {
        console.log("YouTube audio stream active:", e);
      }
    } else {
      if (track && track.audioUrl) {
        if (realAudio.src !== track.audioUrl) {
          realAudio.src = track.audioUrl;
        }
        realAudio.play().catch(e => console.log("Audio autoplay handled:", e));
      }
    }
  }

  function pauseCurrentAudio() {
    if (ytAudioPlayer && isYtReady) {
      try { ytAudioPlayer.pauseVideo(); } catch (e) {}
    }
    realAudio.pause();
  }

  function updateSpotifyDisplay() {
    const track = spotifyTracks[currentTrackIdx];
    if (!track) return;

    // Dynamic Island
    if (islandSongTitle) islandSongTitle.textContent = track.title;
    if (islandEq) {
      islandEq.style.opacity = isSpotifyPlaying ? "1" : "0.3";
      islandEq.querySelectorAll("span").forEach(s => {
        s.style.animationPlayState = isSpotifyPlaying ? "running" : "paused";
      });
    }

    // Desktop Sonoma Widget
    const widgetSongCover = document.getElementById("widget-song-cover");
    const widgetSongTitle = document.getElementById("widget-song-title");
    const widgetSongArtist = document.getElementById("widget-song-artist");
    const widgetProgressFill = document.getElementById("widget-song-progress-fill");
    const widgetCurrentTime = document.getElementById("widget-song-current-time");
    const widgetDurationTime = document.getElementById("widget-song-duration");
    const widgetPlayBtn = document.getElementById("widget-play-btn");

    if (widgetSongCover) widgetSongCover.src = track.cover;
    if (widgetSongTitle) widgetSongTitle.textContent = track.title;
    if (widgetSongArtist) widgetSongArtist.textContent = track.artist;
    if (widgetDurationTime) widgetDurationTime.textContent = formatTime(track.duration);
    if (widgetPlayBtn) widgetPlayBtn.textContent = isSpotifyPlaying ? "⏸" : "▶";

    const pct = Math.min(100, (currentTrackTime / track.duration) * 100);
    if (widgetProgressFill) widgetProgressFill.style.width = `${pct}%`;
    if (widgetCurrentTime) widgetCurrentTime.textContent = formatTime(currentTrackTime);

    // Modal Audio-Only Player Sync
    const modalCover = document.getElementById("modal-song-cover");
    const modalTitle = document.getElementById("modal-song-title");
    const modalArtist = document.getElementById("modal-song-artist");
    const modalProgress = document.getElementById("modal-song-progress-fill");
    const modalCurrentTime = document.getElementById("modal-song-current-time");
    const modalDuration = document.getElementById("modal-song-duration");
    const modalPlayBtn = document.getElementById("modal-play-btn");
    const modalVinyl = document.getElementById("modal-vinyl-disc");
    const modalArtWrapper = document.getElementById("modal-art-wrapper");
    const modalEq = document.getElementById("modal-live-eq");

    if (modalCover) modalCover.src = track.cover;
    if (modalTitle) modalTitle.textContent = track.title;
    if (modalArtist) modalArtist.textContent = track.artist;
    if (modalDuration) modalDuration.textContent = formatTime(track.duration);
    if (modalCurrentTime) modalCurrentTime.textContent = formatTime(currentTrackTime);
    if (modalProgress) modalProgress.style.width = `${pct}%`;
    if (modalPlayBtn) modalPlayBtn.textContent = isSpotifyPlaying ? "⏸" : "▶";
    if (modalVinyl) modalVinyl.classList.toggle("playing", isSpotifyPlaying);
    if (modalArtWrapper) modalArtWrapper.classList.toggle("playing", isSpotifyPlaying);
    if (modalEq) modalEq.classList.toggle("playing", isSpotifyPlaying);

    // Queue active states
    document.querySelectorAll(".audio-queue-item").forEach((item, idx) => {
      if (idx === currentTrackIdx) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });
  }

  function startSpotifyTimer() {
    if (spotifyInterval) clearInterval(spotifyInterval);
    spotifyInterval = setInterval(() => {
      if (!isSpotifyPlaying) return;
      const track = spotifyTracks[currentTrackIdx];
      if (!track) return;
      if (ytAudioPlayer && isYtReady && typeof ytAudioPlayer.getCurrentTime === "function") {
        try {
          const ytSecs = Math.floor(ytAudioPlayer.getCurrentTime());
          if (ytSecs > 0) currentTrackTime = ytSecs;
          else currentTrackTime += 1;
        } catch (e) {
          currentTrackTime += 1;
        }
      } else {
        currentTrackTime += 1;
      }

      if (currentTrackTime >= track.duration) {
        currentTrackTime = 0;
        currentTrackIdx = (currentTrackIdx + 1) % spotifyTracks.length;
        playCurrentAudio();
      }
      updateSpotifyDisplay();
    }, 1000);
  }

  window.spotifyTogglePlay = function() {
    isSpotifyPlaying = !isSpotifyPlaying;
    if (isSpotifyPlaying) {
      playCurrentAudio();
    } else {
      pauseCurrentAudio();
    }
    updateSpotifyDisplay();
  };

  window.spotifyNextTrack = function() {
    currentTrackIdx = (currentTrackIdx + 1) % spotifyTracks.length;
    currentTrackTime = 0;
    updateSpotifyDisplay();
    if (isSpotifyPlaying) playCurrentAudio();
  };

  window.spotifyPrevTrack = function() {
    currentTrackIdx = (currentTrackIdx - 1 + spotifyTracks.length) % spotifyTracks.length;
    currentTrackTime = 0;
    updateSpotifyDisplay();
    if (isSpotifyPlaying) playCurrentAudio();
  };

  window.selectAudioTrack = function(idx) {
    currentTrackIdx = idx;
    currentTrackTime = 0;
    isSpotifyPlaying = true;
    playCurrentAudio();
    updateSpotifyDisplay();
  };

  window.seekAudioProgress = function(e) {
    const bar = document.getElementById("modal-progress-bg");
    if (!bar) return;
    const rect = bar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const track = spotifyTracks[currentTrackIdx];
    currentTrackTime = Math.floor(ratio * track.duration);
    if (ytAudioPlayer && isYtReady && track && track.videoId) {
      try { ytAudioPlayer.seekTo(currentTrackTime, true); } catch (err) {}
    }
    updateSpotifyDisplay();
  };

  updateSpotifyDisplay();
  startSpotifyTimer();

  // ==========================================================================
  // 3. Apple Login & Unlock Sequence (macOS & iOS 18)
  // ==========================================================================
  let isLoggingIn = false;

  window.startMacBootSequence = function() {
    if (isLoggingIn || !loginScreen) return;
    isLoggingIn = true;

    // Haptic feedback for mobile devices
    if (navigator.vibrate) {
      try { navigator.vibrate([15, 10, 15]); } catch (e) {}
    }

    loginScreen.classList.add("is-authenticating");

    if (loginInputBox) loginInputBox.style.display = "none";
    if (loginHintsBox) loginHintsBox.style.display = "none";
    if (bootProgressContainer) bootProgressContainer.style.display = "flex";

    setTimeout(() => {
      if (bootProgressFill) bootProgressFill.style.width = "45%";
      if (bootStatusText) bootStatusText.textContent = "Loading Studio Assets...";
    }, 120);

    setTimeout(() => {
      if (bootProgressFill) bootProgressFill.style.width = "85%";
      if (bootStatusText) bootStatusText.textContent = "Welcome to Casey's Studio!";
    }, 450);

    setTimeout(() => {
      if (bootProgressFill) bootProgressFill.style.width = "100%";
    }, 750);

    setTimeout(() => {
      loginScreen.classList.add("is-unlocked");

      setTimeout(() => {
        loginScreen.style.display = "none";
        loginScreen.classList.remove("is-authenticating", "is-unlocked");
        if (bootProgressContainer) bootProgressContainer.style.display = "none";
        if (bootProgressFill) bootProgressFill.style.width = "0%";
        if (loginInputBox) loginInputBox.style.display = "block";
        if (loginHintsBox) loginHintsBox.style.display = "block";
        isLoggingIn = false;
      }, 550);
    }, 950);
  };

  window.lockMacScreen = function() {
    if (!loginScreen) return;
    loginScreen.style.display = "flex";
    void loginScreen.offsetWidth;
    loginScreen.classList.remove("is-unlocked", "is-authenticating");
    if (loginInputBox) loginInputBox.style.display = "block";
    if (loginHintsBox) loginHintsBox.style.display = "block";
    if (bootProgressContainer) bootProgressContainer.style.display = "none";
    if (bootProgressFill) bootProgressFill.style.width = "0%";
  };

  // Lock screen touch/swipe up gesture for mobile
  let touchStartY = 0;
  loginScreen?.addEventListener("touchstart", (e) => {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  loginScreen?.addEventListener("touchend", (e) => {
    const touchEndY = e.changedTouches[0].clientY;
    if (touchStartY - touchEndY > 45) {
      window.startMacBootSequence();
    }
  }, { passive: true });

  // ==========================================================================
  // 4. SpringBoard Renderer (Authentic iOS 18 Home Screen + Multi-Page Physics)
  // ==========================================================================
  function renderAppGrid() {
    const data = window.PORTFOLIO_DATA || (typeof PORTFOLIO_DATA !== "undefined" ? PORTFOLIO_DATA : null);
    if (!desktopGrid || !data || !data.projects) return;
    desktopGrid.innerHTML = "";

    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
      const now = new Date();
      const dayName = daysOfWeek[now.getDay()];
      const dateNum = now.getDate();

      // Multi-Page SpringBoard Slider
      desktopGrid.innerHTML = `
        <div id="springboard-slider" class="ios-springboard-slider">
          
          <!-- ================= PAGE 1: EXACT REFERENCE HOME SCREEN ================= -->
          <div class="ios-springboard-page" id="page-0">
            <div class="ios-apps-grid">
              
              <!-- 2x2 Weather Widget (Top-Left) -->
              <div class="ios-widget-wrapper" onclick="window.openWeatherApp()">
                <div class="ios-widget-weather-card">
                  <div class="weather-top-row">
                    <span class="weather-location">New Delhi <span class="weather-arrow">↗</span></span>
                  </div>
                  <div class="weather-temp-main">29°</div>
                  <div class="weather-condition-row">
                    <span style="font-size: 14px;">☁️</span>
                    <span>Cloudy</span>
                  </div>
                  <div class="weather-range">H:32° L:27°</div>
                </div>
                <span class="ios-app-label">Weather</span>
              </div>

              <!-- Top-Right 2x2 Grid Apps -->
              <!-- FaceTime -->
              <div class="ios-app-item" onclick="window.openFaceTimeApp()">
                <div class="ios-app-icon-box">
                  <img class="ios-app-icon-img" src="assets/images/ios18_clean/facetime.png" alt="FaceTime">
                  <span class="ios-badge">2</span>
                </div>
                <span class="ios-app-label">FaceTime</span>
              </div>

              <!-- Calendar (Dynamic Day & Date) -->
              <div class="ios-app-item" onclick="window.openCalendarApp()">
                <div class="ios-app-icon-box ios-dynamic-calendar-icon">
                  <span id="dynamic-cal-day" class="calendar-day-name">${dayName}</span>
                  <span id="dynamic-cal-date" class="calendar-date-number">${dateNum}</span>
                </div>
                <span class="ios-app-label">Calendar</span>
              </div>

              <!-- Photos -->
              <div class="ios-app-item" onclick="window.openGalleryWindow()">
                <div class="ios-app-icon-box">
                  <img class="ios-app-icon-img" src="assets/images/ios18_clean/photos.png" alt="Photos">
                </div>
                <span class="ios-app-label">Photos</span>
              </div>

              <!-- Camera -->
              <div class="ios-app-item" onclick="window.openCameraApp()">
                <div class="ios-app-icon-box">
                  <img class="ios-app-icon-img" src="assets/images/ios18_clean/camera.png" alt="Camera">
                </div>
                <span class="ios-app-label">Camera</span>
              </div>

              <!-- Row 2 -->
              <!-- Mail (1,134) -->
              <div class="ios-app-item" onclick="window.openContactWindow()">
                <div class="ios-app-icon-box">
                  <img class="ios-app-icon-img" src="assets/images/ios18_clean/mail.png" alt="Mail">
                  <span class="ios-badge">1,134</span>
                </div>
                <span class="ios-app-label">Mail</span>
              </div>

              <!-- Notes -->
              <div class="ios-app-item" onclick="window.openNotesApp()">
                <div class="ios-app-icon-box">
                  <img class="ios-app-icon-img" src="assets/images/ios18_clean/notes.png" alt="Notes">
                </div>
                <span class="ios-app-label">Notes</span>
              </div>

              <!-- Reminders (3) -->
              <div class="ios-app-item" onclick="window.openRemindersApp()">
                <div class="ios-app-icon-box">
                  <img class="ios-app-icon-img" src="assets/images/ios18_clean/reminders.png" alt="Reminders">
                  <span class="ios-badge">3</span>
                </div>
                <span class="ios-app-label">Reminders</span>
              </div>

              <!-- Clock (Live Ticking SVG) -->
              <div class="ios-app-item" onclick="window.openClockApp()">
                <div class="ios-app-icon-box ios-live-clock-icon">
                  <svg class="clock-face-svg" viewBox="0 0 60 60">
                    <circle cx="30" cy="30" r="28" fill="#ffffff" stroke="rgba(0,0,0,0.1)" stroke-width="1"/>
                    ${[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(deg => `
                      <line x1="30" y1="6" x2="30" y2="${deg % 90 === 0 ? '10' : '8'}" stroke="#000000" stroke-width="${deg % 90 === 0 ? '2' : '1'}" transform="rotate(${deg} 30 30)"/>
                    `).join("")}
                    <line id="clock-hr-hand" x1="30" y1="30" x2="30" y2="15" stroke="#000000" stroke-width="2.5" stroke-linecap="round"/>
                    <line id="clock-min-hand" x1="30" y1="30" x2="30" y2="10" stroke="#000000" stroke-width="1.8" stroke-linecap="round"/>
                    <line id="clock-sec-hand" x1="30" y1="34" x2="30" y2="8" stroke="#ff3b30" stroke-width="1" stroke-linecap="round"/>
                    <circle cx="30" cy="30" r="2" fill="#ff3b30"/>
                  </svg>
                </div>
                <span class="ios-app-label">Clock</span>
              </div>

              <!-- Row 3 -->
              <!-- TV -->
              <div class="ios-app-item" onclick="window.openTvApp()">
                <div class="ios-app-icon-box">
                  <img class="ios-app-icon-img" src="assets/images/ios18_clean/tv.png" alt="TV">
                </div>
                <span class="ios-app-label">TV</span>
              </div>

              <!-- Podcasts -->
              <div class="ios-app-item" onclick="window.openPodcastsApp()">
                <div class="ios-app-icon-box">
                  <img class="ios-app-icon-img" src="assets/images/ios18_clean/podcasts.png" alt="Podcasts">
                </div>
                <span class="ios-app-label">Podcasts</span>
              </div>

              <!-- App Store -->
              <div class="ios-app-item" onclick="window.openAppStoreApp()">
                <div class="ios-app-icon-box">
                  <img class="ios-app-icon-img" src="assets/images/ios18_clean/appstore.png" alt="App Store">
                </div>
                <span class="ios-app-label">App Store</span>
              </div>

              <!-- Maps -->
              <div class="ios-app-item" onclick="window.openMapsApp()">
                <div class="ios-app-icon-box">
                  <img class="ios-app-icon-img" src="assets/images/ios18_clean/maps.png" alt="Maps">
                </div>
                <span class="ios-app-label">Maps</span>
              </div>

              <!-- Row 4 -->
              <!-- Health -->
              <div class="ios-app-item" onclick="window.openHealthApp()">
                <div class="ios-app-icon-box">
                  <img class="ios-app-icon-img" src="assets/images/ios18_clean/health.png" alt="Health">
                </div>
                <span class="ios-app-label">Health</span>
              </div>

              <!-- Wallet -->
              <div class="ios-app-item" onclick="window.openWalletApp()">
                <div class="ios-app-icon-box">
                  <img class="ios-app-icon-img" src="assets/images/ios18_clean/wallet.png" alt="Wallet">
                </div>
                <span class="ios-app-label">Wallet</span>
              </div>

              <!-- Settings (3) -->
              <div class="ios-app-item" onclick="window.openSettingsApp()">
                <div class="ios-app-icon-box">
                  <img class="ios-app-icon-img" src="assets/images/ios18_clean/settings.png" alt="Settings">
                  <span class="ios-badge">3</span>
                </div>
                <span class="ios-app-label">Settings</span>
              </div>

              <!-- Passwords -->
              <div class="ios-app-item" onclick="window.openPasswordsApp()">
                <div class="ios-app-icon-box">
                  <img class="ios-app-icon-img" src="assets/images/ios18_clean/passwords.png" alt="Passwords">
                </div>
                <span class="ios-app-label">Passwords</span>
              </div>

              <!-- Row 5 -->
              <!-- Folder: "Camera shit" -->
              <div class="ios-app-item" onclick="window.openCameraFolder()">
                <div class="ios-folder-box">
                  <img class="folder-mini-icon" src="assets/images/ios18_clean/camera.png" alt="Camera">
                  <img class="folder-mini-icon" src="assets/images/ios18_clean/photos.png" alt="Photos">
                  <img class="folder-mini-icon" src="https://framerusercontent.com/images/fZcO2HO3MMDvuS9IcWLgq5MyMc.png" alt="Instagram">
                  <img class="folder-mini-icon" src="assets/images/ios18_clean/finalcut_camera.png" alt="Visuals">
                </div>
                <span class="ios-app-label">Camera shit</span>
              </div>

              <!-- Riot Mobile -->
              <div class="ios-app-item" onclick="window.openRiotApp()">
                <div class="ios-app-icon-box">
                  <img class="ios-app-icon-img" src="assets/images/ios18_clean/riotmobile.png" alt="Riot Mobile">
                </div>
                <span class="ios-app-label">Riot Mobile</span>
              </div>

            </div>
          </div>

          <!-- ================= PAGE 2: STUDIO CREATIVE APPS & WORKS ================= -->
          <div class="ios-springboard-page" id="page-1">
            <div class="ios-apps-grid">
              
              <!-- Live Project Banner Widget (2x2) -->
              <div class="ios-widget-wrapper" onclick="window.openSpotifyWindow()">
                <div class="ios-widget-weather-card" style="background: linear-gradient(135deg, rgba(29, 185, 84, 0.4) 0%, rgba(10, 20, 30, 0.8) 100%);">
                  <div class="weather-top-row">
                    <span class="weather-location" style="color: #1db954;">NOW PLAYING</span>
                    <span style="font-size: 10px; background: rgba(0,0,0,0.4); padding: 2px 6px; border-radius: 8px;">VINYL</span>
                  </div>
                  <div style="font-size: 16px; font-weight: 800; color: #fff; margin-top: 6px;">HOTEL MAFIJA</div>
                  <div style="font-size: 11px; color: rgba(255,255,255,0.75);">Casey & SBM Label</div>
                  <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 8px;">
                    <span style="font-size: 11px; color: #1db954; font-weight: 700;">▶ Playing Master</span>
                    <span style="font-size: 18px;">🎵</span>
                  </div>
                </div>
                <span class="ios-app-label">Studio Music</span>
              </div>

              <!-- Creative Apps Grid -->
              <!-- After Effects -->
              <div class="ios-app-item" onclick="window.openAdobeDialog('ae')">
                <div class="ios-app-icon-box">
                  <img class="ios-app-icon-img" src="https://framerusercontent.com/images/FGXr3pqtmk0UpCXHi0IZJgC4H8.png" alt="After Effects">
                </div>
                <span class="ios-app-label">After Effects</span>
              </div>

              <!-- Photoshop -->
              <div class="ios-app-item" onclick="window.openAdobeDialog('ps')">
                <div class="ios-app-icon-box">
                  <img class="ios-app-icon-img" src="https://framerusercontent.com/images/iDBBsIGms7v4vkBAa7EBeh9PGuM.png" alt="Photoshop">
                </div>
                <span class="ios-app-label">Photoshop</span>
              </div>

              <!-- Illustrator -->
              <div class="ios-app-item" onclick="window.openAdobeDialog('ai')">
                <div class="ios-app-icon-box">
                  <img class="ios-app-icon-img" src="https://framerusercontent.com/images/VHJFQu7ykJIdCqTTduCtUcpcA.png" alt="Illustrator">
                </div>
                <span class="ios-app-label">Illustrator</span>
              </div>

              <!-- System Log -->
              <div class="ios-app-item" onclick="window.openAdobeDialog('warn')">
                <div class="ios-app-icon-box">
                  <img class="ios-app-icon-img" src="https://framerusercontent.com/images/BSPnJPSH4K1WxhDJJbEfUgT7U.png" alt="System Log">
                </div>
                <span class="ios-app-label">System Log</span>
              </div>

              <!-- Behance -->
              <div class="ios-app-item" onclick="window.open('https://www.behance.net/Casey08', '_blank')">
                <div class="ios-app-icon-box">
                  <img class="ios-app-icon-img" src="assets/images/behance-square-color-icon.svg" alt="Behance">
                </div>
                <span class="ios-app-label">Behance</span>
              </div>

              <!-- YouTube -->
              <div class="ios-app-item" onclick="window.open('https://www.youtube.com/@Caseyxlive', '_blank')">
                <div class="ios-app-icon-box" style="background: #cc0000;">
                  <img class="ios-app-icon-img" src="assets/images/youtube_icon.svg" alt="YouTube">
                </div>
                <span class="ios-app-label">YouTube</span>
              </div>

              <!-- Instagram -->
              <div class="ios-app-item" onclick="window.open('https://www.instagram.com/caseyxlive/', '_blank')">
                <div class="ios-app-icon-box" style="background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);">
                  <img class="ios-app-icon-img" src="https://framerusercontent.com/images/fZcO2HO3MMDvuS9IcWLgq5MyMc.png" alt="Instagram">
                </div>
                <span class="ios-app-label">Instagram</span>
              </div>

              <!-- Bin of Ideas -->
              <div class="ios-app-item" onclick="window.openBinWindow()">
                <div class="ios-app-icon-box" style="background: #27272a;">
                  <img class="ios-app-icon-img" src="https://framerusercontent.com/images/Hfn1FB5V1VnB099tUlAIyjV1tC4.png" alt="Bin of Ideas">
                </div>
                <span class="ios-app-label">Bin of Ideas</span>
              </div>

              <!-- Swift Playgrounds -->
              <div class="ios-app-item" onclick="window.openPlaygroundsApp()">
                <div class="ios-app-icon-box">
                  <img class="ios-app-icon-img" src="assets/images/ios18_clean/playgrounds.png" alt="Playgrounds">
                </div>
                <span class="ios-app-label">Playgrounds</span>
              </div>

              <!-- TestFlight -->
              <div class="ios-app-item" onclick="window.openTestFlightApp()">
                <div class="ios-app-icon-box">
                  <img class="ios-app-icon-img" src="assets/images/ios18_clean/testflight.png" alt="TestFlight">
                </div>
                <span class="ios-app-label">TestFlight</span>
              </div>

              <!-- Files -->
              <div class="ios-app-item" onclick="window.openFilesApp()">
                <div class="ios-app-icon-box">
                  <img class="ios-app-icon-img" src="assets/images/ios18_clean/files.png" alt="Files">
                </div>
                <span class="ios-app-label">Files</span>
              </div>

              <!-- Shazam -->
              <div class="ios-app-item" onclick="window.openShazamApp()">
                <div class="ios-app-icon-box">
                  <img class="ios-app-icon-img" src="assets/images/ios18_clean/shazam.png" alt="Shazam">
                </div>
                <span class="ios-app-label">Shazam</span>
              </div>

              <!-- Voice Memos -->
              <div class="ios-app-item" onclick="window.openVoiceMemosApp()">
                <div class="ios-app-icon-box">
                  <img class="ios-app-icon-img" src="assets/images/ios18_clean/voicememos.png" alt="Voice Memos">
                </div>
                <span class="ios-app-label">Voice Memos</span>
              </div>

              <!-- Translate -->
              <div class="ios-app-item" onclick="window.openTranslateApp()">
                <div class="ios-app-icon-box">
                  <img class="ios-app-icon-img" src="assets/images/ios18_clean/translate.png" alt="Translate">
                </div>
                <span class="ios-app-label">Translate</span>
              </div>

              <!-- Keynote -->
              <div class="ios-app-item" onclick="window.openNotebookWindow()">
                <div class="ios-app-icon-box">
                  <img class="ios-app-icon-img" src="assets/images/ios18_clean/keynote.png" alt="Keynote">
                </div>
                <span class="ios-app-label">Pitch Deck</span>
              </div>

            </div>
          </div>

        </div>
      `;

      setupSpringBoardSwipe();
      updateAllClocks();
      if (currentSpringBoardPage !== 0) {
        window.switchSpringBoardPage(currentSpringBoardPage);
      }

    } else {
      // ----------------------------------------------------------------------
      // ----------------------------------------------------------------------
      // Desktop macOS Natural Scattered Layout — organic workspace, draggable
      // ----------------------------------------------------------------------
      const START_X     = 28;   // left margin
      const START_Y     = 46;   // below top menu bar
      const RIGHT_SAFE  = 230;  // avoid right widgets panel
      const BOTTOM_SAFE = 120;  // avoid bottom dock
      const ICON_WIDTH  = 88;
      const ICON_HEIGHT = 96;

      const minX = START_X;
      const maxX = Math.max(minX, window.innerWidth - RIGHT_SAFE - ICON_WIDTH);
      const minY = START_Y;
      const maxY = Math.max(minY, window.innerHeight - BOTTOM_SAFE - ICON_HEIGHT);

      const availW = Math.max(100, maxX - minX);
      const availH = Math.max(100, maxY - minY);

      // 1. Initial coordinates based on pos.x / pos.y
      const positions = data.projects.map((proj, idx) => {
        let px = (proj.pos && typeof proj.pos.x === "number") 
          ? minX + (proj.pos.x / 100) * availW 
          : minX + (idx % 6) * 110;
        let py = (proj.pos && typeof proj.pos.y === "number") 
          ? minY + (proj.pos.y / 100) * availH 
          : minY + Math.floor(idx / 6) * 115;
        return { x: px, y: py, proj };
      });

      // 2. Physics relaxation passes to disperse tight clusters
      const MIN_DIST_X = 104;
      const MIN_DIST_Y = 110;

      for (let step = 0; step < 40; step++) {
        for (let i = 0; i < positions.length; i++) {
          for (let j = i + 1; j < positions.length; j++) {
            const p1 = positions[i];
            const p2 = positions[j];
            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;

            if (Math.abs(dx) < MIN_DIST_X && Math.abs(dy) < MIN_DIST_Y) {
              const overlapX = MIN_DIST_X - Math.abs(dx);
              const overlapY = MIN_DIST_Y - Math.abs(dy);

              const shiftX = (overlapX / 2) * (dx >= 0 ? 1 : -1);
              const shiftY = (overlapY / 2) * (dy >= 0 ? 1 : -1);

              p1.x -= shiftX * 0.7;
              p1.y -= shiftY * 0.7;
              p2.x += shiftX * 0.7;
              p2.y += shiftY * 0.7;
            }
          }
        }

        // Keep inside desktop bounds
        for (const p of positions) {
          p.x = Math.max(minX, Math.min(maxX, p.x));
          p.y = Math.max(minY, Math.min(maxY, p.y));
        }
      }

      // 3. Render scattered items
      positions.forEach(({ x, y, proj }) => {
        const item = document.createElement("div");
        item.className = "desktop-item";
        item.dataset.id = proj.id;
        item.style.left = `${Math.round(x)}px`;
        item.style.top  = `${Math.round(y)}px`;

        item.innerHTML = `
          <div class="desktop-icon-wrapper">
            <img src="${proj.cover}" alt="${proj.title}" draggable="false" loading="lazy" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80'">
          </div>
          <div class="desktop-label">${proj.title}</div>
        `;

        // Apple-like Dragging Physics
        let isDragging = false;
        let startX = 0, startY = 0;
        let itemX = 0, itemY = 0;
        let hasMoved = false;

        item.addEventListener("mousedown", (e) => {
          if (e.button !== 0) return;
          e.preventDefault();
          isDragging = true;
          hasMoved = false;
          startX = e.clientX;
          startY = e.clientY;
          itemX = item.offsetLeft || 0;
          itemY = item.offsetTop || 0;

          item.classList.add("is-dragging");
          item.style.zIndex = 300;

          const onMouseMove = (me) => {
            const dx = me.clientX - startX;
            const dy = me.clientY - startY;
            if (Math.abs(dx) > 4 || Math.abs(dy) > 4) hasMoved = true;
            if (hasMoved) {
              const maxDragX = window.innerWidth - ICON_WIDTH - 10;
              const maxDragY = window.innerHeight - 100;
              const newLeft = Math.max(10, Math.min(maxDragX, itemX + dx));
              const newTop  = Math.max(34, Math.min(maxDragY, itemY + dy));
              item.style.left = `${newLeft}px`;
              item.style.top  = `${newTop}px`;
            }
          };

          const onMouseUp = () => {
            isDragging = false;
            item.classList.remove("is-dragging");
            item.style.zIndex = "";
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
            if (!hasMoved) openProjectModal(proj);
          };

          document.addEventListener("mousemove", onMouseMove);
          document.addEventListener("mouseup", onMouseUp);
        });

        desktopGrid.appendChild(item);
      });
    }

    // On mobile, inject native iOS dock; on desktop, mount macOS React dock
    if (isMobile) {
      renderMobileDock();
    } else if (window.updateDesktopReactComponents) {
      window.updateDesktopReactComponents();
    }
  }

  // ==========================================================================
  // iOS 18 Native Bottom Dock (bypasses React component on mobile)
  // ==========================================================================
  function renderMobileDock() {
    const dockEl = document.getElementById("mac-dock");
    if (!dockEl) return;

    const dockApps = [
      {
        id: "phone",
        label: "Phone",
        icon: "assets/images/ios18_clean/phone.png",
        badge: "183",
        onClick: "window.openPhoneApp && window.openPhoneApp()"
      },
      {
        id: "safari",
        label: "Safari",
        icon: "assets/images/ios18_clean/safari.png",
        badge: null,
        onClick: "window.openSafariApp && window.openSafariApp()"
      },
      {
        id: "messages",
        label: "Messages",
        icon: "assets/images/ios18_clean/messages.png",
        badge: "688",
        onClick: "window.openMessagesApp && window.openMessagesApp()"
      },
      {
        id: "music",
        label: "Music",
        icon: "assets/images/ios18_clean/music.png",
        badge: null,
        onClick: "window.openSpotifyWindow && window.openSpotifyWindow()"
      }
    ];

    dockEl.innerHTML = dockApps.map(app => `
      <div class="ios-dock-item" onclick="${app.onClick}">
        <div class="ios-dock-icon-box">
          <img src="${app.icon}" alt="${app.label}" class="ios-dock-icon-img" draggable="false">
          ${app.badge ? `<span class="ios-dock-badge">${app.badge}</span>` : ""}
        </div>
      </div>
    `).join("");
  }
  window.renderMobileDock = renderMobileDock;

  // Multi-Page SpringBoard Horizontal Swipe & Drag Physics
  let activeSwipeCleanup = null;

  function setupSpringBoardSwipe() {
    const slider = document.getElementById("springboard-slider");
    const container = document.getElementById("desktop-grid");
    if (!slider || !container) return;

    if (activeSwipeCleanup) {
      activeSwipeCleanup();
      activeSwipeCleanup = null;
    }

    slider.style.transform = `translateX(-${currentSpringBoardPage * 50}%)`;

    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;
    let isDragging = false;
    let hasMovedHorizontal = false;
    let startTime = 0;

    const onStart = (clientX, clientY) => {
      startX = clientX;
      startY = clientY;
      currentX = clientX;
      currentY = clientY;
      startTime = Date.now();
      isDragging = true;
      hasMovedHorizontal = false;
      slider.style.transition = "none";
    };

    const onMove = (clientX, clientY, e) => {
      if (!isDragging) return;
      currentX = clientX;
      currentY = clientY;
      const diffX = clientX - startX;
      const diffY = clientY - startY;

      if (!hasMovedHorizontal) {
        if (Math.abs(diffX) > 6 && Math.abs(diffX) >= Math.abs(diffY)) {
          hasMovedHorizontal = true;
          window.__suppressNextAppClick = true;
        } else if (Math.abs(diffY) > 8 && Math.abs(diffY) > Math.abs(diffX)) {
          isDragging = false;
          slider.style.transition = "transform 0.35s cubic-bezier(0.2, 0.9, 0.2, 1)";
          slider.style.transform = `translateX(-${currentSpringBoardPage * 50}%)`;
          return;
        }
      }

      if (hasMovedHorizontal) {
        if (e && e.cancelable) e.preventDefault();
        window.__suppressNextAppClick = true;

        const sliderWidth = slider.offsetWidth || window.innerWidth * 2;
        const basePercent = -(currentSpringBoardPage * 50);
        let dragPercent = (diffX / sliderWidth) * 100;

        if ((currentSpringBoardPage === 0 && diffX > 0) || (currentSpringBoardPage === 1 && diffX < 0)) {
          dragPercent *= 0.25;
        }

        slider.style.transform = `translateX(${basePercent + dragPercent}%)`;
      }
    };

    const onEnd = () => {
      if (!isDragging) return;
      isDragging = false;
      slider.style.transition = "transform 0.35s cubic-bezier(0.2, 0.9, 0.2, 1)";

      const diffX = currentX - startX;
      const duration = Date.now() - startTime;
      const velocity = Math.abs(diffX) / Math.max(duration, 1);

      if (hasMovedHorizontal) {
        window.__suppressNextAppClick = true;
        setTimeout(() => {
          window.__suppressNextAppClick = false;
        }, 250);

        if ((diffX < -30 || (diffX < -15 && velocity > 0.2)) && currentSpringBoardPage === 0) {
          switchSpringBoardPage(1);
        } else if ((diffX > 30 || (diffX > 15 && velocity > 0.2)) && currentSpringBoardPage === 1) {
          switchSpringBoardPage(0);
        } else {
          slider.style.transform = `translateX(-${currentSpringBoardPage * 50}%)`;
        }
      } else {
        slider.style.transform = `translateX(-${currentSpringBoardPage * 50}%)`;
      }
    };

    // Touch handlers for mobile
    const touchStartHandler = (e) => {
      if (e.touches && e.touches.length === 1) {
        onStart(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const touchMoveHandler = (e) => {
      if (e.touches && e.touches.length === 1) {
        onMove(e.touches[0].clientX, e.touches[0].clientY, e);
      }
    };

    const touchEndHandler = () => {
      onEnd();
    };

    // Mouse handlers for desktop / emulator
    const mouseDownHandler = (e) => {
      if (e.button !== 0) return;
      onStart(e.clientX, e.clientY);
      window.addEventListener("mousemove", mouseMoveHandler);
      window.addEventListener("mouseup", mouseUpHandler);
    };

    const mouseMoveHandler = (e) => {
      onMove(e.clientX, e.clientY, e);
    };

    const mouseUpHandler = () => {
      onEnd();
      window.removeEventListener("mousemove", mouseMoveHandler);
      window.removeEventListener("mouseup", mouseUpHandler);
    };

    slider.addEventListener("touchstart", touchStartHandler, { passive: true });
    slider.addEventListener("touchmove", touchMoveHandler, { passive: false });
    slider.addEventListener("touchend", touchEndHandler, { passive: true });
    slider.addEventListener("touchcancel", touchEndHandler, { passive: true });
    slider.addEventListener("mousedown", mouseDownHandler);

    activeSwipeCleanup = () => {
      slider.removeEventListener("touchstart", touchStartHandler);
      slider.removeEventListener("touchmove", touchMoveHandler);
      slider.removeEventListener("touchend", touchEndHandler);
      slider.removeEventListener("touchcancel", touchEndHandler);
      slider.removeEventListener("mousedown", mouseDownHandler);
      window.removeEventListener("mousemove", mouseMoveHandler);
      window.removeEventListener("mouseup", mouseUpHandler);
    };
  }

  // Global click suppressor when swiping
  document.addEventListener("click", (e) => {
    if (window.__suppressNextAppClick) {
      e.stopPropagation();
      e.stopImmediatePropagation();
      e.preventDefault();
      window.__suppressNextAppClick = false;
    }
  }, true);

  window.switchSpringBoardPage = function(pageIdx) {
    currentSpringBoardPage = pageIdx;
    const slider = document.getElementById("springboard-slider");
    if (slider) {
      slider.style.transition = "transform 0.38s cubic-bezier(0.2, 0.9, 0.2, 1)";
      slider.style.transform = `translateX(-${pageIdx * 50}%)`;
    }
    const dot0 = document.getElementById("dot-page-0");
    const dot1 = document.getElementById("dot-page-1");
    if (dot0 && dot1) {
      dot0.classList.toggle("active", pageIdx === 0);
      dot1.classList.toggle("active", pageIdx === 1);
      dot0.setAttribute("aria-selected", pageIdx === 0 ? "true" : "false");
      dot1.setAttribute("aria-selected", pageIdx === 1 ? "true" : "false");
    }
    if (navigator.vibrate) {
      try { navigator.vibrate(10); } catch (e) {}
    }
  };

  renderAppGrid();
  window.addEventListener("resize", renderAppGrid);

  // ==========================================================================
  // 5. Window Manager Core (Desktop Floating Windows + iOS Bottom Sheets)
  // ==========================================================================
  function createWindow({ id, title, width = "620px", contentHTML, top = "15%", left = "25%" }) {
    if (activeWindows[id]) {
      focusWindow(activeWindows[id]);
      return activeWindows[id];
    }

    highestZIndex += 1;
    const win = document.createElement("div");
    win.className = "mac-window focused app-opening";
    win.id = `win-${id}`;

    const isMobile = window.innerWidth <= 768;

    if (!isMobile) {
      win.style.width = width;
      win.style.top = top;
      win.style.left = left;
    }

    win.style.zIndex = highestZIndex;

    win.innerHTML = `
      <div class="window-header">
        <div class="window-traffic-lights">
          <button class="traffic-btn close" title="Close">✕</button>
          <button class="traffic-btn minimize" title="Minimize">−</button>
          <button class="traffic-btn maximize" title="Maximize">+</button>
        </div>
        <div class="window-title">${title}</div>
      </div>
      <div class="window-body">
        ${contentHTML}
      </div>
    `;

    // Window controls (Desktop)
    const closeBtn = win.querySelector(".traffic-btn.close");
    if (closeBtn) closeBtn.addEventListener("click", (e) => { e.stopPropagation(); closeWindow(id); });
    
    const minimizeBtn = win.querySelector(".traffic-btn.minimize");
    if (minimizeBtn) minimizeBtn.addEventListener("click", (e) => { e.stopPropagation(); closeWindow(id); });

    const maximizeBtn = win.querySelector(".traffic-btn.maximize");
    if (maximizeBtn) maximizeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!isMobile) win.classList.toggle("maximized");
    });

    // Make window focusable
    win.addEventListener("mousedown", () => focusWindow(win));
    win.addEventListener("touchstart", () => focusWindow(win), { passive: true });

    // Enable dragging on desktop and Apple-like swipe-down-to-dismiss on mobile
    setupWindowInteraction(win, id);

    windowStack.appendChild(win);
    activeWindows[id] = win;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        win.classList.remove("app-opening");
        win.classList.add("visible");
      });
    });

    return win;
  }

  function focusWindow(win) {
    document.querySelectorAll(".mac-window").forEach(w => w.classList.remove("focused"));
    highestZIndex += 1;
    win.style.zIndex = highestZIndex;
    win.classList.add("focused");
  }

  function closeWindow(id) {
    const win = activeWindows[id];
    if (!win) return;
    win.classList.remove("visible");
    win.classList.add("closing");
    setTimeout(() => {
      if (win.parentNode) win.parentNode.removeChild(win);
      delete activeWindows[id];
    }, 320);
  }
  window.closeWindow = closeWindow;

  window.closeAllMobileWindows = function() {
    Object.keys(activeWindows).forEach(id => closeWindow(id));
  };

  // Setup Dragging (Desktop) & Apple Slide Down Dismissal (Mobile)
  function setupWindowInteraction(win, id) {
    const header = win.querySelector(".window-header");
    if (!header) return;

    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
      let startY = 0;
      let startX = 0;
      let currentTranslateY = 0;
      let startTime = 0;
      let isDragging = false;

      const handleStart = (clientY, clientX) => {
        startY = clientY;
        startX = clientX;
        startTime = Date.now();
        currentTranslateY = 0;
        isDragging = true;
        win.style.transition = "none";
      };

      const handleMove = (clientY, clientX, e) => {
        if (!isDragging) return;
        const diffY = clientY - startY;
        const diffX = clientX - startX;

        // If dragging downward, follow finger directly
        if (diffY > 0) {
          if (e && e.cancelable) e.preventDefault();
          currentTranslateY = diffY;
          win.style.transform = `translateY(${diffY}px)`;
        } else if (diffY < 0) {
          // Rubber banding upward resistance
          currentTranslateY = diffY * 0.2;
          win.style.transform = `translateY(${currentTranslateY}px)`;
        }
      };

      const handleEnd = () => {
        if (!isDragging) return;
        isDragging = false;
        win.style.transition = "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)";

        const duration = Date.now() - startTime;
        const velocity = currentTranslateY / Math.max(duration, 1);

        // Apple sheet dismiss logic: dragged down > 50px or flicked down
        if (currentTranslateY > 50 || (currentTranslateY > 15 && velocity > 0.2)) {
          win.style.transform = "translateY(100%)";
          setTimeout(() => {
            closeWindow(id);
          }, 240);
        } else {
          win.style.transform = "translateY(0)";
        }
        currentTranslateY = 0;
      };

      // Touch events on the mobile header grabber area
      header.addEventListener("touchstart", (e) => {
        if (e.touches && e.touches.length === 1) {
          handleStart(e.touches[0].clientY, e.touches[0].clientX);
        }
      }, { passive: true });

      header.addEventListener("touchmove", (e) => {
        if (e.touches && e.touches.length === 1) {
          handleMove(e.touches[0].clientY, e.touches[0].clientX, e);
        }
      }, { passive: false });

      header.addEventListener("touchend", () => {
        handleEnd();
      }, { passive: true });

      header.addEventListener("touchcancel", () => {
        handleEnd();
      }, { passive: true });

      // Mouse drag down on header (for testing and hybrid touch)
      header.addEventListener("mousedown", (e) => {
        if (e.button !== 0) return;
        handleStart(e.clientY, e.clientX);

        const onMouseMove = (me) => {
          handleMove(me.clientY, me.clientX, me);
        };

        const onMouseUp = () => {
          handleEnd();
          window.removeEventListener("mousemove", onMouseMove);
          window.removeEventListener("mouseup", onMouseUp);
        };

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
      });

    } else {
      let isDragging = false;
      let offsetX = 0;
      let offsetY = 0;

      header.addEventListener("mousedown", (e) => {
        if (e.target.classList.contains("traffic-btn")) return;
        isDragging = true;
        offsetX = e.clientX - win.offsetLeft;
        offsetY = e.clientY - win.offsetTop;
        focusWindow(win);

        const onMouseMove = (me) => {
          if (!isDragging) return;
          const winWidth = win.offsetWidth || 320;
          const newX = Math.max(5, Math.min(window.innerWidth - winWidth - 5, me.clientX - offsetX));
          const newY = Math.max(30, Math.min(window.innerHeight - 60, me.clientY - offsetY));
          win.style.left = `${newX}px`;
          win.style.top = `${newY}px`;
        };

        const onMouseUp = () => {
          isDragging = false;
          document.removeEventListener("mousemove", onMouseMove);
          document.removeEventListener("mouseup", onMouseUp);
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
      });
    }
  }

  // ==========================================================================
  // 6. Interactive iOS 18 Modals & Core Application Windows
  // ==========================================================================

  // --- Weather App ---
  window.openWeatherApp = function() {
    const content = `
      <div style="text-align: center; padding: 10px 0 20px 0;">
        <div style="font-size: 24px; font-weight: 700; color: #fff;">New Delhi</div>
        <div style="font-size: 64px; font-weight: 200; color: #fff; line-height: 1; margin: 6px 0;">29°</div>
        <div style="font-size: 15px; font-weight: 600; color: rgba(255,255,255,0.85);">Cloudy</div>
        <div style="font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.65); margin-top: 2px;">H:32°  L:27°</div>
      </div>

      <div class="ios-modal-section">
        <div style="font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.6); text-transform: uppercase; margin-bottom: 12px;">Cloudy conditions will continue for the rest of the day.</div>
        <div style="display: flex; gap: 18px; overflow-x: auto; padding-bottom: 6px; scrollbar-width: none;">
          ${[
            { t: "Now", i: "☁️", temp: "29°" },
            { t: "7 PM", i: "☁️", temp: "28°" },
            { t: "8 PM", i: "🌧️", temp: "27°" },
            { t: "9 PM", i: "🌧️", temp: "27°" },
            { t: "10 PM", i: "☁️", temp: "26°" },
            { t: "11 PM", i: "🌙", temp: "25°" },
            { t: "12 AM", i: "🌙", temp: "24°" },
          ].map(h => `
            <div style="display: flex; flex-direction: column; align-items: center; gap: 6px; min-width: 44px;">
              <span style="font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.85);">${h.t}</span>
              <span style="font-size: 18px;">${h.i}</span>
              <span style="font-size: 14px; font-weight: 700; color: #fff;">${h.temp}</span>
            </div>
          `).join("")}
        </div>
      </div>

      <div class="ios-modal-section">
        <div style="font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.6); text-transform: uppercase; margin-bottom: 10px;">10-DAY FORECAST</div>
        ${[
          { d: "Today", i: "☁️", min: 27, max: 32 },
          { d: "Sun", i: "🌧️", min: 26, max: 31 },
          { d: "Mon", i: "⛈️", min: 25, max: 30 },
          { d: "Tue", i: "⛅", min: 26, max: 33 },
          { d: "Wed", i: "☀️", min: 27, max: 34 },
          { d: "Thu", i: "☀️", min: 28, max: 35 }
        ].map(f => `
          <div class="ios-modal-row">
            <span style="font-size: 14px; font-weight: 700; width: 60px;">${f.d}</span>
            <span style="font-size: 18px;">${f.i}</span>
            <div style="display: flex; align-items: center; gap: 8px; flex: 1; justify-content: flex-end;">
              <span style="font-size: 13px; color: rgba(255,255,255,0.6);">${f.min}°</span>
              <div style="width: 80px; height: 4px; background: linear-gradient(90deg, #60a5fa 0%, #f59e0b 100%); border-radius: 2px;"></div>
              <span style="font-size: 13px; font-weight: 700;">${f.max}°</span>
            </div>
          </div>
        `).join("")}
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
        <div class="ios-modal-section">
          <div style="font-size: 10px; font-weight: 800; color: rgba(255,255,255,0.6);">AIR QUALITY</div>
          <div style="font-size: 22px; font-weight: 800; margin: 4px 0;">42 - Good</div>
          <div style="font-size: 11px; color: rgba(255,255,255,0.7);">Air quality is ideal for outdoor creative shoots.</div>
        </div>
        <div class="ios-modal-section">
          <div style="font-size: 10px; font-weight: 800; color: rgba(255,255,255,0.6);">UV INDEX</div>
          <div style="font-size: 22px; font-weight: 800; margin: 4px 0;">6 - Moderate</div>
          <div style="font-size: 11px; color: rgba(255,255,255,0.7);">Use protection until 5:00 PM.</div>
        </div>
      </div>
    `;
    createWindow({ id: "weather", title: "Weather", contentHTML: content });
  };

  // --- Calendar App ---
  window.openCalendarApp = function() {
    const content = `
      <div style="padding: 6px 0;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <div>
            <h2 style="font-size: 22px; font-weight: 900;">August 2026</h2>
            <div style="font-size: 12px; color: #ff3b30; font-weight: 700;">Casey's Studio Schedule</div>
          </div>
          <button onclick="window.openContactWindow()" style="background: #007aff; color: #fff; border: none; padding: 8px 14px; border-radius: 18px; font-size: 12px; font-weight: 700; cursor: pointer;">
            + Book Project
          </button>
        </div>

        <div class="ios-modal-section">
          <div style="font-size: 11px; font-weight: 800; color: #ff3b30; text-transform: uppercase; margin-bottom: 10px;">Upcoming Milestones & Availability</div>
          ${[
            { time: "Today · 2:00 PM", title: "Album Packaging Deluxe Foil Final Proof", tag: "SBM Label", color: "#10b981" },
            { time: "Mon, Aug 17", title: "Arena Tour Stage LED Visual Loop Rendering", tag: "Concert Tour", color: "#3b82f6" },
            { time: "Thu, Aug 20", title: "Streetwear Merch Drop Lookbook Shoot", tag: "Capsule Drop", color: "#f59e0b" },
            { time: "Next Month", title: "Open for Q4 Album Art & Tour Visual Contracts", tag: "Booking Open", color: "#8b5cf6" }
          ].map(e => `
            <div style="display: flex; gap: 12px; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08);">
              <div style="width: 4px; border-radius: 2px; background: ${e.color};"></div>
              <div>
                <div style="font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.6);">${e.time}</div>
                <div style="font-size: 14px; font-weight: 800; color: #fff; margin: 2px 0;">${e.title}</div>
                <span style="font-size: 10px; font-weight: 800; background: rgba(255,255,255,0.1); padding: 2px 8px; border-radius: 10px; color: ${e.color};">${e.tag}</span>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `;
    createWindow({ id: "calendar", title: "Calendar", contentHTML: content });
  };

  // --- Camera App ---
  window.openCameraApp = function() {
    const content = `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%;">
        <div style="position: relative; width: 100%; height: 380px; background: #000; border-radius: 20px; overflow: hidden; border: 1px solid rgba(255,255,255,0.2);">
          <video id="camera-feed" autoplay playsinline muted style="width: 100%; height: 100%; object-fit: cover;"></video>
          <div id="camera-fallback" style="position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; background: url('assets/images/casey_portrait.png') center/cover; filter: contrast(1.1);">
            <div style="background: rgba(0,0,0,0.6); backdrop-filter: blur(10px); padding: 8px 16px; border-radius: 14px; font-size: 12px; font-weight: 700; color: #fff;">
              📸 Live Viewfinder Active
            </div>
          </div>
          
          <div style="position: absolute; inset: 0; pointer-events: none; display: grid; grid-template-columns: 1fr 1fr 1fr; grid-template-rows: 1fr 1fr 1fr; opacity: 0.25;">
            <div style="border-right: 1px solid #fff; border-bottom: 1px solid #fff;"></div>
            <div style="border-right: 1px solid #fff; border-bottom: 1px solid #fff;"></div>
            <div style="border-bottom: 1px solid #fff;"></div>
            <div style="border-right: 1px solid #fff; border-bottom: 1px solid #fff;"></div>
            <div style="border-right: 1px solid #fff; border-bottom: 1px solid #fff;"></div>
            <div style="border-bottom: 1px solid #fff;"></div>
            <div style="border-right: 1px solid #fff;"></div>
            <div style="border-right: 1px solid #fff;"></div>
            <div></div>
          </div>
        </div>

        <div style="display: flex; gap: 18px; font-size: 12px; font-weight: 800; color: rgba(255,255,255,0.6); margin: 16px 0 12px 0;">
          <span>CINEMATIC</span>
          <span>VIDEO</span>
          <span style="color: #f59e0b;">PHOTO</span>
          <span>PORTRAIT</span>
          <span>PANO</span>
        </div>

        <div style="display: flex; align-items: center; justify-content: space-around; width: 100%; max-width: 280px;">
          <div onclick="window.openGalleryWindow()" style="width: 44px; height: 44px; border-radius: 10px; overflow: hidden; border: 2px solid #fff; cursor: pointer;">
            <img src="assets/images/casey_portrait.png" style="width: 100%; height: 100%; object-fit: cover;">
          </div>
          <button onclick="
            const f = document.getElementById('camera-fallback');
            if (f) {
              f.style.filter = 'brightness(2.5)';
              setTimeout(() => f.style.filter = 'contrast(1.1)', 150);
            }
            if (navigator.vibrate) navigator.vibrate(20);
          " style="width: 68px; height: 68px; border-radius: 50%; background: #ffffff; border: 4px solid rgba(0,0,0,0.8); box-shadow: 0 0 0 3px #ffffff; cursor: pointer; transition: transform 0.1s ease;">
          </button>
          <button onclick="window.openGalleryWindow()" style="width: 44px; height: 44px; border-radius: 50%; background: rgba(255,255,255,0.15); border: none; color: #fff; font-size: 18px; cursor: pointer;">
            🖼️
          </button>
        </div>
      </div>
    `;
    createWindow({ id: "camera", title: "Camera", contentHTML: content });

    setTimeout(() => {
      const video = document.getElementById('camera-feed');
      const fallback = document.getElementById('camera-fallback');
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
          .then(stream => {
            if (video) {
              video.srcObject = stream;
              if (fallback) fallback.style.display = 'none';
            }
          })
          .catch(e => console.log("Camera access:", e));
      }
    }, 100);
  };

  // --- Folder Popup ("Camera shit") ---
  window.openCameraFolder = function() {
    const overlay = document.getElementById('ios-folder-overlay');
    if (overlay) overlay.classList.add('visible');
    if (navigator.vibrate) try { navigator.vibrate(10); } catch(e){}
  };

  window.closeCameraFolder = function() {
    const overlay = document.getElementById('ios-folder-overlay');
    if (overlay) overlay.classList.remove('visible');
  };

  // --- Phone App ---
  window.openPhoneApp = function() {
    const content = `
      <div style="padding: 10px 0; text-align: center;">
        <div style="font-size: 20px; font-weight: 900; margin-bottom: 4px;">Contacts & Direct Inquiries</div>
        <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 16px;">Direct Channels to Casey</div>

        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 20px;">
          <a href="mailto:khushalchhabra08@gmail.com" style="background: #ea4335; color: #fff; padding: 12px; border-radius: 16px; text-decoration: none; font-size: 12px; font-weight: 700; display: flex; flex-direction: column; align-items: center; gap: 4px; box-shadow: 0 4px 14px rgba(234,67,53,0.4);">
            <span style="font-size: 18px;">✉️</span> Email
          </a>
          <a href="https://www.instagram.com/caseyxlive/" target="_blank" style="background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888); color: #fff; padding: 12px; border-radius: 16px; text-decoration: none; font-size: 12px; font-weight: 700; display: flex; flex-direction: column; align-items: center; gap: 4px; box-shadow: 0 4px 14px rgba(220,39,67,0.4);">
            <span style="font-size: 18px;">📸</span> Instagram
          </a>
          <a href="https://t.me/caseyxlive" target="_blank" style="background: #0088cc; color: #fff; padding: 12px; border-radius: 16px; text-decoration: none; font-size: 12px; font-weight: 700; display: flex; flex-direction: column; align-items: center; gap: 4px; box-shadow: 0 4px 14px rgba(0,136,204,0.4);">
            <span style="font-size: 18px;">✈️</span> Telegram
          </a>
        </div>

        <div id="phone-display-number" style="font-size: 18px; font-weight: 700; height: 36px; color: #60a5fa; letter-spacing: 0.5px; margin-bottom: 12px;">khushalchhabra08@gmail.com</div>

        <div style="display: flex; justify-content: center; gap: 16px;">
          <a href="mailto:khushalchhabra08@gmail.com" style="width: 58px; height: 58px; border-radius: 50%; background: #007aff; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 24px; text-decoration: none; box-shadow: 0 6px 20px rgba(0,122,255,0.5);">
            ✉️
          </a>
        </div>
      </div>
    `;
    createWindow({ id: "phone", title: "Contacts", contentHTML: content });
  };

  // --- Messages App (iMessage with Interactive Bot) ---
  window.openMessagesApp = function() {
    const content = `
      <div style="display: flex; flex-direction: column; height: 460px;">
        <div style="display: flex; flex-direction: column; align-items: center; padding-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.1);">
          <img src="assets/images/casey_portrait.png" style="width: 48px; height: 48px; border-radius: 50%; margin-bottom: 4px; border: 1px solid rgba(255,255,255,0.3);">
          <div style="font-size: 14px; font-weight: 800; color: #fff;">Casey (Khushal)</div>
          <div style="font-size: 11px; color: #34c759; font-weight: 700;">● Active Now · iMessage</div>
        </div>

        <div id="imessage-thread" style="flex: 1; overflow-y: auto; padding: 14px 0; display: flex; flex-direction: column; gap: 10px;">
          <div style="align-self: flex-start; max-width: 80%; background: rgba(255,255,255,0.12); padding: 10px 14px; border-radius: 18px 18px 18px 4px; font-size: 13px; color: #fff; line-height: 1.4;">
            Hey! Thanks for checking out my iOS 18 portfolio. What kind of design or art direction project are you planning?
          </div>
        </div>

        <div style="display: flex; gap: 8px; overflow-x: auto; padding: 6px 0; scrollbar-width: none;">
          <button onclick="window.sendAutoMessage('🔥 Looking for an Album Cover & Deluxe Vinyl rollout!')" style="white-space: nowrap; background: rgba(0,122,255,0.2); border: 1px solid #007aff; color: #60a5fa; font-size: 11px; font-weight: 700; padding: 6px 12px; border-radius: 14px; cursor: pointer;">
            🔥 Album Cover & Vinyl
          </button>
          <button onclick="window.sendAutoMessage('⚡ Need Arena Concert Stage Motion Loops!')" style="white-space: nowrap; background: rgba(0,122,255,0.2); border: 1px solid #007aff; color: #60a5fa; font-size: 11px; font-weight: 700; padding: 6px 12px; border-radius: 14px; cursor: pointer;">
            ⚡ Tour Stage Visuals
          </button>
          <button onclick="window.sendAutoMessage('💼 What are your rates and availability?')" style="white-space: nowrap; background: rgba(0,122,255,0.2); border: 1px solid #007aff; color: #60a5fa; font-size: 11px; font-weight: 700; padding: 6px 12px; border-radius: 14px; cursor: pointer;">
            💼 Rates & Timeline
          </button>
        </div>

        <form onsubmit="event.preventDefault(); window.handleUserMessage();" style="display: flex; gap: 8px; margin-top: 8px;">
          <input id="imessage-input" type="text" placeholder="iMessage" style="flex: 1; height: 38px; border-radius: 19px; background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.2); color: #fff; padding: 0 16px; font-size: 13px; outline: none;">
          <button type="submit" style="width: 38px; height: 38px; border-radius: 50%; background: #007aff; border: none; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 16px; cursor: pointer;">
            ↑
          </button>
        </form>
      </div>
    `;
    createWindow({ id: "messages", title: "iMessage", contentHTML: content });
  };

  window.sendAutoMessage = function(text) {
    const input = document.getElementById("imessage-input");
    if (input) {
      input.value = text;
      window.handleUserMessage();
    }
  };

  window.handleUserMessage = function() {
    const input = document.getElementById("imessage-input");
    const thread = document.getElementById("imessage-thread");
    if (!input || !thread || !input.value.trim()) return;

    const userText = input.value.trim();
    input.value = "";

    // Append User Bubble
    const userBubble = document.createElement("div");
    userBubble.style.cssText = "align-self: flex-end; max-width: 80%; background: #007aff; padding: 10px 14px; border-radius: 18px 18px 4px 18px; font-size: 13px; color: #fff; line-height: 1.4;";
    userBubble.textContent = userText;
    thread.appendChild(userBubble);
    thread.scrollTop = thread.scrollHeight;

    // Casey Reply
    setTimeout(() => {
      const caseyBubble = document.createElement("div");
      caseyBubble.style.cssText = "align-self: flex-start; max-width: 80%; background: rgba(255,255,255,0.12); padding: 10px 14px; border-radius: 18px 18px 18px 4px; font-size: 13px; color: #fff; line-height: 1.4;";
      
      let reply = "Sounds awesome! Let's connect directly via email (khushalchhabra08@gmail.com) or Instagram (@caseyxlive) to lock in the timeline and deliverables.";
      if (userText.toLowerCase().includes("rate") || userText.toLowerCase().includes("cost")) {
        reply = "My project packages start with custom quotes based on scope. You can check my Wallet app for rate cards or drop a brief to khushalchhabra08@gmail.com!";
      } else if (userText.toLowerCase().includes("stage") || userText.toLowerCase().includes("tour")) {
        reply = "Stage motion loops and LED visuals are my specialty! I render in 4K/60fps with seamless looping for Resolume/AV software.";
      }
      
      caseyBubble.textContent = reply;
      thread.appendChild(caseyBubble);
      thread.scrollTop = thread.scrollHeight;
      if (navigator.vibrate) try { navigator.vibrate(15); } catch(e){}
    }, 600);
  };

  // --- Notes App ---
  window.openNotesApp = function() {
    const data = window.PORTFOLIO_DATA || (typeof PORTFOLIO_DATA !== "undefined" ? PORTFOLIO_DATA : {});
    const content = `
      <div style="padding: 4px 0;">
        <h2 style="font-size: 22px; font-weight: 900; margin-bottom: 14px;">Notes</h2>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <div class="ios-modal-section" style="cursor: pointer;" onclick="window.openNotebookWindow()">
            <div style="font-size: 15px; font-weight: 800; color: #f59e0b; margin-bottom: 4px;">📝 About Casey (CV & Bio)</div>
            <div style="font-size: 12px; color: var(--text-muted); line-height: 1.4;">${data.personal.bio}</div>
            <div style="font-size: 11px; color: rgba(255,255,255,0.4); margin-top: 6px;">Tap to view full CV & Experience ›</div>
          </div>

          <div class="ios-modal-section">
            <div style="font-size: 15px; font-weight: 800; color: #60a5fa; margin-bottom: 4px;">🎨 Design Philosophy</div>
            <div style="font-size: 12px; color: var(--text-muted); line-height: 1.4;">
              Merging high-contrast brutalist aesthetics with analogue warmth and precision typography for modern music culture.
            </div>
          </div>

          <div class="ios-modal-section">
            <div style="font-size: 15px; font-weight: 800; color: #10b981; margin-bottom: 4px;">⚡ Capabilities & Tooling</div>
            <div style="font-size: 12px; color: var(--text-muted); line-height: 1.4;">
              After Effects, Photoshop, Illustrator, Cinema 4D, Blender, Figma, Premiere Pro, Final Cut Pro.
            </div>
          </div>
        </div>
      </div>
    `;
    createWindow({ id: "notes", title: "Notes", contentHTML: content });
  };

  // --- Reminders App ---
  window.openRemindersApp = function() {
    const content = `
      <div style="padding: 4px 0;">
        <h2 style="font-size: 22px; font-weight: 900; color: #3b82f6; margin-bottom: 14px;">Reminders</h2>
        <div class="ios-modal-section">
          <div style="font-size: 11px; font-weight: 800; color: rgba(255,255,255,0.6); text-transform: uppercase; margin-bottom: 12px;">Active Studio Deliverables</div>
          ${[
            "Finalize deluxe gatefold foil embossing proof for SBM Label",
            "Export 4K LED concert stage loops for nationwide stadium tour",
            "Package streetwear capsule hoodie graphics for screenprinting",
            "Deliver Spotify Canvas visualizer loops for new single rollout",
            "Update Behance portfolio with latest 3D typography explorations"
          ].map((r, idx) => `
            <div class="ios-modal-row" onclick="
              const c = this.querySelector('.rem-circle');
              c.classList.toggle('checked');
              if (c.classList.contains('checked')) {
                c.style.background = '#3b82f6';
                this.style.opacity = '0.5';
              } else {
                c.style.background = 'transparent';
                this.style.opacity = '1';
              }
            " style="cursor: pointer;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <div class="rem-circle" style="width: 20px; height: 20px; border-radius: 50%; border: 2px solid #3b82f6; transition: all 0.2s ease;"></div>
                <span style="font-size: 13px; color: #fff;">${r}</span>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `;
    createWindow({ id: "reminders", title: "Reminders", contentHTML: content });
  };

  // --- Clock App ---
  window.openClockApp = function() {
    const now = new Date();
    const content = `
      <div style="padding: 4px 0;">
        <h2 style="font-size: 22px; font-weight: 900; margin-bottom: 14px;">World Clock</h2>
        <div class="ios-modal-section">
          ${[
            { city: "Warsaw", offset: "+1.5 HRS", time: now.toLocaleTimeString('en-US', { timeZone: 'Europe/Warsaw', hour: '2-digit', minute: '2-digit' }) },
            { city: "London", offset: "+0.5 HRS", time: now.toLocaleTimeString('en-US', { timeZone: 'Europe/London', hour: '2-digit', minute: '2-digit' }) },
            { city: "New York", offset: "-9.5 HRS", time: now.toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour: '2-digit', minute: '2-digit' }) },
            { city: "Tokyo", offset: "+3.5 HRS", time: now.toLocaleTimeString('en-US', { timeZone: 'Asia/Tokyo', hour: '2-digit', minute: '2-digit' }) },
            { city: "Jaipur (Studio)", offset: "LOCAL", time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) }
          ].map(c => `
            <div class="ios-modal-row">
              <div>
                <div style="font-size: 11px; color: rgba(255,255,255,0.5);">${c.offset}</div>
                <div style="font-size: 16px; font-weight: 800; color: #fff;">${c.city}</div>
              </div>
              <div style="font-size: 24px; font-weight: 300; color: #fff;">${c.time}</div>
            </div>
          `).join("")}
        </div>
      </div>
    `;
    createWindow({ id: "clock", title: "Clock", contentHTML: content });
  };

  // --- TV App (Motion Showreel) ---
  window.openTvApp = function() {
    const content = `
      <div style="padding: 4px 0;">
        <h2 style="font-size: 22px; font-weight: 900; margin-bottom: 6px;">Stage & Motion TV</h2>
        <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 14px;">Arena concert visuals, 3D typography loops, and music video trailers.</p>
        <div style="border-radius: 16px; overflow: hidden; background: #000; box-shadow: 0 10px 30px rgba(0,0,0,0.6); margin-bottom: 16px;">
          <video src="assets/images/purple-eyes-live-wallpaper.mp4" autoplay loop muted controls playsinline style="width: 100%; max-height: 240px; object-fit: cover;"></video>
        </div>
        <div class="ios-modal-section">
          <div style="font-size: 14px; font-weight: 800; margin-bottom: 4px;">Live Arena LED Loops</div>
          <div style="font-size: 12px; color: var(--text-muted);">High impact audio-reactive animations built in Blender & After Effects for festival stages.</div>
        </div>
      </div>
    `;
    createWindow({ id: "tv", title: "Apple TV", contentHTML: content });
  };

  // --- Podcasts App ---
  window.openPodcastsApp = function() {
    const content = `
      <div style="padding: 4px 0;">
        <h2 style="font-size: 22px; font-weight: 900; color: #a855f7; margin-bottom: 14px;">Podcasts & Talks</h2>
        <div class="ios-modal-section">
          ${[
            { title: "Ep 12: The Art of Hip-Hop Vinyl Packaging", show: "Casey Studio Sessions", dur: "42 min" },
            { title: "Ep 08: Stage Motion Loops for Arena Tours", show: "Visual Culture", dur: "38 min" },
            { title: "Ep 03: Typography Systems in Electronic Music", show: "Design Breakdown", dur: "29 min" }
          ].map(p => `
            <div class="ios-modal-row" onclick="window.openSpotifyWindow()" style="cursor: pointer;">
              <div>
                <div style="font-size: 14px; font-weight: 800; color: #fff;">${p.title}</div>
                <div style="font-size: 11px; color: var(--text-muted);">${p.show} · ${p.dur}</div>
              </div>
              <span style="font-size: 18px; color: #a855f7;">▶</span>
            </div>
          `).join("")}
        </div>
      </div>
    `;
    createWindow({ id: "podcasts", title: "Podcasts", contentHTML: content });
  };

  // --- App Store App (Featured Projects Showcase) ---
  window.openAppStoreApp = function() {
    const data = window.PORTFOLIO_DATA || (typeof PORTFOLIO_DATA !== "undefined" ? PORTFOLIO_DATA : {});
    const content = `
      <div style="padding: 4px 0;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
          <h2 style="font-size: 22px; font-weight: 900; color: #007aff;">App Store</h2>
          <span style="font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.6);">${data.projects.length} Works Available</span>
        </div>

        <div style="display: flex; flex-direction: column; gap: 12px;">
          ${(data.projects || []).map(p => `
            <div class="ios-modal-section" style="display: flex; gap: 14px; align-items: center;">
              <img src="${p.cover}" style="width: 58px; height: 58px; border-radius: 14px; object-fit: cover; box-shadow: 0 4px 12px rgba(0,0,0,0.4);">
              <div style="flex: 1; overflow: hidden;">
                <div style="font-size: 14px; font-weight: 800; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${p.title}</div>
                <div style="font-size: 11px; color: #60a5fa; font-weight: 700;">${p.category}</div>
                <div style="font-size: 10px; color: var(--text-muted);">${p.client} · ${p.year}</div>
              </div>
              <button onclick="window.openProjectModal(${JSON.stringify(p).replace(/"/g, '&quot;')})" style="background: rgba(255,255,255,0.2); color: #007aff; border: none; font-size: 12px; font-weight: 800; padding: 6px 14px; border-radius: 16px; cursor: pointer;">
                GET
              </button>
            </div>
          `).join("")}
        </div>
      </div>
    `;
    createWindow({ id: "appstore", title: "App Store", contentHTML: content });
  };

  // --- Maps App (Studio Location & Global Clients) ---
  window.openMapsApp = function() {
    const content = `
      <div style="padding: 4px 0;">
        <h2 style="font-size: 22px; font-weight: 900; margin-bottom: 12px;">Global Clients & Studio</h2>
        <div class="ios-modal-section" style="text-align: center; padding: 20px;">
          <div style="font-size: 40px; margin-bottom: 8px;">🌍</div>
          <div style="font-size: 18px; font-weight: 800; color: #fff;">Jaipur · London · Warsaw</div>
          <div style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">Available for projects worldwide with seamless remote collaboration.</div>
        </div>
        <div class="ios-modal-section">
          <div style="font-size: 11px; font-weight: 800; color: rgba(255,255,255,0.6); text-transform: uppercase; margin-bottom: 10px;">Client Distribution</div>
          <div class="ios-modal-row"><span>London, United Kingdom</span><span style="color:#60a5fa; font-weight:700;">ELVT.live</span></div>
          <div class="ios-modal-row"><span>Warsaw, Poland</span><span style="color:#60a5fa; font-weight:700;">SBM Label & Newonce</span></div>
          <div class="ios-modal-row"><span>Bengaluru, India</span><span style="color:#60a5fa; font-weight:700;">NECMERconsult</span></div>
          <div class="ios-modal-row"><span>Global (Remote)</span><span style="color:#60a5fa; font-weight:700;">Aceternity & Bausch + Lomb</span></div>
        </div>
      </div>
    `;
    createWindow({ id: "maps", title: "Maps", contentHTML: content });
  };

  // --- Health App (Creative Stats) ---
  window.openHealthApp = function() {
    const content = `
      <div style="padding: 4px 0;">
        <h2 style="font-size: 22px; font-weight: 900; color: #ff2d55; margin-bottom: 14px;">Studio Health & Stats</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
          <div class="ios-modal-section">
            <div style="font-size: 10px; font-weight: 800; color: #ff2d55;">VIEWS DELIVERED</div>
            <div style="font-size: 24px; font-weight: 900; color: #fff; margin: 4px 0;">500K+</div>
            <div style="font-size: 11px; color: var(--text-muted);">Cumulative social reach</div>
          </div>
          <div class="ios-modal-section">
            <div style="font-size: 10px; font-weight: 800; color: #34c759;">CLIENT HAPPINESS</div>
            <div style="font-size: 24px; font-weight: 900; color: #fff; margin: 4px 0;">100%</div>
            <div style="font-size: 11px; color: var(--text-muted);">On-time delivery</div>
          </div>
        </div>
        <div class="ios-modal-section">
          <div style="font-size: 11px; font-weight: 800; color: rgba(255,255,255,0.6); text-transform: uppercase; margin-bottom: 10px;">Weekly Creative Rings</div>
          <div class="ios-modal-row"><span>🔴 Design Output</span><span style="font-weight:700; color:#ff2d55;">380% (Goal Met)</span></div>
          <div class="ios-modal-row"><span>🟢 Render Efficiency</span><span style="font-weight:700; color:#34c759;">100% 4K/60fps</span></div>
          <div class="ios-modal-row"><span>🔵 Typography Precision</span><span style="font-weight:700; color:#007aff;">Flawless Kerning</span></div>
        </div>
      </div>
    `;
    createWindow({ id: "health", title: "Health", contentHTML: content });
  };

  // --- Wallet App (Apple Passes) ---
  window.openWalletApp = function() {
    const content = `
      <div style="padding: 4px 0;">
        <h2 style="font-size: 22px; font-weight: 900; margin-bottom: 14px;">Apple Wallet</h2>
        <div style="display: flex; flex-direction: column; gap: 14px;">
          
          <!-- VIP Pass -->
          <div style="background: linear-gradient(135deg, #1f2937 0%, #111827 100%); border: 1px solid rgba(255,255,255,0.25); border-radius: 20px; padding: 18px; box-shadow: 0 10px 30px rgba(0,0,0,0.6);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
              <span style="font-size: 12px; font-weight: 800; color: #f59e0b; letter-spacing: 0.5px;">STUDIO VIP PASS</span>
              <span style="font-size: 14px;"></span>
            </div>
            <div style="font-size: 20px; font-weight: 900; color: #fff;">CASEY ALL-ACCESS</div>
            <div style="font-size: 11px; color: rgba(255,255,255,0.6); margin-top: 4px;">Art Direction & Brand Identity</div>
            <div style="display: flex; justify-content: space-between; margin-top: 20px; border-top: 1px dashed rgba(255,255,255,0.2); padding-top: 10px;">
              <span style="font-size: 11px; color: rgba(255,255,255,0.6);">HOLDER: VIP CLIENT</span>
              <span style="font-size: 11px; color: #10b981; font-weight: 700;">VALID: 2026/2027</span>
            </div>
          </div>

          <!-- Rate Card Pass -->
          <div style="background: linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%); border: 1px solid rgba(255,255,255,0.25); border-radius: 20px; padding: 18px; box-shadow: 0 10px 30px rgba(0,0,0,0.6);" onclick="window.openContactWindow()" style="cursor: pointer;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
              <span style="font-size: 12px; font-weight: 800; color: #60a5fa; letter-spacing: 0.5px;">PROJECT ESTIMATES</span>
              <span style="font-size: 14px;">🎫</span>
            </div>
            <div style="font-size: 18px; font-weight: 900; color: #fff;">REQUEST CUSTOM QUOTE</div>
            <div style="font-size: 11px; color: rgba(255,255,255,0.7); margin-top: 4px;">Tap to initiate a direct inquiry with Casey ›</div>
          </div>

        </div>
      </div>
    `;
    createWindow({ id: "wallet", title: "Wallet", contentHTML: content });
  };

  // --- Settings App (Wallpaper & System Customizer) ---
  window.openSettingsApp = function() {
    const content = `
      <div style="padding: 4px 0;">
        <h2 style="font-size: 22px; font-weight: 900; margin-bottom: 14px;">Settings</h2>
        
        <div class="ios-modal-section">
          <div style="font-size: 11px; font-weight: 800; color: rgba(255,255,255,0.6); text-transform: uppercase; margin-bottom: 10px;">Wallpaper Selection</div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div onclick="window.switchWallpaper('ios18')" style="background: #1e293b; padding: 10px; border-radius: 12px; border: 2px solid #3b82f6; text-align: center; cursor: pointer;">
              <div style="font-size: 12px; font-weight: 800; color: #fff;">iOS 18 Dark</div>
              <div style="font-size: 10px; color: #60a5fa;">Moody Liquid (Active)</div>
            </div>
            <div onclick="window.switchWallpaper('video')" style="background: #1e293b; padding: 10px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.15); text-align: center; cursor: pointer;">
              <div style="font-size: 12px; font-weight: 800; color: #fff;">Purple Eyes</div>
              <div style="font-size: 10px; color: var(--text-muted);">Live Video Loop</div>
            </div>
          </div>
        </div>

        <div class="ios-modal-section">
          <div style="font-size: 11px; font-weight: 800; color: rgba(255,255,255,0.6); text-transform: uppercase; margin-bottom: 10px;">System Information</div>
          <div class="ios-modal-row"><span>iOS Version</span><span style="font-weight:700; color:#fff;">iOS 18.0 (22A3354)</span></div>
          <div class="ios-modal-row"><span>Designer</span><span style="font-weight:700; color:#fff;">Khushal Chhabra (Casey)</span></div>
          <div class="ios-modal-row"><span>Touch ID / Face ID</span><span style="font-weight:700; color:#34c759;">Enabled</span></div>
        </div>
      </div>
    `;
    createWindow({ id: "settings", title: "Settings", contentHTML: content });
  };

  window.switchWallpaper = function(type) {
    const bg = document.getElementById("wallpaper-bg");
    const video = document.getElementById("wallpaper-video-wrapper");
    if (type === "video") {
      if (bg) bg.style.display = "none";
      if (video) video.style.display = "block";
    } else {
      if (bg) {
        bg.style.display = "block";
        bg.style.backgroundImage = "url('assets/images/ios18_wallpaper.jpg')";
      }
      if (video) video.style.display = "none";
    }
  };

  // --- Passwords App (Secret Vault) ---
  window.openPasswordsApp = function() {
    const content = `
      <div style="padding: 4px 0; text-align: center;">
        <div style="font-size: 36px; margin-bottom: 8px;">🔑</div>
        <h2 style="font-size: 20px; font-weight: 900; margin-bottom: 4px;">Passwords & Vault</h2>
        <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 16px;">Protected creative assets and unlocked archives.</p>
        <button onclick="window.openProtectedResume()" style="background: #10b981; color: #fff; border: none; padding: 12px 20px; border-radius: 20px; font-size: 13px; font-weight: 800; cursor: pointer; box-shadow: 0 4px 14px rgba(16,185,129,0.4);">
          🔒 Unlock PDF Resume
        </button>
      </div>
    `;
    createWindow({ id: "passwords", title: "Passwords", contentHTML: content });
  };

  // --- Riot Mobile App ---
  window.openRiotApp = function() {
    const content = `
      <div style="padding: 4px 0;">
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 14px;">
          <img src="assets/images/ios18_clean/riotmobile.png" style="width: 44px; height: 44px; border-radius: 12px;">
          <div>
            <h2 style="font-size: 20px; font-weight: 900; color: #eb0029; margin: 0;">Riot Games Case Studies</h2>
            <div style="font-size: 11px; color: var(--text-muted);">Esports & Tournament Visual Assets</div>
          </div>
        </div>
        <div class="ios-modal-section">
          <div style="font-size: 14px; font-weight: 800; color: #fff; margin-bottom: 4px;">VALORANT & League Key Visuals</div>
          <div style="font-size: 12px; color: var(--text-muted); line-height: 1.4;">
            High-octane promotional graphics, tournament key visuals, and player broadcast graphics tailored for competitive gaming audiences.
          </div>
        </div>
      </div>
    `;
    createWindow({ id: "riot", title: "Riot Mobile", contentHTML: content });
  };

  // --- Additional iOS Apps ---
  window.openFaceTimeApp = function() {
    window.openPhoneApp();
  };

  window.openSafariApp = function() {
    window.open("https://www.behance.net/Casey08", "_blank");
  };

  window.openFilesApp = function() {
    window.openBinWindow();
  };

  window.openPlaygroundsApp = function() {
    window.openAdobeDialog("warn");
  };

  window.openTestFlightApp = function() {
    window.openAppStoreApp();
  };

  window.openVoiceMemosApp = function() {
    window.openSpotifyWindow();
  };

  window.openTranslateApp = function() {
    window.openNotesApp();
  };

  window.openShazamApp = function() {
    window.openSpotifyWindow();
  };

  // --- Project Modal ---
  function openProjectModal(project) {
    const content = `
      <div class="project-modal-grid">
        <div>
          <img class="project-cover-large" src="${project.cover}" alt="${project.title}" onerror="this.src='https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80'">
        </div>
        <div>
          <span class="project-meta-tag">${project.category}</span>
          <h2 class="project-title-large">${project.title}</h2>
          <div class="project-client-line">Client: <strong>${project.client}</strong> · Year: <strong>${project.year}</strong></div>
          <p class="project-desc-text">${project.description}</p>
          <h4 style="font-size: 13px; font-weight: 800; margin-bottom: 8px;">Key Highlights</h4>
          <ul class="project-features-list">
            ${(project.details || ["Custom art direction and visual design", "High quality execution"]).map(d => `<li>${d}</li>`).join("")}
          </ul>
        </div>
      </div>
    `;

    createWindow({
      id: `proj-${project.id}`,
      title: project.title,
      width: "720px",
      top: "14%",
      left: "24%",
      contentHTML: content
    });
  }
  window.openProjectModal = openProjectModal;

  // --- Notebook / CV Modal ---
  window.openNotebookWindow = function() {
    const data = window.PORTFOLIO_DATA || (typeof PORTFOLIO_DATA !== "undefined" ? PORTFOLIO_DATA : {});
    const content = `
      <div class="notebook-tabs">
        <button class="tab-btn active" onclick="switchNotebookTab('tab-about', this)">About Casey</button>
        <button class="tab-btn" onclick="switchNotebookTab('tab-cv', this)">CV & Experience</button>
        <button class="tab-btn" onclick="switchNotebookTab('tab-interests', this)">Creative Interests</button>
      </div>

      <div id="tab-about" class="tab-content active">
        <div class="bio-card">
          <img class="bio-avatar" src="${data.personal.heroImage}" alt="${data.personal.name}" onerror="this.src='https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80'">
          <div>
            <h2 style="font-size: 22px; font-weight: 900;">${data.personal.name}</h2>
            <div style="color: var(--accent-color); font-weight: 700; font-size: 13px; margin-bottom: 8px;">${data.personal.title}</div>
            <p style="font-size: 13px; line-height: 1.5; color: var(--text-muted);">${data.personal.bio}</p>
          </div>
        </div>
        <h3 style="font-size: 14px; font-weight: 800; margin-bottom: 10px;">Capabilities & Services</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 10px;">
          ${(data.services || []).map(s => `
            <div style="background: rgba(255,255,255,0.04); padding: 10px; border-radius: 8px; font-size: 12px; font-weight: 600; border: 1px solid rgba(255,255,255,0.08);">
              ✨ ${s}
            </div>
          `).join("")}
        </div>
      </div>

      <div id="tab-cv" class="tab-content">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; flex-wrap: wrap; gap: 8px;">
          <h3 style="font-size: 15px; font-weight: 800;">Work Experience</h3>
          <button onclick="window.openProtectedResume()" style="padding: 6px 14px; background: #10b981; color: #fff; border: none; border-radius: 6px; font-size: 11px; font-weight: 700; display: inline-flex; align-items: center; gap: 6px; cursor: pointer;">
            🔒 PDF Resume
          </button>
        </div>
        <div class="experience-timeline">
          ${(data.experience || []).map(exp => `
            <div class="timeline-item">
              <div class="timeline-role">${exp.role}</div>
              <div class="timeline-company">${exp.company} · ${exp.period}</div>
              <div class="timeline-desc">${exp.description}</div>
            </div>
          `).join("")}
        </div>
        <h3 style="font-size: 15px; font-weight: 800; margin: 20px 0 10px 0;">Clients & Collaborators</h3>
        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
          ${(data.clients || []).map(c => `
            <span style="background: rgba(59, 130, 246, 0.15); border: 1px solid rgba(59, 130, 246, 0.4); color: #60a5fa; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 12px;">${c}</span>
          `).join("")}
        </div>
      </div>

      <div id="tab-interests" class="tab-content">
        <h3 style="font-size: 15px; font-weight: 800; margin-bottom: 12px;">Design Philosophy & Inspirations</h3>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${(data.interests || []).map(i => `
            <div style="background: rgba(255,255,255,0.04); border-left: 3px solid #10b981; padding: 10px 14px; border-radius: 0 8px 8px 0; font-size: 13px; font-weight: 600;">
              💡 ${i}
            </div>
          `).join("")}
        </div>
      </div>
    `;

    createWindow({
      id: "notebook",
      title: "About & CV — Casey",
      width: "620px",
      top: "12%",
      left: "25%",
      contentHTML: content
    });
  };

  window.switchNotebookTab = function(tabId, btnEl) {
    document.querySelectorAll(".notebook-tabs .tab-btn").forEach(btn => btn.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
    
    const activeBtn = btnEl || (window.event ? window.event.target : null);
    if (activeBtn) activeBtn.classList.add("active");
    const targetContent = document.getElementById(tabId);
    if (targetContent) targetContent.classList.add("active");
  };

  window.openProtectedResume = function() {
    const pwd = prompt("🔒 Enter Passcode to View & Print Resume:");
    if (!pwd) return;
    const valid = ['Khushal2000', 'khushal2000', 'casey0612', 'CASEY0612', 'caseyxresu'];
    const val = pwd.trim();
    if (valid.includes(val) || valid.map(p => p.toLowerCase()).includes(val.toLowerCase())) {
      sessionStorage.setItem('resume_unlocked', 'true');
      window.open("resume.html", "_blank");
    } else {
      alert("❌ Incorrect Passcode!");
    }
  };

  // --- Photos / Gallery Window ---
  window.openGalleryWindow = function() {
    const data = window.PORTFOLIO_DATA || (typeof PORTFOLIO_DATA !== "undefined" ? PORTFOLIO_DATA : {});
    const content = `
      <div class="photos-app-container">
        <div class="photos-hero-banner">
          <div class="photos-hero-title">Photos & Visual Archive</div>
          <div class="photos-hero-subtitle">Selected Key Visuals, 3D Art & Behance Case Studies by Casey (Khushal Chhabra)</div>
          <div class="photos-behance-pill" onclick="window.open('https://www.behance.net/Casey08', '_blank')">
            <img src="assets/images/behance-square-color-icon.svg" alt="Behance" width="16" height="16">
            <span>Explore Behance Profile ↗</span>
          </div>
        </div>

        <div class="gallery-grid">
          ${(data.gallery || []).map(item => `
            <div class="gallery-card ${item.isBehance ? 'is-behance-card' : ''}" onclick="${item.behanceUrl ? `window.open('${item.behanceUrl}', '_blank')` : ''}">
              <div class="gallery-img-wrapper">
                <img src="${item.image}" alt="${item.title}" loading="lazy" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80'">
                ${item.isBehance ? `
                  <span class="gallery-behance-tag">
                    <img src="assets/images/behance-square-color-icon.svg" width="12" height="12" alt="Behance">
                    <span>Behance</span>
                  </span>
                ` : ''}
              </div>
              <div class="gallery-caption-box">
                <div class="gallery-title">${item.title}</div>
                <div class="gallery-meta">
                  <span class="gallery-category">${item.category}</span>
                  ${item.behanceUrl ? `<span class="gallery-link-cta">View ↗</span>` : ''}
                </div>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `;

    createWindow({
      id: "gallery",
      title: "Photos & Art Showcase",
      width: "680px",
      top: "12%",
      left: "22%",
      contentHTML: content
    });
  };

  // --- Bin of Ideas Window ---
  window.openBinWindow = function() {
    const data = window.PORTFOLIO_DATA || (typeof PORTFOLIO_DATA !== "undefined" ? PORTFOLIO_DATA : {});
    const content = `
      <div style="padding: 10px;">
        <h3 style="font-size: 16px; font-weight: 800; margin-bottom: 8px;">🗑️ Bin of Unreleased Ideas</h3>
        <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 16px;">Early drafts, poster experiments, and creative concepts waiting for their turn.</p>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          ${(data.binOfIdeas || []).map(item => `
            <div style="background: rgba(255,255,255,0.04); border: 1px dashed rgba(255,255,255,0.2); padding: 12px; border-radius: 8px;">
              <div style="font-weight: 800; font-size: 13px; margin-bottom: 4px; color: #f59e0b;">${item.title}</div>
              <div style="font-size: 12px; color: var(--text-muted);">${item.note}</div>
            </div>
          `).join("")}
        </div>
      </div>
    `;

    createWindow({
      id: "bin",
      title: "Bin of Ideas",
      width: "480px",
      top: "20%",
      left: "30%",
      contentHTML: content
    });
  };

  // --- Music Player Window (YouTube Music Audio-Only Experience) ---
  window.openSpotifyWindow = function() {
    const track = spotifyTracks[currentTrackIdx] || spotifyTracks[0];
    const pct = Math.min(100, (currentTrackTime / track.duration) * 100);

    const content = `
      <div class="audio-player-container">
        <!-- Top Bar -->
        <div class="audio-player-header">
          <div class="audio-header-left">
            <img src="assets/images/ios18_clean/music.png" class="audio-app-icon" alt="Apple Music">
            <div>
              <div class="audio-header-title">Casey's YouTube Music</div>
              <div class="audio-header-sub">Curated Playlist • Audio Mode (${spotifyTracks.length} Songs)</div>
            </div>
          </div>
          <div class="audio-external-links">
            <a href="https://music.youtube.com/playlist?list=PL5Twt3mfOd_PVsJrFh4dA-f6IWFUAwHAf&si=NU98HG94E22UrT0K" target="_blank" class="audio-ext-pill audio-ext-yt" title="Open in YouTube Music">
              <svg viewBox="0 0 24 24" width="12" height="12" fill="#ff4d4d"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              <span>YT Music ↗</span>
            </a>
            <a href="https://open.spotify.com/playlist/4eBpz8sWLVz9EfuPOY2NpW" target="_blank" class="audio-ext-pill audio-ext-spotify" title="Open in Spotify">
              <svg viewBox="0 0 24 24" width="12" height="12" fill="#1db954"><path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.48-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141 4.38-1.38 9.841-.72 13.561 1.56.36.18.54.78.18 1.26zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.18-1.2-.18-1.38-.72-.18-.6.18-1.2.72-1.38 4.26-1.26 11.28-1.02 15.721 1.62.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
              <span>Spotify ↗</span>
            </a>
          </div>
        </div>

        <!-- Vinyl & Cover Artwork Stage -->
        <div class="audio-stage">
          <div id="modal-art-wrapper" class="audio-art-wrapper ${isSpotifyPlaying ? 'playing' : ''}">
            <img id="modal-song-cover" src="${track.cover}" class="audio-art-img" alt="Artwork" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80'">
            <div id="modal-vinyl-disc" class="audio-vinyl-disc ${isSpotifyPlaying ? 'playing' : ''}">
              <div class="audio-vinyl-center"></div>
            </div>
          </div>
          <div class="audio-info-col">
            <div class="audio-now-tag">
              <span>NOW PLAYING</span>
              <div id="modal-live-eq" class="audio-live-eq ${isSpotifyPlaying ? 'playing' : ''}">
                <span></span><span></span><span></span><span></span>
              </div>
            </div>
            <div id="modal-song-title" class="audio-track-title">${track.title}</div>
            <div id="modal-song-artist" class="audio-track-artist">${track.artist}</div>
          </div>
        </div>

        <!-- Timeline Scrubber -->
        <div class="audio-timeline-box">
          <div id="modal-progress-bg" class="audio-progress-bar-bg" onclick="window.seekAudioProgress(event)">
            <div id="modal-song-progress-fill" class="audio-progress-fill" style="width: ${pct}%;"></div>
          </div>
          <div class="audio-timestamps">
            <span id="modal-song-current-time">${formatTime(currentTrackTime)}</span>
            <span id="modal-song-duration">${formatTime(track.duration)}</span>
          </div>
        </div>

        <!-- Transport Controls -->
        <div class="audio-controls-row">
          <button class="audio-ctrl-btn" onclick="window.spotifyPrevTrack && window.spotifyPrevTrack()" title="Previous Track">⏮</button>
          <button id="modal-play-btn" class="audio-play-btn-large" onclick="window.spotifyTogglePlay && window.spotifyTogglePlay()" title="Play / Pause">
            ${isSpotifyPlaying ? '⏸' : '▶'}
          </button>
          <button class="audio-ctrl-btn" onclick="window.spotifyNextTrack && window.spotifyNextTrack()" title="Next Track">⏭</button>
        </div>

        <!-- Tracklist Queue -->
        <div class="audio-queue-container">
          <div class="audio-queue-title">YouTube Music Playlist (${spotifyTracks.length} Full Songs)</div>
          ${spotifyTracks.map((t, idx) => `
            <div id="audio-queue-item-${idx}" class="audio-queue-item ${idx === currentTrackIdx ? 'active' : ''}" onclick="window.selectAudioTrack(${idx})">
              <div class="audio-queue-item-left">
                <span class="audio-queue-idx">${idx + 1}</span>
                <div>
                  <div class="audio-queue-name">${t.title}</div>
                  <div class="audio-queue-artist">${t.artist}</div>
                </div>
              </div>
              <span class="audio-queue-dur">${formatTime(t.duration)}</span>
            </div>
          `).join("")}
        </div>
      </div>
    `;

    createWindow({
      id: "spotify",
      title: "YouTube Music • Full Songs Audio Player",
      width: "520px",
      top: "12%",
      left: "28%",
      contentHTML: content
    });
  };

  window.openMusicWindow = window.openSpotifyWindow;

  // --- Contact Window ---
  window.openContactWindow = function() {
    const data = window.PORTFOLIO_DATA || (typeof PORTFOLIO_DATA !== "undefined" ? PORTFOLIO_DATA : {});
    const email = (data.personal && data.personal.email) ? data.personal.email : "khushalchhabra08@gmail.com";
    const gmailUrl = `https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(email)}&su=${encodeURIComponent("Project Inquiry — Casey Portfolio")}`;
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent("Project Inquiry — Casey Portfolio")}`;

    const content = `
      <div style="text-align: center; padding: 18px 12px;">
        <div style="width: 56px; height: 56px; margin: 0 auto 12px auto; background: rgba(59, 130, 246, 0.15); border: 1px solid rgba(59, 130, 246, 0.35); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; box-shadow: 0 8px 24px rgba(59, 130, 246, 0.25);">
          ✉️
        </div>

        <h2 style="font-size: 20px; font-weight: 900; margin-bottom: 4px;">Let's Work Together</h2>
        <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 18px; line-height: 1.5; max-width: 340px; margin-left: auto; margin-right: auto;">
          Art Direction · Visual Identity · Album Packaging · Stage Motion
        </p>

        <div style="display: flex; align-items: center; justify-content: center; gap: 8px; background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.18); padding: 8px 14px; border-radius: 20px; width: fit-content; margin: 0 auto 20px auto;">
          <span style="font-size: 12px; font-weight: 700; color: #ffffff;">${email}</span>
          <button 
            type="button" 
            onclick="navigator.clipboard.writeText('${email}'); this.textContent='✓ Copied!'; setTimeout(() => this.textContent='📋 Copy', 2000);" 
            style="background: rgba(255, 255, 255, 0.2); border: none; color: #fff; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 12px; cursor: pointer;">
            📋 Copy
          </button>
        </div>

        <div style="display: flex; flex-direction: column; gap: 10px; width: 100%; max-width: 340px; margin: 0 auto;">
          <a 
            href="${gmailUrl}" 
            target="_blank" 
            rel="noopener noreferrer" 
            style="display: flex; align-items: center; justify-content: center; gap: 8px; padding: 12px 20px; background: #ea4335; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 13px; border-radius: 20px; box-shadow: 0 6px 20px rgba(234, 67, 53, 0.4);">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
            Compose in Gmail
          </a>

          <a 
            href="${mailtoUrl}" 
            style="display: flex; align-items: center; justify-content: center; gap: 8px; padding: 12px 20px; background: rgba(255, 255, 255, 0.12); border: 1px solid rgba(255, 255, 255, 0.2); color: #ffffff; text-decoration: none; font-weight: 600; font-size: 13px; border-radius: 20px;">
            📫 Open System Mail App
          </a>
        </div>
      </div>
    `;

    createWindow({
      id: "contact",
      title: "Contact Casey",
      width: "480px",
      top: "20%",
      left: "30%",
      contentHTML: content
    });
  };

  // --- Adobe Dialog Easter Eggs ---
  window.openAdobeDialog = function(type) {
    const data = window.PORTFOLIO_DATA || (typeof PORTFOLIO_DATA !== "undefined" ? PORTFOLIO_DATA : {});
    const adobeDialogs = data.adobeDialogs || {};
    const dialogData = adobeDialogs[type] || adobeDialogs.warn || { title: "Warning", message: "System operational.", button: "Dismiss" };
    const content = `
      <div class="adobe-dialog-box">
        <div class="adobe-icon-warning">⚠️</div>
        <h3 style="font-size: 16px; font-weight: 800; margin-bottom: 8px;">${dialogData.title}</h3>
        <p class="adobe-msg-text">${dialogData.message}</p>
        <button class="adobe-btn-action" onclick="window.closeWindow && window.closeWindow('adobe-${type}')">
          ${dialogData.button}
        </button>
      </div>
    `;

    createWindow({
      id: `adobe-${type}`,
      title: dialogData.title,
      width: "400px",
      top: "28%",
      left: "34%",
      contentHTML: content
    });
  };

  // Keyboard shortcut: ESC to close top window
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const openWins = Object.values(activeWindows);
      if (openWins.length > 0) {
        openWins.sort((a, b) => parseInt(b.style.zIndex || 0) - parseInt(a.style.zIndex || 0));
        const topId = openWins[0].id.replace("win-", "");
        closeWindow(topId);
      }
    }
  });
});
