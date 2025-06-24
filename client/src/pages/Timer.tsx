import { useState, useEffect } from 'react';
import TimePicker from '@/components/TimePicker';
import { useTimer } from '@/hooks/useTimer';

export default function Timer() {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [alarmRepeat, setAlarmRepeat] = useState('10');
  const [showAlarmDropdown, setShowAlarmDropdown] = useState(false);





  const {
    currentScreen,
    remainingTime,
    elapsedTime,
    originalDuration,
    startTimer,
    pauseTimer,
    stopTimer,
    resetTimer
  } = useTimer();

  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  const isValidTime = totalSeconds > 0;

  const formatCurrentTime = () => {
    if (totalSeconds === 0) {
      return '0 sec';
    } else if (totalSeconds < 60) {
      return `${totalSeconds} sec`;
    } else if (totalSeconds < 3600) {
      const mins = Math.floor(totalSeconds / 60);
      const secs = totalSeconds % 60;
      return secs > 0 ? `${mins} min ${secs} sec` : `${mins} min`;
    } else {
      const hrs = Math.floor(totalSeconds / 3600);
      const mins = Math.floor((totalSeconds % 3600) / 60);
      const secs = totalSeconds % 60;
      let display = `${hrs} hr`;
      if (mins > 0) display += ` ${mins} min`;
      if (secs > 0) display += ` ${secs} sec`;
      return display;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatElapsedTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSecs = seconds % 60;
    
    let result = '';
    if (hours > 0) {
      result += `${hours} hour${hours !== 1 ? 's' : ''}`;
      if (minutes > 0 || remainingSecs > 0) result += ', ';
    }
    if (minutes > 0) {
      result += `${minutes} minute${minutes !== 1 ? 's' : ''}`;
      if (remainingSecs > 0) result += ' and ';
    }
    if (remainingSecs > 0 || (hours === 0 && minutes === 0)) {
      result += `${remainingSecs} second${remainingSecs !== 1 ? 's' : ''}`;
    }
    return result + ' ago';
  };

  const formatOriginalDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSecs = seconds % 60;
    
    if (hours > 0) {
      let result = `${hours} hour${hours !== 1 ? 's' : ''}`;
      if (minutes > 0) result += ` ${minutes} minute${minutes !== 1 ? 's' : ''}`;
      return result;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    } else {
      return `${remainingSecs} second${remainingSecs !== 1 ? 's' : ''}`;
    }
  };

  const handleStart = () => {
    if (isValidTime) {
      startTimer(totalSeconds, alarmRepeat);
    }
  };

  const alarmOptions = [
    { value: '10', label: '10 times' },
    { value: '20', label: '20 times' },
    { value: 'infinite', label: 'Until Stopped' }
  ];

  const selectedAlarmOption = alarmOptions.find(option => option.value === alarmRepeat);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.alarm-container')) {
        setShowAlarmDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  if (currentScreen === 'setup') {
    return (
      <div className="timer-app">
        <div className="flex-1 flex flex-col justify-center items-center px-5 py-8 space-y-8">
          {/* Current Timer Display */}
          <div className="text-center">
            <div className="text-3xl font-light text-white">
              {formatCurrentTime()}
            </div>
          </div>
          
          {/* Time Picker */}
          <div className="timer-picker w-full max-w-sm">
            <div className="picker-headers grid grid-cols-3 text-center px-6 py-3">
              <div className="text-ios-light-gray text-base font-normal">hours</div>
              <div className="text-ios-light-gray text-base font-normal">min</div>
              <div className="text-ios-light-gray text-base font-normal">sec</div>
            </div>
            
            <TimePicker 
              hours={hours}
              minutes={minutes}
              seconds={seconds}
              onHoursChange={setHours}
              onMinutesChange={setMinutes}
              onSecondsChange={setSeconds}
            />
          </div>
          
          {/* Start Button */}
          <button 
            className={`timer-button ${isValidTime ? 'timer-button-green' : 'timer-button-disabled'}`}
            onClick={handleStart}
            disabled={!isValidTime}
          >
            Start
          </button>
          
          {/* Alarm Settings */}
          <div className="alarm-container timer-picker w-full max-w-sm relative">
            <button 
              className="w-full p-4 flex items-center justify-between text-left"
              onClick={() => setShowAlarmDropdown(!showAlarmDropdown)}
            >
              <span className="text-white font-medium">Alarm</span>
              <div className="flex items-center space-x-2">
                <span className="text-ios-light-gray">
                  {selectedAlarmOption?.label}
                </span>
                <svg 
                  className={`w-4 h-4 text-ios-light-gray transform transition-transform ${showAlarmDropdown ? 'rotate-180' : ''}`}
                  viewBox="0 0 16 16"
                >
                  <path fill="currentColor" d="M8 12l-4-4h8l-4 4z"/>
                </svg>
              </div>
            </button>
            
            {/* Alarm Dropdown */}
            {showAlarmDropdown && (
              <div className="absolute top-full left-0 right-0 bg-ios-dark-gray rounded-2xl mt-2 overflow-hidden z-50">
                {alarmOptions.map((option, index) => (
                  <button 
                    key={option.value}
                    className={`w-full p-4 text-left text-white hover:bg-gray-700 transition-colors ${index === alarmOptions.length - 1 ? 'border-t border-gray-600' : ''}`}
                    onClick={() => {
                      setAlarmRepeat(option.value);
                      setShowAlarmDropdown(false);
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (currentScreen === 'running') {
    return (
      <div className="timer-app">
        <div className="flex-1 flex flex-col justify-center px-5 py-8">
          <div className="flex flex-col items-center space-y-12">
            <div className="text-center">
              <h1 className="text-2xl font-light mb-2 text-white">Timer</h1>
            </div>
            
            <div className="flex flex-col items-center space-y-8">
              <div className="timer-display text-white">
                {formatTime(remainingTime)}
              </div>
              <div className="text-ios-light-gray text-lg">Timer</div>
            </div>
            
            <div className="flex space-x-8">
              <button 
                className="timer-button timer-button-gray"
                onClick={pauseTimer}
              >
                Pause
              </button>
              <button 
                className="timer-button timer-button-red"
                onClick={stopTimer}
              >
                Stop
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentScreen === 'completed') {
    return (
      <div className="timer-app">
        <div className="flex-1 flex flex-col justify-center px-5 py-8">
          <div className="flex flex-col items-center space-y-8 text-center">
            <div className="space-y-4">
              <h1 className="text-2xl font-light text-white">Timer Completed</h1>
              <div className="elapsed-time">
                <div>Your {formatOriginalDuration(originalDuration)} timer ended:</div>
                <div className="text-white text-xl font-medium mt-2">
                  {formatElapsedTime(elapsedTime)}
                </div>
              </div>
            </div>
            
            <button 
              className="bg-ios-green text-white px-8 py-3 rounded-xl font-medium text-lg transition-transform duration-75 active:scale-95"
              onClick={resetTimer}
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
