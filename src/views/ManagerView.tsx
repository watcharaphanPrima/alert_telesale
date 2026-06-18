import { useState, useEffect, useRef } from 'react';
import { ref, update } from 'firebase/database';
import { db } from '../lib/firebase';
import { ShieldAlert, Volume2, Settings, VolumeX } from 'lucide-react';
import { useParams } from 'react-router-dom';
import './ManagerView.css';
import { useNotification } from '../contexts/NotificationContext';
import { useAudioSettings } from '../hooks/useAudioSettings';
import { SoundEngine } from '../lib/SoundEngine';
import { useActiveAlerts } from '../hooks/useActiveAlerts';
import { useEscalationTimer } from '../hooks/useEscalationTimer';
import { useOnlineAgents } from '../hooks/useOnlineAgents';
import { SettingsPanel } from '../components/SettingsPanel';
import { AlertList } from '../components/AlertList';
import { OnlineAgentsList } from '../components/OnlineAgentsList';

export function ManagerView() {
  const { teamId } = useParams();
  const { notify } = useNotification();
  
  // Custom Hooks
  const { alerts, activeCount } = useActiveAlerts(teamId);
  const { onlineAgents } = useOnlineAgents(teamId);
  const audioSettings = useAudioSettings();
  const { volume, isMuted, setIsMuted, soundType, enableTTS } = audioSettings;
  
  const [showSettings, setShowSettings] = useState(false);
  const isInitialMount = useRef(true);
  const seenAlertIds = useRef<Set<string>>(new Set());

  // Setup escalation timer hook
  useEscalationTimer(alerts, audioSettings);

  // Handle playing notification for NEW alerts
  useEffect(() => {
    if (!isInitialMount.current && alerts.length > 0) {
      const newAlerts = alerts.filter(a => !seenAlertIds.current.has(a.id));
      
      if (newAlerts.length > 0) {
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
    }
    
    // Mark all current alerts as seen
    alerts.forEach(a => seenAlertIds.current.add(a.id));
    isInitialMount.current = false;
  }, [alerts, isMuted, volume, soundType, enableTTS, notify]);

  useEffect(() => {
    if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  }, []);

  const handleResolve = async (id: string) => {
    if (!teamId) return;
    try {
      const alertRef = ref(db, `teams/${teamId}/alerts/${id}`);
      await update(alertRef, { status: 'resolved' });
    } catch (error) {
      console.error("Failed to resolve alert", error);
      notify('ข้อผิดพลาด', 'ไม่สามารถตอบรับความช่วยเหลือได้ โปรดลองอีกครั้ง', 'danger');
    }
  };

  return (
    <div className="manager-view animate-fade-in">
      <div className="stats-container">
        <div className="stat-card" style={{ gridColumn: '1 / -1' }}>
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
                className={`icon-button ${isMuted ? 'danger-muted' : ''}`}
              >
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              <button 
                onClick={() => setShowSettings(!showSettings)}
                title="ตั้งค่าเสียงแจ้งเตือน"
                className={`icon-button ${showSettings ? 'primary-active' : ''}`}
              >
                <Settings size={18} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Settings Panel Component */}
        {showSettings && (
          <SettingsPanel {...audioSettings} />
        )}
      </div>

      <div className="manager-content-grid">
        <div className="alerts-container glass-panel" style={{ padding: 'var(--space-md, 1.5rem)' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', padding: '0 0.5rem', fontWeight: 700 }}>คำขอความช่วยเหลือล่าสุด</h2>
          <AlertList alerts={alerts} onResolve={handleResolve} />
        </div>
        
        <OnlineAgentsList agents={onlineAgents} teamId={teamId} />
      </div>
    </div>
  );
}
