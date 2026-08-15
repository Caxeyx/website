'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';

// Types for the component
export interface DockApp {
  id: string;
  name: string;
  icon: string;
  badge?: string;
}

export interface MacOSDockProps {
  apps: DockApp[];
  onAppClick: (appId: string) => void;
  openApps?: string[];
  className?: string;
}

interface DockItemProps {
  app: DockApp;
  mouseX: any;
  onAppClick: (appId: string) => void;
  isOpen: boolean;
  baseSize: number;
}

const DockItem: React.FC<DockItemProps> = ({ 
  app, 
  mouseX, 
  onAppClick, 
  isOpen, 
  baseSize 
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);

  // Compute distance from mouse X to icon center
  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds) return 1000;
    return val - (bounds.left + bounds.width / 2);
  });

  // Dynamic magnification mapping using spring physics
  const widthSync = useTransform(
    distance, 
    [-140, 0, 140], 
    [baseSize, baseSize * 1.5, baseSize]
  );
  
  const width = useSpring(widthSync, { 
    mass: 0.1, 
    stiffness: 170, 
    damping: 12 
  });

  const handleClick = () => {
    setIsBouncing(true);
    setTimeout(() => setIsBouncing(false), 500);
    onAppClick(app.id);
  };

  return (
    <div 
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end'
      }}
    >
      {/* Tooltip Bubble */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: -8, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute',
              bottom: '100%',
              marginBottom: '8px',
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
              padding: '4px 10px',
              fontSize: '11px',
              fontWeight: 600,
              color: '#ffffff',
              background: 'rgba(15, 23, 42, 0.92)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '6px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(12px)',
              zIndex: 100,
              letterSpacing: '0.2px'
            }}
          >
            {app.name}
            <div 
              style={{
                position: 'absolute',
                left: '50%',
                bottom: '-4px',
                transform: 'translateX(-50%) rotate(45deg)',
                width: '8px',
                height: '8px',
                background: 'rgba(15, 23, 42, 0.92)',
                borderRight: '1px solid rgba(255, 255, 255, 0.2)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animated Icon Container */}
      <motion.div
        ref={ref}
        style={{ 
          width, 
          height: width,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          borderRadius: '12px',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          overflow: 'visible'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
        animate={isBouncing ? { y: [0, -24, 0, -10, 0], scale: [1, 1.2, 0.94, 1.06, 1] } : { y: 0, scale: 1 }}
        transition={isBouncing ? { duration: 0.6, ease: [0.34, 1.56, 0.64, 1] } : { duration: 0.15 }}
        whileTap={{ scale: 0.88 }}
      >
        <img
          src={app.icon}
          alt={app.name}
          draggable={false}
          style={{
            width: '100%',
            height: '100%',
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            pointerEvents: 'none',
            userSelect: 'none',
            display: 'block',
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))'
          }}
          onError={(e) => {
            const target = e.currentTarget;
            target.onerror = null;
            target.src = 'https://cdn.jim-nielsen.com/macos/1024/finder-2021-09-10.png?rf=1024';
          }}
        />

        {/* Notification Badge */}
        {app.badge && (
          <div
            style={{
              position: 'absolute',
              top: '-4px',
              right: '-6px',
              background: '#ff3b30',
              color: '#ffffff',
              fontSize: '10px',
              fontWeight: 800,
              padding: '1px 5px',
              minWidth: '18px',
              height: '18px',
              borderRadius: '9px',
              border: '1.5px solid rgba(0, 0, 0, 0.5)',
              boxShadow: '0 2px 6px rgba(255, 59, 48, 0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
              letterSpacing: '-0.3px',
              pointerEvents: 'none'
            }}
          >
            {app.badge}
          </div>
        )}

        {/* Active Indicator Dot */}
        {isOpen && (
          <motion.div 
            layoutId={`dot-${app.id}`}
            style={{
              position: 'absolute',
              bottom: '-8px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              boxShadow: '0 0 8px rgba(255, 255, 255, 0.9), 0 0 2px rgba(0, 0, 0, 0.8)'
            }}
          />
        )}
      </motion.div>
    </div>
  );
};

const MacOSDock: React.FC<MacOSDockProps> = ({ 
  apps, 
  onAppClick, 
  openApps = [],
  className = ''
}) => {
  const mouseX = useMotionValue(Infinity);
  const [baseSize, setBaseSize] = useState(44);

  // Viewport responsive icon size calculation
  useEffect(() => {
    const handleResize = () => {
      const smaller = Math.min(window.innerWidth, window.innerHeight);
      if (smaller < 480) setBaseSize(32);
      else if (smaller < 768) setBaseSize(36);
      else if (smaller < 1024) setBaseSize(40);
      else setBaseSize(44);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <motion.div
      initial={{ y: 30, opacity: 0, scale: 0.95 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={(e) => mouseX.set(e.clientX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center',
        gap: '10px',
        padding: '10px 14px',
        borderRadius: '18px',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.04) 100%), rgba(15, 20, 32, 0.48)',
        backdropFilter: 'blur(40px) saturate(210%) contrast(108%)',
        WebkitBackdropFilter: 'blur(40px) saturate(210%) contrast(108%)',
        border: '1px solid rgba(255, 255, 255, 0.28)',
        boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.6), inset 0 1px 1.5px 0 rgba(255, 255, 255, 0.45), inset 0 -1px 1px 0 rgba(0, 0, 0, 0.3)',
        overflow: 'visible',
        position: 'relative',
        width: 'fit-content',
        margin: '0 auto'
      }}
    >
      {apps.map((app) => (
        <DockItem
          key={app.id}
          app={app}
          mouseX={mouseX}
          onAppClick={onAppClick}
          isOpen={openApps.includes(app.id)}
          baseSize={baseSize}
        />
      ))}
    </motion.div>
  );
};

export default MacOSDock;
