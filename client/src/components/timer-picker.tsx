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

  const updatePickerSelection = (picker: HTMLDivElement, type: 'hours' | 'minutes' | 'seconds') => {
    const items = picker.querySelectorAll('.picker-item');
    const containerRect = picker.getBoundingClientRect();
    const centerY = containerRect.top + containerRect.height / 2;
    
    let closest: Element | null = null;
    let closestDistance = Infinity;
    
    items.forEach(item => {
      const itemRect = item.getBoundingClientRect();
      const itemCenterY = itemRect.top + itemRect.height / 2;
      const distance = Math.abs(centerY - itemCenterY);
      
      if (distance < closestDistance) {
        closest = item;
        closestDistance = distance;
      }
      
      item.classList.remove('selected');
    });
    
    if (closest) {
      closest.classList.add('selected');
      const value = parseInt(closest.getAttribute('data-value') || '0');
      onTimeChange({
        ...selectedTime,
        [type]: value
      });
    }
  };

  const setupPicker = (ref: React.RefObject<HTMLDivElement>, type: 'hours' | 'minutes' | 'seconds') => {
    if (!ref.current) return;

    const picker = ref.current;
    const scrollToValue = (value: number) => {
      const item = picker.querySelector(`[data-value="${value}"]`) as HTMLElement;
      if (item) {
        const itemTop = item.offsetTop;
        const containerHeight = picker.clientHeight;
        const itemHeight = item.clientHeight;
        const scrollTop = itemTop - (containerHeight / 2) + (itemHeight / 2);
        picker.scrollTop = scrollTop;
      }
    };

    // Set initial scroll position
    scrollToValue(selectedTime[type]);

    const handleScroll = () => {
      updatePickerSelection(picker, type);
    };

    picker.addEventListener('scroll', handleScroll);
    
    // Initial selection update
    setTimeout(() => updatePickerSelection(picker, type), 100);

    return () => {
      picker.removeEventListener('scroll', handleScroll);
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
                    className="picker-item py-1 text-2xl font-medium cursor-pointer"
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
                    className="picker-item py-1 text-2xl font-medium cursor-pointer"
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
                    className="picker-item py-1 text-2xl font-medium cursor-pointer"
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
