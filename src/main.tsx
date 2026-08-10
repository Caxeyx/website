import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import MacOSDock, { DockApp } from '@/components/ui/mac-os-dock';
import LiveUserCursors from '@/components/ui/live-user-cursors';

const portfolioApps: DockApp[] = [
  { 
    id: 'ae', 
    name: 'After Effects', 
    icon: 'https://framerusercontent.com/images/FGXr3pqtmk0UpCXHi0IZJgC4H8.png' 
  },
  { 
    id: 'ps', 
    name: 'Photoshop', 
    icon: 'https://framerusercontent.com/images/iDBBsIGms7v4vkBAa7EBeh9PGuM.png' 
  },
  { 
    id: 'ai', 
    name: 'Illustrator', 
    icon: 'https://framerusercontent.com/images/VHJFQu7ykJIdCqTTduCtUcpcA.png' 
  },
  { 
    id: 'warn', 
    name: 'System Warning', 
    icon: 'https://framerusercontent.com/images/BSPnJPSH4K1WxhDJJbEfUgT7U.png' 
  },
  { 
    id: 'notebook', 
    name: 'Kajecik (About & CV)', 
    icon: 'https://framerusercontent.com/images/es0axIAu0guUZSRBu6xvsteey8w.png' 
  },
  { 
    id: 'gallery', 
    name: 'Photos Gallery', 
    icon: 'https://framerusercontent.com/images/yNLcekVy7df0d4hAoz6dZR8s.png' 
  },
  { 
    id: 'spotify', 
    name: 'Spotify', 
    icon: 'https://cdn.jim-nielsen.com/macos/1024/spotify-2021-05-25.png?rf=1024' 
  },
  { 
    id: 'instagram', 
    name: 'Instagram (@caseyxlive)', 
    icon: 'https://framerusercontent.com/images/fZcO2HO3MMDvuS9IcWLgq5MyMc.png' 
  },
  { 
    id: 'contact', 
    name: 'Contact Mail', 
    icon: 'https://framerusercontent.com/images/4ZZQ6ZFOyrBZ3TXhVZjMFK7zbGk.png' 
  },
  { 
    id: 'trash', 
    name: 'Bin of Ideas', 
    icon: 'https://framerusercontent.com/images/Hfn1FB5V1VnB099tUlAIyjV1tC4.png' 
  },
];

const InteractiveDockWrapper: React.FC = () => {
  const [openApps, setOpenApps] = useState<string[]>(['spotify']);

  const handleAppClick = (appId: string) => {
    const win = window as any;
    if (['ae', 'ps', 'ai', 'warn'].includes(appId)) {
      win.openAdobeDialog?.(appId);
    } else if (appId === 'notebook') {
      win.openNotebookWindow?.();
    } else if (appId === 'gallery') {
      win.openGalleryWindow?.();
    } else if (appId === 'spotify') {
      win.openSpotifyWindow?.();
    } else if (appId === 'instagram') {
      window.open('https://www.instagram.com/caseyxlive/', '_blank');
    } else if (appId === 'contact') {
      win.openContactWindow?.();
    } else if (appId === 'trash') {
      win.openBinWindow?.();
    }

    setOpenApps(prev => 
      prev.includes(appId) ? prev.filter(id => id !== appId) : [...prev, appId]
    );
  };

  return (
    <MacOSDock
      apps={portfolioApps}
      onAppClick={handleAppClick}
      openApps={openApps}
    />
  );
};

const mountApp = () => {
  // 1. Mount Live Multi-User Cursors directly to document.body for unconstrained full-viewport wandering
  const presenceContainer = document.createElement('div');
  presenceContainer.id = 'live-cursors-root';
  document.body.appendChild(presenceContainer);
  const presenceRoot = ReactDOM.createRoot(presenceContainer);
  presenceRoot.render(<LiveUserCursors />);

  // 2. Mount MacOSDock to #mac-dock
  const dockElement = document.getElementById('mac-dock');
  if (dockElement) {
    dockElement.style.position = 'fixed';
    dockElement.style.bottom = '16px';
    dockElement.style.left = '50%';
    dockElement.style.transform = 'translateX(-50%)';
    dockElement.style.zIndex = '500';
    dockElement.style.background = 'transparent';
    dockElement.style.border = 'none';
    dockElement.style.padding = '0';

    const dockRoot = ReactDOM.createRoot(dockElement);
    dockRoot.render(<InteractiveDockWrapper />);
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountApp);
} else {
  mountApp();
}
