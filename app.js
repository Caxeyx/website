/* ==========================================================================
   CASEY PORTFOLIO — Unified macOS Desktop & iOS Mobile Engine
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  let highestZIndex = 200;
  let activeWindows = {};

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
  // 1. Clock & Date Management (macOS Menu, iOS Status Bar, Lock Screens)
  // ==========================================================================
  function updateAllClocks() {
    const now = new Date();
    
    // Time Strings
    const time12 = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    const timeSimple = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: false });
    const timeShort12 = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    
    // Date Strings
    const dateLong = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    const dateShort = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    const dateWidget = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

    if (menuClock) menuClock.textContent = dateShort;
    if (loginClock) loginClock.textContent = time12;
    if (iosLockClock) iosLockClock.textContent = timeSimple;
    if (iosLockDate) iosLockDate.textContent = dateLong;
    if (iosStatusTime) iosStatusTime.textContent = timeShort12;

    const widgetTimeEl = document.getElementById("widget-digital-time");
    const widgetDateEl = document.getElementById("widget-date-display");
    if (widgetTimeEl) widgetTimeEl.textContent = time12;
    if (widgetDateEl) widgetDateEl.textContent = dateWidget;

    const mobileWidgetTime = document.getElementById("mobile-widget-time");
    const mobileWidgetDate = document.getElementById("mobile-widget-date");
    if (mobileWidgetTime) mobileWidgetTime.textContent = time12;
    if (mobileWidgetDate) mobileWidgetDate.textContent = dateWidget;
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
  const spotifyTracks = [
    {
      title: "HOTEL MAFIJA VINYL",
      artist: "Casey & SBM Label",
      cover: "https://framerusercontent.com/images/vs3eHHOnNIgYRpCxqrlx6kGu7ZE.png?scale-down-to=2048",
      audioUrl: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3",
      duration: 225
    },
    {
      title: "TRASA PO KOŃCU ŚWIATA",
      artist: "Kacperczyk & Casey",
      cover: "https://framerusercontent.com/images/Lx5tLMHaVdhs7fD27bCK8cvb2v4.jpg?scale-down-to=2048",
      audioUrl: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3",
      duration: 198
    },
    {
      title: "RYK X SEXED",
      artist: "Casey Art Direction",
      cover: "https://framerusercontent.com/images/jWCd6yieKKyRymQkEZLe6vjBEI.jpg?scale-down-to=2048",
      audioUrl: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a8d184.mp3",
      duration: 212
    },
    {
      title: "PIERWSZY SWAG W POLSCE",
      artist: "Casey Studio Rollout",
      cover: "https://framerusercontent.com/images/zaWs4d37fEOTdAisIq7UlAJyIU.png?scale-down-to=2048",
      audioUrl: "https://cdn.pixabay.com/download/audio/2021/11/24/audio_3316d97c72.mp3",
      duration: 185
    }
  ];

  let currentTrackIdx = 0;
  let currentTrackTime = 25;
  let isSpotifyPlaying = false;
  let spotifyInterval = null;

  const realAudio = new Audio();
  realAudio.loop = true;
  realAudio.volume = 0.5;

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  function playCurrentAudio() {
    const track = spotifyTracks[currentTrackIdx];
    if (realAudio.src !== track.audioUrl) {
      realAudio.src = track.audioUrl;
    }
    realAudio.play().catch(e => console.log("Audio autoplay handled:", e));
  }

  function pauseCurrentAudio() {
    realAudio.pause();
  }

  function updateSpotifyDisplay() {
    const track = spotifyTracks[currentTrackIdx];

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

    // Mobile Widget
    const mobileTrackTitle = document.getElementById("mobile-music-track-title");
    const mobileArtist = document.getElementById("mobile-music-artist-name");
    const mobilePlayBtn = document.getElementById("mobile-music-play-btn");
    if (mobileTrackTitle) mobileTrackTitle.textContent = track.title;
    if (mobileArtist) mobileArtist.textContent = track.artist;
    if (mobilePlayBtn) mobilePlayBtn.textContent = isSpotifyPlaying ? "⏸" : "▶";
  }

  function startSpotifyTimer() {
    if (spotifyInterval) clearInterval(spotifyInterval);
    spotifyInterval = setInterval(() => {
      if (!isSpotifyPlaying) return;
      const track = spotifyTracks[currentTrackIdx];
      currentTrackTime += 1;
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
      if (bootStatusText) bootStatusText.textContent = "Welcome back, Casey!";
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
  // 4. Responsive Grid & App Launcher (Desktop Scattered + Mobile SpringBoard)
  // ==========================================================================
  function renderAppGrid() {
    const data = window.PORTFOLIO_DATA || (typeof PORTFOLIO_DATA !== "undefined" ? PORTFOLIO_DATA : null);
    if (!desktopGrid || !data || !data.projects) return;
    desktopGrid.innerHTML = "";

    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
      // ----------------------------------------------------------------------
      // Mobile iOS SpringBoard Layout
      // ----------------------------------------------------------------------
      const now = new Date();
      const time12 = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
      const dateWidget = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      const currentTrack = spotifyTracks[currentTrackIdx];

      desktopGrid.innerHTML = `
        <!-- Top iOS Widgets Header -->
        <div class="mobile-home-header">
          <div class="mobile-widgets-row">
            <!-- Clock & Status Widget -->
            <div class="mobile-widget-card" onclick="window.openNotebookWindow && window.openNotebookWindow()">
              <div class="mobile-widget-clock-title">
                <span>STUDIO</span>
                <span>🕒</span>
              </div>
              <div>
                <div id="mobile-widget-time" class="mobile-widget-time">${time12}</div>
                <div id="mobile-widget-date" class="mobile-widget-date">${dateWidget}</div>
              </div>
              <div class="mobile-widget-status">
                <span class="status-dot"></span> Available
              </div>
            </div>

            <!-- Spotify Now Playing Widget -->
            <div class="mobile-widget-card mobile-music-widget" onclick="window.openSpotifyWindow && window.openSpotifyWindow()">
              <div class="mobile-music-header">
                <span class="mobile-music-tag">
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="#1db954"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.516 17.316c-.218.358-.686.474-1.044.256-2.864-1.75-6.467-2.146-10.71-1.176-.407.094-.816-.16-.91-.567-.093-.408.16-.817.568-.91 4.646-1.062 8.632-.612 11.84 1.35.358.218.474.686.256 1.047zm1.47-3.27c-.274.446-.86.588-1.306.314-3.278-2.014-8.277-2.598-12.155-1.42-.505.153-1.04-.135-1.194-.64-.153-.505.135-1.04.64-1.194 4.43-1.344 9.943-.695 13.7 1.614.446.274.588.86.314 1.306zm.127-3.41c-3.931-2.334-10.42-2.55-14.186-1.407-.604.183-1.242-.162-1.425-.766-.183-.604.162-1.242.766-1.425 4.316-1.31 11.48-1.053 16.002 1.63.543.322.723 1.028.4 1.57-.322.544-1.027.724-1.57.402z"/></svg>
                  SPOTIFY
                </span>
                <span style="font-size: 10px; color: rgba(255,255,255,0.6);">PLAYING</span>
              </div>
              <div>
                <div id="mobile-music-track-title" class="mobile-music-track">${currentTrack.title}</div>
                <div id="mobile-music-artist-name" class="mobile-music-artist">${currentTrack.artist}</div>
              </div>
              <div class="mobile-music-ctrls" onclick="event.stopPropagation();">
                <button class="music-btn" onclick="window.spotifyPrevTrack && window.spotifyPrevTrack()">⏮</button>
                <button id="mobile-music-play-btn" class="mobile-music-play-btn" onclick="window.spotifyTogglePlay && window.spotifyTogglePlay()">
                  ${isSpotifyPlaying ? "⏸" : "▶"}
                </button>
                <button class="music-btn" onclick="window.spotifyNextTrack && window.spotifyNextTrack()">⏭</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Core iOS System Apps -->
        <div class="mobile-section-heading">
          <span>APPLICATIONS</span>
          <span style="font-size: 10px; color: rgba(255,255,255,0.5);">Tap to launch</span>
        </div>

        <div class="mobile-apps-grid">
          <div class="mobile-app-item" onclick="window.openNotebookWindow && window.openNotebookWindow()">
            <div class="mobile-app-icon" style="background: #ffffff;">
              <img src="https://framerusercontent.com/images/es0axIAu0guUZSRBu6xvsteey8w.png" alt="About & CV">
            </div>
            <span class="mobile-app-label">About & CV</span>
          </div>

          <div class="mobile-app-item" onclick="window.openGalleryWindow && window.openGalleryWindow()">
            <div class="mobile-app-icon" style="background: #ffffff;">
              <img src="https://framerusercontent.com/images/yNLcekVy7df0d4hAoz6dZR8s.png" alt="Photos Gallery">
            </div>
            <span class="mobile-app-label">Photos</span>
          </div>

          <div class="mobile-app-item" onclick="window.openSpotifyWindow && window.openSpotifyWindow()">
            <div class="mobile-app-icon" style="background: #121212;">
              <img src="https://framerusercontent.com/images/vs3eHHOnNIgYRpCxqrlx6kGu7ZE.png?scale-down-to=2048" alt="Spotify Player">
            </div>
            <span class="mobile-app-label">Spotify</span>
          </div>

          <div class="mobile-app-item" onclick="window.openContactWindow && window.openContactWindow()">
            <div class="mobile-app-icon" style="background: #0078d4;">
              <img src="https://framerusercontent.com/images/4ZZQ6ZFOyrBZ3TXhVZjMFK7zbGk.png" alt="Contact Mail">
            </div>
            <span class="mobile-app-label">Contact</span>
          </div>

          <div class="mobile-app-item" onclick="window.open('https://www.behance.net/Casey08', '_blank')">
            <div class="mobile-app-icon" style="background: #0057ff;">
              <img src="assets/images/behance_icon.svg" alt="Behance">
            </div>
            <span class="mobile-app-label">Behance</span>
          </div>

          <div class="mobile-app-item" onclick="window.open('https://www.youtube.com/@Caseyxlive', '_blank')">
            <div class="mobile-app-icon" style="background: #cc0000;">
              <img src="assets/images/youtube_icon.svg" alt="YouTube">
            </div>
            <span class="mobile-app-label">YouTube</span>
          </div>

          <div class="mobile-app-item" onclick="window.open('https://www.instagram.com/caseyxlive/', '_blank')">
            <div class="mobile-app-icon" style="background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);">
              <img src="https://framerusercontent.com/images/fZcO2HO3MMDvuS9IcWLgq5MyMc.png" alt="Instagram">
            </div>
            <span class="mobile-app-label">Instagram</span>
          </div>

          <div class="mobile-app-item" onclick="window.openBinWindow && window.openBinWindow()">
            <div class="mobile-app-icon" style="background: #27272a;">
              <img src="https://framerusercontent.com/images/Hfn1FB5V1VnB099tUlAIyjV1tC4.png" alt="Bin of Ideas">
            </div>
            <span class="mobile-app-label">Bin of Ideas</span>
          </div>

          <div class="mobile-app-item" onclick="window.openAdobeDialog && window.openAdobeDialog('warn')">
            <div class="mobile-app-icon" style="background: #2a2200;">
              <img src="https://framerusercontent.com/images/BSPnJPSH4K1WxhDJJbEfUgT7U.png" alt="System Alert">
            </div>
            <span class="mobile-app-label">System Log</span>
          </div>

          <div class="mobile-app-item" onclick="window.openAdobeDialog && window.openAdobeDialog('ae')">
            <div class="mobile-app-icon" style="background: #00005b;">
              <img src="https://framerusercontent.com/images/FGXr3pqtmk0UpCXHi0IZJgC4H8.png" alt="After Effects">
            </div>
            <span class="mobile-app-label">After Effects</span>
          </div>
        </div>

        <!-- Featured Projects Showcase Section -->
        <div class="mobile-section-heading">
          <span>FEATURED PROJECTS</span>
          <span style="font-size: 10px; color: rgba(255,255,255,0.5);">${data.projects.length} Works</span>
        </div>

        <div class="mobile-projects-container" id="mobile-projects-list"></div>
      `;

      // Render Project Cards in mobile container
      const projectsList = document.getElementById("mobile-projects-list");
      if (projectsList) {
        data.projects.forEach((proj) => {
          const card = document.createElement("div");
          card.className = "mobile-project-card";
          card.innerHTML = `
            <div class="mobile-project-thumb">
              <img src="${proj.cover}" alt="${proj.title}" loading="lazy">
            </div>
            <div class="mobile-project-info">
              <div class="mobile-project-tag">${proj.category}</div>
              <div class="mobile-project-title">${proj.title}</div>
              <div class="mobile-project-client">${proj.client} · ${proj.year}</div>
            </div>
            <div class="mobile-project-arrow">›</div>
          `;
          card.addEventListener("click", () => openProjectModal(proj));
          projectsList.appendChild(card);
        });
      }

    } else {
      // ----------------------------------------------------------------------
      // Desktop macOS Scattered Canvas Layout with Smooth Draggable Physics
      // ----------------------------------------------------------------------
      const gridWidth = desktopGrid.clientWidth || window.innerWidth;
      const gridHeight = desktopGrid.clientHeight || window.innerHeight;

      data.projects.forEach((proj) => {
        const item = document.createElement("div");
        item.className = "desktop-item";
        item.dataset.id = proj.id;

        const posX = (proj.pos.x / 100) * gridWidth;
        const posY = (proj.pos.y / 100) * gridHeight;

        item.style.left = `${posX}px`;
        item.style.top = `${posY}px`;

        item.innerHTML = `
          <div class="desktop-icon-wrapper">
            <img src="${proj.cover}" alt="${proj.title}" draggable="false" loading="lazy">
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
            if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
              hasMoved = true;
            }
            if (hasMoved) {
              const newLeft = Math.max(10, Math.min(window.innerWidth - 90, itemX + dx));
              const newTop = Math.max(35, Math.min(window.innerHeight - 100, itemY + dy));
              item.style.left = `${newLeft}px`;
              item.style.top = `${newTop}px`;
            }
          };

          const onMouseUp = () => {
            isDragging = false;
            item.classList.remove("is-dragging");
            item.style.zIndex = "";
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);

            if (!hasMoved) {
              openProjectModal(proj);
            }
          };

          document.addEventListener("mousemove", onMouseMove);
          document.addEventListener("mouseup", onMouseUp);
        });

        desktopGrid.appendChild(item);
      });
    }
  }

  renderAppGrid();
  window.addEventListener("resize", renderAppGrid);

  // ==========================================================================
  // 5. Window Manager Core (Desktop Floating Windows + iOS Bottom Sheets)
  // ==========================================================================
  function createWindow({ id, title, width = "620px", contentHTML, top = "15%", left = "25%", originEl = null }) {
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
        <div class="window-header-actions">
          <button class="mobile-window-close-btn" title="Close" onclick="window.closeWindow && window.closeWindow('${id}')">✕</button>
        </div>
      </div>
      <div class="window-body">
        ${contentHTML}
      </div>
    `;

    // Window controls
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

    // Enable dragging on desktop and swipe-down-to-dismiss on mobile
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

  // Setup Dragging (Desktop) & Swipe Down Dismissal (Mobile)
  function setupWindowInteraction(win, id) {
    const header = win.querySelector(".window-header");
    if (!header) return;

    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
      // Mobile Header Swipe Down to Dismiss
      let touchStartY = 0;
      let currentTranslateY = 0;

      header.addEventListener("touchstart", (e) => {
        touchStartY = e.touches[0].clientY;
        win.style.transition = "none";
      }, { passive: true });

      header.addEventListener("touchmove", (e) => {
        const touchY = e.touches[0].clientY;
        const diff = touchY - touchStartY;
        if (diff > 0) {
          currentTranslateY = diff;
          win.style.transform = `translateY(${diff}px)`;
        }
      }, { passive: true });

      header.addEventListener("touchend", () => {
        win.style.transition = "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)";
        if (currentTranslateY > 80) {
          closeWindow(id);
        } else {
          win.style.transform = "translateY(0)";
        }
        currentTranslateY = 0;
      }, { passive: true });

    } else {
      // Desktop Header Draggable
      let isDragging = false;
      let offsetX = 0;
      let offsetY = 0;

      header.addEventListener("mousedown", (e) => {
        if (e.target.classList.contains("traffic-btn") || e.target.classList.contains("mobile-window-close-btn")) return;
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
  // 6. Application Modals: Project Details, About/CV, Gallery, Contact, Spotify
  // ==========================================================================
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

  // About & CV Notebook
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
    const valid = ['caseyxresu', 'caseyxlivework', 'caseyx', 'CASEY', '1234', 'caseyxlive'];
    if (valid.includes(pwd.trim())) {
      sessionStorage.setItem('resume_unlocked', 'true');
      window.open("resume.html", "_blank");
    } else {
      alert("❌ Incorrect Passcode!");
    }
  };

  // Gallery Window
  window.openGalleryWindow = function() {
    const data = window.PORTFOLIO_DATA || (typeof PORTFOLIO_DATA !== "undefined" ? PORTFOLIO_DATA : {});
    const content = `
      <div class="gallery-grid">
        ${(data.gallery || []).map(item => `
          <div class="gallery-card">
            <img src="${item.image}" alt="${item.title}" onerror="this.src='https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80'">
            <div class="gallery-caption">${item.title} (${item.category})</div>
          </div>
        `).join("")}
      </div>
    `;

    createWindow({
      id: "gallery",
      title: "Photos & Art Showcase",
      width: "660px",
      top: "14%",
      left: "24%",
      contentHTML: content
    });
  };

  // Bin of Ideas Window
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

  // Spotify Player Window
  window.openSpotifyWindow = function() {
    const content = `
      <div style="background: #121212; padding: 14px; border-radius: 12px; color: #fff;">
        <div style="display: flex; align-items: center; justify-content: space-between; background: linear-gradient(135deg, #1db954 0%, #0a2912 100%); padding: 14px 18px; border-radius: 10px; margin-bottom: 14px;">
          <div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="#fff"><path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.48-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141 4.38-1.38 9.841-.72 13.561 1.56.36.18.54.78.18 1.26zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.18-1.2-.18-1.38-.72-.18-.6.18-1.2.72-1.38 4.26-1.26 11.28-1.02 15.721 1.62.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
              <h3 style="font-size: 16px; font-weight: 900; margin: 0; color: #fff;">SPOTIFY PLAYER</h3>
            </div>
            <div style="font-size: 11px; color: rgba(255,255,255,0.85); margin-top: 4px;">Top Recommendation Playlist</div>
          </div>
          <div style="font-size: 10px; font-weight: 700; background: rgba(0,0,0,0.35); padding: 4px 10px; border-radius: 12px; border: 1px solid rgba(30,215,96,0.3); color: #fff; display: flex; align-items: center; gap: 6px;">
            <span style="width: 6px; height: 6px; background-color: #1db954; border-radius: 50%; box-shadow: 0 0 6px #1db954;"></span> Connected
          </div>
        </div>

        <div style="border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.7); background: #000;">
          <iframe
            title="Spotify Embed: Recommendation Playlist"
            src="https://open.spotify.com/embed/playlist/4eBpz8sWLVz9EfuPOY2NpW?utm_source=generator&theme=0"
            width="100%"
            height="360"
            style="min-height: 340px;"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy">
          </iframe>
        </div>
      </div>
    `;

    createWindow({
      id: "spotify",
      title: "Spotify Player",
      width: "560px",
      top: "10%",
      left: "26%",
      contentHTML: content
    });
  };

  // Contact Window
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

        <!-- Copyable Email Card -->
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

  // Adobe Dialog Easter Eggs
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
