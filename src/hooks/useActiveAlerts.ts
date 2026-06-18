import { useState, useEffect } from 'react';
import { ref, onValue, query, orderByChild, equalTo, off } from 'firebase/database';
import { db } from '../lib/firebase';

export interface Alert {
  id: string;
  agentName: string;
  status: 'active' | 'resolved';
  timestamp: number;
}

export function useActiveAlerts(teamId: string | undefined) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [activeCount, setActiveCount] = useState(0);

  useEffect(() => {
    if (!teamId) {
      setAlerts([]);
      setActiveCount(0);
      return;
    }

    const alertsRef = query(
      ref(db, `teams/${teamId}/alerts`),
      orderByChild('status'),
      equalTo('active')
    );
    
    const unsubscribe = onValue(alertsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const parsedAlerts: Alert[] = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        
        // Sort by newest first
        parsedAlerts.sort((a, b) => b.timestamp - a.timestamp);
        
        setAlerts(parsedAlerts);
        setActiveCount(parsedAlerts.length);
      } else {
        setAlerts([]);
        setActiveCount(0);
      }
    });

    return () => {
      off(ref(db, `teams/${teamId}/alerts`));
      unsubscribe();
    };
  }, [teamId]);

  return { alerts, activeCount };
}
