import { useEffect } from 'react';
import { check } from '@tauri-apps/plugin-updater';
import { ask, message } from '@tauri-apps/plugin-dialog';
import { relaunch } from '@tauri-apps/plugin-process';
import { useNotification } from '../contexts/NotificationContext';

export function UpdaterCheck() {
  const { notify } = useNotification();

  useEffect(() => {
    let isChecking = false;
    
    async function checkForUpdates() {
      if (isChecking) return;
      isChecking = true;

      try {
        const update = await check();
        if (update) {
          const yes = await ask(
            `มีเวอร์ชันใหม่ (${update.version}) พร้อมใช้งาน\nคุณต้องการอัปเดตเดี๋ยวนี้เลยหรือไม่?`, 
            {
              title: 'แอปมีอัปเดตใหม่',
              kind: 'info',
              okLabel: 'อัปเดตเลย',
              cancelLabel: 'ไว้ทีหลัง'
            }
          );
          
          if (yes) {
            notify("กำลังดาวน์โหลด", "ระบบกำลังดาวน์โหลดและติดตั้งการอัปเดต กรุณารอสักครู่...", "info");
            await update.downloadAndInstall((event) => {
              switch (event.event) {
                case 'Started':
                  console.log('Update started', event.data.contentLength);
                  break;
                case 'Progress':
                  // console.log('Downloaded chunk', event.data.chunkLength);
                  break;
                case 'Finished':
                  console.log('Update installed successfully');
                  break;
              }
            });
            
            await message('ติดตั้งการอัปเดตเรียบร้อยแล้ว ระบบกำลังจะเริ่มทำงานใหม่', { title: 'สำเร็จ', kind: 'info', okLabel: 'ตกลง' });
            await relaunch();
          }
        }
      } catch (error) {
        console.error('Failed to check for updates:', error);
        // We silently fail if no update server is found so it doesn't bother the user during development
      } finally {
        isChecking = false;
      }
    }

    // Small delay to ensure UI loads first before prompting
    setTimeout(() => {
      checkForUpdates();
    }, 2000);
    
  }, [notify]);

  return null; // This is a logic-only component, it doesn't render any UI itself
}
