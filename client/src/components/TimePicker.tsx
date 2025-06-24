import { useEffect, useRef } from 'react';

interface TimePickerProps {
  hours: number;
  minutes: number;
  seconds: number;
  onHoursChange: (hours: number) => void;
  onMinutesChange: (minutes: number) => void;
  onSecondsChange: (seconds: number) => void;
}

export default function TimePicker({ 
  hours, 
  minutes, 
  seconds, 
  onHoursChange, 
  onMinutesChange, 
  onSecondsChange 
}: TimePickerProps) {
  const hoursRef = useRef<HTMLDivElement>(null);
  const minutesRef = useRef<HTMLDivElement>(null);
  const secondsRef = useRef<HTMLDivElement>(null);

  const createPickerItems = (max: number) => {
    return Array.from({ length: max }, (_, i) => i);
  };

  const addPaddingItems = (container: HTMLDivElement) => {
    // Add 5 padding items at top and bottom
    for (let i = 0; i < 5; i++) {
      const paddingTop = document.createElement('div');
      paddingTop.className = 'picker-item';
      paddingTop.style.height = '40px';
      container.insertBefore(paddingTop, container.firstChild);
      
      const paddingBottom = document.createElement('div');
      paddingBottom.className = 'picker-item';
      paddingBottom.style.height = '40px';
      container.appendChild(paddingBottom);
    }
  };

  const setupPicker = (
    ref: React.RefObject<HTMLDivElement>,
    value: number,
    onChange: (value: number) => void,
    max: number
  ) => {
    const container = ref.current;
    if (!container) return;

    // Add padding if not already added
    if (!container.dataset.padded) {
      addPaddingItems(container);
      container.dataset.padded = 'true';
    }

    // Set initial scroll position
    const itemHeight = 40;
    const targetScrollTop = (value + 5) * itemHeight; // +5 for padding
    container.scrollTop = targetScrollTop;

    // Update opacity for initial state
    updatePickerOpacity(container, value + 5);

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const index = Math.round(scrollTop / itemHeight) - 5; // Account for padding
      const clampedIndex = Math.max(0, Math.min(index, max - 1));
      
      updatePickerOpacity(container, clampedIndex + 5);
      
      if (clampedIndex !== value) {
        onChange(clampedIndex);
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  };

  const updatePickerOpacity = (container: HTMLDivElement, centerIndex: number) => {
    const items = container.querySelectorAll('.picker-item[data-value]');
    items.forEach((item, i) => {
      const element = item as HTMLElement;
      if (i === centerIndex) {
        element.style.opacity = '1';
      } else {
        element.style.opacity = '0.3';
      }
    });
  };

  useEffect(() => {
    const cleanup1 = setupPicker(hoursRef, hours, onHoursChange, 24);
    const cleanup2 = setupPicker(minutesRef, minutes, onMinutesChange, 60);
    const cleanup3 = setupPicker(secondsRef, seconds, onSecondsChange, 60);

    return () => {
      cleanup1?.();
      cleanup2?.();
      cleanup3?.();
    };
  }, []);

  // Update scroll positions when values change externally
  useEffect(() => {
    if (hoursRef.current) {
      hoursRef.current.scrollTop = (hours + 5) * 40;
      updatePickerOpacity(hoursRef.current, hours + 5);
    }
  }, [hours]);

  useEffect(() => {
    if (minutesRef.current) {
      minutesRef.current.scrollTop = (minutes + 5) * 40;
      updatePickerOpacity(minutesRef.current, minutes + 5);
    }
  }, [minutes]);

  useEffect(() => {
    if (secondsRef.current) {
      secondsRef.current.scrollTop = (seconds + 5) * 40;
      updatePickerOpacity(secondsRef.current, seconds + 5);
    }
  }, [seconds]);

  return (
    <div className="picker-container">
      <div className="picker-overlay"></div>
      <div className="grid grid-cols-3 gap-4 h-full">
        {/* Hours Picker */}
        <div className="picker-column" ref={hoursRef}>
          {createPickerItems(24).map(hour => (
            <div 
              key={hour} 
              className="picker-item text-white opacity-30" 
              data-value={hour}
            >
              {hour}
            </div>
          ))}
        </div>
        
        {/* Minutes Picker */}
        <div className="picker-column" ref={minutesRef}>
          {createPickerItems(60).map(minute => (
            <div 
              key={minute} 
              className="picker-item text-white opacity-30" 
              data-value={minute}
            >
              {minute}
            </div>
          ))}
        </div>
        
        {/* Seconds Picker */}
        <div className="picker-column" ref={secondsRef}>
          {createPickerItems(60).map(second => (
            <div 
              key={second} 
              className="picker-item text-white opacity-30" 
              data-value={second}
            >
              {second}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
