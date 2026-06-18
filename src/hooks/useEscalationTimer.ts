import { useEffect, useRef } from 'react';
import { Alert } from './useActiveAlerts';
import { SoundEngine } from '../lib/SoundEngine';
import { CONSTANTS } from '../lib/constants';
import { SoundType } from './useAudioSettings';

interface AudioSettingsContext {
  isMuted: boolean;
  volume: number;
  soundType: SoundType;
  enableTTS: boolean;
}

export function useEscalationTimer(alerts: Alert[], audioSettings: AudioSettingsContext) {
  const latestAlerts = useRef(alerts);
  const latestAudioSettings = useRef(audioSettings);

  useEffect(() => {
    latestAlerts.current = alerts;
    latestAudioSettings.current = audioSettings;
  }, [alerts, audioSettings]);

  useEffect(() => {
    const escalationInterval = setInterval(() => {
      const currentAlerts = latestAlerts.current;
      const { isMuted: muted, volume: vol, soundType: sound, enableTTS: tts } = latestAudioSettings.current;
      
      if (currentAlerts.length > 0 && !muted) {
        // currentAlerts is sorted newest first, so the last element is the oldest
        const oldestAlert = currentAlerts[currentAlerts.length - 1]; 
        const age = Date.now() - oldestAlert.timestamp;
        
        if (age > CONSTANTS.ESCALATION_INTERVAL_MS) { 
          SoundEngine.playSound(sound, vol);
          if (tts) {
             setTimeout(() => {
                SoundEngine.speak(`มีคำขอความช่วยเหลือค้างอยู่ กรุณาตรวจสอบ`, vol);
             }, 1500);
          }
        }
      }
    }, CONSTANTS.ESCALATION_INTERVAL_MS);
    
    return () => clearInterval(escalationInterval);
  }, []);
}
