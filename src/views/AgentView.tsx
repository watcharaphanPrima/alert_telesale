import { useState } from 'react';
import { ref, push, serverTimestamp } from 'firebase/database';
import { db } from '../lib/firebase';
import { AlertCircle } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useNotification } from '../contexts/NotificationContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import './AgentView.css';

export function AgentView() {
  const { teamId } = useParams();
  const { notify } = useNotification();
  const [agentName, setAgentName] = useLocalStorage<string>('agentName', '');
  const [isSending, setIsSending] = useState(false);

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
      notify('SOS Sent', 'ส่งคำขอความช่วยเหลือสำเร็จแล้ว!', 'success');
    } catch (error) {
      console.error("Failed to send SOS:", error);
      notify('Error', 'ส่งคำขอไม่สำเร็จ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต', 'danger');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form className="agent-view animate-fade-in" onSubmit={handleSOS}>
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
        <span>{isSending ? 'กำลังส่ง...' : 'ขอความช่วยเหลือ (SOS)'}</span>
      </button>

    </form>
  );
}
