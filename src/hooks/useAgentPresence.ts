import { useEffect, useRef } from 'react';
import { ref, onValue, set, onDisconnect, serverTimestamp } from 'firebase/database';
import { db } from '../lib/firebase';
import { useLocalStorage } from './useLocalStorage';

// สร้าง ID แบบสุ่มให้กับ Agent ประจำเครื่อง
const generateAgentId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export function useAgentPresence(teamId: string | undefined, agentName: string) {
  const [agentId, setAgentId] = useLocalStorage('agent_session_id', '');
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    
    // ถ้ายังไม่มี Agent ID ในเครื่อง ให้สร้างใหม่
    if (!agentId) {
      setAgentId(generateAgentId());
      return;
    }

    if (!teamId || !agentName.trim()) return;

    const connectedRef = ref(db, '.info/connected');
    const presenceRef = ref(db, `teams/${teamId}/presence/${agentId}`);

    const unsubscribe = onValue(connectedRef, (snap) => {
      if (snap.val() === true) {
        // เมื่อเชื่อมต่ออินเทอร์เน็ตได้ ให้ตั้งค่าลบสถานะเมื่อตัดการเชื่อมต่อ (onDisconnect)
        onDisconnect(presenceRef).remove().then(() => {
          // ถ้าตั้งค่า onDisconnect สำเร็จ ให้เขียนสถานะ Online ทันที
          if (isMounted.current) {
            set(presenceRef, {
              name: agentName,
              status: 'online',
              lastActive: serverTimestamp(),
              callSignal: 0
            });
          }
        });
      }
    });

    return () => {
      isMounted.current = false;
      unsubscribe();
      // ลบสถานะทันทีเมื่อ Component ถูก unmount (เช่น เปลี่ยนหน้า)
      set(presenceRef, null);
    };
  }, [teamId, agentName, agentId, setAgentId]);

  return { agentId };
}
