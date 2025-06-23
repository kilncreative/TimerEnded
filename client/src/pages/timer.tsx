import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import TimerPicker from "@/components/timer-picker";
import TimerDisplay from "@/components/timer-display";

type TimerState = 'setup' | 'active' | 'paused' | 'expired';

interface TimeValue {
  hours: number;
  minutes: number;
  seconds: number;
}

export default function Timer() {
  const [state, setState] = useState<TimerState>('setup');
  const [selectedTime, setSelectedTime] = useState<TimeValue>({ hours: 0, minutes: 0, seconds: 0 });
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [expiredAt, setExpiredAt] = useState<Date | null>(null);
  const [elapsedSinceExpired, setElapsedSinceExpired] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const expiredIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio
  useEffect(() => {
    // Create audio element for timer notification with a proper alarm sound
    audioRef.current = new Audio();
    // Multi-tone alarm sound that's more noticeable
    audioRef.current.src = "data:audio/wav;base64,UklGRkgOAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAA==";
    audioRef.current.volume = 0.8;
    
    // Create a synthetic alarm sound using Web Audio API as fallback
    const createAlarmSound = () => {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator1 = audioContext.createOscillator();
        const oscillator2 = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator1.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator2.frequency.setValueAtTime(1000, audioContext.currentTime);
        
        oscillator1.type = 'sine';
        oscillator2.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
        
        oscillator1.connect(gainNode);
        oscillator2.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator1.start(audioContext.currentTime);
        oscillator2.start(audioContext.currentTime);
        oscillator1.stop(audioContext.currentTime + 1);
        oscillator2.stop(audioContext.currentTime + 1);
        
        // Play multiple beeps
        setTimeout(() => {
          const osc3 = audioContext.createOscillator();
          const osc4 = audioContext.createOscillator();
          const gain2 = audioContext.createGain();
          
          osc3.frequency.setValueAtTime(800, audioContext.currentTime);
          osc4.frequency.setValueAtTime(1000, audioContext.currentTime);
          osc3.type = 'sine';
          osc4.type = 'sine';
          
          gain2.gain.setValueAtTime(0.3, audioContext.currentTime);
          gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
          
          osc3.connect(gain2);
          osc4.connect(gain2);
          gain2.connect(audioContext.destination);
          
          osc3.start(audioContext.currentTime);
          osc4.start(audioContext.currentTime);
          osc3.stop(audioContext.currentTime + 1);
          osc4.stop(audioContext.currentTime + 1);
        }, 500);
        
        setTimeout(() => {
          const osc5 = audioContext.createOscillator();
          const osc6 = audioContext.createOscillator();
          const gain3 = audioContext.createGain();
          
          osc5.frequency.setValueAtTime(800, audioContext.currentTime);
          osc6.frequency.setValueAtTime(1000, audioContext.currentTime);
          osc5.type = 'sine';
          osc6.type = 'sine';
          
          gain3.gain.setValueAtTime(0.3, audioContext.currentTime);
          gain3.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
          
          osc5.connect(gain3);
          osc6.connect(gain3);
          gain3.connect(audioContext.destination);
          
          osc5.start(audioContext.currentTime);
          osc6.start(audioContext.currentTime);
          osc5.stop(audioContext.currentTime + 1);
          osc6.stop(audioContext.currentTime + 1);
        }, 1000);
      } catch (error) {
        console.warn('Web Audio API not supported, using fallback beep');
      }
    };
    
    // Override the audio play function to use our custom alarm
    const originalPlay = audioRef.current.play.bind(audioRef.current);
    audioRef.current.play = () => {
      createAlarmSound();
      return originalPlay().catch(() => createAlarmSound());
    };
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Timer countdown logic
  useEffect(() => {
    if (state === 'active' && remainingTime > 0) {
      intervalRef.current = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1) {
            setState('expired');
            setExpiredAt(new Date());
            if (audioRef.current) {
              audioRef.current.play().catch(console.error);
            }
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

  // Expired timer tracking
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
    };
  }, [state, expiredAt]);

  const handleStart = () => {
    const totalSeconds = selectedTime.hours * 3600 + selectedTime.minutes * 60 + selectedTime.seconds;
    if (totalSeconds > 0) {
      setRemainingTime(totalSeconds);
      setState('active');
    }
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
  };

  const handleReset = () => {
    setState('setup');
    setRemainingTime(0);
    setExpiredAt(null);
    setElapsedSinceExpired(0);
  };

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatElapsedTime = (elapsedSeconds: number) => {
    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;
    
    if (minutes > 0) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''} and ${seconds} second${seconds !== 1 ? 's' : ''} ago`;
    }
    return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
  };

  const getDisplayTime = () => {
    const { hours, minutes, seconds } = selectedTime;
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    if (minutes > 0) {
      return `${minutes} min`;
    }
    return `${seconds} sec`;
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--dark-primary)' }}>
      {/* Header */}
      <header className="flex items-center justify-center p-4 relative">
        <h1 className="text-lg font-semibold text-white">
          {state === 'setup' ? getDisplayTime() : 'Timer'}
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <AnimatePresence mode="wait">
          {state === 'setup' && (
            <motion.div
              key="setup"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-sm"
            >
              <TimerPicker
                selectedTime={selectedTime}
                onTimeChange={setSelectedTime}
                onStart={handleStart}
                onCancel={handleReset}
              />
            </motion.div>
          )}

          {(state === 'active' || state === 'paused') && (
            <motion.div
              key="active"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-sm"
            >
              <TimerDisplay
                remainingTime={remainingTime}
                isPaused={state === 'paused'}
                onPause={handlePause}
                onResume={handleResume}
                onStop={handleStop}
              />
            </motion.div>
          )}

          {state === 'expired' && (
            <motion.div
              key="expired"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-sm text-center"
            >
              {/* Expired Notification */}
              <div 
                className="mb-8 expired-glow rounded-2xl p-6"
                style={{ backgroundColor: 'var(--timer-red)' }}
              >
                <div className="text-2xl font-semibold mb-2 text-white">Timer Expired</div>
                <div className="text-red-100 text-lg">
                  {formatElapsedTime(elapsedSinceExpired)}
                </div>
              </div>

              {/* Elapsed Time Display */}
              <div className="mb-12">
                <div 
                  className="text-sm font-medium mb-2"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Time since expiration
                </div>
                <div 
                  className="countdown-display text-6xl font-light mb-4 text-red-400"
                >
                  {Math.floor(elapsedSinceExpired / 60).toString().padStart(2, '0')}:
                  {(elapsedSinceExpired % 60).toString().padStart(2, '0')}
                </div>
              </div>

              {/* Reset Button */}
              <div className="flex justify-center">
                <button
                  onClick={handleReset}
                  className="w-20 h-20 rounded-full flex items-center justify-center text-lg font-semibold transition-all duration-200 active:scale-95"
                  style={{ backgroundColor: 'var(--accent-green)' }}
                >
                  Reset
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
