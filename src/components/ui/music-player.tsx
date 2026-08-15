import React, { useState, useRef, useEffect, useCallback } from 'react';

interface MusicPlayerProps {
  albumArt: string;
  songTitle: string;
  artistName: string;
  audioSrc: string;
}

function formatTime(seconds: number): string {
  if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

const SPOTIFY_GREEN = '#1DB954';

export const MusicPlayer: React.FC<MusicPlayerProps> = ({
  albumArt,
  songTitle,
  artistName,
  audioSrc,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTimeUpdate = () => { if (!isDragging) setCurrentTime(audio.currentTime); };
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => setIsPlaying(false);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
    };
  }, [isDragging]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) { audio.pause(); setIsPlaying(false); }
    else { audio.play().then(() => setIsPlaying(true)).catch(() => {}); }
  }, [isPlaying]);

  const seek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    const bar = progressRef.current;
    if (!audio || !bar || !duration) return;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = ratio * duration;
    setCurrentTime(audio.currentTime);
  }, [duration]);

  const skip = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, Math.min(duration, audio.currentTime + seconds));
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div style={{
      width: '260px',
      background: 'linear-gradient(160deg, #2a1f5e 0%, #1a1040 60%, #150d38 100%)',
      borderRadius: '16px',
      border: '1px solid rgba(255,255,255,0.08)',
      boxShadow: '0 20px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)',
      overflow: 'hidden',
      fontFamily: "'Circular', 'Helvetica Neue', Arial, sans-serif",
      userSelect: 'none',
    }}>
      <audio ref={audioRef} src={audioSrc} preload="metadata" />

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 16px 10px',
      }}>
        {/* Spotify logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill={SPOTIFY_GREEN}>
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
          </svg>
          <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '2px', color: SPOTIFY_GREEN, textTransform: 'uppercase' }}>
            Now Playing
          </span>
        </div>
        {/* Equalizer bars animation */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '16px' }}>
          {[0.6, 1, 0.7, 0.9, 0.5].map((h, i) => (
            <div key={i} style={{
              width: '3px',
              height: isPlaying ? `${h * 16}px` : '4px',
              background: SPOTIFY_GREEN,
              borderRadius: '2px',
              transition: 'height 0.3s ease',
              animation: isPlaying ? `eqBounce${i} ${0.5 + i * 0.1}s ease-in-out infinite alternate` : 'none',
            }} />
          ))}
        </div>
      </div>

      {/* Album Art */}
      <div style={{ padding: '4px 16px 12px' }}>
        <div style={{
          width: '100%',
          aspectRatio: '1',
          borderRadius: '8px',
          backgroundImage: `url(${albumArt})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        }} />
      </div>

      {/* Song Info */}
      <div style={{ padding: '0 16px 10px' }}>
        <div style={{
          fontSize: '15px', fontWeight: 700, color: '#fff',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          marginBottom: '2px',
        }}>
          {songTitle}
        </div>
        <div style={{
          fontSize: '12px', color: 'rgba(255,255,255,0.5)',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {artistName}
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ padding: '0 16px' }}>
        <div
          ref={progressRef}
          onClick={seek}
          style={{
            width: '100%', height: '3px',
            background: 'rgba(255,255,255,0.15)',
            borderRadius: '99px', cursor: 'pointer',
            position: 'relative',
          }}
        >
          <div style={{
            height: '100%', borderRadius: '99px',
            background: SPOTIFY_GREEN,
            width: `${progress}%`,
            transition: isDragging ? 'none' : 'width 0.25s linear',
            position: 'relative',
          }}>
            {/* Playhead dot */}
            <div style={{
              position: 'absolute', right: '-5px', top: '50%',
              transform: 'translateY(-50%)',
              width: '10px', height: '10px', borderRadius: '50%',
              background: '#fff',
              opacity: progress > 0 ? 1 : 0,
              boxShadow: '0 0 4px rgba(0,0,0,0.4)',
            }} />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px' }}>
          <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', fontVariantNumeric: 'tabular-nums' }}>
            {formatTime(currentTime)}
          </span>
          <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', fontVariantNumeric: 'tabular-nums' }}>
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: '24px', padding: '8px 16px 18px',
      }}>
        {/* Previous */}
        <button onClick={() => skip(-15)} style={iconBtn}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="rgba(255,255,255,0.8)">
            <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/>
          </svg>
        </button>

        {/* Play / Pause */}
        <button
          onClick={togglePlay}
          style={{
            width: '48px', height: '48px', borderRadius: '50%',
            background: SPOTIFY_GREEN,
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 4px 20px rgba(29,185,84,0.5)`,
            transition: 'transform 0.12s ease, box-shadow 0.12s ease',
            flexShrink: 0,
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.06)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
          onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.93)'; }}
          onMouseUp={e => { e.currentTarget.style.transform = 'scale(1.06)'; }}
        >
          {isPlaying ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="black">
              <rect x="6" y="4" width="4" height="16" rx="1"/>
              <rect x="14" y="4" width="4" height="16" rx="1"/>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="black" style={{ marginLeft: '2px' }}>
              <polygon points="5,3 19,12 5,21"/>
            </svg>
          )}
        </button>

        {/* Next */}
        <button onClick={() => skip(15)} style={iconBtn}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="rgba(255,255,255,0.8)">
            <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
          </svg>
        </button>
      </div>

      <style>{`
        @keyframes eqBounce0 { from { height: 4px; } to { height: 10px; } }
        @keyframes eqBounce1 { from { height: 6px; } to { height: 16px; } }
        @keyframes eqBounce2 { from { height: 5px; } to { height: 11px; } }
        @keyframes eqBounce3 { from { height: 7px; } to { height: 14px; } }
        @keyframes eqBounce4 { from { height: 4px; } to { height: 8px; } }
      `}</style>
    </div>
  );
};

const iconBtn: React.CSSProperties = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '6px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'opacity 0.15s',
};

export default MusicPlayer;
