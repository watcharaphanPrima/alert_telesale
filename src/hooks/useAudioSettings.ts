import { useLocalStorage } from './useLocalStorage';

export type SoundType = 'siren' | 'chime' | 'bell';

export interface AudioSettings {
  volume: number;      // 0.0 to 1.0
  isMuted: boolean;    // true or false
  soundType: SoundType;
  enableTTS: boolean;  // Text-to-Speech
}

export function useAudioSettings() {
  const [volume, setVolume] = useLocalStorage<number>('alert_volume', 0.8);
  const [isMuted, setIsMuted] = useLocalStorage<boolean>('alert_muted', false);
  const [soundType, setSoundType] = useLocalStorage<SoundType>('alert_sound_type', 'bell');
  const [enableTTS, setEnableTTS] = useLocalStorage<boolean>('alert_enable_tts', true);

  return {
    volume,
    setVolume,
    isMuted,
    setIsMuted,
    soundType,
    setSoundType,
    enableTTS,
    setEnableTTS
  };
}
