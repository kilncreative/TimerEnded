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
  const [selectedTime, setSelectedTime] = useState<TimeValue>({ hours: 0, minutes: 10, seconds: 0 });
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [expiredAt, setExpiredAt] = useState<Date | null>(null);
  const [elapsedSinceExpired, setElapsedSinceExpired] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const expiredIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio
  useEffect(() => {
    // Create audio element for timer notification
    audioRef.current = new Audio();
    // Using a simple beep sound - in production you'd want a proper timer sound
    audioRef.current.src = "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmAcBC2BzO/aiSsFGXm/7OOfUQ0OTqXh8LNjHAU7k9n1vX8lBSl+zfDejjcIG2m5yvOkUgwMTKXo7bROCw5KnOvz0m8gAC5+2u+rQAcSebzs552QTAsOSJ7l7apSEgZGneDuvmIcBC2CzO/aiSwGGXm/7OOeUgwMTKPn77VjGgU6k9n0vn8lBCp/zfDejjcHG2q5yvOkUgwMTKXo7bROCQ5KnOvz0m8gAC5+2u+rQAcSebzs552QTAsOSJ7l7apSEgZGneDuvmIcBC2CzO/aiSwGGXm/7OOeUgwMTKPn77VjGgU6k9n0vn8lBCp/zfDejjcHG2q5yvOkUgwMTKXo7bROCQ5KnOvz0m8gAC5+2u+rQAcSebzs552QTAsOSJ7l7apSEgZGneDuvmIcBC2CzO/aiSwGGXm/7OOeUgwMTKPn77VjGgU6k9n0vn8lBCp/zfDejjcHG2q5yvOkUgwMTKXo7bROCQ5KnOvz0m8gAC5+2u+rQAcSebzs552QTAsOSJ7l7apSEgZGneDuvmIcBC2CzO/aiSwGGXm/7OOeUgwMTKPn77VjGgU6k9n0vn8lBCp/zfDejjcHG2q5yvOkUgwMTKXo7bROCQ5KnOvz0m8gAC5+2u+rQAcSebzs552QTAsOSJ7l7apSEgZGneDuvmIcBC2CzO/aiSwGGXm/7OOeUgwMTKPn77VjGgU6k9n0vn8lBCp/zfDejjcHG2q5yvOkUgwMTKXo7bROCQ5KnOvz0m8gAC5+2u+rQAcSebzs552QTAsOSJ7l7apSEgZGneDuvmIcBC2CzO/aiSwGGXm/7OOeUgwMTKPn77VjGgU6k9n0vn8lBCp/zfDejjcHG2q5yvOkUgwMTKXo7bROCQ5KnOvz0m8gAC5+2u+rQAcSebzs552QTAsOSJ7l7apSEgZGneDuvmIcBC2CzO/aiSwGGXm/7OOeUgwMTKPn77VjGgU6k9n0vn8lBCp/zfDejjcHG2q5yvOkUgwMTKXo7bROCQ5KnOvz0m8gAC5+2u+rQAcSebzs552QTAsOSJ7l7apSEgZGneDuvmIcBC2CzO/aiSwGGXm/7OOeUgwMTKPn77VjGgU6k9n0vn8lBCp/zfDejjcHG2q5yvOkUgwMTKXo7bROCQ5KnOvz0m8gAC5+2u+rQAcSebzs552QTAsOSJ7l7apSEgZGneDuvmIcBC2CzO/aiSwGGXm/7OOeUg==";
    
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
      <header className="flex items-center justify-between p-4 border-b border-gray-800">
        <button 
          className="flex items-center text-green-500 text-lg font-medium"
          onClick={() => window.history.back()}
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Timers
        </button>
        <h1 className="text-lg font-semibold text-white">
          {state === 'setup' ? getDisplayTime() : 'Timer'}
        </h1>
        <div className="w-16"></div>
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
