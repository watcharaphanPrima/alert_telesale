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
  const { addNotification } = useNotification();

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
      addNotification('error', 'ข้อผิดพลาด', `ไม่สามารถย่อหน้าต่างได้: ${error}`);
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
      addNotification('error', 'ข้อผิดพลาด', `ไม่สามารถขยายหน้าต่างได้ (Permission ขาดหาย): ${error}`);
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
      addNotification('error', 'ข้อผิดพลาด', `ไม่สามารถปิดโปรแกรมได้: ${error}`);
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
        Alert Telesale {appVersion && <span style={{ opacity: 0.5, marginLeft: 6, fontWeight: 'normal' }}>v{appVersion}</span>}
      </div>
      <div className="titlebar-controls">
        <button 
          className="titlebar-button" 
          onClick={handleMinimizeOrWidget} 
          title={isMiniMode ? "ซ่อนลง Taskbar" : (showWidgetToggle ? "ย่อเป็น Widget ลอยบนจอ" : "ย่อหน้าต่างลง Taskbar")}
        >
          <Minus size={16} color="currentColor" strokeWidth={2.5} />
        </button>
        
        <button 
          className="titlebar-button" 
          onClick={handleMaximizeOrRestore} 
          title={isMiniMode ? "ขยายกลับเป็นหน้าต่างปกติ" : "ขยายเต็มจอ"}
        >
          {isMiniMode ? <Maximize2 size={14} color="currentColor" strokeWidth={2.5} /> : <Square size={12} color="currentColor" strokeWidth={2.5} />}
        </button>

        <button 
          className="titlebar-button close" 
          onClick={handleClose} 
          title="ปิดโปรแกรม"
        >
          <X size={16} color="currentColor" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
