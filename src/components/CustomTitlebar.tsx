import { GripHorizontal, Minus, Square, Maximize2, X } from 'lucide-react';
import { getCurrentWindow } from '@tauri-apps/api/window';

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

  const handleMinimizeOrWidget = () => {
    if (showWidgetToggle && onToggleMiniMode) {
      if (isMiniMode) {
        appWindow.minimize(); // In Widget Mode, Minus minimizes to taskbar
      } else {
        onToggleMiniMode(); // In Normal Mode, Minus enters Widget Mode
      }
    } else {
      appWindow.minimize(); // Standard minimize
    }
  };

  const handleMaximizeOrRestore = () => {
    if (showWidgetToggle && onToggleMiniMode && isMiniMode) {
      onToggleMiniMode(); // In Widget Mode, Expand restores to Normal Mode
    } else {
      appWindow.toggleMaximize(); // Standard maximize
    }
  };

  const handleDoubleClick = () => {
    if (!isMiniMode) {
      appWindow.toggleMaximize();
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
        {isMiniMode && <GripHorizontal size={14} style={{ marginRight: 8, opacity: 0.5 }} />}
        Alert Telesale {appVersion && <span style={{ opacity: 0.5, marginLeft: 6, fontWeight: 'normal' }}>v{appVersion}</span>}
      </div>
      <div className="titlebar-controls">
        <button 
          className="titlebar-button" 
          onClick={handleMinimizeOrWidget} 
          title={isMiniMode ? "ซ่อนลง Taskbar" : (showWidgetToggle ? "ย่อเป็น Widget ลอยบนจอ" : "ย่อหน้าต่างลง Taskbar")}
        >
          <Minus size={16} />
        </button>
        
        <button 
          className="titlebar-button" 
          onClick={handleMaximizeOrRestore} 
          title={isMiniMode ? "ขยายกลับเป็นหน้าต่างปกติ" : "ขยายเต็มจอ"}
        >
          {isMiniMode ? <Maximize2 size={14} /> : <Square size={12} />}
        </button>

        <button 
          className="titlebar-button close" 
          onClick={() => appWindow.close()} 
          title="ปิดโปรแกรม"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
