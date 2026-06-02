import { useState, useEffect } from 'react';
import { ref, onValue, update, query, orderByChild, equalTo } from 'firebase/database';
import { db } from '../lib/firebase';
import { ShieldAlert, Users, Clock, CheckCircle } from 'lucide-react';

interface Alert {
  id: string;
  agentName: string;
  status: 'active' | 'resolved';
  timestamp: number;
}

export function ManagerView() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [activeCount, setActiveCount] = useState(0);

  useEffect(() => {
    // We want to listen to ALL alerts to show stats, or just active ones.
    // For simplicity, let's grab all alerts that are 'active'.
    const alertsRef = query(ref(db, 'alerts'), orderByChild('status'), equalTo('active'));
    
    const unsubscribe = onValue(alertsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const parsedAlerts: Alert[] = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        
        // Sort by newest first
        parsedAlerts.sort((a, b) => b.timestamp - a.timestamp);
        
        // Check if there are NEW alerts (for notification)
        if (parsedAlerts.length > activeCount && activeCount > 0) {
          // Play a sound or show OS notification
          if (Notification.permission === 'granted') {
            new Notification('Telesales Helpdesk', {
              body: `${parsedAlerts[0].agentName} requested help!`,
            });
          }
        }
        
        setAlerts(parsedAlerts);
        setActiveCount(parsedAlerts.length);
      } else {
        setAlerts([]);
        setActiveCount(0);
      }
    });

    // Request notification permission on mount
    if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [activeCount]);

  const handleResolve = async (id: string) => {
    try {
      const alertRef = ref(db, `alerts/${id}`);
      await update(alertRef, { status: 'resolved' });
    } catch (error) {
      console.error("Failed to resolve alert", error);
    }
  };

  return (
    <div className="manager-view animate-fade-in">
      <div className="stats-container">
        <div className="stat-card glass-panel">
          <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.2)', color: 'var(--danger)' }}>
            <ShieldAlert size={24} />
          </div>
          <div className="stat-info">
            <h3>Active Alerts</h3>
            <p style={{ color: activeCount > 0 ? 'var(--danger)' : 'white' }}>{activeCount}</p>
          </div>
        </div>
        
        <div className="stat-card glass-panel">
          <div className="stat-icon">
            <Users size={24} />
          </div>
          <div className="stat-info">
            <h3>Team Status</h3>
            <p>Online</p>
          </div>
        </div>
      </div>

      <div className="alerts-container glass-panel" style={{ padding: '1rem', marginTop: '1rem' }}>
        <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem', padding: '0 0.5rem' }}>Recent Requests</h2>
        
        {alerts.length === 0 ? (
          <div className="empty-state">
            <CheckCircle size={48} color="var(--success)" opacity={0.5} />
            <p>All clear! No active help requests.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {alerts.map((alert) => (
              <div key={alert.id} className="alert-item glass-panel" style={{ borderLeftColor: 'var(--danger)' }}>
                <div className="alert-info">
                  <h4>{alert.agentName}</h4>
                  <p className="flex items-center gap-1">
                    <Clock size={14} />
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </p>
                </div>
                <div className="alert-actions">
                  <button className="btn-resolve" onClick={() => handleResolve(alert.id)}>
                    Mark Resolved
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
