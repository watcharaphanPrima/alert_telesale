import { useState, useEffect } from 'react';
import { ref, onValue, off } from 'firebase/database';
import { db } from '../lib/firebase';

export interface AgentPresence {
  id: string;
  name: string;
  status: 'online' | 'offline';
  callSignal?: number;
  lastActive?: number;
}

export function useOnlineAgents(teamId: string | undefined) {
  const [onlineAgents, setOnlineAgents] = useState<AgentPresence[]>([]);

  useEffect(() => {
    if (!teamId) {
      setOnlineAgents([]);
      return;
    }

    const presenceRef = ref(db, `teams/${teamId}/presence`);
    
    const unsubscribe = onValue(presenceRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const agents: AgentPresence[] = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        
        // กรองเฉพาะคนที่ตั้ง status ว่า online 
        const activeAgents = agents.filter(a => a.status === 'online');
        // เรียงตามชื่อตัวอักษร
        activeAgents.sort((a, b) => a.name.localeCompare(b.name));
        
        setOnlineAgents(activeAgents);
      } else {
        setOnlineAgents([]);
      }
    });

    return () => {
      off(ref(db, `teams/${teamId}/presence`));
      unsubscribe();
    };
  }, [teamId]);

  return { onlineAgents };
}
