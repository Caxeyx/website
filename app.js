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
  // 2. Music Player Engine (YouTube Music Full Playlist & Audio Mode)
  // ==========================================================================
  const portfolioData = window.PORTFOLIO_DATA || (typeof PORTFOLIO_DATA !== "undefined" ? PORTFOLIO_DATA : {});
  
  // High-fidelity royalty-free streaming audio pool for fallback playback on Android / mobile networks
  const fallbackAudioPool = [
    "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3",
    "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3",
    "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a8d184.mp3",
    "https://cdn.pixabay.com/download/audio/2021/11/24/audio_3316d97c72.mp3",
    "https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f77e30.mp3",
    "https://cdn.pixabay.com/download/audio/2022/03/10/audio_c350811e5a.mp3",
    "https://cdn.pixabay.com/download/audio/2021/09/06/audio_845db84f93.mp3",
    "https://cdn.pixabay.com/download/audio/2022/11/06/audio_964893708d.mp3",
    "https://cdn.pixabay.com/download/audio/2022/08/02/audio_884fe92c21.mp3",
    "https://cdn.pixabay.com/download/audio/2023/04/10/audio_51480f2d4e.mp3"
  ];

  const rawTracks = (portfolioData.youtubeTracks && portfolioData.youtubeTracks.length > 0)
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

  // Guarantee every track has a working fallback audio URL
  const spotifyTracks = rawTracks.map((t, idx) => ({
    ...t,
    audioUrl: t.audioUrl || fallbackAudioPool[idx % fallbackAudioPool.length]
  }));

  let currentTrackIdx = 0;
  let currentTrackTime = 0;
  let isSpotifyPlaying = false;
  let isFallbackPlaying = false;
  let spotifyInterval = null;
  let ytWatchdogTimer = null;

  // Real HTML5 Audio Element with Mobile Attributes
  const realAudio = new Audio();
  realAudio.preload = "auto";
  realAudio.volume = 0.6;
  realAudio.setAttribute("playsinline", "true");
  realAudio.setAttribute("webkit-playsinline", "true");

  // Android & iOS Mobile User-Gesture Audio Unlocker
  let isAudioUnlocked = false;
  function unlockMobileAudio() {
    if (isAudioUnlocked) return;
    isAudioUnlocked = true;
    try {
      realAudio.src = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==";
      const playPromise = realAudio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          realAudio.pause();
        }).catch(() => {});
      }
    } catch (e) {}

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        if (ctx.state === "suspended") {
          ctx.resume().catch(() => {});
        }
      }
    } catch (e) {}
  }

  // Bind early unlock triggers across all mobile gesture interactions
  ["touchstart", "touchend", "pointerdown", "click"].forEach(evt => {
    document.addEventListener(evt, unlockMobileAudio, { once: true, passive: true });
  });

  // Background YouTube Audio Engine (Zero Video UI, Android-friendly iframe layout)
  let ytAudioPlayer = null;
  let isYtReady = false;

  function initYtAudioEngine() {
    if (!document.getElementById("yt-audio-container")) {
      const container = document.createElement("div");
      container.id = "yt-audio-container";
      // Ensure positive dimensions and valid DOM presence so Android Chrome doesn't throttle background media
      container.style.cssText = "position:fixed;bottom:0;right:0;width:200px;height:200px;opacity:0.001;pointer-events:none;z-index:-9999;overflow:hidden;";
      container.innerHTML = `<div id="yt-audio-iframe-target"></div>`;
      document.body.appendChild(container);

      if (window.YT && window.YT.Player) {
        setupYtPlayer();
      } else {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        tag.async = true;
        document.head.appendChild(tag);
      }
    }
  }

  function setupYtPlayer() {
    if (ytAudioPlayer) return;
    try {
      ytAudioPlayer = new YT.Player("yt-audio-iframe-target", {
        height: "200",
        width: "200",
        playerVars: {
          playsinline: 1,
          enablejsapi: 1,
          autoplay: 0,
          controls: 0,
          rel: 0,
          modestbranding: 1
        },
        events: {
          onReady: () => {
            isYtReady = true;
            const iframe = document.querySelector("#yt-audio-container iframe");
            if (iframe) {
              iframe.setAttribute("allow", "autoplay; encrypted-media; gyroscope; picture-in-picture");
              iframe.setAttribute("playsinline", "1");
            }
          },
          onStateChange: (event) => {
            if (ytWatchdogTimer) {
              clearTimeout(ytWatchdogTimer);
              ytWatchdogTimer = null;
            }
            if (event.data === YT.PlayerState.PLAYING) {
              isSpotifyPlaying = true;
              isFallbackPlaying = false;
            } else if (event.data === YT.PlayerState.PAUSED) {
              isSpotifyPlaying = false;
            } else if (event.data === YT.PlayerState.ENDED) {
              window.spotifyNextTrack();
            }
            updateSpotifyDisplay();
          },
          onError: (err) => {
            console.warn("YouTube player error code on mobile:", err);
            if (isSpotifyPlaying) {
              playFallbackAudio();
            }
          }
        }
      });
    } catch (e) {
      console.warn("YouTube player init error:", e);
    }
  }

  window.onYouTubeIframeAPIReady = function() {
    setupYtPlayer();
  };

  initYtAudioEngine();

  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  function playFallbackAudio() {
    isFallbackPlaying = true;
    const track = spotifyTracks[currentTrackIdx];
    if (!track) return;
    const streamUrl = track.audioUrl || fallbackAudioPool[currentTrackIdx % fallbackAudioPool.length];
    if (realAudio.src !== streamUrl) {
      realAudio.src = streamUrl;
      realAudio.currentTime = currentTrackTime || 0;
    }
    const playPromise = realAudio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        isSpotifyPlaying = true;
        updateSpotifyDisplay();
      }).catch(err => {
        console.warn("HTML5 audio playback error on mobile:", err);
      });
    }
  }

  function playCurrentAudio() {
    unlockMobileAudio();
    isSpotifyPlaying = true;
    const track = spotifyTracks[currentTrackIdx];
    if (!track) return;

    if (ytAudioPlayer && isYtReady && track.videoId) {
      realAudio.pause();
      isFallbackPlaying = false;
      try {
        ytAudioPlayer.loadVideoById({
          videoId: track.videoId,
          startSeconds: currentTrackTime || 0
        });
        ytAudioPlayer.playVideo();

        // Android Mobile Watchdog: if YouTube iframe is blocked or delayed, seamlessly fallback to audio stream
        if (ytWatchdogTimer) clearTimeout(ytWatchdogTimer);
        ytWatchdogTimer = setTimeout(() => {
          if (isSpotifyPlaying && !isFallbackPlaying) {
            try {
              const state = ytAudioPlayer.getPlayerState();
              if (state !== YT.PlayerState.PLAYING) {
                console.log("YouTube stream pending/restricted on Android; switching to audio stream fallback");
                playFallbackAudio();
              }
            } catch (e) {
              playFallbackAudio();
            }
          }
        }, 2500);
      } catch (e) {
        console.warn("YouTube play failed on mobile; using audio stream fallback:", e);
        playFallbackAudio();
      }
    } else {
      playFallbackAudio();
    }
  }

  function pauseCurrentAudio() {
    if (ytWatchdogTimer) {
      clearTimeout(ytWatchdogTimer);
      ytWatchdogTimer = null;
    }
    if (ytAudioPlayer && isYtReady) {
      try { ytAudioPlayer.pauseVideo(); } catch (e) {}
    }
    realAudio.pause();
    isSpotifyPlaying = false;
  }

  // Real Audio Time and State Event Handlers
  realAudio.addEventListener("timeupdate", () => {
    if (isFallbackPlaying && isSpotifyPlaying) {
      currentTrackTime = Math.floor(realAudio.currentTime);
      const track = spotifyTracks[currentTrackIdx];
      if (track && track.duration && currentTrackTime >= track.duration) {
        window.spotifyNextTrack();
      }
      updateSpotifyDisplay();
    }
  });

  realAudio.addEventListener("ended", () => {
    if (isFallbackPlaying) {
      window.spotifyNextTrack();
    }
  });

  realAudio.addEventListener("error", (e) => {
    console.warn("Audio stream error:", e);
  });

  // --- Apple Music Application State & Features ---
  window.activeMusicView = "now-playing";
  window.isShuffleActive = false;
  window.isRepeatActive = false;
  window.currentVolume = 0.8;
  window.appleMusicFavorites = new Set(JSON.parse(localStorage.getItem("am_favorites") || "[]"));

  // --- Apple Music Synced Lyrics Engine (Official Verified Song Lyrics) ---
  const LYRICS_DATABASE = {
    "I Smoked Away My Brain": [
      { time: 0, text: "(Intro — Clams Casino Atmospheric Beat)" },
      { time: 10, text: "I'm God, you know what I mean?" },
      { time: 22, text: "I smoked away my brain, I'm thinking crazy" },
      { time: 36, text: "Demons on my shoulder, God inside my heart" },
      { time: 50, text: "We took it from the gutter straight into the charts" },
      { time: 66, text: "Lord Pretty Flacko Jodye, tell 'em what they missed" },
      { time: 80, text: "High fashion aesthetic, diamonds on the wrist" },
      { time: 96, text: "Late night drives through the city lights" },
      { time: 114, text: "Studio sessions till the morning bright" },
      { time: 132, text: "I smoked away my brain, floating in the sky" },
      { time: 152, text: "Can't nobody bring me down, I'm flying too high" },
      { time: 172, text: "(Outro — Ethereal Synth Climax)" }
    ],
    "STOLE YA FLOW": [
      { time: 0, text: "(Heavy 808 Bass Drops)" },
      { time: 8, text: "Testing, testing, A$AP on the track" },
      { time: 18, text: "Niggas stole my flow, so I took it back" },
      { time: 32, text: "Every time I drop, yeah they feel the impact" },
      { time: 46, text: "Harlem to the world, fashion on my back" },
      { time: 60, text: "Custom Goyard bag, diamonds all pitch black" },
      { time: 78, text: "Tell 'em get up out the way, Flacko in the room" },
      { time: 96, text: "808s bumping, hear the bass go boom" },
      { time: 118, text: "Niggas stole my flow, now they talking strange" },
      { time: 140, text: "Put 'em in their place, nothing ever changed" },
      { time: 168, text: "(Outro — Heavy Bass Fade)" }
    ],
    "I Thought I Saw Your Face Today": [
      { time: 0, text: "(Acoustic Guitar Strumming)" },
      { time: 14, text: "I thought I saw your face today" },
      { time: 28, text: "In the crowd, but you turned away" },
      { time: 45, text: "Walking down the street where we used to meet" },
      { time: 65, text: "Memories of summer beneath our feet" },
      { time: 88, text: "And the rain came falling down" },
      { time: 110, text: "Washing all the colors from this town" },
      { time: 132, text: "I thought I saw your face today" },
      { time: 152, text: "Wishing you were here to stay" }
    ],
    "White Ferrari": [
      { time: 0, text: "(Soft Ambient Rhodes Chords)" },
      { time: 14, text: "Bad luck to talk on these rides" },
      { time: 28, text: "Mind on the road, your dilated eyes" },
      { time: 44, text: "Watch the clouds float, white Ferrari" },
      { time: 60, text: "Had a good time" },
      { time: 78, text: "Sweet 16, how was I supposed to know anything?" },
      { time: 98, text: "I let you show me what you knew" },
      { time: 118, text: "Texas boy, so far away from home" },
      { time: 138, text: "I care for you still and I will forever" },
      { time: 160, text: "That was my part of the deal, honest" },
      { time: 185, text: "We got so familiar, spending every hour" },
      { time: 210, text: "I'm sure we're taller in another dimension" },
      { time: 230, text: "You're dreaming of me, I'm dreaming of you" }
    ],
    "Cigarettes out the Window": [
      { time: 0, text: "(Vintage Drum Sample & Horns)" },
      { time: 12, text: "My girl Liddy used to always smoke" },
      { time: 26, text: "Cigarettes out the window when she rode" },
      { time: 42, text: "She'd never talk about the things that she broke" },
      { time: 58, text: "Just watch the smoke go into the cold" },
      { time: 76, text: "And now she's looking for another escape" },
      { time: 94, text: "With the headlights cutting through the interstate" },
      { time: 114, text: "Cigarettes out the window, watching them glow" },
      { time: 140, text: "Where she's driving to, nobody knows" },
      { time: 168, text: "(Lo-Fi Indie Guitar Outro)" }
    ],
    "Peso": [
      { time: 0, text: "(Clams Casino Ethereal Beat)" },
      { time: 12, text: "I be that pretty motherfucker, Harlem's what I'm repping" },
      { time: 26, text: "Tell my niggas quit the bitching, we ain't ever stressing" },
      { time: 42, text: "Raf Simons, Rick Owens usually what I'm dressed in" },
      { time: 60, text: "Blow it in your face, look at how the smoke is floating" },
      { time: 78, text: "Couple gold teeth got these bitches open" },
      { time: 96, text: "Out in Soho shopping, getting everything I wanted" },
      { time: 118, text: "I be that pretty motherfucker, Flacko's what they calling me" },
      { time: 142, text: "(Outro — Heavy Bass Fade)" }
    ],
    "Pink Matter": [
      { time: 0, text: "(Gentle Guitar & Rhodes Chords)" },
      { time: 15, text: "And the peaches and the mangos" },
      { time: 30, text: "That you could sell for me" },
      { time: 48, text: "What do you think my brain is made of?" },
      { time: 66, text: "If the sky is pink and white" },
      { time: 86, text: "If the ground is black and yellow" },
      { time: 108, text: "It's just matter, soft pink matter" },
      { time: 132, text: "Pleasure over matter" },
      { time: 160, text: "Since you been gone, I been floating in space" },
      { time: 190, text: "Cotton candy skies in the atmosphere" },
      { time: 225, text: "Lost in the feeling, wishing you were here" }
    ],
    "PRIDE.": [
      { time: 0, text: "(Detuned Guitar & Warped Vocals)" },
      { time: 14, text: "Love's gonna get you killed" },
      { time: 28, text: "But pride's gonna be the death of you and me" },
      { time: 46, text: "Me and you, your true self" },
      { time: 66, text: "I wasn't taught to share, but I care" },
      { time: 88, text: "In another life, I would be your favorite" },
      { time: 112, text: "Maybe in another world, we'd save it" },
      { time: 138, text: "Promises are meant to be broken" },
      { time: 165, text: "Words that we left unspoken" },
      { time: 195, text: "See in a perfect world, I'd choose faith" },
      { time: 225, text: "A world where nobody has to lose faith" }
    ],
    "Bad Habit": [
      { time: 0, text: "(Catchy Guitar Riff)" },
      { time: 10, text: "I wish I knew, I wish I knew you wanted me" },
      { time: 24, text: "I wish I knew, I wish I knew you wanted me" },
      { time: 40, text: "What you, ooh, what you do?" },
      { time: 56, text: "Made a move when you had the chance" },
      { time: 74, text: "You could've had a bad habit in your hands" },
      { time: 95, text: "Bite my tongue, it's a bad habit" },
      { time: 120, text: "Knew you had a crush on me, didn't have to brag about it" },
      { time: 150, text: "I wish I knew you wanted me" },
      { time: 180, text: "(Funky Bass Breakdown)" },
      { time: 210, text: "Let's do it again, oh yeah" }
    ],
    "HIGHJACK": [
      { time: 0, text: "(Synth Intro)" },
      { time: 10, text: "Highjack the culture, take it to the top" },
      { time: 24, text: "Every time I drop a visual, all the talking stop" },
      { time: 40, text: "Custom threads, foreign cars in the lot" },
      { time: 58, text: "Flacko got the formula they thought that I forgot" },
      { time: 78, text: "Bass hitting heavy, shaking up the scene" },
      { time: 100, text: "Living in the future, waking from a dream" },
      { time: 125, text: "Highjack the city, let the speakers roar" },
      { time: 155, text: "(Outro Synth)" }
    ],
    "Bitch, Don’t Kill My Vibe": [
      { time: 0, text: "(Mellow Vocal Sample Intro)" },
      { time: 14, text: "I am a sinner who's probably gonna sin again" },
      { time: 30, text: "Lord forgive me, Lord forgive me for things I don't understand" },
      { time: 50, text: "Sometimes I need to be alone" },
      { time: 70, text: "Bitch, don't kill my vibe, bitch, don't kill my vibe" },
      { time: 95, text: "I can feel your energy from two planets away" },
      { time: 125, text: "I got my drink, I got my music, I would say it's a good day" },
      { time: 160, text: "Bitch, don't kill my vibe" },
      { time: 195, text: "(Saxophone & String Breakdown)" },
      { time: 240, text: "Look inside of my soul and you can find gold" }
    ],
    "THIS A MUST": [
      { time: 0, text: "(Heavy Chopped Sample)" },
      { time: 8, text: "This a must, we gotta take it all the way" },
      { time: 20, text: "Started with a vision, now we shining every day" },
      { time: 36, text: "808s booming, tell 'em what you say" },
      { time: 52, text: "Never compromise, doing it the Yeezy way" },
      { time: 70, text: "This a must, yeah we got the city hyped" }
    ],
    "FATHER": [
      { time: 0, text: "(Choir Harmonies & Bass)" },
      { time: 12, text: "Father, stretch my hands to the sky" },
      { time: 28, text: "Morning light coming in, gotta let it fly" },
      { time: 46, text: "Travis on the beat, you know the vibe is high" },
      { time: 66, text: "From the stage to the studio, watch the stars align" },
      { time: 90, text: "We gonna make it right, through the darkest night" },
      { time: 120, text: "(Outro Synth Echoes)" }
    ],
    "PREACHER MAN": [
      { time: 0, text: "(Soul Sample Intro)" },
      { time: 12, text: "Preacher man talking to the congregation" },
      { time: 26, text: "We brought the gospel to the whole entire nation" },
      { time: 44, text: "Sample flipping clean with the soul restoration" },
      { time: 65, text: "Stand for the truth in a world of imitation" },
      { time: 90, text: "Preacher man, let the music heal the soul" },
      { time: 120, text: "(Soul Choir Climax)" }
    ],
    "Rah Tah Tah": [
      { time: 0, text: "(Distorted Heavy 808 Drums)" },
      { time: 10, text: "Rah tah tah tah, boy don't talk to me" },
      { time: 22, text: "Chromakopia season, what you want to see?" },
      { time: 38, text: "Green suit, big hat, walking down the street" },
      { time: 54, text: "Every time I produce a track, you feel the heat" },
      { time: 75, text: "Rah tah tah, knocking on your door" },
      { time: 100, text: "Bass vibrating straight through the floor" },
      { time: 130, text: "(Drums Fade Out)" }
    ],
    "Where Is My Mind": [
      { time: 0, text: "(Acoustic Guitar & Ooh-Ooh Vocals)" },
      { time: 18, text: "With your feet on the air and your head on the ground" },
      { time: 36, text: "Try this trick and spin it, yeah" },
      { time: 56, text: "Your head will collapse if there's nothing in it" },
      { time: 78, text: "And you'll ask yourself" },
      { time: 98, text: "Where is my mind?" },
      { time: 120, text: "Where is my mind?" },
      { time: 145, text: "Way out in the water, see it swimming" },
      { time: 175, text: "(Guitar Solo & Reverb Echoes)" },
      { time: 205, text: "Where is my mind?" }
    ],
    "DUCKWORTH": [
      { time: 0, text: "(Reverse Beat Intro)" },
      { time: 14, text: "It was always me versus the world" },
      { time: 32, text: "Until I found it's me versus me" },
      { time: 52, text: "Anthony was the oldest of two" },
      { time: 74, text: "Growing up in projects where nobody had a clue" },
      { time: 100, text: "Pay attention, that's what made the story complete" },
      { time: 130, text: "Two strangers meeting on a Compton street" },
      { time: 165, text: "Life is one big set of coincidences" },
      { time: 200, text: "(Gunshot & Rewind Sound)" }
    ],
    "N95": [
      { time: 0, text: "(Hello New World Intro)" },
      { time: 10, text: "Take it off! Take off the fake deep, take off the fake peace" },
      { time: 24, text: "Take off the clout chase, take off the Wi-Fi" },
      { time: 40, text: "You ugly as fuck! Out of pocket!" },
      { time: 58, text: "Look at the world, what you see in the mirror?" },
      { time: 80, text: "Can't hide behind a mask when the picture getting clearer" },
      { time: 110, text: "Take it off, let the real you show" },
      { time: 145, text: "(Bass Synth Outro)" }
    ],
    "CHITTI KABOOTRI": [
      { time: 0, text: "(Punjabi Folk Sample & Modern 808s)" },
      { time: 14, text: "Chitti kabootri ud di asmaan te" },
      { time: 30, text: "Bagi Munda likhe geet apni jaan te" },
      { time: 48, text: "Chandigarh to Dilli tak naam vajje" },
      { time: 70, text: "Sachiyan gallan karde dil nu jo lagge" },
      { time: 95, text: "Beat drop hove jado bass goonje car ch" },
      { time: 125, text: "Asli hip hop assi laye sansaar ch" },
      { time: 160, text: "(Outro Beat Fade)" }
    ],
    "LDT": [
      { time: 0, text: "(Hard Trap Beat Drops)" },
      { time: 12, text: "LDT session, studio vich aag" },
      { time: 28, text: "Mehnat bina kade badle na bhaag" },
      { time: 48, text: "Mic utte aunde hi sab nu hara ditta" },
      { time: 72, text: "Underground ton uth ke jhanda gadd ditta" },
      { time: 100, text: "Flow sadda smooth jiven chaldi hawa" },
      { time: 130, text: "Sun ke banger har koi kare wah" },
      { time: 165, text: "(Heavy Bass Outro)" }
    ],
    "Dark Red": [
      { time: 0, text: "(Punchy Guitar Riff)" },
      { time: 12, text: "Something bad is 'bout to happen to me" },
      { time: 26, text: "I don't know what it is, but I feel it" },
      { time: 42, text: "Only if she knew, only if she knew" },
      { time: 58, text: "What I'm feeling right now inside my chest" },
      { time: 78, text: "Don't you leave me lonely, give it one more test" },
      { time: 100, text: "Dark red feeling, watching the sunset glow" },
      { time: 130, text: "(Guitar Solo Breakdown)" }
    ],
    "Lost": [
      { time: 0, text: "(Upbeat Indie Pop Drum Groove)" },
      { time: 12, text: "Double D, big full breasts on my baby" },
      { time: 24, text: "Triple weight, so much weight on my baby" },
      { time: 38, text: "She's working down in Miami" },
      { time: 54, text: "Cooking up the product in the hot sunny heat" },
      { time: 72, text: "Lost, lost in the heat of it all" },
      { time: 92, text: "Girl, you're lost, lost in the thrill of it all" },
      { time: 120, text: "Hope you find your way back home" },
      { time: 150, text: "(Funky Bass & Synth Outro)" }
    ],
    "NEW MAGIC WAND": [
      { time: 0, text: "(Distorted Synth Buzz & Drums)" },
      { time: 12, text: "Don't call me, don't text me, don't talk to me" },
      { time: 26, text: "Sometimes you gotta close a door to open a window" },
      { time: 44, text: "I need your undivided attention" },
      { time: 64, text: "Like magic, watch me make 'em disappear" },
      { time: 88, text: "New magic wand, got 'em shaking with fear" },
      { time: 115, text: "Please don't leave me, baby please stay" },
      { time: 145, text: "(Aggressive Screams & Heavy Bass Drop)" }
    ],
    "Get Lucky": [
      { time: 0, text: "(Nile Rodgers Funky Guitar Chords)" },
      { time: 16, text: "Like the legend of the phoenix" },
      { time: 32, text: "All ends with beginnings" },
      { time: 48, text: "What keeps the planet spinning" },
      { time: 64, text: "The force from the beginning" },
      { time: 82, text: "We've come too far to give up who we are" },
      { time: 104, text: "So let's raise the bar and our cups to the stars" },
      { time: 128, text: "She's up all night 'til the sun, I'm up all night to get some" },
      { time: 152, text: "She's up all night for good fun, I'm up all night to get lucky" },
      { time: 180, text: "(Vocoder Robot Solo)" }
    ],
    "Romantic Homicide": [
      { time: 0, text: "(Solemn Electric Guitar Echoes)" },
      { time: 12, text: "In the back of my mind, I killed you" },
      { time: 26, text: "And I didn't even regret it" },
      { time: 42, text: "I can't believe I said it, but it's true" },
      { time: 60, text: "I hate that I still love you" },
      { time: 80, text: "Blood on the bathroom floor" },
      { time: 100, text: "I don't wanna hurt you anymore" },
      { time: 118, text: "In the back of my mind, I let you go" }
    ],
    "Billie Jean": [
      { time: 0, text: "(Iconic Drum & Bass Line)" },
      { time: 18, text: "She was more like a beauty queen from a movie scene" },
      { time: 36, text: "I said don't mind, but what do you mean, I am the one" },
      { time: 56, text: "Who will dance on the floor in the round?" },
      { time: 78, text: "She told me her name was Billie Jean" },
      { time: 98, text: "As she caused a scene, then every head turned with eyes that dreamed" },
      { time: 120, text: "Billie Jean is not my lover" },
      { time: 142, text: "She's just a girl who claims that I am the one" },
      { time: 168, text: "But the kid is not my son" },
      { time: 195, text: "She says I am the one, but the kid is not my son" },
      { time: 225, text: "(Moonwalk String Climax)" }
    ],
    "JANE TU YA JANE NA": [
      { time: 0, text: "(Melancholic Acoustic Guitar Sample)" },
      { time: 14, text: "Jane tu ya jane na, dil ki ye baat hai" },
      { time: 30, text: "Teri hi yaadon mein guzri har raat hai" },
      { time: 50, text: "Raste juda hue par yaadein saath hain" },
      { time: 75, text: "Khwaabon ke shahar mein barsaatein saath hain" },
      { time: 105, text: "Jane tu ya jane na, hum toh tere rahe" },
      { time: 135, text: "Dard yeh saare hum chup chap sehte rahe" },
      { time: 160, text: "(Guitar Outro)" }
    ],
    "Made You Proud": [
      { time: 0, text: "(Karma x Bagi Munda Intro)" },
      { time: 12, text: "Dilli se Mohali tak awaaz jaave" },
      { time: 26, text: "Je tu mehnat kare taan kismat vi aave" },
      { time: 42, text: "Made you proud, dekh ajj kithe khade aan" },
      { time: 60, text: "Har ik mushkil de naal assi lade aan" },
      { time: 80, text: "Stage lightan glow karein, bass boom kare" },
      { time: 105, text: "Graphic posteran te Casey da naam room kare" },
      { time: 130, text: "Hip-hop di wave vich sab ton agge" },
      { time: 155, text: "Sachi gallan karde aan, dil nu jo lagge" },
      { time: 180, text: "Made you proud, we did it our own way" }
    ],
    "SHAKTI": [
      { time: 0, text: "(Seedhe Maut Drum Beat Drops)" },
      { time: 10, text: "SM Nation, shakti poori saath mein" },
      { time: 24, text: "Kalam se aag nikle jab bhi likhein raat mein" },
      { time: 40, text: "Terah saal ki mehnat ka hai ye nateeja" },
      { time: 58, text: "Visual art direction mein Casey ka sika" },
      { time: 78, text: "DHH ke top pe baithe bina kisi shaq ke" },
      { time: 100, text: "Banger pe banger diye bina kisi thak ke" },
      { time: 125, text: "SHAKTI in the veins, sun le dhyan se" },
      { time: 150, text: "Jeet ke dikhayenge poore imaan se" }
    ]
  };

  window.getTrackLyrics = function(track) {
    if (!track) return [];
    
    const trackTitleLower = (track.title || "").toLowerCase().trim();
    for (const [key, lines] of Object.entries(LYRICS_DATABASE)) {
      const keyLower = key.toLowerCase().trim();
      if (trackTitleLower === keyLower || trackTitleLower.includes(keyLower) || keyLower.includes(trackTitleLower)) {
        return lines;
      }
    }

    const dur = track.duration || 180;
    const title = track.title || "Track";
    const artist = track.artist || "Artist";

    return [
      { time: 0, text: `(Intro — ${title})` },
      { time: Math.floor(dur * 0.10), text: `Yeah, ${artist} on the beat` },
      { time: Math.floor(dur * 0.22), text: `Vibrations flowing, telling only the truth` },
      { time: Math.floor(dur * 0.36), text: `Late night sessions crafting visual and sound` },
      { time: Math.floor(dur * 0.50), text: `Feel the heavy 808s shaking up the ground` },
      { time: Math.floor(dur * 0.64), text: `Every verse recorded with a vision so clear` },
      { time: Math.floor(dur * 0.78), text: `Lossless audio streaming straight into your ear` },
      { time: Math.floor(dur * 0.88), text: `We built this aesthetic from the ground up high` },
      { time: Math.floor(dur * 0.96), text: `(Outro — Studio Mix Fade)` }
    ];
  };

  let lastRenderedLyricsTrackIdx = -1;
  let lastActiveLyricLine = null;

  window.renderLyricsForCurrentTrack = function() {
    const scrollContainer = document.getElementById("am-lyrics-scroll");
    if (!scrollContainer) return;
    const track = spotifyTracks[currentTrackIdx];
    if (!track) return;

    lastRenderedLyricsTrackIdx = currentTrackIdx;
    const lyrics = window.getTrackLyrics(track);

    scrollContainer.innerHTML = lyrics.map((line) => `
      <div class="am-lyric-line ${line.time <= currentTrackTime ? 'active' : ''}" data-time="${line.time}" onclick="window.seekToLyricTime(${line.time})">
        ${line.text}
      </div>
    `).join("");
  };

  window.seekToLyricTime = function(targetSecs) {
    currentTrackTime = Math.max(0, targetSecs);
    if (!isFallbackPlaying && ytAudioPlayer && isYtReady && typeof ytAudioPlayer.seekTo === "function") {
      try { ytAudioPlayer.seekTo(currentTrackTime, true); } catch(err) {}
    } else if (realAudio) {
      try { realAudio.currentTime = currentTrackTime; } catch(err) {}
    }
    if (!isSpotifyPlaying) {
      window.spotifyTogglePlay();
    }
    updateSpotifyDisplay();
  };

  window.setAppleMusicView = function(viewName) {
    window.activeMusicView = viewName;
    document.querySelectorAll(".am-view-panel").forEach(panel => {
      panel.classList.remove("active");
    });
    const targetPanel = document.getElementById("am-view-" + viewName);
    if (targetPanel) targetPanel.classList.add("active");

    const queueToggleBtn = document.getElementById("am-queue-toggle-btn");
    if (queueToggleBtn) queueToggleBtn.classList.toggle("active", viewName === "queue");

    const lyricsToggleBtn = document.getElementById("am-lyrics-toggle-btn");
    if (lyricsToggleBtn) lyricsToggleBtn.classList.toggle("active", viewName === "lyrics");

    if (viewName === "lyrics") {
      window.renderLyricsForCurrentTrack();
    }

    updateSpotifyDisplay();
  };

  window.toggleAppleMusicFavorite = function() {
    if (window.appleMusicFavorites.has(currentTrackIdx)) {
      window.appleMusicFavorites.delete(currentTrackIdx);
    } else {
      window.appleMusicFavorites.add(currentTrackIdx);
    }
    localStorage.setItem("am_favorites", JSON.stringify(Array.from(window.appleMusicFavorites)));
    updateSpotifyDisplay();
  };

  window.toggleAppleMusicShuffle = function() {
    window.isShuffleActive = !window.isShuffleActive;
    if (window.isShuffleActive) {
      currentTrackIdx = Math.floor(Math.random() * spotifyTracks.length);
      currentTrackTime = 0;
      if (isSpotifyPlaying) playCurrentAudio();
    }
    updateSpotifyDisplay();
  };

  window.toggleAppleMusicRepeat = function() {
    window.isRepeatActive = !window.isRepeatActive;
    updateSpotifyDisplay();
  };

  window.setVolumeByEvent = function(e) {
    const trackEl = e.currentTarget;
    if (!trackEl) return;
    const rect = trackEl.getBoundingClientRect();
    const clientX = (e.touches && e.touches.length > 0) ? e.touches[0].clientX : (e.clientX !== undefined ? e.clientX : rect.left);
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    window.currentVolume = ratio;
    if (realAudio) realAudio.volume = ratio;
    if (ytAudioPlayer && typeof ytAudioPlayer.setVolume === "function") {
      try { ytAudioPlayer.setVolume(Math.floor(ratio * 100)); } catch (err) {}
    }
    const fill = document.getElementById("am-volume-fill");
    if (fill) fill.style.width = `${Math.floor(ratio * 100)}%`;
  };

  window.showAirPlayToast = function() {
    alert(" AirPlay: Streaming Hi-Res Lossless Audio to iPhone & Studio Reference Monitors.");
  };

  window.showAppleMusicOptions = function() {
    const overlay = document.getElementById("am-options-overlay");
    if (overlay) overlay.classList.add("visible");
  };

  window.closeAppleMusicOptions = function() {
    const overlay = document.getElementById("am-options-overlay");
    if (overlay) overlay.classList.remove("visible");
  };

  window.switchToVinylPlayerFromOptions = function() {
    window.closeAppleMusicOptions();
    window.closeWindow("spotify");
    setTimeout(() => {
      window.openVinylPlayerWindow();
    }, 120);
  };

  function updateSpotifyDisplay() {
    const track = spotifyTracks[currentTrackIdx];
    if (!track) return;

    const isFav = window.appleMusicFavorites && window.appleMusicFavorites.has(currentTrackIdx);
    const pct = Math.min(100, (currentTrackTime / (track.duration || 1)) * 100);
    const remainingTimeStr = "-" + formatTime(Math.max(0, (track.duration || 1) - currentTrackTime));
    const currentTimeStr = formatTime(currentTrackTime);

    // Dynamic Island
    if (islandSongTitle) islandSongTitle.textContent = track.title;
    if (islandEq) {
      islandEq.style.opacity = isSpotifyPlaying ? "1" : "0.3";
      islandEq.querySelectorAll("span").forEach(s => {
        s.style.animationPlayState = isSpotifyPlaying ? "running" : "paused";
      });
    }

    // Desktop Sonoma Widget
    const widgetMusicEl = document.getElementById("widget-music");
    const widgetVinylDisc = document.getElementById("widget-vinyl-disc");
    const widgetSongCover = document.getElementById("widget-song-cover");
    const widgetSongTitle = document.getElementById("widget-song-title");
    const widgetSongArtist = document.getElementById("widget-song-artist");
    const widgetProgressFill = document.getElementById("widget-song-progress-fill");
    const widgetCurrentTime = document.getElementById("widget-song-current-time");
    const widgetDurationTime = document.getElementById("widget-song-duration");
    const widgetPlayBtn = document.getElementById("widget-play-btn");

    if (widgetMusicEl) widgetMusicEl.classList.toggle("is-playing", isSpotifyPlaying);
    if (widgetVinylDisc) widgetVinylDisc.classList.toggle("playing", isSpotifyPlaying);
    if (widgetSongCover) widgetSongCover.src = track.cover;
    if (widgetSongTitle) widgetSongTitle.textContent = track.title;
    if (widgetSongArtist) widgetSongArtist.textContent = track.artist;
    if (widgetDurationTime) widgetDurationTime.textContent = formatTime(track.duration);
    if (widgetPlayBtn) widgetPlayBtn.textContent = isSpotifyPlaying ? "⏸" : "▶";
    if (widgetProgressFill) widgetProgressFill.style.width = `${pct}%`;
    if (widgetCurrentTime) widgetCurrentTime.textContent = currentTimeStr;

    // Mobile Apple Music Live Widget Sync (Page 2)
    const mobWidgetCover = document.getElementById("mobile-widget-song-cover");
    const mobWidgetTitle = document.getElementById("mobile-widget-song-title");
    const mobWidgetArtist = document.getElementById("mobile-widget-song-artist");
    const mobWidgetPlayBtn = document.getElementById("mobile-widget-play-btn");

    if (mobWidgetCover && mobWidgetCover.src !== track.cover) mobWidgetCover.src = track.cover;
    if (mobWidgetTitle) mobWidgetTitle.textContent = track.title;
    if (mobWidgetArtist) mobWidgetArtist.textContent = track.artist;
    if (mobWidgetPlayBtn) {
      mobWidgetPlayBtn.innerHTML = isSpotifyPlaying
        ? `<svg viewBox="0 0 24 24" width="14" height="15" fill="#ffffff"><rect x="5" y="3.5" width="4.2" height="17" rx="2.1"/><rect x="14.8" y="3.5" width="4.2" height="17" rx="2.1"/></svg><span>Pause</span>`
        : `<svg viewBox="0 0 24 24" width="14" height="15" fill="#ffffff"><path d="M6 4.5V19.5L19 12L6 4.5Z"/></svg><span>Play</span>`;
    }

    // Full Apple Music App Synchronization
    const amAmbientBg = document.getElementById("am-ambient-bg");
    const amCoverArt = document.getElementById("am-cover-art");
    const amSongTitle = document.getElementById("am-song-title");
    const amSongArtist = document.getElementById("am-song-artist");
    const amStarBtn = document.getElementById("am-star-btn");
    const amScrubberFill = document.getElementById("am-scrubber-fill");
    const amTimeCurrent = document.getElementById("am-time-current");
    const amTimeRemaining = document.getElementById("am-time-remaining");
    const amStatusText = document.getElementById("am-status-text");
    const amPlayBtn = document.getElementById("am-play-btn");

    if (amAmbientBg) amAmbientBg.style.backgroundImage = `url('${track.cover}')`;
    if (amCoverArt) {
      if (amCoverArt.src !== track.cover) amCoverArt.src = track.cover;
      amCoverArt.classList.toggle("playing", isSpotifyPlaying);
    }
    if (amSongTitle) amSongTitle.textContent = track.title;
    if (amSongArtist) amSongArtist.textContent = track.artist;
    if (amStarBtn) {
      amStarBtn.classList.toggle("starred", isFav);
      const starSvg = amStarBtn.querySelector("svg");
      if (starSvg) starSvg.setAttribute("fill", isFav ? "#ff2d55" : "none");
    }
    if (amScrubberFill) amScrubberFill.style.width = `${pct}%`;
    if (amTimeCurrent) amTimeCurrent.textContent = currentTimeStr;
    if (amTimeRemaining) amTimeRemaining.textContent = remainingTimeStr;
    if (amStatusText) amStatusText.textContent = isSpotifyPlaying ? "Lossless" : "Paused";
    if (amPlayBtn) {
      amPlayBtn.innerHTML = isSpotifyPlaying
        ? `<svg viewBox="0 0 24 24" width="38" height="38" fill="currentColor"><rect x="5.5" y="4" width="4.5" height="16" rx="2.25"/><rect x="14" y="4" width="4.5" height="16" rx="2.25"/></svg>`
        : `<svg viewBox="0 0 24 24" width="38" height="38" fill="currentColor"><path d="M7 4.5v15l13-7.5z"/></svg>`;
    }

    // Action Sheet Options Sync
    const amOptionsArt = document.getElementById("am-options-art");
    const amOptionsTitle = document.getElementById("am-options-title");
    const amOptionsArtist = document.getElementById("am-options-artist");
    if (amOptionsArt && amOptionsArt.src !== track.cover) amOptionsArt.src = track.cover;
    if (amOptionsTitle) amOptionsTitle.textContent = track.title;
    if (amOptionsArtist) amOptionsArtist.textContent = track.artist;

    // Browse Mini Player Sync
    const amMiniCover = document.getElementById("am-mini-cover");
    const amMiniTitle = document.getElementById("am-mini-title");
    const amMiniArtist = document.getElementById("am-mini-artist");
    const amMiniPlayBtn = document.getElementById("am-mini-play-btn");

    if (amMiniCover && amMiniCover.src !== track.cover) amMiniCover.src = track.cover;
    if (amMiniTitle) amMiniTitle.textContent = track.title;
    if (amMiniArtist) amMiniArtist.textContent = track.artist;
    if (amMiniPlayBtn) amMiniPlayBtn.textContent = isSpotifyPlaying ? "⏸" : "▶";

    // Queue View Sync
    const amQueueTopArt = document.getElementById("am-queue-top-art");
    const amQueueTopTitle = document.getElementById("am-queue-top-title");
    const amQueueTopArtist = document.getElementById("am-queue-top-artist");
    const amQueuePlayBtn = document.getElementById("am-queue-play-btn");
    const amQueueScrubberFill = document.getElementById("am-queue-scrubber-fill");
    const amQueueTimeCurrent = document.getElementById("am-queue-time-current");
    const amQueueTimeRemaining = document.getElementById("am-queue-time-remaining");

    if (amQueueTopArt && amQueueTopArt.src !== track.cover) amQueueTopArt.src = track.cover;
    if (amQueueTopTitle) amQueueTopTitle.textContent = track.title;
    if (amQueueTopArtist) amQueueTopArtist.textContent = track.artist;
    if (amQueuePlayBtn) {
      amQueuePlayBtn.innerHTML = isSpotifyPlaying
        ? `<svg viewBox="0 0 24 24" width="34" height="34" fill="currentColor"><rect x="5.5" y="4" width="4.5" height="16" rx="2.25"/><rect x="14" y="4" width="4.5" height="16" rx="2.25"/></svg>`
        : `<svg viewBox="0 0 24 24" width="34" height="34" fill="currentColor"><path d="M7 4.5v15l13-7.5z"/></svg>`;
    }
    if (amQueueScrubberFill) amQueueScrubberFill.style.width = `${pct}%`;
    if (amQueueTimeCurrent) amQueueTimeCurrent.textContent = currentTimeStr;
    if (amQueueTimeRemaining) amQueueTimeRemaining.textContent = remainingTimeStr;

    // Active item highlight in Apple Music Queue
    document.querySelectorAll(".am-queue-item").forEach((item, idx) => {
      item.classList.toggle("active", idx === currentTrackIdx);
    });

    // Live Synced Lyrics Synchronization
    const lyricsScroll = document.getElementById("am-lyrics-scroll");
    const lyricsMiniArt = document.getElementById("am-lyrics-mini-art");
    const lyricsSongTitle = document.getElementById("am-lyrics-song-title");
    const lyricsSongArtist = document.getElementById("am-lyrics-song-artist");
    const lyricsPlayBtn = document.getElementById("am-lyrics-play-btn");
    const lyricsScrubberFill = document.getElementById("am-lyrics-scrubber-fill");
    const lyricsTimeCurrent = document.getElementById("am-lyrics-time-current");
    const lyricsTimeRemaining = document.getElementById("am-lyrics-time-remaining");

    if (lyricsMiniArt && lyricsMiniArt.src !== track.cover) lyricsMiniArt.src = track.cover;
    if (lyricsSongTitle) lyricsSongTitle.textContent = track.title;
    if (lyricsSongArtist) lyricsSongArtist.textContent = track.artist;
    if (lyricsScrubberFill) lyricsScrubberFill.style.width = `${pct}%`;
    if (lyricsTimeCurrent) lyricsTimeCurrent.textContent = currentTimeStr;
    if (lyricsTimeRemaining) lyricsTimeRemaining.textContent = remainingTimeStr;
    if (lyricsPlayBtn) {
      lyricsPlayBtn.innerHTML = isSpotifyPlaying
        ? `<svg viewBox="0 0 24 24" width="34" height="34" fill="currentColor"><rect x="5.5" y="4" width="4.5" height="16" rx="2.25"/><rect x="14" y="4" width="4.5" height="16" rx="2.25"/></svg>`
        : `<svg viewBox="0 0 24 24" width="34" height="34" fill="currentColor"><path d="M7 4.5v15l13-7.5z"/></svg>`;
    }

    if (lyricsScroll) {
      if (lastRenderedLyricsTrackIdx !== currentTrackIdx) {
        window.renderLyricsForCurrentTrack();
      }

      const lyricLines = lyricsScroll.querySelectorAll(".am-lyric-line");
      let activeLineEl = null;

      lyricLines.forEach((lineEl) => {
        const lineTime = parseFloat(lineEl.getAttribute("data-time") || 0);
        if (lineTime <= currentTrackTime) {
          activeLineEl = lineEl;
        }
      });

      if (activeLineEl) {
        let isPassed = true;
        lyricLines.forEach((lineEl) => {
          if (lineEl === activeLineEl) {
            lineEl.classList.add("active");
            lineEl.classList.remove("passed");
            isPassed = false;
          } else {
            lineEl.classList.remove("active");
            lineEl.classList.toggle("passed", isPassed);
          }
        });

        if (activeLineEl !== lastActiveLyricLine) {
          lastActiveLyricLine = activeLineEl;
          const targetTop = activeLineEl.offsetTop - (lyricsScroll.clientHeight / 2) + (activeLineEl.clientHeight / 2);
          lyricsScroll.scrollTo({
            top: Math.max(0, targetTop),
            behavior: "smooth"
          });
        }
      }
    }

    // Backup Vinyl Player Window Sync
    const vinylCover = document.getElementById("vinyl-song-cover");
    const vinylTitle = document.getElementById("vinyl-song-title");
    const vinylArtist = document.getElementById("vinyl-song-artist");
    const vinylProgress = document.getElementById("vinyl-song-progress-fill");
    const vinylCurrentTime = document.getElementById("vinyl-song-current-time");
    const vinylDuration = document.getElementById("vinyl-song-duration");
    const vinylPlayBtn = document.getElementById("vinyl-play-btn");
    const vinylDisc = document.getElementById("vinyl-disc-spin");
    const vinylArtWrapper = document.getElementById("vinyl-art-wrapper");
    const vinylEq = document.getElementById("vinyl-live-eq");

    if (vinylCover && vinylCover.src !== track.cover) vinylCover.src = track.cover;
    if (vinylTitle) vinylTitle.textContent = track.title;
    if (vinylArtist) vinylArtist.textContent = track.artist;
    if (vinylDuration) vinylDuration.textContent = formatTime(track.duration);
    if (vinylCurrentTime) vinylCurrentTime.textContent = currentTimeStr;
    if (vinylProgress) vinylProgress.style.width = `${pct}%`;
    if (vinylPlayBtn) vinylPlayBtn.textContent = isSpotifyPlaying ? "⏸" : "▶";
    if (vinylDisc) vinylDisc.classList.toggle("playing", isSpotifyPlaying);
    if (vinylArtWrapper) vinylArtWrapper.classList.toggle("playing", isSpotifyPlaying);
    if (vinylEq) vinylEq.classList.toggle("playing", isSpotifyPlaying);

    document.querySelectorAll(".vinyl-queue-item").forEach((item, idx) => {
      item.classList.toggle("active", idx === currentTrackIdx);
    });
  }

  function startSpotifyTimer() {
    if (spotifyInterval) clearInterval(spotifyInterval);
    spotifyInterval = setInterval(() => {
      if (!isSpotifyPlaying) return;
      const track = spotifyTracks[currentTrackIdx];
      if (!track) return;
      
      if (!isFallbackPlaying && ytAudioPlayer && isYtReady && typeof ytAudioPlayer.getCurrentTime === "function") {
        try {
          const ytSecs = ytAudioPlayer.getCurrentTime();
          if (ytSecs > 0) currentTrackTime = ytSecs;
          else currentTrackTime += 0.25;
        } catch (e) {
          currentTrackTime += 0.25;
        }
      } else if (!isFallbackPlaying) {
        currentTrackTime += 0.25;
      }

      if (currentTrackTime >= track.duration) {
        currentTrackTime = 0;
        if (!window.isRepeatActive) {
          currentTrackIdx = (currentTrackIdx + 1) % spotifyTracks.length;
        }
        playCurrentAudio();
      }
      updateSpotifyDisplay();
    }, 250);
  }

  window.spotifyTogglePlay = function() {
    unlockMobileAudio();
    isSpotifyPlaying = !isSpotifyPlaying;
    if (isSpotifyPlaying) {
      playCurrentAudio();
    } else {
      pauseCurrentAudio();
    }
    updateSpotifyDisplay();
  };

  window.spotifyNextTrack = function() {
    unlockMobileAudio();
    currentTrackIdx = (currentTrackIdx + 1) % spotifyTracks.length;
    currentTrackTime = 0;
    updateSpotifyDisplay();
    if (isSpotifyPlaying) playCurrentAudio();
  };

  window.spotifyPrevTrack = function() {
    unlockMobileAudio();
    currentTrackIdx = (currentTrackIdx - 1 + spotifyTracks.length) % spotifyTracks.length;
    currentTrackTime = 0;
    updateSpotifyDisplay();
    if (isSpotifyPlaying) playCurrentAudio();
  };

  window.selectAudioTrack = function(idx) {
    unlockMobileAudio();
    currentTrackIdx = idx;
    currentTrackTime = 0;
    isSpotifyPlaying = true;
    playCurrentAudio();
    updateSpotifyDisplay();
  };

  window.seekAudioProgress = function(e) {
    const bar = e.currentTarget || document.getElementById("am-scrubber-bg") || document.getElementById("modal-progress-bg");
    if (!bar) return;
    const rect = bar.getBoundingClientRect();
    const clientX = (e.touches && e.touches.length > 0) ? e.touches[0].clientX : (e.clientX !== undefined ? e.clientX : rect.left);
    const clickX = clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const track = spotifyTracks[currentTrackIdx];
    currentTrackTime = Math.floor(ratio * (track.duration || 1));
    
    if (isFallbackPlaying) {
      try { realAudio.currentTime = currentTrackTime; } catch (err) {}
    } else if (ytAudioPlayer && isYtReady && track && track.videoId) {
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
              
              <!-- iOS 18 Apple Music Widget (2x2) -->
              <div class="ios-widget-wrapper" onclick="window.openSpotifyWindow && window.openSpotifyWindow()">
                <div class="ios-widget-music-card" id="mobile-widget-music">
                  
                  <!-- Top Row: Cover Artwork + Apple Music Glyph -->
                  <div class="ios-music-widget-top">
                    <img id="mobile-widget-song-cover" src="${(spotifyTracks[currentTrackIdx] || spotifyTracks[0]).cover}" class="ios-music-widget-art" alt="Cover" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80'">
                    <svg class="ios-music-widget-icon" viewBox="0 0 24 24" fill="#ffffff">
                      <path d="M21 3.25L9 5.75C8.45 5.86 8 6.35 8 6.92V17.08C7.4 16.72 6.48 16.5 5.5 16.5C3.57 16.5 2 17.84 2 19.5C2 21.16 3.57 22.5 5.5 22.5C7.43 22.5 9 21.16 9 19.5V10.25L20 7.95V14.58C19.4 14.22 18.48 14 17.5 14C15.57 14 14 15.34 14 17C14 18.66 15.57 20 17.5 20C19.43 20 21 18.66 21 17V4C21 3.53 20.61 3.16 20.15 3.25L21 3.25Z"/>
                    </svg>
                  </div>

                  <!-- Middle Info: Title + Artist -->
                  <div class="ios-music-widget-meta">
                    <div id="mobile-widget-song-title" class="ios-music-widget-title">${(spotifyTracks[currentTrackIdx] || spotifyTracks[0]).title}</div>
                    <div id="mobile-widget-song-artist" class="ios-music-widget-artist">${(spotifyTracks[currentTrackIdx] || spotifyTracks[0]).artist}</div>
                  </div>

                  <!-- Bottom Full-Width Pill Action Button -->
                  <button id="mobile-widget-play-btn" class="ios-music-widget-pill-btn" onclick="event.stopPropagation(); window.spotifyTogglePlay && window.spotifyTogglePlay();">
                    ${isSpotifyPlaying ? `
                      <svg viewBox="0 0 24 24" width="14" height="15" fill="#ffffff"><rect x="5" y="3.5" width="4.2" height="17" rx="2.1"/><rect x="14.8" y="3.5" width="4.2" height="17" rx="2.1"/></svg>
                      <span>Pause</span>
                    ` : `
                      <svg viewBox="0 0 24 24" width="14" height="15" fill="#ffffff"><path d="M6 4.5V19.5L19 12L6 4.5Z"/></svg>
                      <span>Play</span>
                    `}
                  </button>

                </div>
                <span class="ios-app-label">Music</span>
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

        const hasVid = !!(proj.video || proj.videoSrc || proj.videoId || (proj.youtubeUrl && proj.youtubeUrl.includes('youtu')));
        item.innerHTML = `
          <div class="desktop-icon-wrapper">
            <img src="${proj.cover}" alt="${proj.title}" draggable="false" loading="lazy" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80'">
            ${hasVid ? `
              <div class="desktop-video-badge" style="position: absolute; bottom: 4px; right: 4px; width: 18px; height: 18px; border-radius: 50%; background: rgba(220, 38, 38, 0.92); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.7); pointer-events: none;">
                <svg viewBox="0 0 24 24" width="9" height="9" fill="#fff"><path d="M8 5v14l11-7z"/></svg>
              </div>
            ` : ''}
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

          let rafId = null;
          let currentClientX = e.clientX;
          let currentClientY = e.clientY;

          const updateItemPosition = () => {
            if (!isDragging) return;
            const dx = currentClientX - startX;
            const dy = currentClientY - startY;
            if (Math.abs(dx) > 3 || Math.abs(dy) > 3) hasMoved = true;
            if (hasMoved) {
              const maxDragX = window.innerWidth - ICON_WIDTH - 10;
              const maxDragY = window.innerHeight - 100;
              const newLeft = Math.max(10, Math.min(maxDragX, itemX + dx));
              const newTop  = Math.max(34, Math.min(maxDragY, itemY + dy));
              item.style.left = `${newLeft}px`;
              item.style.top  = `${newTop}px`;
            }
            rafId = null;
          };

          const onMouseMove = (me) => {
            if (!isDragging) return;
            currentClientX = me.clientX;
            currentClientY = me.clientY;
            if (!rafId) {
              rafId = requestAnimationFrame(updateItemPosition);
            }
          };

          const onMouseUp = () => {
            isDragging = false;
            if (rafId) {
              cancelAnimationFrame(rafId);
              rafId = null;
            }
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
        // Use 16px threshold so human finger tap micro-jitter on Android touchscreens doesn't get flagged as a swipe
        if (Math.abs(diffX) > 16 && Math.abs(diffX) >= Math.abs(diffY)) {
          hasMovedHorizontal = true;
          window.__suppressNextAppClick = true;
        } else if (Math.abs(diffY) > 14 && Math.abs(diffY) > Math.abs(diffX)) {
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

      if (hasMovedHorizontal && Math.abs(diffX) > 16) {
        window.__suppressNextAppClick = true;
        setTimeout(() => {
          window.__suppressNextAppClick = false;
        }, 150);

        if ((diffX < -30 || (diffX < -15 && velocity > 0.2)) && currentSpringBoardPage === 0) {
          switchSpringBoardPage(1);
        } else if ((diffX > 30 || (diffX > 15 && velocity > 0.2)) && currentSpringBoardPage === 1) {
          switchSpringBoardPage(0);
        } else {
          slider.style.transform = `translateX(-${currentSpringBoardPage * 50}%)`;
        }
      } else {
        window.__suppressNextAppClick = false;
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

    function toggleMaximizeWindow(targetWin) {
      if (isMobile) return;
      const isMax = targetWin.classList.contains("maximized");
      if (!isMax) {
        targetWin.dataset.prevWidth = targetWin.style.width || "";
        targetWin.dataset.prevTop = targetWin.style.top || "";
        targetWin.dataset.prevLeft = targetWin.style.left || "";
        targetWin.classList.add("maximized");
      } else {
        targetWin.classList.remove("maximized");
        if (targetWin.dataset.prevWidth) targetWin.style.width = targetWin.dataset.prevWidth;
        if (targetWin.dataset.prevTop) targetWin.style.top = targetWin.dataset.prevTop;
        if (targetWin.dataset.prevLeft) targetWin.style.left = targetWin.dataset.prevLeft;
      }
      focusWindow(targetWin);
    }

    // Window controls (Desktop)
    const closeBtn = win.querySelector(".traffic-btn.close");
    if (closeBtn) closeBtn.addEventListener("click", (e) => { e.stopPropagation(); closeWindow(id); });
    
    const minimizeBtn = win.querySelector(".traffic-btn.minimize");
    if (minimizeBtn) minimizeBtn.addEventListener("click", (e) => { e.stopPropagation(); closeWindow(id); });

    const maximizeBtn = win.querySelector(".traffic-btn.maximize");
    if (maximizeBtn) maximizeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleMaximizeWindow(win);
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
      let rafId = null;
      let lastClientX = 0;
      let lastClientY = 0;

      header.addEventListener("dblclick", (e) => {
        if (e.target.classList.contains("traffic-btn")) return;
        const maxBtn = win.querySelector(".traffic-btn.maximize");
        if (maxBtn) maxBtn.click();
      });

      header.addEventListener("mousedown", (e) => {
        if (e.target.classList.contains("traffic-btn")) return;
        if (win.classList.contains("maximized")) return;
        e.preventDefault();
        isDragging = true;
        win.classList.add("is-dragging");
        offsetX = e.clientX - win.offsetLeft;
        offsetY = e.clientY - win.offsetTop;
        lastClientX = e.clientX;
        lastClientY = e.clientY;
        focusWindow(win);

        const updateWindowPos = () => {
          if (!isDragging) return;
          const winWidth = win.offsetWidth || 320;
          const newX = Math.max(5, Math.min(window.innerWidth - winWidth - 5, lastClientX - offsetX));
          const newY = Math.max(30, Math.min(window.innerHeight - 60, lastClientY - offsetY));
          win.style.left = `${newX}px`;
          win.style.top = `${newY}px`;
          rafId = null;
        };

        const onMouseMove = (me) => {
          if (!isDragging) return;
          lastClientX = me.clientX;
          lastClientY = me.clientY;
          if (!rafId) {
            rafId = requestAnimationFrame(updateWindowPos);
          }
        };

        const onMouseUp = () => {
          isDragging = false;
          if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
          }
          win.classList.remove("is-dragging");
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
          <a href="mailto:khushalworkmail08@gmail.com" style="background: #ea4335; color: #fff; padding: 12px; border-radius: 16px; text-decoration: none; font-size: 12px; font-weight: 700; display: flex; flex-direction: column; align-items: center; gap: 4px; box-shadow: 0 4px 14px rgba(234,67,53,0.4);">
            <span style="font-size: 18px;">✉️</span> Email
          </a>
          <a href="https://www.instagram.com/caseyxlive/" target="_blank" style="background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888); color: #fff; padding: 12px; border-radius: 16px; text-decoration: none; font-size: 12px; font-weight: 700; display: flex; flex-direction: column; align-items: center; gap: 4px; box-shadow: 0 4px 14px rgba(220,39,67,0.4);">
            <span style="font-size: 18px;">📸</span> Instagram
          </a>
          <a href="https://t.me/caseyxlive" target="_blank" style="background: #0088cc; color: #fff; padding: 12px; border-radius: 16px; text-decoration: none; font-size: 12px; font-weight: 700; display: flex; flex-direction: column; align-items: center; gap: 4px; box-shadow: 0 4px 14px rgba(0,136,204,0.4);">
            <span style="font-size: 18px;">✈️</span> Telegram
          </a>
        </div>

        <div id="phone-display-number" style="font-size: 18px; font-weight: 700; height: 36px; color: #60a5fa; letter-spacing: 0.5px; margin-bottom: 12px;">khushalworkmail08@gmail.com</div>

        <div style="display: flex; justify-content: center; gap: 16px;">
          <a href="mailto:khushalworkmail08@gmail.com" style="width: 58px; height: 58px; border-radius: 50%; background: #007aff; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 24px; text-decoration: none; box-shadow: 0 6px 20px rgba(0,122,255,0.5);">
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
    const videoSrc = project.video || project.videoSrc || (project.videoId ? `assets/videos/avatar_motion.mp4` : null);

    if (videoSrc) {
      // Bespoke Apple QuickTime / macOS TV Player UI with Floating Glass HUD
      const content = `<div class="apple-video-container-root" id="apple-video-root-${project.id}" style="width: 100%; height: 100%; min-height: 382px; background: #000;"></div>`;

      const win = createWindow({
        id: `proj-${project.id}`,
        title: project.title,
        width: "680px",
        top: "16%",
        left: "26%",
        contentHTML: content
      });

      const body = win.querySelector(".window-body");
      if (body) {
        body.style.padding = "0";
        body.style.background = "#000000";
        body.style.overflow = "hidden";
        body.style.display = "flex";
        body.style.flexDirection = "column";
      }

      const rootEl = win.querySelector(`#apple-video-root-${project.id}`);
      if (rootEl) {
        setupAppleVideoPlayer(rootEl, project, videoSrc);
      }

      return win;
    }

    // Regular artwork project modal for image posters
    const safeTitle = (project.title || 'Artwork').replace(/'/g, "\\'");
    const content = `
      <div class="project-modal-grid">
        <div>
          <div class="project-cover-container" onclick="window.openArtworkLightbox && window.openArtworkLightbox('${project.cover}', '${safeTitle}')" title="Click to zoom & enlarge artwork">
            <img class="project-cover-large" src="${project.cover}" alt="${project.title}" draggable="false" oncontextmenu="event.preventDefault(); return false;" onerror="this.src='https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80'">
            <div class="project-zoom-badge">🔍 Click to Expand</div>
          </div>
        </div>
        <div>
          <span class="project-meta-tag">${project.category}</span>
          <h2 class="project-title-large">${project.title}</h2>
          <div class="project-client-line">Client / Subject: <strong>${project.client}</strong> · Year: <strong>${project.year}</strong></div>
          <p class="project-desc-text">${project.description}</p>
          <h4 style="font-size: 13px; font-weight: 800; margin-bottom: 8px;">Key Highlights</h4>
          <ul class="project-features-list">
            ${(project.details || ["Custom art direction and visual design", "High quality execution"]).map(d => `<li>${d}</li>`).join("")}
          </ul>
          <div style="display: flex; gap: 8px; margin-top: 14px; flex-wrap: wrap;">
            <button onclick="window.open('https://www.instagram.com/caseyxlive/', '_blank')" style="background: linear-gradient(45deg, #f09433, #dc2743, #bc1888); color: #fff; border: none; font-size: 11px; font-weight: 700; padding: 7px 16px; border-radius: 8px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 14px rgba(220,39,67,0.4);">
              📸 View on Instagram ↗
            </button>
          </div>
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

  // --- Apple QuickTime / macOS TV Player HUD Logic ---
  function setupAppleVideoPlayer(container, project, videoSrc) {
    container.innerHTML = `
      <div class="apple-video-player" id="avp-${project.id}">
        <video 
          id="vid-el-${project.id}" 
          src="${videoSrc}" 
          poster="${project.cover}" 
          preload="auto" 
          playsinline 
          loop 
          oncontextmenu="event.preventDefault(); return false;"
        ></video>
        
        <div class="apple-center-badge" id="acb-${project.id}">
          <svg class="badge-play" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          <svg class="badge-pause" viewBox="0 0 24 24" fill="currentColor" style="display:none;"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
        </div>

        <div class="apple-video-spinner" id="avs-${project.id}"></div>

        <div class="apple-hud-container" id="hud-${project.id}">
          <div class="apple-scrubber-track" id="ast-${project.id}">
            <div class="apple-scrubber-buffer" id="asb-${project.id}"></div>
            <div class="apple-scrubber-fill" id="asf-${project.id}"></div>
            <div class="apple-scrubber-thumb" id="asm-${project.id}"></div>
            <div class="apple-scrubber-preview" id="asp-${project.id}">0:00</div>
          </div>

          <div class="apple-hud-row">
            <div class="apple-hud-group left">
              <button class="apple-btn play-pause-btn" id="btn-pp-${project.id}" title="Play / Pause (Space)">
                <svg class="icon-play" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                <svg class="icon-pause" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
              </button>

              <button class="apple-btn skip-btn" id="btn-rew-${project.id}" title="Rewind 10s (←)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                  <path d="M3 3v5h5"/>
                </svg>
                <span class="skip-num">10</span>
              </button>

              <button class="apple-btn skip-btn" id="btn-fwd-${project.id}" title="Forward 10s (→)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 12a9 9 0 1 1-9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                  <path d="M21 3v5h-5"/>
                </svg>
                <span class="skip-num">10</span>
              </button>

              <div class="apple-time-display" id="atd-${project.id}" title="Click to toggle remaining time">
                <span class="cur-time">0:00</span>
                <span class="time-sep">/</span>
                <span class="dur-time">0:00</span>
              </div>
            </div>

            <div class="apple-hud-group right">
              <div class="apple-volume-box">
                <button class="apple-btn vol-btn" id="btn-vol-${project.id}" title="Mute / Unmute (M)">
                  <svg class="icon-vol-high" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
                  <svg class="icon-vol-mute" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>
                </button>
                <div class="apple-volume-slider-wrap">
                  <input type="range" class="apple-volume-slider" id="vsl-${project.id}" min="0" max="1" step="0.05" value="1">
                </div>
              </div>

              ${document.pictureInPictureEnabled ? `
                <button class="apple-btn pip-btn" id="btn-pip-${project.id}" title="Picture in Picture">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="3"/>
                    <rect x="12" y="10" width="8" height="8" rx="1.5" fill="rgba(255,255,255,0.4)"/>
                  </svg>
                </button>
              ` : ''}

              <button class="apple-btn fs-btn" id="btn-fs-${project.id}" title="Full Screen (F)">
                <svg class="icon-expand" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                </svg>
                <svg class="icon-compress" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 14h6v6M20 10h-6V4M14 10l7-7M3 21l7-7"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    const player = container.querySelector(".apple-video-player");
    const video = container.querySelector("video");
    const centerBadge = container.querySelector(".apple-center-badge");
    const badgePlay = centerBadge.querySelector(".badge-play");
    const badgePause = centerBadge.querySelector(".badge-pause");
    const spinner = container.querySelector(".apple-video-spinner");
    const scrubberTrack = container.querySelector(".apple-scrubber-track");
    const scrubberFill = container.querySelector(".apple-scrubber-fill");
    const scrubberBuffer = container.querySelector(".apple-scrubber-buffer");
    const scrubberThumb = container.querySelector(".apple-scrubber-thumb");
    const scrubberPreview = container.querySelector(".apple-scrubber-preview");
    const playBtn = container.querySelector(".play-pause-btn");
    const rewBtn = container.querySelector("#btn-rew-" + project.id);
    const fwdBtn = container.querySelector("#btn-fwd-" + project.id);
    const timeDisplay = container.querySelector(".apple-time-display");
    const curTimeEl = timeDisplay.querySelector(".cur-time");
    const durTimeEl = timeDisplay.querySelector(".dur-time");
    const volBtn = container.querySelector(".vol-btn");
    const volSlider = container.querySelector(".apple-volume-slider");
    const pipBtn = container.querySelector(".pip-btn");
    const fsBtn = container.querySelector(".fs-btn");

    let isScrubbing = false;
    let showRemaining = false;
    let hideTimer = null;
    let lastVolume = 1;

    function formatTime(seconds) {
      if (isNaN(seconds) || seconds < 0) return "0:00";
      const m = Math.floor(seconds / 60);
      const s = Math.floor(seconds % 60);
      return `${m}:${s < 10 ? "0" : ""}${s}`;
    }

    function triggerCenterBadge(isPlay) {
      if (isPlay) {
        badgePlay.style.display = "block";
        badgePause.style.display = "none";
      } else {
        badgePlay.style.display = "none";
        badgePause.style.display = "block";
      }
      centerBadge.classList.add("pop");
      clearTimeout(centerBadge._timer);
      centerBadge._timer = setTimeout(() => {
        centerBadge.classList.remove("pop");
      }, 400);
    }

    function togglePlay() {
      if (video.paused || video.ended) {
        video.play();
        triggerCenterBadge(true);
      } else {
        video.pause();
        triggerCenterBadge(false);
      }
    }

    function resetHideTimer() {
      player.classList.remove("controls-hidden");
      clearTimeout(hideTimer);
      if (!video.paused) {
        hideTimer = setTimeout(() => {
          if (!video.paused && !isScrubbing) {
            player.classList.add("controls-hidden");
          }
        }, 2400);
      }
    }

    // Video playback events
    video.addEventListener("play", () => {
      player.classList.add("is-playing");
      resetHideTimer();
    });

    video.addEventListener("pause", () => {
      player.classList.remove("is-playing");
      player.classList.remove("controls-hidden");
    });

    video.addEventListener("waiting", () => {
      spinner.classList.add("is-buffering");
    });

    video.addEventListener("playing", () => {
      spinner.classList.remove("is-buffering");
    });

    video.addEventListener("timeupdate", () => {
      if (isScrubbing) return;
      const cur = video.currentTime || 0;
      const dur = video.duration || 0;
      const pct = dur > 0 ? (cur / dur) * 100 : 0;
      scrubberFill.style.width = pct + "%";
      scrubberThumb.style.left = pct + "%";
      curTimeEl.textContent = showRemaining ? `-${formatTime(Math.max(0, dur - cur))}` : formatTime(cur);
      durTimeEl.textContent = formatTime(dur);
    });

    video.addEventListener("progress", () => {
      if (video.buffered.length > 0 && video.duration > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        const bufPct = (bufferedEnd / video.duration) * 100;
        scrubberBuffer.style.width = Math.min(100, bufPct) + "%";
      }
    });

    video.addEventListener("loadedmetadata", () => {
      durTimeEl.textContent = formatTime(video.duration);
    });

    // Scrubbing logic
    function seekToEvent(e) {
      const rect = scrubberTrack.getBoundingClientRect();
      const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const dur = video.duration || 0;
      if (dur > 0) {
        video.currentTime = pos * dur;
        scrubberFill.style.width = (pos * 100) + "%";
        scrubberThumb.style.left = (pos * 100) + "%";
      }
    }

    scrubberTrack.addEventListener("mousedown", (e) => {
      isScrubbing = true;
      scrubberTrack.classList.add("is-scrubbing");
      seekToEvent(e);

      const onMouseMove = (me) => {
        seekToEvent(me);
      };
      const onMouseUp = () => {
        isScrubbing = false;
        scrubberTrack.classList.remove("is-scrubbing");
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
        resetHideTimer();
      };
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    });

    scrubberTrack.addEventListener("mousemove", (e) => {
      const rect = scrubberTrack.getBoundingClientRect();
      const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const dur = video.duration || 0;
      scrubberPreview.textContent = formatTime(pos * dur);
      scrubberPreview.style.left = (pos * 100) + "%";
    });

    // Control buttons
    playBtn.addEventListener("click", (e) => { e.stopPropagation(); togglePlay(); });
    rewBtn.addEventListener("click", (e) => { e.stopPropagation(); video.currentTime = Math.max(0, video.currentTime - 10); resetHideTimer(); });
    fwdBtn.addEventListener("click", (e) => { e.stopPropagation(); video.currentTime = Math.min(video.duration || 0, video.currentTime + 10); resetHideTimer(); });

    timeDisplay.addEventListener("click", () => {
      showRemaining = !showRemaining;
      const cur = video.currentTime || 0;
      const dur = video.duration || 0;
      curTimeEl.textContent = showRemaining ? `-${formatTime(Math.max(0, dur - cur))}` : formatTime(cur);
    });

    // Volume & Mute
    volSlider.addEventListener("input", (e) => {
      const val = parseFloat(e.target.value);
      video.volume = val;
      video.muted = (val === 0);
      if (val > 0) lastVolume = val;
      if (video.muted) player.classList.add("is-muted");
      else player.classList.remove("is-muted");
    });

    volBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (video.muted || video.volume === 0) {
        video.muted = false;
        video.volume = lastVolume || 1;
        volSlider.value = lastVolume || 1;
        player.classList.remove("is-muted");
      } else {
        lastVolume = video.volume;
        video.muted = true;
        volSlider.value = 0;
        player.classList.add("is-muted");
      }
    });

    // Picture in Picture
    if (pipBtn) {
      pipBtn.addEventListener("click", async (e) => {
        e.stopPropagation();
        try {
          if (document.pictureInPictureElement) {
            await document.exitPictureInPicture();
          } else {
            await video.requestPictureInPicture();
          }
        } catch (err) {
          console.warn("PiP not available:", err);
        }
      });
    }

    // Fullscreen / Window Expand
    fsBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const parentWin = container.closest(".mac-window");
      if (parentWin) {
        const maxBtn = parentWin.querySelector(".traffic-btn.maximize");
        if (maxBtn) maxBtn.click();
      }
    });

    // Click on video to toggle play, double-click to fullscreen/maximize
    let clickTimeout = null;
    video.addEventListener("click", (e) => {
      e.stopPropagation();
      if (clickTimeout) {
        clearTimeout(clickTimeout);
        clickTimeout = null;
        const parentWin = container.closest(".mac-window");
        if (parentWin) {
          const maxBtn = parentWin.querySelector(".traffic-btn.maximize");
          if (maxBtn) maxBtn.click();
        }
      } else {
        clickTimeout = setTimeout(() => {
          clickTimeout = null;
          togglePlay();
        }, 220);
      }
    });

    // Mouse movement inside player resets hide timer
    player.addEventListener("mousemove", resetHideTimer);
    player.addEventListener("mouseenter", resetHideTimer);
    player.addEventListener("mouseleave", () => {
      if (!video.paused && !isScrubbing) {
        player.classList.add("controls-hidden");
      }
    });

    // Auto-start video
    video.play().catch(() => {
      video.muted = true;
      volSlider.value = 0;
      player.classList.add("is-muted");
      video.play().catch(() => {});
    });
  }

  // --- macOS Quick Look / Lightbox Zoom Viewer ---
  window.openArtworkLightbox = function(imgSrc, title) {
    const existing = document.getElementById("artwork-lightbox");
    if (existing) existing.remove();

    const lightbox = document.createElement("div");
    lightbox.id = "artwork-lightbox";
    lightbox.className = "artwork-lightbox-overlay";
    lightbox.innerHTML = `
      <div class="lightbox-backdrop" onclick="window.closeArtworkLightbox()"></div>
      <div class="lightbox-dialog" onclick="event.stopPropagation()">
        <div class="lightbox-header">
          <div class="lightbox-title">${title || "Artwork Preview"} · Quick Look</div>
          <button class="lightbox-close-btn" onclick="window.closeArtworkLightbox()" title="Close (Esc)">✕</button>
        </div>
        <div class="lightbox-body">
          <div class="lightbox-img-wrapper" oncontextmenu="event.preventDefault(); return false;">
            <img class="lightbox-image" src="${imgSrc}" alt="${title}" draggable="false" oncontextmenu="event.preventDefault(); return false;">
            <div class="lightbox-protection-overlay" oncontextmenu="event.preventDefault(); return false;"></div>
          </div>
        </div>
        <div class="lightbox-footer">
          <span class="lightbox-hint">🔒 Protected Artwork Preview · Click anywhere outside to close</span>
        </div>
      </div>
    `;

    document.body.appendChild(lightbox);
    requestAnimationFrame(() => {
      lightbox.classList.add("visible");
    });
  };

  window.closeArtworkLightbox = function() {
    const lightbox = document.getElementById("artwork-lightbox");
    if (!lightbox) return;
    lightbox.classList.remove("visible");
    setTimeout(() => {
      if (lightbox && lightbox.parentNode) lightbox.parentNode.removeChild(lightbox);
    }, 280);
  };

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
      // Pass unlock token via URL hash (works cross-tab unlike sessionStorage)
      window.open("resume.html#unlocked=caseyx2025", "_blank");
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
          <div class="photos-hero-title">Photos & Art Showcase</div>
          <div class="photos-hero-subtitle">Selected Key Visuals, 3D Art, Tour Graphics & Instagram Works by Casey (Khushal Chhabra)</div>
          <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 6px;">
            <div class="photos-behance-pill" onclick="window.open('https://www.behance.net/Casey08', '_blank')">
              <img src="assets/images/behance-square-color-icon.svg" alt="Behance" width="16" height="16">
              <span>Explore Behance ↗</span>
            </div>
            <div class="photos-behance-pill" style="background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888); box-shadow: 0 4px 12px rgba(220,39,67,0.4);" onclick="window.open('https://www.instagram.com/caseyxlive/', '_blank')">
              <span style="font-size: 13px;">📸</span>
              <span>Instagram (@caseyxlive) ↗</span>
            </div>
          </div>
        </div>

        <div class="gallery-grid">
          ${(data.gallery || []).map(item => {
            const targetUrl = item.url || item.behanceUrl || item.instagramUrl || item.youtubeUrl || '';
            const isBehance = item.isBehance || (targetUrl && targetUrl.includes('behance.net'));
            const isInstagram = item.isInstagram || (targetUrl && targetUrl.includes('instagram.com'));
            const isVideo = !!(item.video || item.videoSrc || item.isYouTube || (targetUrl && (targetUrl.includes('youtube.com') || targetUrl.includes('youtu.be'))));
            const clickAction = isVideo 
              ? `const p = (window.PORTFOLIO_DATA?.projects || []).find(x => x.id === '${item.id || 'avatar-motion-poster'}') || ${JSON.stringify(item).replace(/"/g, '&quot;')}; window.openProjectModal && window.openProjectModal(p);`
              : (targetUrl ? `window.open('${targetUrl}', '_blank')` : '');
            return `
            <div class="gallery-card ${isBehance ? 'is-behance-card' : ''} ${isInstagram ? 'is-instagram-card' : ''} ${isVideo ? 'is-video-card' : ''}" onclick="${clickAction}">
              <div class="gallery-img-wrapper">
                <img src="${item.image}" alt="${item.title}" loading="lazy" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80'">
                ${isBehance ? `
                  <span class="gallery-behance-tag">
                    <img src="assets/images/behance-square-color-icon.svg" width="12" height="12" alt="Behance">
                    <span>Behance</span>
                  </span>
                ` : ''}
                ${isInstagram ? `
                  <span class="gallery-instagram-tag">
                    <span>📸</span>
                    <span>Instagram</span>
                  </span>
                ` : ''}
                ${isVideo ? `
                  <span class="gallery-youtube-tag" style="position: absolute; top: 8px; left: 8px; background: rgba(0, 0, 0, 0.78); backdrop-filter: blur(8px); padding: 3px 9px; border-radius: 12px; font-size: 10px; font-weight: 700; color: #fff; display: flex; align-items: center; gap: 4px; z-index: 2; border: 1px solid rgba(255,255,255,0.2);">
                    <svg viewBox="0 0 24 24" width="10" height="10" fill="#fff"><path d="M8 5v14l11-7z"/></svg>
                    <span>Motion</span>
                  </span>
                ` : ''}
              </div>
              <div class="gallery-caption-box">
                <div class="gallery-title">${item.title}</div>
                <div class="gallery-meta">
                  <span class="gallery-category">${item.category}</span>
                  ${targetUrl ? `<span class="gallery-link-cta" style="${isInstagram ? 'color: #ff5277;' : isVideo ? 'color: #60a5fa;' : ''}">View ↗</span>` : ''}
                </div>
              </div>
            </div>
            `;
          }).join("")}
        </div>
      </div>
    `;

    createWindow({
      id: "gallery",
      title: "Photos & Art Showcase",
      width: "740px",
      top: "10%",
      left: "20%",
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

  // --- Apple Music Application (Authentic iOS 18 Player, Browse, Queue & Lyrics) ---
  window.openSpotifyWindow = function() {
    const track = spotifyTracks[currentTrackIdx] || spotifyTracks[0];
    const pct = Math.min(100, (currentTrackTime / (track.duration || 1)) * 100);
    const isFav = window.appleMusicFavorites && window.appleMusicFavorites.has(currentTrackIdx);

    const content = `
      <div class="apple-music-app" id="apple-music-app">
        <!-- Dynamic Fluid Ambient Blurred Glow -->
        <div id="am-ambient-bg" class="am-ambient-bg" style="background-image: url('${track.cover}');"></div>
        <div class="am-backdrop-tint"></div>

        <div class="am-content-layer">
          
          <!-- ========================================================
               VIEW 1: NOW PLAYING FULL SCREEN (Screenshot 1)
               ======================================================== -->
          <div id="am-view-now-playing" class="am-view-panel ${window.activeMusicView === 'now-playing' ? 'active' : ''} am-view-now-playing">
            
            <!-- Top Drag Handle / Close Pill -->
            <div class="am-drag-handle" onclick="window.closeCurrentWindow ? window.closeCurrentWindow('spotify') : null" title="Swipe or Tap to Dismiss"></div>

            <!-- Main Large Cover Artwork -->
            <div class="am-now-playing-art-wrap">
              <img id="am-cover-art" src="${track.cover}" class="am-cover-art ${isSpotifyPlaying ? 'playing' : ''}" alt="Cover Artwork" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80'">
            </div>

            <!-- Track Info & Action Icons Row -->
            <div class="am-track-info-row">
              <div class="am-track-meta">
                <div class="am-title-line">
                  <span id="am-song-title" class="am-song-title">${track.title}</span>
                  <span class="am-explicit-badge">E</span>
                </div>
                <div id="am-song-artist" class="am-song-artist">${track.artist}</div>
              </div>

              <div class="am-actions-right">
                <button id="am-star-btn" class="am-circle-btn ${isFav ? 'starred' : ''}" onclick="window.toggleAppleMusicFavorite && window.toggleAppleMusicFavorite()" title="Favorite">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="${isFav ? '#ff2d55' : 'none'}" stroke="currentColor" stroke-width="2.2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                </button>
                <button class="am-circle-btn" onclick="window.showAppleMusicOptions && window.showAppleMusicOptions()" title="More Options">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><circle cx="5" cy="12" r="2.2"/><circle cx="12" cy="12" r="2.2"/><circle cx="19" cy="12" r="2.2"/></svg>
                </button>
              </div>
            </div>

            <!-- Scrubber Timeline -->
            <div class="am-scrubber-box">
              <div id="am-scrubber-bg" class="am-scrubber-bg" onclick="window.seekAudioProgress(event)" ontouchstart="window.seekAudioProgress(event)" ontouchmove="window.seekAudioProgress(event)">
                <div id="am-scrubber-fill" class="am-scrubber-fill" style="width: ${pct}%;"></div>
              </div>
              <div class="am-timestamps-row">
                <span id="am-time-current">${formatTime(currentTrackTime)}</span>
                <span class="am-status-badge" id="am-status-badge">
                  <svg viewBox="0 0 24 24" width="10" height="10" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-2h2v2zm0-4H9V7h2v5z"/></svg>
                  <span id="am-status-text">${isSpotifyPlaying ? 'Lossless' : 'Paused'}</span>
                </span>
                <span id="am-time-remaining">-${formatTime(Math.max(0, track.duration - currentTrackTime))}</span>
              </div>
            </div>

            <!-- Main Transport Controls -->
            <div class="am-transport-row">
              <button class="am-transport-btn" onclick="window.spotifyPrevTrack && window.spotifyPrevTrack()" title="Previous Track">
                <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor"><path d="M6 6h2.5v12H6zm3.5 6l10 7V5z"/></svg>
              </button>
              <button id="am-play-btn" class="am-transport-btn am-transport-play" onclick="window.spotifyTogglePlay && window.spotifyTogglePlay()" title="Play / Pause">
                ${isSpotifyPlaying ? `
                  <svg viewBox="0 0 24 24" width="38" height="38" fill="currentColor"><rect x="5.5" y="4" width="4.5" height="16" rx="2.25"/><rect x="14" y="4" width="4.5" height="16" rx="2.25"/></svg>
                ` : `
                  <svg viewBox="0 0 24 24" width="38" height="38" fill="currentColor"><path d="M7 4.5v15l13-7.5z"/></svg>
                `}
              </button>
              <button class="am-transport-btn" onclick="window.spotifyNextTrack && window.spotifyNextTrack()" title="Next Track">
                <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor"><path d="M4.5 19l10-7-10-7v14zM15.5 6v12H18V6h-2.5z"/></svg>
              </button>
            </div>

            <!-- Volume Slider -->
            <div class="am-volume-row">
              <span class="am-volume-icon">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M7 9v6h4l5 5V4l-5 5H7z"/></svg>
              </span>
              <div class="am-volume-track" onclick="window.setVolumeByEvent(event)" ontouchstart="window.setVolumeByEvent(event)" ontouchmove="window.setVolumeByEvent(event)">
                <div id="am-volume-fill" class="am-volume-fill" style="width: ${Math.floor(window.currentVolume * 100)}%;"></div>
              </div>
              <span class="am-volume-icon">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
              </span>
            </div>

            <!-- Bottom Toolbar -->
            <div class="am-bottom-toolbar">
              <button id="am-lyrics-toggle-btn" class="am-tool-btn" onclick="window.setAppleMusicView('lyrics')" title="Live Synced Lyrics">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-9 9H7V9h4v2zm6 0h-4V9h4v2zm0-4H7V5h10v2z"/></svg>
              </button>
              <button class="am-tool-btn" onclick="window.showAirPlayToast && window.showAirPlayToast()" title="AirPlay & Devices">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M6 22h12l-6-6zM21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4v-2H3V5h18v12h-4v2h4c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/></svg>
              </button>
              <button id="am-queue-toggle-btn" class="am-tool-btn" onclick="window.setAppleMusicView('queue')" title="Up Next Queue">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/></svg>
              </button>
              <button class="am-tool-btn" onclick="window.setAppleMusicView('browse')" title="Browse Catalog">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z"/></svg>
              </button>
            </div>

          </div>


          <!-- ========================================================
               VIEW 2: BROWSE / LIBRARY (Screenshot 2)
               ======================================================== -->
          <div id="am-view-browse" class="am-view-panel ${window.activeMusicView === 'browse' ? 'active' : ''} am-view-browse">
            
            <div class="am-browse-header">
              <div class="am-browse-title">Listen Now</div>
              <button class="am-circle-btn" onclick="window.setAppleMusicView('now-playing')">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              </button>
            </div>

            <!-- Dynamic Playlists & Browse Sections from data.js -->
            ${((window.PORTFOLIO_DATA && window.PORTFOLIO_DATA.appleMusicBrowse) || []).map(section => `
              <div class="am-browse-section">
                <div class="am-section-title-row">
                  <span class="am-section-title">${section.categoryTitle} ${section.hasArrow ? '<span class="am-section-arrow">›</span>' : ''}</span>
                </div>
                <div class="am-carousel-row">
                  ${section.items.map(item => `
                    <div class="am-album-card" onclick="window.selectAudioTrack(${item.trackIdx || 0}); window.setAppleMusicView('now-playing');">
                      <div class="am-album-art-box">
                        <img src="${item.cover}" class="am-album-cover-img" alt="${item.title}" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80'">
                        ${item.badge ? `<span class="am-album-apple-badge">${item.badge}</span>` : ''}
                      </div>
                      <div class="am-album-card-title">${item.title}</div>
                      <div class="am-album-card-sub">${item.subtitle}</div>
                    </div>
                  `).join("")}
                </div>
              </div>
            `).join("")}


            <!-- Floating Glass Mini Player Bar -->
            <div class="am-mini-player" onclick="window.setAppleMusicView('now-playing')">
              <div class="am-mini-left">
                <img id="am-mini-cover" src="${track.cover}" class="am-mini-cover" alt="Mini Artwork">
                <div class="am-mini-meta">
                  <div id="am-mini-title" class="am-mini-title">${track.title}</div>
                  <div id="am-mini-artist" class="am-mini-artist">${track.artist}</div>
                </div>
              </div>
              <div class="am-mini-controls" onclick="event.stopPropagation();">
                <button id="am-mini-play-btn" class="am-mini-btn" onclick="window.spotifyTogglePlay()">
                  ${isSpotifyPlaying ? '⏸' : '▶'}
                </button>
                <button class="am-mini-btn" onclick="window.spotifyNextTrack()">⏭</button>
              </div>
            </div>

            <!-- Bottom Tab Bar -->
            <div class="am-tab-bar">
              <div class="am-tab-item active" onclick="window.setAppleMusicView('browse')">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
                <span>Home</span>
              </div>
              <div class="am-tab-item" onclick="window.setAppleMusicView('queue')">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/></svg>
                <span>Up Next</span>
              </div>
              <div class="am-tab-item" onclick="window.setAppleMusicView('now-playing')">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
                <span>Now Playing</span>
              </div>
            </div>

          </div>


          <!-- ========================================================
               VIEW 3: QUEUE ("Continue Playing") (Screenshot 3)
               ======================================================== -->
          <div id="am-view-queue" class="am-view-panel ${window.activeMusicView === 'queue' ? 'active' : ''} am-view-queue">
            
            <!-- Top Mini Header -->
            <div class="am-queue-top-header">
              <div class="am-queue-top-left" onclick="window.setAppleMusicView('now-playing')">
                <img id="am-queue-top-art" src="${track.cover}" class="am-queue-top-art" alt="Cover">
                <div>
                  <div style="display: flex; align-items: center; gap: 4px;">
                    <span id="am-queue-top-title" style="font-size: 15px; font-weight: 800; color: #fff;">${track.title}</span>
                    <span class="am-explicit-badge">E</span>
                  </div>
                  <div id="am-queue-top-artist" style="font-size: 12.5px; color: rgba(255,255,255,0.65);">${track.artist}</div>
                </div>
              </div>
              <div class="am-actions-right">
                <button class="am-circle-btn" onclick="window.toggleAppleMusicFavorite()">
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="${isFav ? '#ff2d55' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                </button>
                <button class="am-circle-btn" onclick="window.setAppleMusicView('now-playing')">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                </button>
              </div>
            </div>

            <!-- Mode Buttons Row -->
            <div class="am-queue-modes">
              <button class="am-mode-pill ${window.isShuffleActive ? 'active' : ''}" onclick="window.toggleAppleMusicShuffle()" title="Shuffle">
                <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/></svg>
              </button>
              <button class="am-mode-pill ${window.isRepeatActive ? 'active' : ''}" onclick="window.toggleAppleMusicRepeat()" title="Repeat">
                <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/></svg>
              </button>
              <button class="am-mode-pill active" title="Autoplay On">
                <span style="font-size: 16px; font-weight: 900;">♾️</span>
              </button>
              <button class="am-mode-pill active" onclick="window.setAppleMusicView('now-playing')" title="Now Playing">
                <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
              </button>
            </div>

            <div class="am-queue-section-info">
              <div class="am-queue-heading">Continue Playing</div>
              <div class="am-queue-sub">From Casey's Studio Essentials (${spotifyTracks.length} Songs)</div>
            </div>

            <!-- Queue Tracklist -->
            <div class="am-queue-list">
              ${spotifyTracks.map((t, idx) => `
                <div id="am-q-item-${idx}" class="am-queue-item ${idx === currentTrackIdx ? 'active' : ''}" onclick="window.selectAudioTrack(${idx})">
                  <div class="am-queue-item-left">
                    <img src="${t.cover}" class="am-queue-item-art" alt="Track Art" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80'">
                    <div style="flex: 1; min-width: 0;">
                      <div style="font-size: 13px; font-weight: 700; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: flex; align-items: center; gap: 4px;">
                        <span>${t.title}</span>
                        <span class="am-explicit-badge">E</span>
                      </div>
                      <div style="font-size: 11px; color: rgba(255,255,255,0.6); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${t.artist}</div>
                    </div>
                  </div>
                  <span class="am-queue-item-handle">≡</span>
                </div>
              `).join("")}
            </div>

            <!-- Quick Controls at Bottom of Queue -->
            <div class="am-scrubber-box">
              <div class="am-scrubber-bg" onclick="window.seekAudioProgress(event)">
                <div id="am-queue-scrubber-fill" class="am-scrubber-fill" style="width: ${pct}%;"></div>
              </div>
              <div class="am-timestamps-row">
                <span id="am-queue-time-current">${formatTime(currentTrackTime)}</span>
                <span id="am-queue-time-remaining">-${formatTime(Math.max(0, track.duration - currentTrackTime))}</span>
              </div>
            </div>

            <div class="am-transport-row" style="margin: 0 0 6px 0;">
              <button class="am-transport-btn" onclick="window.spotifyPrevTrack()">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M6 6h2.5v12H6zm3.5 6l10 7V5z"/></svg>
              </button>
              <button id="am-queue-play-btn" class="am-transport-btn am-transport-play" onclick="window.spotifyTogglePlay()">
                ${isSpotifyPlaying ? `
                  <svg viewBox="0 0 24 24" width="34" height="34" fill="currentColor"><rect x="5.5" y="4" width="4.5" height="16" rx="2.25"/><rect x="14" y="4" width="4.5" height="16" rx="2.25"/></svg>
                ` : `
                  <svg viewBox="0 0 24 24" width="34" height="34" fill="currentColor"><path d="M7 4.5v15l13-7.5z"/></svg>
                `}
              </button>
              <button class="am-transport-btn" onclick="window.spotifyNextTrack()">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M4.5 19l10-7-10-7v14zM15.5 6v12H18V6h-2.5z"/></svg>
              </button>
            </div>

          </div>


          <!-- ========================================================
               VIEW 4: LIVE SYNCED LYRICS VIEW
               ======================================================== -->
          <div id="am-view-lyrics" class="am-view-panel ${window.activeMusicView === 'lyrics' ? 'active' : ''} am-view-lyrics">
            
            <!-- Top Header with Track Info -->
            <div class="am-lyrics-header">
              <div class="am-lyrics-track-info" onclick="window.setAppleMusicView('now-playing')" style="cursor: pointer;">
                <img id="am-lyrics-mini-art" src="${track.cover}" class="am-lyrics-mini-art" alt="Art" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80'">
                <div class="am-lyrics-track-titles">
                  <div id="am-lyrics-song-title" class="am-lyrics-song-title">${track.title}</div>
                  <div id="am-lyrics-song-artist" class="am-lyrics-song-artist">${track.artist}</div>
                </div>
              </div>
              <button class="am-circle-btn" onclick="window.setAppleMusicView('now-playing')" title="Back to Now Playing">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
              </button>
            </div>

            <!-- Central Scrolling Synced Lyrics -->
            <div id="am-lyrics-scroll" class="am-lyrics-scroll">
              ${(window.getTrackLyrics ? window.getTrackLyrics(track) : []).map((line) => `
                <div class="am-lyric-line ${line.time <= currentTrackTime ? 'active' : ''}" data-time="${line.time}" onclick="window.seekToLyricTime(${line.time})">
                  ${line.text}
                </div>
              `).join("")}
            </div>

            <!-- Lyrics Footer with Scrubber & Controls -->
            <div class="am-lyrics-footer">
              <div class="am-scrubber-container">
                <div class="am-scrubber-bg" onclick="window.seekAudioProgress(event)" ontouchstart="window.seekAudioProgress(event)" ontouchmove="window.seekAudioProgress(event)">
                  <div id="am-lyrics-scrubber-fill" class="am-scrubber-fill" style="width: ${pct}%;"></div>
                </div>
                <div class="am-timestamps-row">
                  <span id="am-lyrics-time-current">${formatTime(currentTrackTime)}</span>
                  <span id="am-lyrics-time-remaining">-${formatTime(Math.max(0, track.duration - currentTrackTime))}</span>
                </div>
              </div>

              <div class="am-transport-row" style="margin: 0 0 4px 0;">
                <button class="am-transport-btn" onclick="window.spotifyPrevTrack()">
                  <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M6 6h2.5v12H6zm3.5 6l10 7V5z"/></svg>
                </button>
                <button id="am-lyrics-play-btn" class="am-transport-btn am-transport-play" onclick="window.spotifyTogglePlay()">
                  ${isSpotifyPlaying ? `
                    <svg viewBox="0 0 24 24" width="34" height="34" fill="currentColor"><rect x="5.5" y="4" width="4.5" height="16" rx="2.25"/><rect x="14" y="4" width="4.5" height="16" rx="2.25"/></svg>
                  ` : `
                    <svg viewBox="0 0 24 24" width="34" height="34" fill="currentColor"><path d="M7 4.5v15l13-7.5z"/></svg>
                  `}
                </button>
                <button class="am-transport-btn" onclick="window.spotifyNextTrack()">
                  <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M4.5 19l10-7-10-7v14zM15.5 6v12H18V6h-2.5z"/></svg>
                </button>
              </div>

              <div class="am-bottom-toolbar">
                <button class="am-tool-btn active" onclick="window.setAppleMusicView('now-playing')" title="Now Playing">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-9 9H7V9h4v2zm6 0h-4V9h4v2zm0-4H7V5h10v2z"/></svg>
                </button>
                <button class="am-tool-btn" onclick="window.setAppleMusicView('queue')" title="Up Next Queue">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/></svg>
                </button>
                <button class="am-tool-btn" onclick="window.setAppleMusicView('browse')" title="Browse Catalog">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z"/></svg>
                </button>
              </div>
            </div>

          </div>

        </div>

        <!-- Apple Music Options Action Sheet Modal -->
        <div id="am-options-overlay" class="am-options-overlay" onclick="window.closeAppleMusicOptions()">
          <div class="am-options-sheet" onclick="event.stopPropagation();">
            
            <div class="am-options-header">
              <img id="am-options-art" src="${track.cover}" class="am-options-art" alt="Art" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80'">
              <div class="am-options-meta">
                <div id="am-options-title" class="am-options-title">${track.title}</div>
                <div id="am-options-artist" class="am-options-artist">${track.artist}</div>
                <div class="am-options-badge"> Hi-Res Lossless · Spatial Audio</div>
              </div>
            </div>

            <div class="am-options-menu">
              <button class="am-options-item am-options-item-primary" onclick="window.switchToVinylPlayerFromOptions()">
                <span>💿 Switch to Classic Vinyl Player (Backup)</span>
                <span>›</span>
              </button>

              <button class="am-options-item" onclick="window.toggleAppleMusicFavorite(); window.closeAppleMusicOptions();">
                <span>⭐ Favorite This Song</span>
                <span>›</span>
              </button>

              <button class="am-options-item" onclick="window.toggleAppleMusicShuffle(); window.closeAppleMusicOptions();">
                <span>🔀 Shuffle Queue</span>
                <span>›</span>
              </button>

              <button class="am-options-item" onclick="window.showAirPlayToast(); window.closeAppleMusicOptions();">
                <span>📻 AirPlay & Output Devices</span>
                <span>›</span>
              </button>
            </div>

          </div>

          <div class="am-options-cancel-btn" onclick="window.closeAppleMusicOptions()">
            Cancel
          </div>
        </div>

      </div>
    `;

    createWindow({
      id: "spotify",
      title: "Apple Music",
      width: "520px",
      top: "8%",
      left: "28%",
      contentHTML: content
    });
  };

  window.openMusicWindow = window.openSpotifyWindow;

  // --- Classic Vinyl Audio Player (Backup Mode) ---
  window.openVinylPlayerWindow = function() {
    const track = spotifyTracks[currentTrackIdx] || spotifyTracks[0];
    const pct = Math.min(100, (currentTrackTime / (track.duration || 1)) * 100);

    const content = `
      <div class="vinyl-player-container">
        <!-- Top Bar -->
        <div class="vinyl-player-header">
          <div class="vinyl-header-left">
            <img src="assets/images/ios18_clean/music.png" class="vinyl-app-icon" alt="Vinyl Music">
            <div>
              <div class="vinyl-header-title">Casey's Vinyl Player (Classic)</div>
              <div class="vinyl-header-sub">Curated Studio Playlist (${spotifyTracks.length} Songs)</div>
            </div>
          </div>
          <div class="vinyl-external-links">
            <button onclick="window.openSpotifyWindow()" class="audio-ext-pill" style="background: rgba(255,45,85,0.2); color: #ff2d55; border: 1px solid rgba(255,45,85,0.4); cursor: pointer;" title="Switch to iOS 18 Apple Music">
              <span> Apple Music ↗</span>
            </button>
          </div>
        </div>

        <!-- Vinyl & Artwork Stage -->
        <div class="vinyl-stage">
          <div id="vinyl-art-wrapper" class="vinyl-art-wrapper ${isSpotifyPlaying ? 'playing' : ''}">
            <img id="vinyl-song-cover" src="${track.cover}" class="vinyl-art-img" alt="Artwork" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80'">
            <div id="vinyl-disc-spin" class="vinyl-disc ${isSpotifyPlaying ? 'playing' : ''}">
              <div class="vinyl-center"></div>
            </div>
          </div>
          <div class="vinyl-info-col">
            <div class="vinyl-now-tag">
              <span>NOW PLAYING</span>
              <div id="vinyl-live-eq" class="vinyl-live-eq ${isSpotifyPlaying ? 'playing' : ''}">
                <span></span><span></span><span></span><span></span>
              </div>
            </div>
            <div id="vinyl-song-title" class="vinyl-track-title">${track.title}</div>
            <div id="vinyl-song-artist" class="vinyl-track-artist">${track.artist}</div>
          </div>
        </div>

        <!-- Timeline Scrubber -->
        <div class="vinyl-timeline-box">
          <div class="vinyl-progress-bar-bg" onclick="window.seekAudioProgress(event)" ontouchstart="window.seekAudioProgress(event)" ontouchmove="window.seekAudioProgress(event)">
            <div id="vinyl-song-progress-fill" class="vinyl-progress-fill" style="width: ${pct}%;"></div>
          </div>
          <div class="vinyl-timestamps">
            <span id="vinyl-song-current-time">${formatTime(currentTrackTime)}</span>
            <span id="vinyl-song-duration">${formatTime(track.duration)}</span>
          </div>
        </div>

        <!-- Transport Controls -->
        <div class="vinyl-controls-row">
          <button class="vinyl-ctrl-btn" onclick="window.spotifyPrevTrack && window.spotifyPrevTrack()" title="Previous Track">⏮</button>
          <button id="vinyl-play-btn" class="vinyl-play-btn-large" onclick="window.spotifyTogglePlay && window.spotifyTogglePlay()" title="Play / Pause">
            ${isSpotifyPlaying ? '⏸' : '▶'}
          </button>
          <button class="vinyl-ctrl-btn" onclick="window.spotifyNextTrack && window.spotifyNextTrack()" title="Next Track">⏭</button>
        </div>

        <!-- Tracklist Queue -->
        <div class="vinyl-queue-container">
          <div class="vinyl-queue-title">Vinyl Tracklist (${spotifyTracks.length} Full Songs)</div>
          ${spotifyTracks.map((t, idx) => `
            <div class="vinyl-queue-item ${idx === currentTrackIdx ? 'active' : ''}" onclick="window.selectAudioTrack(${idx})">
              <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.4);">${idx + 1}</span>
                <div>
                  <div style="font-size: 12px; font-weight: 700; color: #fff;">${t.title}</div>
                  <div style="font-size: 10.5px; color: rgba(255,255,255,0.5);">${t.artist}</div>
                </div>
              </div>
              <span style="font-size: 11px; color: rgba(255,255,255,0.5);">${formatTime(t.duration)}</span>
            </div>
          `).join("")}
        </div>
      </div>
    `;

    createWindow({
      id: "vinyl",
      title: "Classic Vinyl Player (Backup)",
      width: "520px",
      top: "12%",
      left: "28%",
      contentHTML: content
    });
  };

  window.openBackupVinylPlayer = window.openVinylPlayerWindow;

  // --- Contact Window ---
  window.openContactWindow = function() {
    const data = window.PORTFOLIO_DATA || (typeof PORTFOLIO_DATA !== "undefined" ? PORTFOLIO_DATA : {});
    const email = (data.personal && data.personal.email) ? data.personal.email : "khushalworkmail08@gmail.com";
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

  // --- Creative Asset Right-Click & Download Protection ---
  function showProtectedToast() {
    let toast = document.getElementById("asset-protect-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "asset-protect-toast";
      toast.style.cssText = "position:fixed;bottom:80px;left:50%;transform:translateX(-50%) translateY(20px);background:rgba(18,22,34,0.92);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);color:#fff;border:1px solid rgba(255,255,255,0.2);padding:8px 18px;border-radius:20px;font-size:12px;font-weight:700;box-shadow:0 10px 30px rgba(0,0,0,0.8);z-index:99999;opacity:0;transition:all 0.25s ease;pointer-events:none;display:flex;align-items:center;gap:6px;";
      toast.innerHTML = `<span>🔒</span><span>Artwork Protected · Casey Portfolio</span>`;
      document.body.appendChild(toast);
    }
    requestAnimationFrame(() => {
      toast.style.opacity = "1";
      toast.style.transform = "translateX(-50%) translateY(0)";
    });
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(-50%) translateY(20px)";
    }, 2200);
  }

  // Prevent right click on all artwork elements
  document.addEventListener("contextmenu", (e) => {
    if (e.target.tagName === "IMG" || e.target.closest(".project-cover-container") || e.target.closest(".lightbox-img-wrapper") || e.target.closest(".gallery-card") || e.target.closest(".desktop-item")) {
      e.preventDefault();
      showProtectedToast();
      return false;
    }
  });

  // Prevent image dragging to external folders / browser tabs
  document.addEventListener("dragstart", (e) => {
    if (e.target.tagName === "IMG") {
      e.preventDefault();
      return false;
    }
  });

  // Keyboard shortcut: ESC to close lightbox or top window
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const lightbox = document.getElementById("artwork-lightbox");
      if (lightbox) {
        window.closeArtworkLightbox();
        return;
      }
      const openWins = Object.values(activeWindows);
      if (openWins.length > 0) {
        openWins.sort((a, b) => parseInt(b.style.zIndex || 0) - parseInt(a.style.zIndex || 0));
        const topId = openWins[0].id.replace("win-", "");
        closeWindow(topId);
      }
    }
  });
});

