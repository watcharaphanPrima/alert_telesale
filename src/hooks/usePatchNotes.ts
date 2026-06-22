import { useState, useEffect } from 'react';
import { getVersion } from '@tauri-apps/api/app';
import { useLocalStorage } from './useLocalStorage';
import { CHANGELOG } from '../lib/changelog';

export function usePatchNotes() {
  const [lastSeenVersion, setLastSeenVersion] = useLocalStorage<string>('last_seen_patch_notes', '');
  const [showNotes, setShowNotes] = useState(false);
  const [appVersion, setAppVersion] = useState<string>('');

  useEffect(() => {
    // ดึงเวอร์ชันปัจจุบันของแอปจาก Tauri
    getVersion().then((version) => {
      setAppVersion(version);
      
      // กรณีใช้บนเบราว์เซอร์หรือกรณี fallback ใช้เวอร์ชันล่าสุดจาก CHANGELOG
      const currentVersion = version || CHANGELOG[0].version;
      
      // ถ้าไม่มี lastSeenVersion (เปิดแอปครั้งแรก) หรือ เวอร์ชันที่เคยเห็นเก่ากว่าเวอร์ชันล่าสุด
      if (!lastSeenVersion || compareVersions(currentVersion, lastSeenVersion) > 0) {
        setShowNotes(true);
      }
    }).catch((err) => {
      console.error('Failed to get app version:', err);
      // Fallback fallback fallback
      if (!lastSeenVersion || compareVersions(CHANGELOG[0].version, lastSeenVersion) > 0) {
        setShowNotes(true);
      }
    });
  }, [lastSeenVersion]);

  const closeNotes = () => {
    setShowNotes(false);
    // อัปเดตข้อมูลว่าเห็นเวอร์ชันล่าสุดแล้ว
    const versionToSave = appVersion || CHANGELOG[0].version;
    setLastSeenVersion(versionToSave);
  };

  const openNotesManually = () => {
    setShowNotes(true);
  };

  return {
    showNotes,
    closeNotes,
    openNotesManually,
    appVersion: appVersion || CHANGELOG[0].version,
    changelog: CHANGELOG
  };
}

// Helper: เปรียบเทียบเวอร์ชัน (1.0.1 > 1.0.0) Return 1 if v1 > v2
function compareVersions(v1: string, v2: string) {
  const v1Parts = v1.split('.').map(Number);
  const v2Parts = v2.split('.').map(Number);
  
  for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
    const p1 = v1Parts[i] || 0;
    const p2 = v2Parts[i] || 0;
    if (p1 > p2) return 1;
    if (p1 < p2) return -1;
  }
  return 0;
}
