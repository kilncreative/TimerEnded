import { useEffect, useRef, useState } from "react";

interface TimeValue {
  hours: number;
  minutes: number;
  seconds: number;
}

type AlarmOption = '5 times' | '10 times' | 'Until Canceled';

interface TimerPickerProps {
  selectedTime: TimeValue;
  onTimeChange: (time: TimeValue) => void;
  onStart: () => void;
  alarmOption: AlarmOption;
  onAlarmOptionChange: (option: AlarmOption) => void;
}

export default function TimerPicker({ selectedTime, onTimeChange, onStart, alarmOption, onAlarmOptionChange }: TimerPickerProps) {
  const hoursRef = useRef<HTMLDivElement>(null);
  const minutesRef = useRef<HTMLDivElement>(null);
  const secondsRef = useRef<HTMLDivElement>(null);
  const [showAlarmDropdown, setShowAlarmDropdown] = useState(false);
  
  const alarmOptions: AlarmOption[] = ['5 times', '10 times', 'Until Canceled'];

  const generateNumbers = (max: number) => Array.from({ length: max }, (_, i) => i);

  const updatePickerSelection = (picker: HTMLDivElement, type: 'hours' | 'minutes' | 'seconds', shouldUpdateState = true) => {
    const itemHeight = 44;
    const scrollTop = picker.scrollTop;
    const selectedIndex = Math.round(scrollTop / itemHeight);
    
    const items = picker.querySelectorAll('.picker-item');
    items.forEach((item, index) => {
      const htmlItem = item as HTMLElement;
      htmlItem.classList.remove('selected');
      if (index === selectedIndex) {
        htmlItem.classList.add('selected');
      }
    });
    
    if (shouldUpdateState && selectedIndex >= 0) {
      onTimeChange({
        ...selectedTime,
        [type]: selectedIndex
      });
    }
  };

  const setupPicker = (ref: React.RefObject<HTMLDivElement>, type: 'hours' | 'minutes' | 'seconds') => {
    if (!ref.current) return;

    const picker = ref.current;
    const itemHeight = 44;
    
    const scrollToValue = (value: number) => {
      const scrollTop = value * itemHeight;
      picker.scrollTop = scrollTop;
    };

    // Set initial scroll position
    scrollToValue(selectedTime[type]);

    let isSnapping = false;
    
    const snapToNearest = () => {
      if (isSnapping) return;
      isSnapping = true;
      
      const scrollTop = picker.scrollTop;
      const nearestIndex = Math.round(scrollTop / itemHeight);
      const targetScrollTop = nearestIndex * itemHeight;
      
      picker.scrollTo({
        top: targetScrollTop,
        behavior: 'smooth'
      });
      
      setTimeout(() => {
        isSnapping = false;
        updatePickerSelection(picker, type);
      }, 200);
    };

    let scrollTimeout: NodeJS.Timeout;
    
    const handleScroll = () => {
      if (!isSnapping) {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(snapToNearest, 150);
      }
    };

    // Mouse wheel support - default browser behavior for natural speed
    const handleWheel = (e: WheelEvent) => {
      // Don't prevent default - let browser handle scroll naturally
      // This preserves the original working scroll speed
    };

    // Desktop drag support
    let isDragging = false;
    let startY = 0;
    let startScrollTop = 0;
    let hasMoved = false;

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      startY = e.clientY;
      startScrollTop = picker.scrollTop;
      hasMoved = false;
      picker.style.cursor = 'grabbing';
      e.preventDefault();
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      
      const deltaY = startY - e.clientY;
      const newScrollTop = startScrollTop + deltaY;
      picker.scrollTop = Math.max(0, newScrollTop);
      hasMoved = true;
    };

    const handleMouseUp = () => {
      if (isDragging) {
        isDragging = false;
        picker.style.cursor = 'grab';
        if (hasMoved) {
          setTimeout(snapToNearest, 50);
        }
      }
    };

    const handleClick = (e: MouseEvent) => {
      if (hasMoved) {
        e.preventDefault();
        return;
      }
      
      const rect = picker.getBoundingClientRect();
      const y = e.clientY - rect.top;
      const centerY = picker.offsetHeight / 2;
      const offset = y - centerY;
      const itemsToMove = Math.round(offset / itemHeight);
      
      if (itemsToMove !== 0) {
        const currentScroll = picker.scrollTop;
        const newScroll = currentScroll + (itemsToMove * itemHeight);
        picker.scrollTo({
          top: Math.max(0, newScroll),
          behavior: 'smooth'
        });
      }
    };

    picker.addEventListener('scroll', handleScroll);
    picker.addEventListener('wheel', handleWheel, { passive: false });
    picker.addEventListener('mousedown', handleMouseDown);
    picker.addEventListener('click', handleClick);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    // Initial selection update
    setTimeout(() => updatePickerSelection(picker, type, false), 100);

    return () => {
      picker.removeEventListener('scroll', handleScroll);
      picker.removeEventListener('wheel', handleWheel);
      picker.removeEventListener('mousedown', handleMouseDown);
      picker.removeEventListener('click', handleClick);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      clearTimeout(scrollTimeout);
    };
  };

  useEffect(() => {
    const cleanupHours = setupPicker(hoursRef, 'hours');
    const cleanupMinutes = setupPicker(minutesRef, 'minutes');
    const cleanupSeconds = setupPicker(secondsRef, 'seconds');

    return () => {
      cleanupHours?.();
      cleanupMinutes?.();
      cleanupSeconds?.();
    };
  }, []);

  const canStart = selectedTime.hours > 0 || selectedTime.minutes > 0 || selectedTime.seconds > 0;

  return (
    <div className="space-y-6">
      {/* Time Picker Wheels */}
      <div className="timer-picker">
        <div className="picker-headers">
          <div className="grid grid-cols-3 text-center">
            <div className="picker-header">hours</div>
            <div className="picker-header">min</div>
            <div className="picker-header">sec</div>
          </div>
        </div>
        
        <div className="picker-container">
          <div className="picker-overlay"></div>
          <div className="grid grid-cols-3 h-full">
            {/* Hours Picker */}
            <div className="picker-column" ref={hoursRef}>
              {generateNumbers(24).map((num) => (
                <div key={num} className="picker-item" data-value={num}>
                  {num}
                </div>
              ))}
            </div>

            {/* Minutes Picker */}
            <div className="picker-column" ref={minutesRef}>
              {generateNumbers(60).map((num) => (
                <div key={num} className="picker-item" data-value={num}>
                  {num}
                </div>
              ))}
            </div>

            {/* Seconds Picker */}
            <div className="picker-column" ref={secondsRef}>
              {generateNumbers(60).map((num) => (
                <div key={num} className="picker-item" data-value={num}>
                  {num}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex justify-center">
        <button
          onClick={onStart}
          disabled={!canStart}
          className="w-20 h-20 rounded-full flex items-center justify-center text-lg font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50"
          style={{ backgroundColor: canStart ? '#30D158' : '#48484A', color: 'white' }}
        >
          Start
        </button>
      </div>

      {/* Timer Options */}
      <div className="bg-dark-secondary rounded-2xl px-6 py-4">
        <div className="flex items-center justify-between py-3 relative">
          <span className="text-white font-medium">When Timer Ends</span>
          <button
            onClick={() => setShowAlarmDropdown(!showAlarmDropdown)}
            className="flex items-center text-gray-400"
          >
            <span>{alarmOption}</span>
            <span className="ml-2">›</span>
          </button>
          
          {showAlarmDropdown && (
            <div className="absolute top-full right-0 mt-2 bg-dark-tertiary rounded-2xl py-2 z-50 min-w-[150px]">
              {alarmOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    onAlarmOptionChange(option);
                    setShowAlarmDropdown(false);
                  }}
                  className={`w-full px-4 py-2 text-left hover:bg-gray-700 ${
                    option === alarmOption ? 'text-white' : 'text-gray-400'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}