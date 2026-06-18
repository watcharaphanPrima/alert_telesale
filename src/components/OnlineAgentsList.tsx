import { Bell, Users, Volume2 } from 'lucide-react';
import { AgentPresence } from '../hooks/useOnlineAgents';
import { ref, set, serverTimestamp } from 'firebase/database';
import { db } from '../lib/firebase';
import { useNotification } from '../contexts/NotificationContext';
import './OnlineAgentsList.css';

interface OnlineAgentsListProps {
  agents: AgentPresence[];
  teamId: string | undefined;
}

export function OnlineAgentsList({ agents, teamId }: OnlineAgentsListProps) {
  const { notify } = useNotification();

  const handleCall = async (agentId: string, agentName: string) => {
    if (!teamId) return;
    try {
      const callRef = ref(db, `teams/${teamId}/presence/${agentId}/callSignal`);
      await set(callRef, serverTimestamp());
      notify('เรียกพนักงาน', `ส่งสัญญาณเรียก ${agentName} แล้ว`, 'success');
    } catch (err) {
      console.error(err);
      notify('ข้อผิดพลาด', 'ไม่สามารถส่งสัญญาณเรียกได้', 'danger');
    }
  };

  const handleCallAll = async () => {
    if (!teamId || agents.length === 0) return;
    try {
      const promises = agents.map(agent => 
        set(ref(db, `teams/${teamId}/presence/${agent.id}/callSignal`), serverTimestamp())
      );
      await Promise.all(promises);
      notify('เรียกทุกคน', `ส่งสัญญาณเรียกพนักงานทุกคนแล้ว (${agents.length} คน)`, 'success');
    } catch (err) {
      console.error(err);
      notify('ข้อผิดพลาด', 'ไม่สามารถส่งสัญญาณเรียกได้', 'danger');
    }
  };

  return (
    <div className="online-agents-container glass-panel">
      <div className="online-agents-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Users size={18} />
          <h3>ออนไลน์ ({agents.length})</h3>
        </div>
        <button 
          className="btn-call-all" 
          onClick={handleCallAll}
          disabled={agents.length === 0}
          title="เรียกพนักงานทุกคน"
        >
          <Volume2 size={16} />
          <span>เรียกทุกคน</span>
        </button>
      </div>
      
      {agents.length === 0 ? (
        <div className="online-agents-empty">
          <p>ไม่มีพนักงานออนไลน์</p>
        </div>
      ) : (
        <ul className="online-agents-list">
          {agents.map(agent => (
            <li key={agent.id} className="online-agent-item">
              <div className="agent-name-wrap">
                <div className="status-dot online"></div>
                <span className="agent-name">{agent.name}</span>
              </div>
              <button 
                className="btn-call" 
                onClick={() => handleCall(agent.id, agent.name)}
                title={`เรียก ${agent.name}`}
              >
                <Bell size={14} />
                <span>เรียก</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
