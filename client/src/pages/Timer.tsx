import { useState, useEffect, useRef } from 'react';
import TimerPicker from '@/components/TimerPicker';

type TimerState = 'setup' | 'active' | 'paused' | 'expired';

interface TimeValue {
  hours: number;
  minutes: number;
  seconds: number;
}

type AlarmOption = '5 times' | '10 times' | 'Until Canceled';

export default function Timer() {
  const [state, setState] = useState<TimerState>('setup');
  const [selectedTime, setSelectedTime] = useState<TimeValue>({ hours: 0, minutes: 0, seconds: 0 });
  const [alarmOption, setAlarmOption] = useState<AlarmOption>('10 times');
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [expiredAt, setExpiredAt] = useState<Date | null>(null);
  const [elapsedSinceExpired, setElapsedSinceExpired] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const expiredIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Alarm system
  const alarmIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const createSingleChime = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.8);
      
      // Vibrate for silent mode support
      if (navigator.vibrate) {
        navigator.vibrate(800);
      }
    } catch (error) {
      console.warn('Web Audio API not supported');
      // Fallback vibration if audio fails
      if (navigator.vibrate) {
        navigator.vibrate(800);
      }
    }
  };
  
  const startAlarm = () => {
    let chimeCount = 0;
    const maxChimes = alarmOption === '5 times' ? 5 : alarmOption === '10 times' ? 10 : Infinity;
    
    const playNextChime = () => {
      createSingleChime();
      chimeCount++;
      
      if (chimeCount < maxChimes) {
        alarmIntervalRef.current = setTimeout(playNextChime, 2000); // 2 second delay between chimes
      }
    };
    
    playNextChime(); // Start first chime immediately
  };
  
  const stopAlarm = () => {
    if (alarmIntervalRef.current) {
      clearTimeout(alarmIntervalRef.current);
      alarmIntervalRef.current = null;
    }
  };

  // Timer countdown logic
  useEffect(() => {
    if (state === 'active' && remainingTime > 0) {
      intervalRef.current = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1) {
            setState('expired');
            setExpiredAt(new Date());
            startAlarm();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state, remainingTime]);

  // Track elapsed time since expiration
  useEffect(() => {
    if (state === 'expired' && expiredAt) {
      expiredIntervalRef.current = setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor((now.getTime() - expiredAt.getTime()) / 1000);
        setElapsedSinceExpired(elapsed);
      }, 1000);
    } else {
      if (expiredIntervalRef.current) {
        clearInterval(expiredIntervalRef.current);
        expiredIntervalRef.current = null;
      }
    }

    return () => {
      if (expiredIntervalRef.current) {
        clearInterval(expiredIntervalRef.current);
      }
      stopAlarm();
    };
  }, [state, expiredAt]);

  const handleStart = () => {
    const totalSeconds = selectedTime.hours * 3600 + selectedTime.minutes * 60 + selectedTime.seconds;
    setRemainingTime(totalSeconds);
    setState('active');
  };

  const handlePause = () => {
    setState('paused');
  };

  const handleResume = () => {
    setState('active');
  };

  const handleStop = () => {
    setState('setup');
    setRemainingTime(0);
    setExpiredAt(null);
    setElapsedSinceExpired(0);
    stopAlarm();
  };

  const handleReset = () => {
    setState('setup');
    setRemainingTime(0);
    setExpiredAt(null);
    setElapsedSinceExpired(0);
    stopAlarm();
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatElapsedTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours} hour${hours !== 1 ? 's' : ''}, ${minutes} minute${minutes !== 1 ? 's' : ''}, and ${secs} second${secs !== 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''} and ${secs} second${secs !== 1 ? 's' : ''} ago`;
    }
    return `${secs} second${secs !== 1 ? 's' : ''} ago`;
  };

  const formatOriginalDuration = (): string => {
    const { hours, minutes, seconds } = selectedTime;
    const parts = [];
    
    if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
    if (minutes > 0) parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
    if (seconds > 0) parts.push(`${seconds} second${seconds !== 1 ? 's' : ''}`);
    
    return parts.join(', ');
  };

  return (
    <div className="timer-app">
      {state === 'setup' && (
        <div className="flex-1 flex flex-col justify-center px-5 py-8">
          <TimerPicker
            selectedTime={selectedTime}
            onTimeChange={setSelectedTime}
            onStart={handleStart}
            alarmOption={alarmOption}
            onAlarmOptionChange={setAlarmOption}
          />
        </div>
      )}

      {(state === 'active' || state === 'paused') && (
        <div className="timer-app">
          <div className="flex-1 flex flex-col justify-center px-5 py-8">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="countdown-display text-8xl font-light mb-4 text-white">
                {formatTime(remainingTime)}
              </div>
              
              <div className="flex justify-center space-x-4">
                <button 
                  className="bg-ios-gray text-white px-8 py-3 rounded-xl font-medium text-lg transition-transform duration-75 active:scale-95"
                  onClick={handleStop}
                >
                  Cancel
                </button>
                
                {state === 'active' ? (
                  <button 
                    className="bg-ios-orange text-white px-8 py-3 rounded-xl font-medium text-lg transition-transform duration-75 active:scale-95"
                    onClick={handlePause}
                  >
                    Pause
                  </button>
                ) : (
                  <button 
                    className="bg-ios-green text-white px-8 py-3 rounded-xl font-medium text-lg transition-transform duration-75 active:scale-95"
                    onClick={handleResume}
                  >
                    Resume
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {state === 'expired' && (
        <div className="timer-app">
          <div className="flex-1 flex flex-col justify-center px-5 py-8">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="space-y-4">
                <h1 className="text-2xl font-light text-white">Timer Completed</h1>
                <div className="elapsed-time">
                  <div>Your {formatOriginalDuration()} timer ended:</div>
                  <div className="text-white text-xl font-medium mt-2">
                    {formatElapsedTime(elapsedSinceExpired)}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col space-y-4">
                <button 
                  className="bg-ios-red text-white px-8 py-3 rounded-xl font-medium text-lg transition-transform duration-75 active:scale-95"
                  onClick={stopAlarm}
                >
                  Stop Alarm
                </button>
                
                <button 
                  className="bg-ios-green text-white px-8 py-3 rounded-xl font-medium text-lg transition-transform duration-75 active:scale-95"
                  onClick={handleReset}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
