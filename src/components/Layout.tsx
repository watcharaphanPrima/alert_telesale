import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LogOut, Minimize2, Maximize2, GripHorizontal } from 'lucide-react';
import { getCurrentWindow, LogicalSize, LogicalPosition, currentMonitor } from '@tauri-apps/api/window';
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
        await appWindow.setDecorations(true);
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
        
        await appWindow.setDecorations(false);
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
      <div className="app-container" style={{ position: 'relative', zIndex: 10 }}>
        {isMiniMode ? (
          <header 
            className="app-header glass-panel" 
            data-tauri-drag-region
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '0.5rem 1rem',
              cursor: 'grab',
              userSelect: 'none',
              background: 'rgba(0,0,0,0.2)'
            }}
          >
            <div data-tauri-drag-region style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
              <GripHorizontal size={18} data-tauri-drag-region />
              <span data-tauri-drag-region style={{ fontSize: '0.75rem', fontWeight: 600 }}>Telesale Widget</span>
            </div>
            <button 
              className="btn-icon" 
              onClick={toggleMiniMode} 
              title="ขยายหน้าต่าง"
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}
            >
              <Maximize2 size={16} />
            </button>
          </header>
        ) : (
          <header className="app-header glass-panel hide-in-mini" data-tauri-drag-region style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '1rem 1.5rem',
            marginBottom: '2rem'
          }}>
            <div data-tauri-drag-region>
              <h1 style={{ fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center' }}>
                {title}
                {appVersion && <span style={{ fontSize: '0.7rem', color: 'var(--text-muted, #94a3b8)', marginLeft: '10px', fontWeight: 'normal', backgroundColor: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px' }}>v{appVersion}</span>}
              </h1>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: 'var(--primary)', opacity: 0.8 }}>
                ทีม: {displayTeam}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                className="btn-icon" 
                onClick={toggleMiniMode} 
                title="ย่อเป็น Widget"
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <Minimize2 size={18} />
              </button>
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
