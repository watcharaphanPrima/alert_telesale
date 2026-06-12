import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, ShieldAlert } from 'lucide-react';
import { useNotification } from '../contexts/NotificationContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import './RoleSelection.css';

export function RoleSelection() {
  const navigate = useNavigate();
  const { notify } = useNotification();
  const [teamName, setTeamName] = useLocalStorage<string>('lastTeam', '');
  const [session, setSession] = useLocalStorage<{teamId: string, role: string} | null>('autoLoginSession', null);

  useEffect(() => {
    // If a session exists, auto-login by redirecting immediately
    if (session && session.teamId && session.role) {
      navigate(`/${session.teamId}/${session.role}`, { replace: true });
    }
  }, [session, navigate]);

  const formatTeamId = (name: string) => {
    return name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9ก-๙-]/g, '');
  };

  const handleSelectRole = (role: 'agent' | 'manager', e?: React.FormEvent) => {
    if (e) e.preventDefault(); // Prevent default form submission if triggered via Enter key
    
    if (!teamName.trim()) {
      notify('ข้อผิดพลาด', 'กรุณาระบุชื่อทีมก่อนเข้าสู่ระบบ', 'danger');
      return;
    }
    const teamId = formatTeamId(teamName);
    if (!teamId) {
      notify('ข้อผิดพลาด', 'ชื่อทีมไม่ถูกต้อง', 'danger');
      return;
    }
    setTeamName(teamName);
    setSession({ teamId, role });
    navigate(`/${teamId}/${role}`);
  };

  return (
    <>
      <div className="custom-titlebar">
        <div 
          className="titlebar-drag-region" 
          onPointerDown={(e) => {
            if (e.button === 0) import('@tauri-apps/api/window').then(({ getCurrentWindow }) => getCurrentWindow().startDragging());
          }}
        >
          Alert Telesale
        </div>
        <div className="titlebar-controls">
          <button className="titlebar-button" onClick={() => import('@tauri-apps/api/window').then(({ getCurrentWindow }) => getCurrentWindow().minimize())} title="ย่อหน้าต่าง">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </button>
          <button className="titlebar-button close" onClick={() => import('@tauri-apps/api/window').then(({ getCurrentWindow }) => getCurrentWindow().close())} title="ปิดโปรแกรม">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
      </div>

      <div className="ambient-glow glow-primary"></div>
      <div className="ambient-glow glow-danger"></div>
      <div className="ambient-glow glow-accent"></div>
      
      <div className="role-selection-wrapper animate-fade-in" style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-xl, 3rem)',
        width: '100%',
        maxWidth: '480px',
        margin: '0 auto',
        zIndex: 10,
        position: 'relative'
      }}>
        
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)', margin: '0 0 0.5rem 0', textWrap: 'balance', letterSpacing: '-0.02em', fontWeight: 700 }}>
            Alert Telesale
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', margin: 0, fontWeight: 400 }}>
            เชื่อมต่อกับเครือข่ายทีมของคุณแบบเรียลไทม์
          </p>
        </div>
        
        <div className="glass-panel" style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 'var(--space-lg, 2rem)', 
          padding: 'var(--space-lg, 2.5rem)',
          background: 'var(--bg-surface)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px var(--glass-border)'
        }}>
          
          <form 
            onSubmit={(e) => handleSelectRole('agent', e)}
            style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
          >
            <label htmlFor="teamNameInput" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
              1. ระบุชื่อทีมของคุณ
            </label>
            <input 
              id="teamNameInput"
              className="role-input"
              type="text" 
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="เช่น Alpha, ทีม A, ฝ่ายขาย 2"
              style={{
                width: '100%',
                padding: '1rem 1.25rem',
                borderRadius: 'var(--radius-pill)',
                border: '1px solid var(--glass-border)',
                background: 'var(--bg-base)',
                color: 'var(--text-main)',
                fontSize: '1.1rem',
                outline: 'none',
              }}
            />
            {/* Hidden submit button to allow Enter key to submit form */}
            <button type="submit" style={{ display: 'none' }} aria-hidden="true">Submit</button>
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label id="roleSelectionLabel" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
              2. เลือกตำแหน่งของคุณ
            </label>
            
            <div 
              role="group" 
              aria-labelledby="roleSelectionLabel"
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}
            >
              <button 
                className="role-card-btn"
                onClick={() => handleSelectRole('agent')}
                aria-label="เข้าสู่ระบบในฐานะพนักงานเพื่อขอความช่วยเหลือ"
              >
                <div style={{ padding: '12px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--primary)', marginBottom: '4px' }}>
                  <Users size={28} strokeWidth={2.5} />
                </div>
                <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>พนักงาน (Agent)</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ขอความช่วยเหลือ</span>
              </button>

              <button 
                className="role-card-btn"
                onClick={() => handleSelectRole('manager')}
                aria-label="เข้าสู่ระบบในฐานะหัวหน้าทีมเพื่อดูการแจ้งเตือน"
              >
                <div style={{ padding: '12px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', marginBottom: '4px' }}>
                  <ShieldAlert size={28} strokeWidth={2.5} />
                </div>
                <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>หัวหน้าทีม (Manager)</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ดูการแจ้งเตือน</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
