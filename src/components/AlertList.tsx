import { Clock, CheckCircle } from 'lucide-react';
import { Alert } from '../hooks/useActiveAlerts';
import { CONSTANTS } from '../lib/constants';

interface AlertListProps {
  alerts: Alert[];
  onResolve: (id: string) => void;
}

export function AlertList({ alerts, onResolve }: AlertListProps) {
  if (alerts.length === 0) {
    return (
      <div className="empty-state">
        <CheckCircle size={48} color="var(--success)" opacity={0.5} />
        <p>ปกติ! ไม่มีคำขอความช่วยเหลือในขณะนี้</p>
      </div>
    );
  }

  // Display only up to a certain maximum to avoid DOM bloat
  const displayAlerts = alerts.slice(0, CONSTANTS.MAX_ALERTS_DISPLAY);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {displayAlerts.map((alert) => (
        <div key={alert.id} className="alert-item">
          <div className="alert-info">
            <h4>{alert.agentName}</h4>
            <p className="flex items-center gap-1">
              <Clock size={14} />
              {new Date(alert.timestamp).toLocaleTimeString()}
            </p>
          </div>
          <div className="alert-actions">
            <button className="btn-resolve" onClick={() => onResolve(alert.id)}>
              ช่วยเหลือแล้ว
            </button>
          </div>
        </div>
      ))}
      {alerts.length > CONSTANTS.MAX_ALERTS_DISPLAY && (
        <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
          และรายการอื่นๆ อีก {alerts.length - CONSTANTS.MAX_ALERTS_DISPLAY} รายการ
        </div>
      )}
    </div>
  );
}
