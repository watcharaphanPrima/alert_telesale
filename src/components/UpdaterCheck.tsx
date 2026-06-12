import { useEffect, useState } from 'react';
import { check } from '@tauri-apps/plugin-updater';
import { ask } from '@tauri-apps/plugin-dialog';
import { relaunch } from '@tauri-apps/plugin-process';

export function UpdaterCheck() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [downloadedBytes, setDownloadedBytes] = useState(0);
  const [totalBytes, setTotalBytes] = useState(0);
  const [updateMessage, setUpdateMessage] = useState('');

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
            setIsUpdating(true);
            setUpdateMessage('ระบบกำลังเตรียมการดาวน์โหลด...');
            
            let downloaded = 0;
            
            await update.downloadAndInstall((event) => {
              switch (event.event) {
                case 'Started':
                  setTotalBytes(event.data.contentLength || 0);
                  setUpdateMessage('กำลังดาวน์โหลดอัปเดต...');
                  break;
                case 'Progress':
                  downloaded += event.data.chunkLength;
                  setDownloadedBytes(downloaded);
                  break;
                case 'Finished':
                  setUpdateMessage('ดาวน์โหลดเสร็จสิ้น กำลังติดตั้ง...');
                  break;
              }
            });
            
            setUpdateMessage('ติดตั้งการอัปเดตเรียบร้อยแล้ว ระบบกำลังจะเริ่มทำงานใหม่...');
            setTimeout(async () => {
              await relaunch();
            }, 1500);
          }
        }
      } catch (error) {
        console.error('Failed to check for updates:', error);
      } finally {
        isChecking = false;
      }
    }

    setTimeout(() => {
      checkForUpdates();
    }, 2000);
    
  }, []);

  if (!isUpdating) return null;

  const percent = totalBytes > 0 ? Math.min(100, Math.round((downloadedBytes / totalBytes) * 100)) : 0;
  const downloadedMB = (downloadedBytes / (1024 * 1024)).toFixed(1);
  const totalMB = totalBytes > 0 ? (totalBytes / (1024 * 1024)).toFixed(1) : '?';

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999,
      color: 'white',
      animation: 'fade-in 0.3s ease forwards'
    }}>
      <div style={{
        background: 'var(--bg-base, #1e1e2e)',
        border: '1px solid var(--glass-border, rgba(255,255,255,0.1))',
        borderRadius: '16px',
        padding: '2rem',
        width: '90%',
        maxWidth: '450px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        textAlign: 'center'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          background: 'rgba(59, 130, 246, 0.1)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem auto'
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary, #3b82f6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
        </div>
        
        <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.4rem', fontWeight: 'bold' }}>กำลังอัปเดตระบบ</h2>
        <p style={{ color: 'var(--text-muted, #94a3b8)', marginBottom: '2rem', fontSize: '0.95rem' }}>{updateMessage}</p>
        
        <div style={{
          width: '100%',
          height: '12px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '999px',
          overflow: 'hidden',
          marginBottom: '0.75rem'
        }}>
          <div style={{
            height: '100%',
            width: `${percent}%`,
            background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
            borderRadius: '999px',
            transition: 'width 0.2s ease-out',
            boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)'
          }} />
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted, #94a3b8)', fontWeight: 500 }}>
          <span>{downloadedMB} MB / {totalMB} MB</span>
          <span style={{ color: 'var(--text-main, #ffffff)' }}>{percent}%</span>
        </div>
      </div>
    </div>
  );
}
