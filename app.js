/* ==========================================================================
   bychudy.com Inspired macOS Desktop Logic for Casey
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  let highestZIndex = 200;
  let activeWindows = {};

  // Initialize Elements
  const desktopGrid = document.getElementById("desktop-grid");
  const windowStack = document.getElementById("window-stack");
  const dock = document.getElementById("mac-dock");

  // 1. Render Top Menu Clock
  function updateMenuClock() {
    const clockEl = document.getElementById("menu-clock");
    if (!clockEl) return;
    const now = new Date();
    const options = { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    clockEl.textContent = now.toLocaleDateString('en-US', options);
  }
  updateMenuClock();
  setInterval(updateMenuClock, 10000);

  // 1c. macOS Sonoma Desktop Widgets Manager
  const widgetsLayer = document.getElementById("desktop-widgets-layer");
  const widgetTimeEl = document.getElementById("widget-digital-time");
  const widgetDateEl = document.getElementById("widget-date-display");

  function updateWidgetClock() {
    if (!widgetTimeEl || !widgetDateEl) return;
    const now = new Date();
    widgetTimeEl.textContent = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    widgetDateEl.textContent = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }
  updateWidgetClock();
  setInterval(updateWidgetClock, 1000);

  window.toggleMacWidgets = function() {
    if (!widgetsLayer) return;
    widgetsLayer.classList.toggle("is-hidden");
  };

  // 1d. Real HTML5 Audio Music Player & Spotify Widget Engine
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
  let currentTrackTime = 30;
  let isSpotifyPlaying = true;
  let spotifyInterval = null;

  // Real HTML5 Audio Instance
  const realAudio = new Audio();
  realAudio.loop = true;
  realAudio.volume = 0.45;

  const widgetMusicCard = document.getElementById("widget-music");
  const widgetSongCover = document.getElementById("widget-song-cover");
  const widgetSongTitle = document.getElementById("widget-song-title");
  const widgetSongArtist = document.getElementById("widget-song-artist");
  const widgetProgressFill = document.getElementById("widget-song-progress-fill");
  const widgetCurrentTime = document.getElementById("widget-song-current-time");
  const widgetDurationTime = document.getElementById("widget-song-duration");
  const widgetPlayBtn = document.getElementById("widget-play-btn");

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
    realAudio.play().catch(e => console.log("Audio autoplay policy handled:", e));
  }

  function pauseCurrentAudio() {
    realAudio.pause();
  }

  function updateSpotifyWidgetDisplay() {
    const track = spotifyTracks[currentTrackIdx];
    if (widgetSongCover) widgetSongCover.src = track.cover;
    if (widgetSongTitle) widgetSongTitle.textContent = track.title;
    if (widgetSongArtist) widgetSongArtist.textContent = track.artist;
    if (widgetDurationTime) widgetDurationTime.textContent = formatTime(track.duration);
    
    const pct = Math.min(100, (currentTrackTime / track.duration) * 100);
    if (widgetProgressFill) widgetProgressFill.style.width = `${pct}%`;
    if (widgetCurrentTime) widgetCurrentTime.textContent = formatTime(currentTrackTime);
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
      updateSpotifyWidgetDisplay();
    }, 1000);
  }

  window.spotifyTogglePlay = function() {
    isSpotifyPlaying = !isSpotifyPlaying;
    if (widgetMusicCard) {
      if (isSpotifyPlaying) {
        widgetMusicCard.classList.remove("is-paused");
        playCurrentAudio();
      } else {
        widgetMusicCard.classList.add("is-paused");
        pauseCurrentAudio();
      }
    }
    if (widgetPlayBtn) {
      widgetPlayBtn.textContent = isSpotifyPlaying ? "⏸" : "▶";
    }
  };

  window.spotifyNextTrack = function() {
    currentTrackIdx = (currentTrackIdx + 1) % spotifyTracks.length;
    currentTrackTime = 0;
    updateSpotifyWidgetDisplay();
    if (isSpotifyPlaying) playCurrentAudio();
  };

  window.spotifyPrevTrack = function() {
    currentTrackIdx = (currentTrackIdx - 1 + spotifyTracks.length) % spotifyTracks.length;
    currentTrackTime = 0;
    updateSpotifyWidgetDisplay();
    if (isSpotifyPlaying) playCurrentAudio();
  };

  updateSpotifyWidgetDisplay();
  startSpotifyTimer();

  // Make individual macOS desktop widgets draggable
  document.querySelectorAll(".mac-widget").forEach((widget) => {
    let isDragging = false;
    let startX = 0, startY = 0;
    let widgetX = 0, widgetY = 0;

    widget.addEventListener("mousedown", (e) => {
      if (e.target.closest("button") || e.target.closest("a")) return;
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      widgetX = widget.offsetLeft;
      widgetY = widget.offsetTop;
      widget.style.zIndex = 10;
    });

    document.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      widget.style.left = `${widgetX + dx}px`;
      widget.style.top = `${widgetY + dy}px`;
      widget.style.right = "auto";
    });

    document.addEventListener("mouseup", () => {
      if (isDragging) {
        isDragging = false;
        widget.style.zIndex = "";
      }
    });
  });

  // 1b. macOS Apple Login & Boot Progress Sequence
  const loginScreen = document.getElementById("mac-login-screen");
  const loginInputBox = document.getElementById("login-input-box");
  const loginHintsBox = document.getElementById("login-hints-box");
  const bootProgressContainer = document.getElementById("boot-progress-container");
  const bootProgressFill = document.getElementById("boot-progress-fill");
  const bootStatusText = document.getElementById("boot-status-text");
  const loginClock = document.getElementById("login-clock");
  const passwordInput = document.getElementById("login-password-input");

  let isLoggingIn = false;

  function updateLoginClock() {
    if (!loginClock) return;
    const now = new Date();
    loginClock.textContent = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  }
  updateLoginClock();
  setInterval(updateLoginClock, 5000);

  window.startMacBootSequence = function() {
    if (isLoggingIn || !loginScreen) return;
    isLoggingIn = true;

    loginScreen.classList.add("is-authenticating");

    if (loginInputBox) loginInputBox.style.display = "none";
    if (loginHintsBox) loginHintsBox.style.display = "none";
    if (bootProgressContainer) bootProgressContainer.style.display = "flex";

    setTimeout(() => {
      if (bootProgressFill) bootProgressFill.style.width = "40%";
      if (bootStatusText) bootStatusText.textContent = "Loading macOS Sonoma...";
    }, 150);

    setTimeout(() => {
      if (bootProgressFill) bootProgressFill.style.width = "85%";
      if (bootStatusText) bootStatusText.textContent = "Setting up Casey's Studio Workspace...";
    }, 550);

    setTimeout(() => {
      if (bootProgressFill) bootProgressFill.style.width = "100%";
      if (bootStatusText) bootStatusText.textContent = "Welcome back, Casey!";
    }, 950);

    setTimeout(() => {
      loginScreen.classList.add("is-unlocked");

      // Trigger real music audio playback on unlock
      if (typeof playCurrentAudio === "function") {
        playCurrentAudio();
      }

      setTimeout(() => {
        loginScreen.style.display = "none";
        loginScreen.classList.remove("is-authenticating", "is-unlocked");
        if (bootProgressContainer) bootProgressContainer.style.display = "none";
        if (bootProgressFill) bootProgressFill.style.width = "0%";
        if (loginInputBox) loginInputBox.style.display = "block";
        if (loginHintsBox) loginHintsBox.style.display = "block";
        if (passwordInput) passwordInput.value = "";
        isLoggingIn = false;
      }, 650);
    }, 1250);
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
    if (passwordInput) {
      passwordInput.value = "";
      passwordInput.focus();
    }
  };

  // 2. Render Scattered Desktop Icons (Ultra-Smooth Apple Dragging & Mobile Support)
  function renderDesktopIcons() {
    const data = window.PORTFOLIO_DATA || (typeof PORTFOLIO_DATA !== "undefined" ? PORTFOLIO_DATA : null);
    if (!desktopGrid || !data || !data.projects) return;
    desktopGrid.innerHTML = "";

    const gridWidth = desktopGrid.clientWidth || window.innerWidth;
    const gridHeight = desktopGrid.clientHeight || window.innerHeight;
    const isMobile = window.innerWidth <= 768;

    data.projects.forEach((proj) => {
      const item = document.createElement("div");
      item.className = "desktop-item";
      item.dataset.id = proj.id;
      
      const posX = (proj.pos.x / 100) * gridWidth;
      const posY = (proj.pos.y / 100) * gridHeight;

      if (!isMobile) {
        item.style.left = `${posX}px`;
        item.style.top = `${posY}px`;
      }

      item.innerHTML = `
        <div class="desktop-icon-wrapper">
          <img src="${proj.cover}" alt="${proj.title}" draggable="false" loading="lazy">
        </div>
        <div class="desktop-label">${proj.title}</div>
      `;

      // Apple-like Silky Smooth Dragging with Mobile Touch Support
      let isDragging = false;
      let startX = 0, startY = 0;
      let itemX = 0, itemY = 0;
      let hasMoved = false;
      let animationFrameId = null;
      let currentClientX = 0, currentClientY = 0;

      const startDrag = (clientX, clientY) => {
        isDragging = true;
        hasMoved = false;
        startX = clientX;
        startY = clientY;
        itemX = item.offsetLeft || 0;
        itemY = item.offsetTop || 0;

        item.classList.add("is-dragging");
        item.style.zIndex = 300;
      };

      const updatePosition = () => {
        if (!isDragging) return;
        const dx = currentClientX - startX;
        const dy = currentClientY - startY;

        // On mobile/touch require higher move threshold before setting hasMoved
        const moveThreshold = isMobile ? 10 : 4;
        if (Math.abs(dx) > moveThreshold || Math.abs(dy) > moveThreshold) {
          hasMoved = true;
        }

        if (hasMoved && !isMobile) {
          let newLeft = itemX + dx;
          let newTop = itemY + dy;

          newLeft = Math.max(10, Math.min(window.innerWidth - 90, newLeft));
          newTop = Math.max(35, Math.min(window.innerHeight - 100, newTop));

          item.style.left = `${newLeft}px`;
          item.style.top = `${newTop}px`;
        }

        animationFrameId = null;
      };

      const moveDrag = (clientX, clientY) => {
        if (!isDragging) return;
        currentClientX = clientX;
        currentClientY = clientY;
        if (!animationFrameId) {
          animationFrameId = requestAnimationFrame(updatePosition);
        }
      };

      const endDrag = () => {
        if (!isDragging) return;
        isDragging = false;
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
        item.classList.remove("is-dragging");
        item.style.zIndex = "";

        if (!hasMoved) {
          openProjectModal(proj);
        }
      };

      // Mouse Listeners
      item.addEventListener("mousedown", (e) => {
        if (e.button !== 0) return;
        e.preventDefault();
        startDrag(e.clientX, e.clientY);

        const onMouseMove = (me) => {
          me.preventDefault();
          moveDrag(me.clientX, me.clientY);
        };

        const onMouseUp = () => {
          endDrag();
          document.removeEventListener("mousemove", onMouseMove);
          document.removeEventListener("mouseup", onMouseUp);
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
      });

      // Touch Listeners
      item.addEventListener("touchstart", (e) => {
        const touch = e.touches[0];
        startDrag(touch.clientX, touch.clientY);

        const onTouchMove = (te) => {
          const t = te.touches[0];
          moveDrag(t.clientX, t.clientY);
        };

        const onTouchEnd = () => {
          endDrag();
          document.removeEventListener("touchmove", onTouchMove);
          document.removeEventListener("touchend", onTouchEnd);
        };

        document.addEventListener("touchmove", onTouchMove, { passive: true });
        document.addEventListener("touchend", onTouchEnd);
      }, { passive: true });

      desktopGrid.appendChild(item);
    });
  }
  renderDesktopIcons();

  // Handle Resize for desktop grid layout
  window.addEventListener("resize", renderDesktopIcons);

  // 3. macOS Window Creator Core (Mobile Centered + Touch Support)
  function createWindow({ id, title, width = "620px", contentHTML, top = "15%", left = "25%" }) {
    if (activeWindows[id]) {
      focusWindow(activeWindows[id]);
      return activeWindows[id];
    }

    highestZIndex += 1;
    const win = document.createElement("div");
    win.className = "mac-window focused";
    win.id = `win-${id}`;
    
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      win.style.width = "92vw";
      win.style.top = "42px";
      win.style.left = "4vw";
    } else {
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
        <div class="window-header-actions"></div>
      </div>
      <div class="window-body">
        ${contentHTML}
      </div>
    `;

    // Window controls
    const closeBtn = win.querySelector(".traffic-btn.close");
    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      closeWindow(id);
    });

    const minimizeBtn = win.querySelector(".traffic-btn.minimize");
    minimizeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      closeWindow(id);
    });

    const maximizeBtn = win.querySelector(".traffic-btn.maximize");
    maximizeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      win.classList.toggle("maximized");
    });

    // Make window focusable (Mouse & Touch)
    win.addEventListener("mousedown", () => focusWindow(win));
    win.addEventListener("touchstart", () => focusWindow(win), { passive: true });

    // Make window draggable
    makeWindowDraggable(win);

    windowStack.appendChild(win);
    activeWindows[id] = win;

    // Trigger visible animation
    requestAnimationFrame(() => win.classList.add("visible"));
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
    setTimeout(() => {
      if (win.parentNode) win.parentNode.removeChild(win);
      delete activeWindows[id];
    }, 250);
  }

  // Unified Mouse + Touch Window Dragging Core
  function makeWindowDraggable(win) {
    const header = win.querySelector(".window-header");
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    const startDrag = (clientX, clientY) => {
      if (win.classList.contains("maximized")) return;
      isDragging = true;
      offsetX = clientX - win.offsetLeft;
      offsetY = clientY - win.offsetTop;
      focusWindow(win);
    };

    const moveDrag = (clientX, clientY) => {
      if (!isDragging) return;
      let newX = clientX - offsetX;
      let newY = clientY - offsetY;
      
      const winWidth = win.offsetWidth || 320;
      newX = Math.max(5, Math.min(window.innerWidth - winWidth - 5, newX));
      newY = Math.max(30, Math.min(window.innerHeight - 60, newY));

      win.style.left = `${newX}px`;
      win.style.top = `${newY}px`;
    };

    const endDrag = () => {
      isDragging = false;
    };

    // Mouse Event Listeners
    header.addEventListener("mousedown", (e) => {
      if (e.target.classList.contains("traffic-btn")) return;
      startDrag(e.clientX, e.clientY);
    });

    document.addEventListener("mousemove", (e) => {
      if (isDragging) moveDrag(e.clientX, e.clientY);
    });

    document.addEventListener("mouseup", endDrag);

    // Touch Event Listeners for Mobile Phones
    header.addEventListener("touchstart", (e) => {
      if (e.target.classList.contains("traffic-btn")) return;
      const touch = e.touches[0];
      startDrag(touch.clientX, touch.clientY);
    }, { passive: true });

    document.addEventListener("touchmove", (e) => {
      if (!isDragging) return;
      const touch = e.touches[0];
      moveDrag(touch.clientX, touch.clientY);
    }, { passive: true });

    document.addEventListener("touchend", endDrag);
    document.addEventListener("touchcancel", endDrag);
  }

  // 4. Open Project Detail Window Modal
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

    // Center offset based on project
    const topPos = `${Math.min(20 + Math.random() * 10, 30)}%`;
    const leftPos = `${Math.min(20 + Math.random() * 15, 35)}%`;

    createWindow({
      id: `proj-${project.id}`,
      title: project.title,
      width: "720px",
      top: topPos,
      left: leftPos,
      contentHTML: content
    });
  }

  // 5. Open Kajecik / Notes Window (About / CV / Interests)
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
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
          ${data.services.map(s => `
            <div style="background: rgba(255,255,255,0.04); padding: 10px; border-radius: 8px; font-size: 12px; font-weight: 600; border: 1px solid rgba(255,255,255,0.08);">
              ✨ ${s}
            </div>
          `).join("")}
        </div>
      </div>

      <div id="tab-cv" class="tab-content">
        <h3 style="font-size: 15px; font-weight: 800; margin-bottom: 14px;">Work Experience</h3>
        <div class="experience-timeline">
          ${data.experience.map(exp => `
            <div class="timeline-item">
              <div class="timeline-role">${exp.role}</div>
              <div class="timeline-company">${exp.company} · ${exp.period}</div>
              <div class="timeline-desc">${exp.description}</div>
            </div>
          `).join("")}
        </div>
        <h3 style="font-size: 15px; font-weight: 800; margin: 20px 0 10px 0;">Clients & Collaborators</h3>
        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
          ${data.clients.map(c => `
            <span style="background: rgba(59, 130, 246, 0.15); border: 1px solid rgba(59, 130, 246, 0.4); color: #60a5fa; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 12px;">${c}</span>
          `).join("")}
        </div>
      </div>

      <div id="tab-interests" class="tab-content">
        <h3 style="font-size: 15px; font-weight: 800; margin-bottom: 12px;">Design Philosophy & Inspirations</h3>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${data.interests.map(i => `
            <div style="background: rgba(255,255,255,0.04); border-left: 3px solid #10b981; padding: 10px 14px; border-radius: 0 8px 8px 0; font-size: 13px; font-weight: 600;">
              💡 ${i}
            </div>
          `).join("")}
        </div>
      </div>
    `;

    createWindow({
      id: "notebook",
      title: "Kajecik - About & CV",
      width: "600px",
      top: "12%",
      left: "26%",
      contentHTML: content
    });
  };

  // Tab switcher helper with robust touch target passing
  window.switchNotebookTab = function(tabId, btnEl) {
    document.querySelectorAll(".notebook-tabs .tab-btn").forEach(btn => btn.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
    
    const activeBtn = btnEl || (window.event ? window.event.target : null);
    if (activeBtn) activeBtn.classList.add("active");
    const targetContent = document.getElementById(tabId);
    if (targetContent) targetContent.classList.add("active");
  };

  // 6. Open Gallery Window
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

  // 7. Open Bin of Ideas / Trash Window
  window.openBinWindow = function() {
    const data = window.PORTFOLIO_DATA || (typeof PORTFOLIO_DATA !== "undefined" ? PORTFOLIO_DATA : {});
    const content = `
      <div style="padding: 10px;">
        <h3 style="font-size: 16px; font-weight: 800; margin-bottom: 12px;">🗑️ Bin of Unreleased Ideas</h3>
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

  // 10. Open Spotify Window (Recommendation Playlist: 4eBpz8sWLVz9EfuPOY2NpW)
  window.openSpotifyWindow = function() {
    const data = window.PORTFOLIO_DATA || (typeof PORTFOLIO_DATA !== "undefined" ? PORTFOLIO_DATA : {});
    const spotifyData = data.spotify || {};
    
    const content = `
      <div style="background: #121212; padding: 12px; border-radius: 8px; color: #fff;">
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

        <!-- Live Spotify Web Player Embed Playlist 4eBpz8sWLVz9EfuPOY2NpW -->
        <div style="border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.7); background: #000; margin-bottom: 10px;">
          <iframe
            title="Spotify Embed: Recommendation Playlist"
            src="https://open.spotify.com/embed/playlist/4eBpz8sWLVz9EfuPOY2NpW?utm_source=generator&theme=0"
            width="100%"
            height="380"
            style="min-height: 360px;"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy">
          </iframe>
        </div>
      </div>
    `;

    createWindow({
      id: "spotify",
      title: "Spotify Player — Top Tracks Playlist",
      width: "560px",
      top: "10%",
      left: "26%",
      contentHTML: content
    });
  };

  // 11. Open Contact Window with Interactive Working Email Links & Copy Action
  window.openContactWindow = function() {
    const data = window.PORTFOLIO_DATA || (typeof PORTFOLIO_DATA !== "undefined" ? PORTFOLIO_DATA : {});
    const email = (data.personal && data.personal.email) ? data.personal.email : "khushalworkmail08@gmail.com";
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent("Project Inquiry — Casey Portfolio")}`;
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent("Project Inquiry — Casey Portfolio")}`;

    const content = `
      <div style="text-align: center; padding: 22px 18px;">
        <!-- Mail Icon Badge -->
        <div style="width: 56px; height: 56px; margin: 0 auto 14px auto; background: rgba(59, 130, 246, 0.15); border: 1px solid rgba(59, 130, 246, 0.35); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 26px; box-shadow: 0 8px 24px rgba(59, 130, 246, 0.25);">
          ✉️
        </div>

        <h2 style="font-size: 22px; font-weight: 800; margin-bottom: 6px; letter-spacing: -0.3px;">Let's Work Together</h2>
        <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 20px; line-height: 1.5; max-width: 380px; margin-left: auto; margin-right: auto;">
          Art Direction · Visual Identity · Album Packaging · Stage Motion
        </p>

        <!-- Email Address Box with One-Click Copy -->
        <div style="display: flex; align-items: center; justify-content: center; gap: 10px; background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.18); padding: 8px 16px; border-radius: 20px; width: fit-content; margin: 0 auto 22px auto;">
          <span style="font-size: 13px; font-weight: 700; color: #ffffff; letter-spacing: 0.2px;">${email}</span>
          <button 
            type="button" 
            onclick="navigator.clipboard.writeText('${email}'); this.textContent='✓ Copied!'; setTimeout(() => this.textContent='📋 Copy', 2000);" 
            style="background: rgba(255, 255, 255, 0.18); border: none; color: #fff; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 12px; cursor: pointer; transition: all 0.2s ease;">
            📋 Copy
          </button>
        </div>

        <div style="display: flex; flex-direction: column; gap: 10px; width: 100%; max-width: 380px; margin: 0 auto;">
          <!-- Direct Gmail Web Compose Button (100% Native Trusted Link) -->
          <a 
            href="${gmailUrl}" 
            target="_blank" 
            rel="noopener noreferrer" 
            style="display: flex; align-items: center; justify-content: center; gap: 10px; padding: 14px 24px; background: #ea4335; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 13px; border-radius: 24px; box-shadow: 0 6px 20px rgba(234, 67, 53, 0.45); transition: transform 0.2s, background 0.2s;"
            onmouseover="this.style.transform='scale(1.02)'; this.style.background='#dc2626';" 
            onmouseout="this.style.transform='scale(1)'; this.style.background='#ea4335';">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
            Compose in Gmail Web
          </a>

          <!-- Native Mail App Option -->
          <a 
            href="${mailtoUrl}" 
            style="display: flex; align-items: center; justify-content: center; gap: 8px; padding: 12px 24px; background: rgba(255, 255, 255, 0.12); border: 1px solid rgba(255, 255, 255, 0.2); color: #ffffff; text-decoration: none; font-weight: 600; font-size: 13px; border-radius: 24px; transition: transform 0.2s, background 0.2s;"
            onmouseover="this.style.transform='scale(1.02)'; this.style.background='rgba(255, 255, 255, 0.22)';" 
            onmouseout="this.style.transform='scale(1)'; this.style.background='rgba(255, 255, 255, 0.12)';">
            📫 Open in Default Mail App
          </a>
        </div>
      </div>
    `;

    createWindow({
      id: "contact",
      title: "Contact Casey",
      width: "480px",
      top: "22%",
      left: "32%",
      contentHTML: content
    });
  };

  // 9. Open Adobe Crash Easter Egg Dialog
  window.openAdobeDialog = function(type) {
    const data = window.PORTFOLIO_DATA || (typeof PORTFOLIO_DATA !== "undefined" ? PORTFOLIO_DATA : {});
    const adobeDialogs = data.adobeDialogs || {};
    const dialogData = adobeDialogs[type] || adobeDialogs.warn || { title: "Warning", message: "System warning", button: "Close" };
    const content = `
      <div class="adobe-dialog-box">
        <div class="adobe-icon-warning">⚠️</div>
        <h3 style="font-size: 16px; font-weight: 800; margin-bottom: 10px;">${dialogData.title}</h3>
        <p class="adobe-msg-text">${dialogData.message}</p>
        <button class="adobe-btn-action" onclick="this.closest('.mac-window').querySelector('.traffic-btn.close').click()">
          ${dialogData.button}
        </button>
      </div>
    `;

    createWindow({
      id: `adobe-${type}`,
      title: dialogData.title,
      width: "420px",
      top: "30%",
      left: "35%",
      contentHTML: content
    });
  };

  // 10. Dock Icon Hover Magnification Animation Effect (Desktop Only)
  if (dock) {
    const dockItems = dock.querySelectorAll(".dock-item");
    const isTouchDevice = window.matchMedia("(hover: none)").matches;
    
    if (!isTouchDevice) {
      dock.addEventListener("mousemove", (e) => {
        const mouseX = e.clientX;
        
        dockItems.forEach(item => {
          const rect = item.getBoundingClientRect();
          const itemCenterX = rect.left + rect.width / 2;
          const distance = Math.abs(mouseX - itemCenterX);
          
          let scale = 1;
          if (distance < 140) {
            scale = 1 + (1 - distance / 140) * 0.45; // Max 1.45x scale
          }
          item.style.transform = `scale(${scale})`;
        });
      });

      dock.addEventListener("mouseleave", () => {
        dockItems.forEach(item => {
          item.style.transform = "scale(1)";
        });
      });
    }
  }

  // Keyboard shortcut: ESC to close top window
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const openWins = Object.values(activeWindows);
      if (openWins.length > 0) {
        // Find topmost window
        openWins.sort((a, b) => parseInt(b.style.zIndex || 0) - parseInt(a.style.zIndex || 0));
        const topId = openWins[0].id.replace("win-", "");
        closeWindow(topId);
      }
    }
  });
});
