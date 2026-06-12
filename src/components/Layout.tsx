import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { getCurrentWindow, LogicalSize } from '@tauri-apps/api/window';
import { getVersion } from '@tauri-apps/api/app';
import { CustomTitlebar } from './CustomTitlebar';

export function Layout({ children, title }: { children: React.ReactNode, title: string }) {
  const navigate = useNavigate();
  const { teamId } = useParams();
  const [isMiniMode, setIsMiniMode] = useState(false);
  const [appVersion, setAppVersion] = useState('');

  useEffect(() => {
    getVersion().then(setAppVersion).catch(console.error);
    if (document.body.classList.contains('mini-mode')) {
      setIsMiniMode(true);
    }
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
        try { await appWindow.setAlwaysOnTop(false); } catch(e){}
        try { await appWindow.setSize(new LogicalSize(800, 600)); } catch(e){}
        try { await appWindow.center(); } catch(e){}
      } else {
        // Enter Widget Mode
        setIsMiniMode(true);
        document.body.classList.add('mini-mode');
        
        // Must unmaximize first, otherwise setSize has no effect on Windows
        try {
          const maximized = await appWindow.isMaximized();
          if (maximized) {
            await appWindow.unmaximize();
          }
        } catch(e) {}
        
        try { await appWindow.setAlwaysOnTop(true); } catch(e){}
        try { await appWindow.setSize(new LogicalSize(320, 480)); } catch(e){}
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
      <CustomTitlebar 
        appVersion={appVersion}
        isMiniMode={isMiniMode}
        onToggleMiniMode={toggleMiniMode}
        showWidgetToggle={true}
      />

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
