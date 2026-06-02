import { useState, useEffect } from 'react';
import { ref, push, serverTimestamp } from 'firebase/database';
import { db } from '../lib/firebase';
import { AlertCircle, CheckCircle } from 'lucide-react';

export function AgentView() {
  const [agentName, setAgentName] = useState(() => localStorage.getItem('agentName') || '');
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (agentName) {
      localStorage.setItem('agentName', agentName);
    }
  }, [agentName]);

  const handleSOS = async () => {
    if (!agentName.trim()) {
      alert("Please enter your name first!");
      return;
    }

    setIsSending(true);
    setStatus('idle');

    try {
      const alertsRef = ref(db, 'alerts');
      await push(alertsRef, {
        agentName,
        status: 'active',
        timestamp: serverTimestamp(),
      });
      setStatus('success');
      
      // Reset status after 3 seconds
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      console.error("Failed to send SOS:", error);
      setStatus('error');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="agent-view animate-fade-in">
      <div className="glass-panel" style={{ padding: '1.5rem', width: '300px' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Your Name / ID
        </label>
        <input 
          type="text" 
          value={agentName}
          onChange={(e) => setAgentName(e.target.value)}
          placeholder="e.g. Somchai (Sales 1)"
          style={{
            width: '100%',
            padding: '0.75rem',
            borderRadius: '8px',
            border: '1px solid var(--glass-border)',
            background: 'rgba(0,0,0,0.2)',
            color: 'white',
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
        <span>{isSending ? 'Sending...' : 'SOS'}</span>
      </button>

      <div className="status-message">
        {status === 'success' && (
          <span className="status-success flex items-center gap-2">
            <CheckCircle size={20} style={{display: 'inline', verticalAlign: 'middle'}}/> 
            Help requested successfully!
          </span>
        )}
        {status === 'error' && (
          <span className="status-error">Failed to send request. Check connection.</span>
        )}
      </div>
    </div>
  );
}
