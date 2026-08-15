import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import MacOSDock, { DockApp } from '@/components/ui/mac-os-dock';
import LiveUserCursors from '@/components/ui/live-user-cursors';
import spotifyIcon from '../assets/images/spotify_icon.svg';
import behanceIcon from '../assets/images/behance_icon.svg';
import youtubeIcon from '../assets/images/youtube_icon.svg';

const allPortfolioApps: DockApp[] = [
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
    name: 'About & CV', 
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
    icon: spotifyIcon 
  },
  { 
    id: 'behance', 
    name: 'Behance (@Casey08)', 
    icon: behanceIcon 
  },
  { 
    id: 'youtube', 
    name: 'YouTube (@Caseyxlive)', 
    icon: youtubeIcon 
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

const mobileDockApps: DockApp[] = [
  { 
    id: 'notebook', 
    name: 'About & CV', 
    icon: 'https://framerusercontent.com/images/es0axIAu0guUZSRBu6xvsteey8w.png' 
  },
  { 
    id: 'gallery', 
    name: 'Photos Gallery', 
    icon: 'https://framerusercontent.com/images/yNLcekVy7df0d4hAoz6dZR8s.png' 
  },
  { 
    id: 'behance', 
    name: 'Behance', 
    icon: behanceIcon 
  },
  { 
    id: 'youtube', 
    name: 'YouTube', 
    icon: youtubeIcon 
  },
  { 
    id: 'spotify', 
    name: 'Spotify', 
    icon: spotifyIcon 
  },
  { 
    id: 'contact', 
    name: 'Contact Mail', 
    icon: 'https://framerusercontent.com/images/4ZZQ6ZFOyrBZ3TXhVZjMFK7zbGk.png' 
  },
];

const InteractiveDockWrapper: React.FC = () => {
  const [openApps, setOpenApps] = useState<string[]>(['spotify']);
  const [isMobile, setIsMobile] = useState<boolean>(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    } else if (appId === 'behance') {
      window.open('https://www.behance.net/Casey08', '_blank');
    } else if (appId === 'youtube') {
      window.open('https://www.youtube.com/@Caseyxlive', '_blank');
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

  const currentApps = isMobile ? mobileDockApps : allPortfolioApps;

  return (
    <MacOSDock
      apps={currentApps}
      onAppClick={handleAppClick}
      openApps={openApps}
    />
  );
};

const mountApp = () => {
  // 1. Mount Live Multi-User Cursors directly to document.body for desktop
  if (typeof window !== 'undefined' && window.innerWidth > 768) {
    const presenceContainer = document.createElement('div');
    presenceContainer.id = 'live-cursors-root';
    presenceContainer.style.pointerEvents = 'none';
    document.body.appendChild(presenceContainer);
    const presenceRoot = ReactDOM.createRoot(presenceContainer);
    presenceRoot.render(<LiveUserCursors />);
  }

  // 2. Mount MacOSDock to #mac-dock
  const dockElement = document.getElementById('mac-dock');
  if (dockElement) {
    const dockRoot = ReactDOM.createRoot(dockElement);
    dockRoot.render(<InteractiveDockWrapper />);
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountApp);
} else {
  mountApp();
}
