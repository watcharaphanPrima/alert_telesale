import { SoundType } from '../hooks/useAudioSettings';
import { SoundEngine } from '../lib/SoundEngine';

interface SettingsPanelProps {
  volume: number;
  setVolume: (v: number) => void;
  soundType: SoundType;
  setSoundType: (s: SoundType) => void;
  enableTTS: boolean;
  setEnableTTS: (v: boolean) => void;
  isMuted: boolean;
}

export function SettingsPanel({
  volume,
  setVolume,
  soundType,
  setSoundType,
  enableTTS,
  setEnableTTS,
  isMuted
}: SettingsPanelProps) {
  
  const playTestSound = () => {
    if (isMuted) return;
    SoundEngine.playSound(soundType, volume);
    if (enableTTS) {
       setTimeout(() => {
          SoundEngine.speak("ทดสอบระบบเสียงเรียบร้อย", volume);
       }, 1500);
    }
  };

  return (
    <div className="stat-card" style={{ gridColumn: '1 / -1', flexDirection: 'column', alignItems: 'stretch', gap: '1.5rem', animation: 'slide-in-blur 0.3s ease forwards' }}>
      <h3 style={{ fontSize: '1.1rem', margin: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        ตั้งค่าระบบแจ้งเตือน
        <button className="btn-primary" onClick={playTestSound} style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
          ทดสอบเสียง
        </button>
      </h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>ระดับความดัง ({Math.round(volume * 100)}%)</label>
          <input 
            type="range" 
            min="0" max="1" step="0.05" 
            value={volume} 
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--primary)' }}
          />
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>เสียงเตือน</label>
          <select 
            value={soundType} 
            onChange={(e) => setSoundType(e.target.value as SoundType)}
            style={{ 
              width: '100%', 
              padding: '0.75rem', 
              background: 'var(--bg-base)', 
              color: 'var(--text-main)', 
              border: '1px solid var(--glass-border)',
              borderRadius: '8px',
              outline: 'none'
            }}
          >
            <option value="bell">กระดิ่ง (Bell)</option>
            <option value="chime">เตือนด่วน (Chime)</option>
            <option value="siren">ไซเรนฉุกเฉิน (Siren)</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
          <input 
            type="checkbox" 
            id="tts-toggle"
            checked={enableTTS} 
            onChange={(e) => setEnableTTS(e.target.checked)}
            style={{ width: '1.2rem', height: '1.2rem', accentColor: 'var(--primary)' }}
          />
          <label htmlFor="tts-toggle" style={{ color: 'var(--text-main)', cursor: 'pointer' }}>
            ให้คอมพิวเตอร์พูดชื่อผู้เรียก (Text-to-Speech)
          </label>
        </div>
      </div>
    </div>
  );
}
