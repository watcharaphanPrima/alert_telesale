import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LogOut } from 'lucide-react';

export function Layout({ children, title }: { children: React.ReactNode, title: string }) {
  const navigate = useNavigate();
  const { teamId } = useParams();
  
  // Format team ID back to readable for display (e.g. team-alpha -> Team Alpha)
  const displayTeam = teamId ? teamId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : '';

  return (
    <>
      <div className="ambient-glow glow-primary"></div>
      <div className="ambient-glow glow-danger"></div>
      <div className="ambient-glow glow-accent"></div>
      <div className="app-container" style={{ position: 'relative', zIndex: 10 }}>
        <header className="app-header glass-panel" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          padding: '1rem 1.5rem',
          marginBottom: '2rem'
        }}>
          <div>
            <h1 style={{ fontSize: '1.25rem', margin: 0 }}>{title}</h1>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: 'var(--primary)', opacity: 0.8 }}>
              ทีม: {displayTeam}
            </p>
          </div>
          <button 
            className="btn-icon" 
            onClick={() => navigate('/')} 
            title="เปลี่ยนทีม / ตำแหน่ง"
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <LogOut size={20} />
          </button>
        </header>
        <main className="app-content">
          {children}
        </main>
      </div>
    </>
  );
}
