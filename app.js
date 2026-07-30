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

  // 2. Render Scattered Desktop Icons (Ultra-Smooth Apple Dragging)
  function renderDesktopIcons() {
    if (!desktopGrid || !PORTFOLIO_DATA || !PORTFOLIO_DATA.projects) return;
    desktopGrid.innerHTML = "";

    const gridWidth = desktopGrid.clientWidth || window.innerWidth;
    const gridHeight = desktopGrid.clientHeight || window.innerHeight;

    PORTFOLIO_DATA.projects.forEach((proj) => {
      const item = document.createElement("div");
      item.className = "desktop-item";
      item.dataset.id = proj.id;
      
      // Calculate initial pixel coordinates from percentages
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

      // Apple-like Silky Smooth Dragging
      let isDragging = false;
      let startX = 0, startY = 0;
      let itemX = posX, itemY = posY;
      let hasMoved = false;
      let animationFrameId = null;
      let currentClientX = 0, currentClientY = 0;

      const startDrag = (clientX, clientY) => {
        isDragging = true;
        hasMoved = false;
        startX = clientX;
        startY = clientY;
        itemX = parseFloat(item.style.left) || 0;
        itemY = parseFloat(item.style.top) || 0;

        item.classList.add("is-dragging");
        item.style.zIndex = 300;
      };

      const updatePosition = () => {
        if (!isDragging) return;
        const dx = currentClientX - startX;
        const dy = currentClientY - startY;

        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
          hasMoved = true;
        }

        if (hasMoved) {
          let newLeft = itemX + dx;
          let newTop = itemY + dy;

          // Clamp smoothly inside workspace bounds
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

  // 3. macOS Window Creator Core
  function createWindow({ id, title, width = "620px", contentHTML, top = "15%", left = "25%" }) {
    if (activeWindows[id]) {
      focusWindow(activeWindows[id]);
      return activeWindows[id];
    }

    highestZIndex += 1;
    const win = document.createElement("div");
    win.className = "mac-window focused";
    win.id = `win-${id}`;
    win.style.width = width;
    win.style.zIndex = highestZIndex;
    win.style.top = top;
    win.style.left = left;

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

    // Make window focusable
    win.addEventListener("mousedown", () => focusWindow(win));

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

  function makeWindowDraggable(win) {
    const header = win.querySelector(".window-header");
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    header.addEventListener("mousedown", (e) => {
      if (e.target.classList.contains("traffic-btn")) return;
      isDragging = true;
      offsetX = e.clientX - win.offsetLeft;
      offsetY = e.clientY - win.offsetTop;
      focusWindow(win);
    });

    document.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      let newX = e.clientX - offsetX;
      let newY = e.clientY - offsetY;
      // Clamp to viewport
      newY = Math.max(30, Math.min(window.innerHeight - 80, newY));
      win.style.left = `${newX}px`;
      win.style.top = `${newY}px`;
    });

    document.addEventListener("mouseup", () => {
      isDragging = false;
    });
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
    const content = `
      <div class="notebook-tabs">
        <button class="tab-btn active" onclick="switchNotebookTab('tab-about')">About Casey</button>
        <button class="tab-btn" onclick="switchNotebookTab('tab-cv')">CV & Experience</button>
        <button class="tab-btn" onclick="switchNotebookTab('tab-interests')">Creative Interests</button>
      </div>

      <div id="tab-about" class="tab-content active">
        <div class="bio-card">
          <img class="bio-avatar" src="${PORTFOLIO_DATA.personal.heroImage}" alt="${PORTFOLIO_DATA.personal.name}" onerror="this.src='https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80'">
          <div>
            <h2 style="font-size: 22px; font-weight: 900;">${PORTFOLIO_DATA.personal.name}</h2>
            <div style="color: var(--accent-color); font-weight: 700; font-size: 13px; margin-bottom: 8px;">${PORTFOLIO_DATA.personal.title}</div>
            <p style="font-size: 13px; line-height: 1.5; color: var(--text-muted);">${PORTFOLIO_DATA.personal.bio}</p>
          </div>
        </div>
        <h3 style="font-size: 14px; font-weight: 800; margin-bottom: 10px;">Capabilities & Services</h3>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
          ${PORTFOLIO_DATA.services.map(s => `
            <div style="background: rgba(255,255,255,0.04); padding: 10px; border-radius: 8px; font-size: 12px; font-weight: 600; border: 1px solid rgba(255,255,255,0.08);">
              ✨ ${s}
            </div>
          `).join("")}
        </div>
      </div>

      <div id="tab-cv" class="tab-content">
        <h3 style="font-size: 15px; font-weight: 800; margin-bottom: 14px;">Work Experience</h3>
        <div class="experience-timeline">
          ${PORTFOLIO_DATA.experience.map(exp => `
            <div class="timeline-item">
              <div class="timeline-role">${exp.role}</div>
              <div class="timeline-company">${exp.company} · ${exp.period}</div>
              <div class="timeline-desc">${exp.description}</div>
            </div>
          `).join("")}
        </div>
        <h3 style="font-size: 15px; font-weight: 800; margin: 20px 0 10px 0;">Clients & Collaborators</h3>
        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
          ${PORTFOLIO_DATA.clients.map(c => `
            <span style="background: rgba(59, 130, 246, 0.15); border: 1px solid rgba(59, 130, 246, 0.4); color: #60a5fa; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 12px;">${c}</span>
          `).join("")}
        </div>
      </div>

      <div id="tab-interests" class="tab-content">
        <h3 style="font-size: 15px; font-weight: 800; margin-bottom: 12px;">Design Philosophy & Inspirations</h3>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${PORTFOLIO_DATA.interests.map(i => `
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

  // Tab switcher helper
  window.switchNotebookTab = function(tabId) {
    document.querySelectorAll(".notebook-tabs .tab-btn").forEach(btn => btn.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
    
    event.target.classList.add("active");
    const targetContent = document.getElementById(tabId);
    if (targetContent) targetContent.classList.add("active");
  };

  // 6. Open Gallery Window
  window.openGalleryWindow = function() {
    const content = `
      <div class="gallery-grid">
        ${PORTFOLIO_DATA.gallery.map(item => `
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
    const content = `
      <div style="padding: 10px;">
        <h3 style="font-size: 16px; font-weight: 800; margin-bottom: 12px;">🗑️ Bin of Unreleased Ideas</h3>
        <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 16px;">Early drafts, poster experiments, and creative concepts waiting for their turn.</p>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          ${PORTFOLIO_DATA.binOfIdeas.map(item => `
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
    const data = PORTFOLIO_DATA.spotify;
    
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

  // 11. Open Contact Window
  window.openContactWindow = function() {
    const content = `
      <div style="text-align: center; padding: 10px;">
        <div style="font-size: 40px; margin-bottom: 10px;">✉️</div>
        <h2 style="font-size: 22px; font-weight: 900; margin-bottom: 6px;">Let's Work Together</h2>
        <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 20px;">Open for Art Direction, Key Visuals, Album Packaging & Collaborations.</p>
        <a href="mailto:${PORTFOLIO_DATA.personal.email}" style="display: inline-block; padding: 10px 24px; background: #3b82f6; color: #fff; text-decoration: none; font-weight: 800; font-size: 13px; border-radius: 8px; transition: background 0.2s;">
          Send Email to ${PORTFOLIO_DATA.personal.email}
        </a>
      </div>
    `;

    createWindow({
      id: "contact",
      title: "Contact Casey",
      width: "450px",
      top: "22%",
      left: "32%",
      contentHTML: content
    });
  };

  // 9. Open Adobe Crash Easter Egg Dialog
  window.openAdobeDialog = function(type) {
    const dialogData = PORTFOLIO_DATA.adobeDialogs[type] || PORTFOLIO_DATA.adobeDialogs.warn;
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

  // 10. Dock Icon Hover Magnification Animation Effect
  if (dock) {
    const dockItems = dock.querySelectorAll(".dock-item");
    
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
