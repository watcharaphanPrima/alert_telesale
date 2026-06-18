import { useState, useEffect } from 'react';
import { ref, push, serverTimestamp } from 'firebase/database';
import { db } from '../lib/firebase';
import { AlertCircle, WifiOff } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useNotification } from '../contexts/NotificationContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import './AgentView.css';

export function AgentView() {
  const { teamId } = useParams();
  const { notify } = useNotification();
  const [agentName, setAgentName] = useLocalStorage<string>('agentName', '');
  const [isSending, setIsSending] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleSOS = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!agentName.trim()) {
      notify("ข้อผิดพลาด", "กรุณาระบุชื่อของคุณก่อน!", "danger");
      return;
    }
    if (!teamId) {
      notify("ข้อผิดพลาด", "ไม่พบข้อมูลทีม!", "danger");
      return;
    }

    setIsSending(true);

    try {
      const alertsRef = ref(db, `teams/${teamId}/alerts`);
      await push(alertsRef, {
        agentName,
        status: 'active',
        timestamp: serverTimestamp(),
      });
      
      if (isOffline) {
        notify('ออฟไลน์ (Offline)', 'คำขอถูกเก็บไว้แล้ว และจะส่งอัตโนมัติเมื่อต่ออินเทอร์เน็ตได้', 'info');
      } else {
        notify('SOS Sent', 'ส่งคำขอความช่วยเหลือสำเร็จแล้ว!', 'success');
      }
    } catch (error) {
      console.error("Failed to send SOS:", error);
      notify('Error', 'ส่งคำขอไม่สำเร็จ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต', 'danger');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form className="agent-view animate-fade-in" onSubmit={handleSOS}>
      
      {isOffline && (
        <div style={{ 
          background: 'rgba(239, 68, 68, 0.1)', 
          color: 'var(--danger)', 
          padding: '0.75rem 1rem', 
          borderRadius: '8px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem',
          fontSize: '0.9rem',
          fontWeight: 600,
          border: '1px solid rgba(239, 68, 68, 0.2)'
        }}>
          <WifiOff size={18} />
          <span>ขาดการเชื่อมต่ออินเทอร์เน็ต (Offline) - คำขอจะส่งเมื่อต่อเน็ตได้</span>
        </div>
      )}

      <div className={`glass-panel ${agentName.trim() ? 'hide-in-mini' : ''}`} style={{ 
        padding: 'var(--space-lg, 2rem)', 
        width: '100%', 
        maxWidth: '380px',
        background: 'var(--bg-surface)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px var(--glass-border)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
      }}>
        <label htmlFor="agentNameInput" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
          ชื่อ / รหัสพนักงานของคุณ
        </label>
        <input 
          id="agentNameInput"
          className="role-input"
          type="text" 
          value={agentName}
          onChange={(e) => setAgentName(e.target.value)}
          placeholder="เช่น สมชาย (ฝ่ายขาย 1)"
          style={{
            width: '100%',
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-pill)',
            border: '1px solid var(--glass-border)',
            background: 'var(--bg-base)',
            color: 'var(--text-main)',
            fontSize: '1.1rem',
            outline: 'none'
          }}
        />
      </div>

      <button 
        className={`sos-button ${isSending ? 'sending' : ''}`}
        onClick={handleSOS}
        disabled={isSending || !agentName.trim()}
      >
        <AlertCircle size={48} />
        <span>{isSending ? 'กำลังประมวลผล...' : 'ขอความช่วยเหลือ (SOS)'}</span>
      </button>

    </form>
  );
}
