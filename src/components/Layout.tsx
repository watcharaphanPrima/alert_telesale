import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LogOut, Minimize2, Maximize2, GripHorizontal, Minus, Square, X } from 'lucide-react';
import { getCurrentWindow, LogicalSize } from '@tauri-apps/api/window';
import { getVersion } from '@tauri-apps/api/app';

export function Layout({ children, title }: { children: React.ReactNode, title: string }) {
  const navigate = useNavigate();
  const { teamId } = useParams();
  const [isMiniMode, setIsMiniMode] = useState(false);
  const [appVersion, setAppVersion] = useState('');

  useEffect(() => {
    getVersion().then(setAppVersion).catch(console.error);
  }, []);
  
  // Format team ID back to readable for display (e.g. team-alpha -> Team Alpha)
  const displayTeam = teamId ? teamId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : '';

  const toggleMiniMode = async () => {
    try {
      const appWindow = getCurrentWindow();
      if (isMiniMode) {
        // Restore to full size
        setIsMiniMode(false);
        document.body.classList.remove('mini-mode');
        await appWindow.setAlwaysOnTop(false);
        await appWindow.setSize(new LogicalSize(800, 600));
        await appWindow.center();
      } else {
        // Enter Widget Mode
        setIsMiniMode(true);
        document.body.classList.add('mini-mode');
        
        // Must unmaximize first, otherwise setSize has no effect on Windows
        const maximized = await appWindow.isMaximized();
        if (maximized) {
          await appWindow.unmaximize();
        }
        
        await appWindow.setAlwaysOnTop(true);
        await appWindow.setSize(new LogicalSize(320, 480));
      }
    } catch (e) {
      console.error("Failed to toggle mini mode", e);
    }
  };

  return (
    <>
      <div className="ambient-glow glow-primary"></div>
      <div className="ambient-glow glow-danger"></div>
      <div className="ambient-glow glow-accent"></div>
      <div className="custom-titlebar">
        <div 
          className="titlebar-drag-region" 
          onPointerDown={(e) => {
            if (e.button === 0) getCurrentWindow().startDragging();
          }}
        >
          {isMiniMode && <GripHorizontal size={14} style={{ marginRight: 8, opacity: 0.5 }} />}
          Alert Telesale {appVersion && <span style={{ opacity: 0.5, marginLeft: 6, fontWeight: 'normal' }}>v{appVersion}</span>}
        </div>
        <div className="titlebar-controls">
          <button className="titlebar-button" onClick={toggleMiniMode} title={isMiniMode ? "ขยายหน้าต่าง" : "ย่อเป็น Widget"}>
            {isMiniMode ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
          </button>
          {!isMiniMode && (
            <>
              <button className="titlebar-button" onClick={() => getCurrentWindow().minimize()} title="ย่อหน้าต่างลง Taskbar">
                <Minus size={16} />
              </button>
              <button className="titlebar-button" onClick={() => getCurrentWindow().toggleMaximize()} title="ขยายเต็มจอ">
                <Square size={12} />
              </button>
            </>
          )}
          <button className="titlebar-button close" onClick={() => getCurrentWindow().close()} title="ปิดโปรแกรม">
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="app-container" style={{ position: 'relative', zIndex: 10 }}>
        {!isMiniMode && (
          <header className="app-header glass-panel hide-in-mini" style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '1rem 1.5rem',
            marginBottom: '2rem'
          }}>
            <div>
              <h1 style={{ fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center' }}>
                {title}
              </h1>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: 'var(--primary)', opacity: 0.8 }}>
                ทีม: {displayTeam}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                className="btn-icon" 
                onClick={() => {
                  localStorage.removeItem('autoLoginSession');
                  navigate('/');
                }} 
                title="เปลี่ยนทีม / ตำแหน่ง"
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <LogOut size={20} />
              </button>
            </div>
          </header>
        )}
        <main className="app-content">
          {children}
        </main>
      </div>
    </>
  );
}
