import { useState, useEffect, useRef } from 'react';
import { ref, onValue, update, query, orderByChild, equalTo } from 'firebase/database';
import { db } from '../lib/firebase';
import { ShieldAlert, Users, Clock, CheckCircle, Volume2 } from 'lucide-react';
import { useParams } from 'react-router-dom';
import './ManagerView.css';
import { useNotification } from '../contexts/NotificationContext';

interface Alert {
  id: string;
  agentName: string;
  status: 'active' | 'resolved';
  timestamp: number;
}

const playAlertSound = () => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    // Siren pattern
    const playBeep = (freq: number, startTime: number) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.1, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);
      osc.start(startTime);
      osc.stop(startTime + 0.3);
    };
    
    const now = audioCtx.currentTime;
    playBeep(880, now);        // High beep
    playBeep(659.25, now + 0.3); // Low beep
    playBeep(880, now + 0.6);    // High beep
    playBeep(659.25, now + 0.9); // Low beep
  } catch (e) {
    console.warn("Audio play failed (maybe autoplay blocked):", e);
  }
};

export function ManagerView() {
  const { teamId } = useParams();
  const { notify } = useNotification();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [activeCount, setActiveCount] = useState(0);
  
  const isInitialMount = useRef(true);
  const seenAlertIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!teamId) return;
    const alertsRef = query(ref(db, `teams/${teamId}/alerts`), orderByChild('status'), equalTo('active'));
    
    const unsubscribe = onValue(alertsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const parsedAlerts: Alert[] = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        
        // Sort by newest first
        parsedAlerts.sort((a, b) => b.timestamp - a.timestamp);
        
        // Check for completely new alerts
        const newAlerts = parsedAlerts.filter(a => !seenAlertIds.current.has(a.id));
        
        if (!isInitialMount.current && newAlerts.length > 0) {
          // Play sound
          playAlertSound();
          
          // OS Notification
          if (Notification.permission === 'granted') {
            new Notification('ระบบแจ้งเตือน Telesales', {
              body: `${newAlerts[0].agentName} กำลังขอความช่วยเหลือ!`,
            });
          }
          
          // App Toast Notification
          notify('SOS Alert', `${newAlerts[0].agentName} ต้องการความช่วยเหลือด่วน!`, 'danger');
        }
        
        // Mark all as seen
        parsedAlerts.forEach(a => seenAlertIds.current.add(a.id));
        
        setAlerts(parsedAlerts);
        setActiveCount(parsedAlerts.length);
      } else {
        setAlerts([]);
        setActiveCount(0);
      }
      
      isInitialMount.current = false;
    });

    // Request notification permission on mount
    if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }

    return () => unsubscribe();
  }, [teamId, notify]);

  const handleResolve = async (id: string) => {
    if (!teamId) return;
    try {
      const alertRef = ref(db, `teams/${teamId}/alerts/${id}`);
      await update(alertRef, { status: 'resolved' });
    } catch (error) {
      console.error("Failed to resolve alert", error);
    }
  };

  return (
    <div className="manager-view animate-fade-in">
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }}>
            <ShieldAlert size={24} />
          </div>
          <div className="stat-info" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
            <div>
              <h3>รอความช่วยเหลือ (Active)</h3>
              <p style={{ color: activeCount > 0 ? 'var(--danger)' : 'var(--text-main)' }}>{activeCount}</p>
            </div>
            <button 
              onClick={playAlertSound}
              title="ทดสอบเสียงเตือน"
              style={{
                background: 'var(--bg-base)',
                border: '1px solid var(--glass-border)',
                borderRadius: '8px',
                padding: '8px',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-main)'}
              onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              <Volume2 size={18} />
            </button>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <Users size={24} />
          </div>
          <div className="stat-info">
            <h3>สถานะทีม</h3>
            <p>ออนไลน์</p>
          </div>
        </div>
      </div>

      <div className="alerts-container glass-panel" style={{ padding: 'var(--space-md, 1.5rem)', marginTop: 'var(--space-md, 1.5rem)' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', padding: '0 0.5rem', fontWeight: 700 }}>คำขอความช่วยเหลือล่าสุด</h2>
        
        {alerts.length === 0 ? (
          <div className="empty-state">
            <CheckCircle size={48} color="var(--success)" opacity={0.5} />
            <p>ปกติ! ไม่มีคำขอความช่วยเหลือในขณะนี้</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {alerts.map((alert) => (
              <div key={alert.id} className="alert-item">
                <div className="alert-info">
                  <h4>{alert.agentName}</h4>
                  <p className="flex items-center gap-1">
                    <Clock size={14} />
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </p>
                </div>
                <div className="alert-actions">
                  <button className="btn-resolve" onClick={() => handleResolve(alert.id)}>
                    ช่วยเหลือแล้ว
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
