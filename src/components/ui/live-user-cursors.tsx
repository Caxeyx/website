'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface UserPresence {
  id: string;
  name: string;
  location: string;
  color: string;
  x: number;
  y: number;
  lastSeen: number;
}

const COLOR_OPTIONS = [
  { name: 'Neon Pink', value: '#ec4899' },
  { name: 'Electric Cyan', value: '#06b6d4' },
  { name: 'Bright Amber', value: '#f59e0b' },
  { name: 'Vivid Purple', value: '#a855f7' },
  { name: 'Emerald Green', value: '#10b981' },
  { name: 'Crimson Red', value: '#ef4444' },
  { name: 'Royal Blue', value: '#3b82f6' },
];

export const LiveUserCursors: React.FC = () => {
  // Persistent user customization settings
  const [myId] = useState<string>(() => {
    let stored = localStorage.getItem('mac_cursor_uid');
    if (!stored) {
      stored = `usr_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem('mac_cursor_uid', stored);
    }
    return stored;
  });

  const [name, setName] = useState<string>(() => localStorage.getItem('mac_cursor_name') || 'Visitor');
  const [location, setLocation] = useState<string>(() => localStorage.getItem('mac_cursor_loc') || 'Studio');
  const [color, setColor] = useState<string>(() => localStorage.getItem('mac_cursor_color') || '#ec4899');
  
  const [remoteUsers, setRemoteUsers] = useState<Record<string, UserPresence>>({});
  const [isCustomizerOpen, setIsCustomizerOpen] = useState<boolean>(false);

  // Save custom cursor identity
  const saveCustomization = (newName: string, newLoc: string, newColor: string) => {
    setName(newName);
    setLocation(newLoc);
    setColor(newColor);
    localStorage.setItem('mac_cursor_name', newName);
    localStorage.setItem('mac_cursor_loc', newLoc);
    localStorage.setItem('mac_cursor_color', newColor);
    setIsCustomizerOpen(false);
  };

  // Real-Time Multi-User Cursor Engine (No Bots, Pure macOS Arrow Pointers)
  useEffect(() => {
    let ws: WebSocket | null = null;
    let bcast: BroadcastChannel | null = null;

    try {
      bcast = new BroadcastChannel('mac_portfolio_cursors_clean');
    } catch {
      bcast = null;
    }

    try {
      ws = new WebSocket('wss://socketsbay.com/wss/v2/1/mac_portfolio_clean_cursors/');
    } catch {
      ws = null;
    }

    const broadcastMove = (xPct: number, yPct: number) => {
      const payload: UserPresence = {
        id: myId,
        name,
        location,
        color,
        x: xPct,
        y: yPct,
        lastSeen: Date.now()
      };

      const msg = JSON.stringify({ type: 'CURSOR_MOVE', payload });

      if (bcast) {
        bcast.postMessage({ type: 'CURSOR_MOVE', payload });
      }
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(msg);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const xPct = (e.clientX / window.innerWidth) * 100;
      const yPct = (e.clientY / window.innerHeight) * 100;
      broadcastMove(xPct, yPct);
    };

    const receiveUserPayload = (user: UserPresence) => {
      if (!user || user.id === myId) return;
      setRemoteUsers(prev => ({
        ...prev,
        [user.id]: user
      }));
    };

    if (bcast) {
      bcast.onmessage = (e: MessageEvent) => {
        if (e.data?.type === 'CURSOR_MOVE' && e.data.payload) {
          receiveUserPayload(e.data.payload);
        } else if (e.data?.type === 'CURSOR_LEAVE' && e.data.id) {
          setRemoteUsers(prev => {
            const next = { ...prev };
            delete next[e.data.id];
            return next;
          });
        }
      };
    }

    if (ws) {
      ws.onmessage = (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);
          if (data?.type === 'CURSOR_MOVE' && data.payload) {
            receiveUserPayload(data.payload);
          }
        } catch {}
      };
    }

    window.addEventListener('mousemove', handleMouseMove);

    // Auto-prune stale idle remote cursors
    const pruneInterval = setInterval(() => {
      const now = Date.now();
      setRemoteUsers(prev => {
        const next: Record<string, UserPresence> = {};
        Object.values(prev).forEach(u => {
          if (now - u.lastSeen < 5000) {
            next[u.id] = u;
          }
        });
        return next;
      });
    }, 1500);

    const handleUnload = () => {
      if (bcast) bcast.postMessage({ type: 'CURSOR_LEAVE', id: myId });
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'CURSOR_LEAVE', id: myId }));
      }
    };
    window.addEventListener('beforeunload', handleUnload);

    (window as any).toggleCursorCustomizer = () => {
      setIsCustomizerOpen(prev => !prev);
    };

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('beforeunload', handleUnload);
      clearInterval(pruneInterval);
      if (bcast) bcast.close();
      if (ws) ws.close();
    };
  }, [myId, name, location, color]);

  return (
    <>
      {/* Real Multi-User macOS Arrow Pointer Overlay */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 850,
          overflow: 'hidden'
        }}
      >
        <AnimatePresence>
          {Object.values(remoteUsers).map(user => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, scale: 0.5, left: `${user.x}%`, top: `${user.y}%` }}
              animate={{ opacity: 1, scale: 1, left: `${user.x}%`, top: `${user.y}%` }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.12, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '6px',
                pointerEvents: 'none',
                userSelect: 'none',
                transform: 'translate(-2px, -2px)'
              }}
            >
              {/* Clean macOS Arrow Pointer SVG */}
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                style={{ color: user.color, filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.6))' }}
              >
                <path
                  d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829V0.5L16.8829 16.8829H9.00693L13.8829 23.5L10.5 24L5.65376 12.3673Z"
                  fill="currentColor"
                  stroke="#ffffff"
                  strokeWidth="1.2"
                />
              </svg>

              {/* Translucent 50% Liquid Glass User Name Badge */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '3px 9px',
                  borderRadius: '12px',
                  fontSize: '10px',
                  fontWeight: 700,
                  color: '#ffffff',
                  background: `linear-gradient(135deg, ${user.color}ee, ${user.color}99)`,
                  border: '1px solid rgba(255, 255, 255, 0.35)',
                  boxShadow: `0 4px 14px ${user.color}50`,
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  whiteSpace: 'nowrap'
                }}
              >
                <span 
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#ffffff',
                    boxShadow: '0 0 6px rgba(255, 255, 255, 0.9)'
                  }}
                />
                <span>{user.name}</span>
                {user.location && <span style={{ opacity: 0.75, fontWeight: 500, fontSize: '9px' }}>· {user.location}</span>}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Clean Liquid Glass Cursor Customization Modal */}
      <AnimatePresence>
        {isCustomizerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0, 0, 0, 0.65)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)'
            }}
            onClick={() => setIsCustomizerOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 14 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 14 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '380px',
                padding: '24px',
                borderRadius: '22px',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.04) 100%), rgba(16, 20, 30, 0.75)',
                backdropFilter: 'blur(40px) saturate(210%)',
                WebkitBackdropFilter: 'blur(40px) saturate(210%)',
                border: '1px solid rgba(255, 255, 255, 0.28)',
                boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.7), inset 0 1px 1px rgba(255, 255, 255, 0.4)',
                color: '#ffffff',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif'
              }}
            >
              {/* Modal Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 800, letterSpacing: '-0.3px', margin: 0 }}>
                  🎨 Customize Live Cursor
                </h3>
                <button
                  onClick={() => setIsCustomizerOpen(false)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Name Input */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, opacity: 0.75, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Display Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  style={{
                    width: '100%',
                    padding: '9px 14px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.12)',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    color: '#ffffff',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Location Input */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, opacity: 0.75, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  City / Role Tag
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. NYC or Designer"
                  style={{
                    width: '100%',
                    padding: '9px 14px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.12)',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    color: '#ffffff',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Color Swatches */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, opacity: 0.75, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Cursor Accent Color
                </label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {COLOR_OPTIONS.map(c => (
                    <button
                      key={c.value}
                      onClick={() => setColor(c.value)}
                      title={c.name}
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        background: c.value,
                        border: color === c.value ? '2.5px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.3)',
                        boxShadow: color === c.value ? `0 0 12px ${c.value}` : 'none',
                        cursor: 'pointer'
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Live Badge Preview */}
              <div style={{ marginBottom: '20px', padding: '14px', background: 'rgba(0, 0, 0, 0.35)', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '10px', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Badge Preview:</span>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '3px 9px',
                    borderRadius: '12px',
                    fontSize: '10px',
                    fontWeight: 700,
                    color: '#ffffff',
                    background: `linear-gradient(135deg, ${color}ee, ${color}99)`,
                    border: '1px solid rgba(255, 255, 255, 0.35)',
                    boxShadow: `0 4px 14px ${color}50`
                  }}
                >
                  <span 
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: '#ffffff',
                      boxShadow: '0 0 6px rgba(255, 255, 255, 0.9)'
                    }}
                  />
                  <span>{name || 'Visitor'}</span>
                  <span style={{ opacity: 0.75, fontWeight: 500, fontSize: '9px' }}>· {location || 'Studio'}</span>
                </div>
              </div>

              {/* Save Button */}
              <button
                onClick={() => saveCustomization(name, location, color)}
                style={{
                  width: '100%',
                  padding: '11px',
                  borderRadius: '12px',
                  background: '#3b82f6',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '13px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 6px 16px rgba(59, 130, 246, 0.4)'
                }}
              >
                Save & Broadcast Identity
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LiveUserCursors;
