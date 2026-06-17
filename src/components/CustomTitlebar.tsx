import { GripHorizontal, Minus, Square, Maximize2, X } from 'lucide-react';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { useNotification } from '../contexts/NotificationContext';

interface CustomTitlebarProps {
  appVersion?: string;
  isMiniMode?: boolean;
  onToggleMiniMode?: () => void;
  showWidgetToggle?: boolean;
}

export function CustomTitlebar({ 
  appVersion, 
  isMiniMode = false, 
  onToggleMiniMode,
  showWidgetToggle = true 
}: CustomTitlebarProps) {

  const appWindow = getCurrentWindow();
  const { notify } = useNotification();

  const handleMinimizeOrWidget = async () => {
    try {
      if (showWidgetToggle && onToggleMiniMode) {
        if (isMiniMode) {
          await appWindow.minimize(); // In Widget Mode, Minus minimizes to taskbar
        } else {
          onToggleMiniMode(); // In Normal Mode, Minus enters Widget Mode
        }
      } else {
        await appWindow.minimize(); // Standard minimize
      }
    } catch (error) {
      console.error(error);
      notify('ข้อผิดพลาด', `ไม่สามารถย่อหน้าต่างได้: ${error}`, 'danger');
    }
  };

  const handleMaximizeOrRestore = async () => {
    try {
      if (showWidgetToggle && onToggleMiniMode && isMiniMode) {
        onToggleMiniMode(); // In Widget Mode, Expand restores to Normal Mode
      } else {
        await appWindow.toggleMaximize(); // Standard maximize
      }
    } catch (error) {
      console.error(error);
      notify('ข้อผิดพลาด', `ไม่สามารถขยายหน้าต่างได้ (Permission ขาดหาย): ${error}`, 'danger');
    }
  };

  const handleDoubleClick = async () => {
    try {
      if (!isMiniMode) {
        await appWindow.toggleMaximize();
      }
    } catch (e) {
      // ignore
    }
  };

  const handleClose = async () => {
    try {
      await appWindow.close();
    } catch (error) {
      console.error(error);
      notify('ข้อผิดพลาด', `ไม่สามารถปิดโปรแกรมได้: ${error}`, 'danger');
    }
  };

  return (
    <div className="custom-titlebar">
      <div 
        className="titlebar-drag-region" 
        onPointerDown={(e) => {
          if (e.button === 0) appWindow.startDragging();
        }}
        onDoubleClick={handleDoubleClick}
      >
        {isMiniMode && <GripHorizontal size={14} style={{ marginRight: 8, opacity: 0.5 }} color="currentColor" />}
        <img src="/tauri.svg" alt="App Icon" style={{ width: 16, height: 16, marginRight: 8, pointerEvents: 'none' }} />
        Alert Telesale {appVersion && <span style={{ opacity: 0.5, marginLeft: 6, fontWeight: 'normal' }}>v{appVersion}</span>}
      </div>
      <div 
        className="titlebar-controls" 
        style={{ 
          position: 'absolute', 
          top: 0, 
          right: 0, 
          display: 'flex', 
          height: '32px', 
          zIndex: 999999 
        }}
      >
        <button 
          className="titlebar-button" 
          onClick={handleMinimizeOrWidget} 
          title={isMiniMode ? "ซ่อนลง Taskbar" : (showWidgetToggle ? "ย่อเป็น Widget ลอยบนจอ" : "ย่อหน้าต่างลง Taskbar")}
          style={{ width: '46px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.9)', cursor: 'pointer' }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 5H10" stroke="currentColor" strokeWidth="1.2"/>
          </svg>
        </button>
        
        <button 
          className="titlebar-button" 
          onClick={handleMaximizeOrRestore} 
          title={isMiniMode ? "ขยายกลับเป็นหน้าต่างปกติ" : "ขยายเต็มจอ"}
          style={{ width: '46px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.9)', cursor: 'pointer' }}
        >
          {isMiniMode ? (
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M2.5 2.5H9.5V9.5H2.5V2.5Z" stroke="currentColor" strokeWidth="1.2"/>
               <path d="M0.5 7.5V0.5H7.5" stroke="currentColor" strokeWidth="1.2"/>
            </svg>
          ) : (
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0.5 0.5H9.5V9.5H0.5V0.5Z" stroke="currentColor" strokeWidth="1.2"/>
            </svg>
          )}
        </button>

        <button 
          className="titlebar-button close" 
          onClick={handleClose} 
          title="ปิดโปรแกรม"
          style={{ width: '46px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.9)', cursor: 'pointer' }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.5 0.5L9.5 9.5M9.5 0.5L0.5 9.5" stroke="currentColor" strokeWidth="1.2"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
