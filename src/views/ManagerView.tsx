import { useState, useEffect, useRef } from 'react';
import { ref, onValue, update, query, orderByChild, equalTo } from 'firebase/database';
import { db } from '../lib/firebase';
import { ShieldAlert, Clock, CheckCircle, Volume2, Settings, VolumeX } from 'lucide-react';
import { useParams } from 'react-router-dom';
import './ManagerView.css';
import { useNotification } from '../contexts/NotificationContext';
import { useAudioSettings } from '../hooks/useAudioSettings';
import { SoundEngine } from '../lib/SoundEngine';

interface Alert {
  id: string;
  agentName: string;
  status: 'active' | 'resolved';
  timestamp: number;
}

export function ManagerView() {
  const { teamId } = useParams();
  const { notify } = useNotification();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [activeCount, setActiveCount] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  
  // Audio Settings
  const { volume, setVolume, isMuted, setIsMuted, soundType, setSoundType, enableTTS, setEnableTTS } = useAudioSettings();
  
  const isInitialMount = useRef(true);
  const seenAlertIds = useRef<Set<string>>(new Set());

  // Handle new incoming alerts
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
          // Play sound and/or TTS
          if (!isMuted) {
            SoundEngine.playSound(soundType, volume);
            if (enableTTS) {
              setTimeout(() => {
                SoundEngine.speak(`คุณ${newAlerts[0].agentName} ต้องการความช่วยเหลือ`, volume);
              }, 1500); // Wait for sound to play first
            }
          }
          
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

    if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }

    return () => unsubscribe();
  }, [teamId, notify, isMuted, volume, soundType, enableTTS]);

  // Escalation Loop: Remind every 30 seconds if there are unresolved alerts
  useEffect(() => {
    const escalationInterval = setInterval(() => {
      if (alerts.length > 0 && !isMuted) {
        const oldestAlert = alerts[alerts.length - 1]; // sorted newest first, so last is oldest
        const age = Date.now() - oldestAlert.timestamp;
        
        if (age > 30000) { // Older than 30s
          SoundEngine.playSound(soundType, volume);
          if (enableTTS) {
             setTimeout(() => {
                SoundEngine.speak(`มีคำขอความช่วยเหลือค้างอยู่ กรุณาตรวจสอบ`, volume);
             }, 1500);
          }
        }
      }
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(escalationInterval);
  }, [alerts, isMuted, volume, soundType, enableTTS]);

  const handleResolve = async (id: string) => {
    if (!teamId) return;
    try {
      const alertRef = ref(db, `teams/${teamId}/alerts/${id}`);
      await update(alertRef, { status: 'resolved' });
    } catch (error) {
      console.error("Failed to resolve alert", error);
    }
  };

  const playTestSound = () => {
    if (isMuted) return;
    SoundEngine.playSound(soundType, volume);
    if (enableTTS) {
       setTimeout(() => {
          SoundEngine.speak("ทดสอบระบบเสียงเรียบร้อย", volume);
       }, 1500);
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
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                onClick={() => setIsMuted(!isMuted)}
                title={isMuted ? "เปิดเสียง" : "ปิดเสียง"}
                style={{
                  background: isMuted ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-base)',
                  border: `1px solid ${isMuted ? 'rgba(239, 68, 68, 0.3)' : 'var(--glass-border)'}`,
                  borderRadius: '8px',
                  padding: '8px',
                  cursor: 'pointer',
                  color: isMuted ? 'var(--danger)' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
              >
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              <button 
                onClick={() => setShowSettings(!showSettings)}
                title="ตั้งค่าเสียงแจ้งเตือน"
                style={{
                  background: showSettings ? 'rgba(59, 130, 246, 0.1)' : 'var(--bg-base)',
                  border: `1px solid ${showSettings ? 'rgba(59, 130, 246, 0.3)' : 'var(--glass-border)'}`,
                  borderRadius: '8px',
                  padding: '8px',
                  cursor: 'pointer',
                  color: showSettings ? 'var(--primary)' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
              >
                <Settings size={18} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Settings Panel Slide-out */}
        {showSettings && (
          <div className="stat-card" style={{ gridColumn: '1 / -1', flexDirection: 'column', alignItems: 'stretch', gap: '1.5rem', animation: 'slide-in-blur 0.3s ease forwards' }}>
            <h3 style={{ fontSize: '1.1rem', margin: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              ตั้งค่าระบบแจ้งเตือน
              <button className="btn-primary" onClick={playTestSound} style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                ทดสอบเสียง
              </button>
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>ระดับความดัง ({Math.round(volume * 100)}%)</label>
                <input 
                  type="range" 
                  min="0" max="1" step="0.05" 
                  value={volume} 
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--primary)' }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>เสียงเตือน</label>
                <select 
                  value={soundType} 
                  onChange={(e) => setSoundType(e.target.value as any)}
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem', 
                    background: 'var(--bg-base)', 
                    color: 'var(--text-main)', 
                    border: '1px solid var(--glass-border)',
                    borderRadius: '8px',
                    outline: 'none'
                  }}
                >
                  <option value="bell">กระดิ่ง (Bell)</option>
                  <option value="chime">เตือนด่วน (Chime)</option>
                  <option value="siren">ไซเรนฉุกเฉิน (Siren)</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
                <input 
                  type="checkbox" 
                  id="tts-toggle"
                  checked={enableTTS} 
                  onChange={(e) => setEnableTTS(e.target.checked)}
                  style={{ width: '1.2rem', height: '1.2rem', accentColor: 'var(--primary)' }}
                />
                <label htmlFor="tts-toggle" style={{ color: 'var(--text-main)', cursor: 'pointer' }}>
                  ให้คอมพิวเตอร์พูดชื่อผู้เรียก (Text-to-Speech)
                </label>
              </div>
            </div>
          </div>
        )}
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
