import { useState, useEffect, useRef } from 'react';

type TimerScreen = 'setup' | 'running' | 'paused' | 'completed';

export function useTimer() {
  const [currentScreen, setCurrentScreen] = useState<TimerScreen>('setup');
  const [remainingTime, setRemainingTime] = useState(0);
  const [originalDuration, setOriginalDuration] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerEndTime, setTimerEndTime] = useState<number | null>(null);
  
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const elapsedIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const alarmIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const playAlarm = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.type = 'square';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.5);
      
      // Vibrate if available
      if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200]);
      }
    } catch (error) {
      console.log('Audio context not available');
    }
  };

  const startTimer = (totalSeconds: number, alarmRepeat: string) => {
    if (totalSeconds <= 0) return;
    
    setRemainingTime(totalSeconds);
    setOriginalDuration(totalSeconds);
    setCurrentScreen('running');
    
    timerIntervalRef.current = setInterval(() => {
      setRemainingTime(prev => {
        const newTime = prev - 1;
        
        if (newTime <= 0) {
          // Timer completed
          if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
            timerIntervalRef.current = null;
          }
          
          const endTime = Date.now();
          setTimerEndTime(endTime);
          setElapsedTime(0);
          
          // Play alarm based on repeat setting
          if (alarmRepeat === 'infinite') {
            const playRepeatedAlarm = () => {
              playAlarm();
              alarmIntervalRef.current = setTimeout(playRepeatedAlarm, 2000);
            };
            playRepeatedAlarm();
          } else {
            const repeatCount = parseInt(alarmRepeat);
            let currentRepeat = 0;
            const playLimitedAlarm = () => {
              if (currentRepeat < repeatCount) {
                playAlarm();
                currentRepeat++;
                alarmIntervalRef.current = setTimeout(playLimitedAlarm, 2000);
              }
            };
            playLimitedAlarm();
          }
          
          // Start elapsed time tracking
          elapsedIntervalRef.current = setInterval(() => {
            if (endTime) {
              const elapsed = Math.floor((Date.now() - endTime) / 1000);
              setElapsedTime(elapsed);
            }
          }, 1000);
          
          setCurrentScreen('completed');
          return 0;
        }
        
        return newTime;
      });
    }, 1000);
  };

  const pauseTimer = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setCurrentScreen('paused');
  };

  const stopTimer = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (alarmIntervalRef.current) {
      clearTimeout(alarmIntervalRef.current);
      alarmIntervalRef.current = null;
    }
    if (elapsedIntervalRef.current) {
      clearInterval(elapsedIntervalRef.current);
      elapsedIntervalRef.current = null;
    }
    setCurrentScreen('setup');
    setRemainingTime(0);
    setElapsedTime(0);
    setTimerEndTime(null);
  };

  const resetTimer = () => {
    if (elapsedIntervalRef.current) {
      clearInterval(elapsedIntervalRef.current);
      elapsedIntervalRef.current = null;
    }
    if (alarmIntervalRef.current) {
      clearTimeout(alarmIntervalRef.current);
      alarmIntervalRef.current = null;
    }
    setCurrentScreen('setup');
    setElapsedTime(0);
    setTimerEndTime(null);
    setRemainingTime(0);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      if (elapsedIntervalRef.current) {
        clearInterval(elapsedIntervalRef.current);
      }
      if (alarmIntervalRef.current) {
        clearTimeout(alarmIntervalRef.current);
      }
    };
  }, []);

  return {
    currentScreen,
    remainingTime,
    elapsedTime,
    originalDuration,
    startTimer,
    pauseTimer,
    stopTimer,
    resetTimer
  };
}
