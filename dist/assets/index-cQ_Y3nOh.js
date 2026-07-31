(function(){const u=document.createElement("link").relList;if(u&&u.supports&&u.supports("modulepreload"))return;for(const d of document.querySelectorAll('link[rel="modulepreload"]'))A(d);new MutationObserver(d=>{for(const r of d)if(r.type==="childList")for(const y of r.addedNodes)y.tagName==="LINK"&&y.rel==="modulepreload"&&A(y)}).observe(document,{childList:!0,subtree:!0});function b(d){const r={};return d.integrity&&(r.integrity=d.integrity),d.referrerPolicy&&(r.referrerPolicy=d.referrerPolicy),d.crossOrigin==="use-credentials"?r.credentials="include":d.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function A(d){if(d.ep)return;d.ep=!0;const r=b(d);fetch(d.href,r)}})();document.addEventListener("DOMContentLoaded",()=>{let T=200,u={};const b=document.getElementById("desktop-grid"),A=document.getElementById("window-stack"),d=document.getElementById("mac-dock");function r(){const t=document.getElementById("menu-clock");if(!t)return;const e=new Date,n={weekday:"short",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"};t.textContent=e.toLocaleDateString("en-US",n)}r(),setInterval(r,1e4);function y(){if(!b||!PORTFOLIO_DATA||!PORTFOLIO_DATA.projects)return;b.innerHTML="";const t=b.clientWidth||window.innerWidth,e=b.clientHeight||window.innerHeight,n=window.innerWidth<=768;PORTFOLIO_DATA.projects.forEach(a=>{const i=document.createElement("div");i.className="desktop-item",i.dataset.id=a.id;const g=a.pos.x/100*t,o=a.pos.y/100*e;n||(i.style.left=`${g}px`,i.style.top=`${o}px`),i.innerHTML=`
        <div class="desktop-icon-wrapper">
          <img src="${a.cover}" alt="${a.title}" draggable="false" loading="lazy">
        </div>
        <div class="desktop-label">${a.title}</div>
      `;let c=!1,s=0,l=0,w=0,f=0,L=!1,O=null,k=0,I=0;const P=(p,m)=>{c=!0,L=!1,s=p,l=m,w=i.offsetLeft||0,f=i.offsetTop||0,i.classList.add("is-dragging"),i.style.zIndex=300},R=()=>{if(!c)return;const p=k-s,m=I-l,h=n?10:4;if((Math.abs(p)>h||Math.abs(m)>h)&&(L=!0),L&&!n){let v=w+p,$=f+m;v=Math.max(10,Math.min(window.innerWidth-90,v)),$=Math.max(35,Math.min(window.innerHeight-100,$)),i.style.left=`${v}px`,i.style.top=`${$}px`}O=null},D=(p,m)=>{c&&(k=p,I=m,O||(O=requestAnimationFrame(R)))},M=()=>{c&&(c=!1,O&&(cancelAnimationFrame(O),O=null),i.classList.remove("is-dragging"),i.style.zIndex="",L||F(a))};i.addEventListener("mousedown",p=>{if(p.button!==0)return;p.preventDefault(),P(p.clientX,p.clientY);const m=v=>{v.preventDefault(),D(v.clientX,v.clientY)},h=()=>{M(),document.removeEventListener("mousemove",m),document.removeEventListener("mouseup",h)};document.addEventListener("mousemove",m),document.addEventListener("mouseup",h)}),i.addEventListener("touchstart",p=>{const m=p.touches[0];P(m.clientX,m.clientY);const h=$=>{const C=$.touches[0];D(C.clientX,C.clientY)},v=()=>{M(),document.removeEventListener("touchmove",h),document.removeEventListener("touchend",v)};document.addEventListener("touchmove",h,{passive:!0}),document.addEventListener("touchend",v)},{passive:!0}),b.appendChild(i)})}y(),window.addEventListener("resize",y);function x({id:t,title:e,width:n="620px",contentHTML:a,top:i="15%",left:g="25%"}){if(u[t])return E(u[t]),u[t];T+=1;const o=document.createElement("div");return o.className="mac-window focused",o.id=`win-${t}`,window.innerWidth<=768?(o.style.width="92vw",o.style.top="42px",o.style.left="4vw"):(o.style.width=n,o.style.top=i,o.style.left=g),o.style.zIndex=T,o.innerHTML=`
      <div class="window-header">
        <div class="window-traffic-lights">
          <button class="traffic-btn close" title="Close">✕</button>
          <button class="traffic-btn minimize" title="Minimize">−</button>
          <button class="traffic-btn maximize" title="Maximize">+</button>
        </div>
        <div class="window-title">${e}</div>
        <div class="window-header-actions"></div>
      </div>
      <div class="window-body">
        ${a}
      </div>
    `,o.querySelector(".traffic-btn.close").addEventListener("click",f=>{f.stopPropagation(),z(t)}),o.querySelector(".traffic-btn.minimize").addEventListener("click",f=>{f.stopPropagation(),z(t)}),o.querySelector(".traffic-btn.maximize").addEventListener("click",f=>{f.stopPropagation(),o.classList.toggle("maximized")}),o.addEventListener("mousedown",()=>E(o)),o.addEventListener("touchstart",()=>E(o),{passive:!0}),W(o),A.appendChild(o),u[t]=o,requestAnimationFrame(()=>o.classList.add("visible")),o}function E(t){document.querySelectorAll(".mac-window").forEach(e=>e.classList.remove("focused")),T+=1,t.style.zIndex=T,t.classList.add("focused")}function z(t){const e=u[t];e&&(e.classList.remove("visible"),setTimeout(()=>{e.parentNode&&e.parentNode.removeChild(e),delete u[t]},250))}function W(t){const e=t.querySelector(".window-header");let n=!1,a=0,i=0;const g=(s,l)=>{t.classList.contains("maximized")||(n=!0,a=s-t.offsetLeft,i=l-t.offsetTop,E(t))},o=(s,l)=>{if(!n)return;let w=s-a,f=l-i;const L=t.offsetWidth||320;w=Math.max(5,Math.min(window.innerWidth-L-5,w)),f=Math.max(30,Math.min(window.innerHeight-60,f)),t.style.left=`${w}px`,t.style.top=`${f}px`},c=()=>{n=!1};e.addEventListener("mousedown",s=>{s.target.classList.contains("traffic-btn")||g(s.clientX,s.clientY)}),document.addEventListener("mousemove",s=>{n&&o(s.clientX,s.clientY)}),document.addEventListener("mouseup",c),e.addEventListener("touchstart",s=>{if(s.target.classList.contains("traffic-btn"))return;const l=s.touches[0];g(l.clientX,l.clientY)},{passive:!0}),document.addEventListener("touchmove",s=>{if(!n)return;const l=s.touches[0];o(l.clientX,l.clientY)},{passive:!0}),document.addEventListener("touchend",c),document.addEventListener("touchcancel",c)}function F(t){const e=`
      <div class="project-modal-grid">
        <div>
          <img class="project-cover-large" src="${t.cover}" alt="${t.title}" onerror="this.src='https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80'">
        </div>
        <div>
          <span class="project-meta-tag">${t.category}</span>
          <h2 class="project-title-large">${t.title}</h2>
          <div class="project-client-line">Client: <strong>${t.client}</strong> · Year: <strong>${t.year}</strong></div>
          <p class="project-desc-text">${t.description}</p>
          <h4 style="font-size: 13px; font-weight: 800; margin-bottom: 8px;">Key Highlights</h4>
          <ul class="project-features-list">
            ${(t.details||["Custom art direction and visual design","High quality execution"]).map(i=>`<li>${i}</li>`).join("")}
          </ul>
        </div>
      </div>
    `,n=`${Math.min(20+Math.random()*10,30)}%`,a=`${Math.min(20+Math.random()*15,35)}%`;x({id:`proj-${t.id}`,title:t.title,width:"720px",top:n,left:a,contentHTML:e})}if(window.openNotebookWindow=function(){const t=`
      <div class="notebook-tabs">
        <button class="tab-btn active" onclick="switchNotebookTab('tab-about', this)">About Casey</button>
        <button class="tab-btn" onclick="switchNotebookTab('tab-cv', this)">CV & Experience</button>
        <button class="tab-btn" onclick="switchNotebookTab('tab-interests', this)">Creative Interests</button>
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
          ${PORTFOLIO_DATA.services.map(e=>`
            <div style="background: rgba(255,255,255,0.04); padding: 10px; border-radius: 8px; font-size: 12px; font-weight: 600; border: 1px solid rgba(255,255,255,0.08);">
              ✨ ${e}
            </div>
          `).join("")}
        </div>
      </div>

      <div id="tab-cv" class="tab-content">
        <h3 style="font-size: 15px; font-weight: 800; margin-bottom: 14px;">Work Experience</h3>
        <div class="experience-timeline">
          ${PORTFOLIO_DATA.experience.map(e=>`
            <div class="timeline-item">
              <div class="timeline-role">${e.role}</div>
              <div class="timeline-company">${e.company} · ${e.period}</div>
              <div class="timeline-desc">${e.description}</div>
            </div>
          `).join("")}
        </div>
        <h3 style="font-size: 15px; font-weight: 800; margin: 20px 0 10px 0;">Clients & Collaborators</h3>
        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
          ${PORTFOLIO_DATA.clients.map(e=>`
            <span style="background: rgba(59, 130, 246, 0.15); border: 1px solid rgba(59, 130, 246, 0.4); color: #60a5fa; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 12px;">${e}</span>
          `).join("")}
        </div>
      </div>

      <div id="tab-interests" class="tab-content">
        <h3 style="font-size: 15px; font-weight: 800; margin-bottom: 12px;">Design Philosophy & Inspirations</h3>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${PORTFOLIO_DATA.interests.map(e=>`
            <div style="background: rgba(255,255,255,0.04); border-left: 3px solid #10b981; padding: 10px 14px; border-radius: 0 8px 8px 0; font-size: 13px; font-weight: 600;">
              💡 ${e}
            </div>
          `).join("")}
        </div>
      </div>
    `;x({id:"notebook",title:"Kajecik - About & CV",width:"600px",top:"12%",left:"26%",contentHTML:t})},window.switchNotebookTab=function(t,e){document.querySelectorAll(".notebook-tabs .tab-btn").forEach(i=>i.classList.remove("active")),document.querySelectorAll(".tab-content").forEach(i=>i.classList.remove("active"));const n=e||(window.event?window.event.target:null);n&&n.classList.add("active");const a=document.getElementById(t);a&&a.classList.add("active")},window.openGalleryWindow=function(){const t=`
      <div class="gallery-grid">
        ${PORTFOLIO_DATA.gallery.map(e=>`
          <div class="gallery-card">
            <img src="${e.image}" alt="${e.title}" onerror="this.src='https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80'">
            <div class="gallery-caption">${e.title} (${e.category})</div>
          </div>
        `).join("")}
      </div>
    `;x({id:"gallery",title:"Photos & Art Showcase",width:"660px",top:"14%",left:"24%",contentHTML:t})},window.openBinWindow=function(){const t=`
      <div style="padding: 10px;">
        <h3 style="font-size: 16px; font-weight: 800; margin-bottom: 12px;">🗑️ Bin of Unreleased Ideas</h3>
        <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 16px;">Early drafts, poster experiments, and creative concepts waiting for their turn.</p>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          ${PORTFOLIO_DATA.binOfIdeas.map(e=>`
            <div style="background: rgba(255,255,255,0.04); border: 1px dashed rgba(255,255,255,0.2); padding: 12px; border-radius: 8px;">
              <div style="font-weight: 800; font-size: 13px; margin-bottom: 4px; color: #f59e0b;">${e.title}</div>
              <div style="font-size: 12px; color: var(--text-muted);">${e.note}</div>
            </div>
          `).join("")}
        </div>
      </div>
    `;x({id:"bin",title:"Bin of Ideas",width:"480px",top:"20%",left:"30%",contentHTML:t})},window.openSpotifyWindow=function(){PORTFOLIO_DATA.spotify,x({id:"spotify",title:"Spotify Player — Top Tracks Playlist",width:"560px",top:"10%",left:"26%",contentHTML:`
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
    `})},window.openContactWindow=function(){const t=`
      <div style="text-align: center; padding: 10px;">
        <div style="font-size: 40px; margin-bottom: 10px;">✉️</div>
        <h2 style="font-size: 22px; font-weight: 900; margin-bottom: 6px;">Let's Work Together</h2>
        <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 20px;">Open for Art Direction, Key Visuals, Album Packaging & Collaborations.</p>
        <a href="mailto:${PORTFOLIO_DATA.personal.email}" style="display: inline-block; padding: 10px 24px; background: #3b82f6; color: #fff; text-decoration: none; font-weight: 800; font-size: 13px; border-radius: 8px; transition: background 0.2s;">
          Send Email to ${PORTFOLIO_DATA.personal.email}
        </a>
      </div>
    `;x({id:"contact",title:"Contact Casey",width:"450px",top:"22%",left:"32%",contentHTML:t})},window.openAdobeDialog=function(t){const e=PORTFOLIO_DATA.adobeDialogs[t]||PORTFOLIO_DATA.adobeDialogs.warn,n=`
      <div class="adobe-dialog-box">
        <div class="adobe-icon-warning">⚠️</div>
        <h3 style="font-size: 16px; font-weight: 800; margin-bottom: 10px;">${e.title}</h3>
        <p class="adobe-msg-text">${e.message}</p>
        <button class="adobe-btn-action" onclick="this.closest('.mac-window').querySelector('.traffic-btn.close').click()">
          ${e.button}
        </button>
      </div>
    `;x({id:`adobe-${t}`,title:e.title,width:"420px",top:"30%",left:"35%",contentHTML:n})},d){const t=d.querySelectorAll(".dock-item");window.matchMedia("(hover: none)").matches||(d.addEventListener("mousemove",n=>{const a=n.clientX;t.forEach(i=>{const g=i.getBoundingClientRect(),o=g.left+g.width/2,c=Math.abs(a-o);let s=1;c<140&&(s=1+(1-c/140)*.45),i.style.transform=`scale(${s})`})}),d.addEventListener("mouseleave",()=>{t.forEach(n=>{n.style.transform="scale(1)"})}))}document.addEventListener("keydown",t=>{if(t.key==="Escape"){const e=Object.values(u);if(e.length>0){e.sort((a,i)=>parseInt(i.style.zIndex||0)-parseInt(a.style.zIndex||0));const n=e[0].id.replace("win-","");z(n)}}})});
