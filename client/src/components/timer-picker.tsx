import { useEffect, useRef } from "react";

interface TimeValue {
  hours: number;
  minutes: number;
  seconds: number;
}

interface TimerPickerProps {
  selectedTime: TimeValue;
  onTimeChange: (time: TimeValue) => void;
  onStart: () => void;
  onCancel: () => void;
}

export default function TimerPicker({ selectedTime, onTimeChange, onStart, onCancel }: TimerPickerProps) {
  const hoursRef = useRef<HTMLDivElement>(null);
  const minutesRef = useRef<HTMLDivElement>(null);
  const secondsRef = useRef<HTMLDivElement>(null);

  const generateNumbers = (max: number) => Array.from({ length: max }, (_, i) => i);

  const updatePickerSelection = (picker: HTMLDivElement, type: 'hours' | 'minutes' | 'seconds', shouldUpdateState = true) => {
    const itemHeight = 32;
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
    const itemHeight = 32; // Height of each picker item
    
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

    picker.addEventListener('scroll', handleScroll);
    
    // Initial selection update - don't change state on first load
    setTimeout(() => updatePickerSelection(picker, type, false), 100);

    return () => {
      picker.removeEventListener('scroll', handleScroll);
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
    <div>
      {/* Time Picker Wheels */}
      <div 
        className="flex justify-center items-center mb-12 rounded-2xl p-6"
        style={{ backgroundColor: 'var(--dark-secondary)' }}
      >
        {/* Hours Picker */}
        <div className="flex-1 text-center">
          <div 
            className="text-sm font-medium mb-2"
            style={{ color: 'var(--text-secondary)' }}
          >
            hours
          </div>
          <div className="picker-wheel">
            <div 
              ref={hoursRef}
              className="picker-container h-32 overflow-y-auto"
            >
              <div className="py-12">
                {generateNumbers(24).map(hour => (
                  <div
                    key={hour}
                    className="picker-item h-8 flex items-center justify-center text-2xl font-medium cursor-pointer"
                    data-value={hour}
                  >
                    {hour}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Minutes Picker */}
        <div 
          className="flex-1 text-center border-l border-r"
          style={{ borderColor: 'var(--divider)' }}
        >
          <div 
            className="text-sm font-medium mb-2"
            style={{ color: 'var(--text-secondary)' }}
          >
            min
          </div>
          <div className="picker-wheel">
            <div 
              ref={minutesRef}
              className="picker-container h-32 overflow-y-auto"
            >
              <div className="py-12">
                {generateNumbers(60).map(minute => (
                  <div
                    key={minute}
                    className="picker-item h-8 flex items-center justify-center text-2xl font-medium cursor-pointer"
                    data-value={minute}
                  >
                    {minute}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Seconds Picker */}
        <div className="flex-1 text-center">
          <div 
            className="text-sm font-medium mb-2"
            style={{ color: 'var(--text-secondary)' }}
          >
            sec
          </div>
          <div className="picker-wheel">
            <div 
              ref={secondsRef}
              className="picker-container h-32 overflow-y-auto"
            >
              <div className="py-12">
                {generateNumbers(60).map(second => (
                  <div
                    key={second}
                    className="picker-item h-8 flex items-center justify-center text-2xl font-medium cursor-pointer"
                    data-value={second}
                  >
                    {second}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-6 mb-8">
        <button
          onClick={onCancel}
          className="w-20 h-20 rounded-full flex items-center justify-center text-lg font-medium transition-all duration-200 active:scale-95"
          style={{ backgroundColor: 'var(--cancel-gray)' }}
        >
          Cancel
        </button>
        <button
          onClick={onStart}
          disabled={!canStart}
          className="w-20 h-20 rounded-full flex items-center justify-center text-lg font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50"
          style={{ backgroundColor: canStart ? 'var(--accent-green)' : 'var(--cancel-gray)' }}
        >
          Start
        </button>
      </div>

      {/* Timer Options */}
      <div 
        className="rounded-2xl p-4 space-y-3"
        style={{ backgroundColor: 'var(--dark-secondary)' }}
      >
        <div className="flex items-center justify-between py-2">
          <span className="text-white font-medium">Label</span>
          <span style={{ color: 'var(--text-secondary)' }}>Timer</span>
        </div>
        <div 
          className="h-px"
          style={{ backgroundColor: 'var(--divider)' }}
        ></div>
        <div className="flex items-center justify-between py-2">
          <span className="text-white font-medium">When Timer Ends</span>
          <div 
            className="flex items-center"
            style={{ color: 'var(--text-secondary)' }}
          >
            <span>Radar</span>
            <span className="ml-2">›</span>
          </div>
        </div>
      </div>
    </div>
  );
}
