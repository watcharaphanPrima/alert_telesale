import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { AgentView } from './views/AgentView';
import { ManagerView } from './views/ManagerView';
import { LogOut, Users, ShieldAlert } from 'lucide-react';
import './App.css'; 

function RoleSelection() {
  const navigate = useNavigate();
  const [teamName, setTeamName] = useState(() => localStorage.getItem('lastTeam') || '');

  const formatTeamId = (name: string) => {
    return name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  };

  const handleSelectRole = (role: 'agent' | 'manager') => {
    if (!teamName.trim()) {
      alert('กรุณาระบุชื่อทีมก่อนเข้าสู่ระบบ');
      return;
    }
    const teamId = formatTeamId(teamName);
    if (!teamId) {
      alert('ชื่อทีมไม่ถูกต้อง');
      return;
    }
    localStorage.setItem('lastTeam', teamName);
    navigate(`/${teamId}/${role}`);
  };

  return (
    <>
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
            ระบบขอความช่วยเหลือ Telesales
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
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
              1. ระบุชื่อทีมของคุณ
            </label>
            <input 
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
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
              2. เลือกตำแหน่งของคุณ
            </label>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <button 
                className="role-card-btn"
                onClick={() => handleSelectRole('agent')}
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

function Layout({ children, title }: { children: React.ReactNode, title: string }) {
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <div className="app-container center-content">
            <RoleSelection />
          </div>
        } />
        <Route path="/:teamId/agent" element={<Layout title="ระบบพนักงาน (Agent)"><AgentView /></Layout>} />
        <Route path="/:teamId/manager" element={<Layout title="ระบบจัดการ (Manager)"><ManagerView /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
