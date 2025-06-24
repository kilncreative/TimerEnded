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

  const itemHeight = 32;
  const visibleItems = 5; // Number of visible items
  const centerIndex = Math.floor(visibleItems / 2); // Index of the center item

  const createPickerItems = (max: number) => {
    const items = [];
    
    // Add padding items at the top
    for (let i = 0; i < centerIndex; i++) {
      items.push(
        <div key={`padding-top-${i}`} className="picker-item" style={{ height: itemHeight }}>
        </div>
      );
    }
    
    // Add actual items
    for (let i = 0; i < max; i++) {
      items.push(
        <div key={i} className="picker-item text-white" style={{ height: itemHeight }}>
          {i}
        </div>
      );
    }
    
    // Add padding items at the bottom
    for (let i = 0; i < centerIndex; i++) {
      items.push(
        <div key={`padding-bottom-${i}`} className="picker-item" style={{ height: itemHeight }}>
        </div>
      );
    }
    
    return items;
  };

  const updateOpacity = (container: HTMLDivElement) => {
    const scrollTop = container.scrollTop;
    const centerPosition = scrollTop + (container.offsetHeight / 2);
    const items = container.querySelectorAll('.picker-item');
    
    items.forEach((item, index) => {
      const element = item as HTMLElement;
      const itemTop = index * itemHeight;
      const itemCenter = itemTop + (itemHeight / 2);
      const distance = Math.abs(centerPosition - itemCenter);
      
      if (distance < itemHeight / 2) {
        element.style.opacity = '1';
        element.style.fontSize = '22px';
        element.style.fontWeight = '300';
      } else if (distance < itemHeight * 1.5) {
        element.style.opacity = '0.6';
        element.style.fontSize = '20px';
        element.style.fontWeight = '200';
      } else {
        element.style.opacity = '0.3';
        element.style.fontSize = '18px';
        element.style.fontWeight = '200';
      }
    });
  };

  const setupPicker = (
    ref: React.RefObject<HTMLDivElement>,
    value: number,
    onChange: (value: number) => void,
    max: number
  ) => {
    const container = ref.current;
    if (!container) return;

    let isScrolling = false;
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      isScrolling = true;
      updateOpacity(container);
      
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isScrolling = false;
        
        // Snap to nearest item
        const scrollTop = container.scrollTop;
        const itemIndex = Math.round(scrollTop / itemHeight);
        const targetScroll = itemIndex * itemHeight;
        
        container.scrollTo({
          top: targetScroll,
          behavior: 'smooth'
        });
        
        // Calculate the actual value (accounting for padding)
        const actualValue = itemIndex - centerIndex;
        const clampedValue = Math.max(0, Math.min(actualValue, max - 1));
        
        if (clampedValue !== value) {
          onChange(clampedValue);
        }
        
        updateOpacity(container);
      }, 150);
    };

    // Set initial scroll position
    const initialScroll = (value + centerIndex) * itemHeight;
    container.scrollTop = initialScroll;
    updateOpacity(container);

    container.addEventListener('scroll', handleScroll);
    
    return () => {
      container.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
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
      const targetScroll = (hours + centerIndex) * itemHeight;
      hoursRef.current.scrollTop = targetScroll;
      updateOpacity(hoursRef.current);
    }
  }, [hours]);

  useEffect(() => {
    if (minutesRef.current) {
      const targetScroll = (minutes + centerIndex) * itemHeight;
      minutesRef.current.scrollTop = targetScroll;
      updateOpacity(minutesRef.current);
    }
  }, [minutes]);

  useEffect(() => {
    if (secondsRef.current) {
      const targetScroll = (seconds + centerIndex) * itemHeight;
      secondsRef.current.scrollTop = targetScroll;
      updateOpacity(secondsRef.current);
    }
  }, [seconds]);

  return (
    <div className="picker-container">
      <div className="picker-overlay"></div>
      <div className="grid grid-cols-3 gap-4 h-full">
        {/* Hours Picker */}
        <div className="picker-column" ref={hoursRef}>
          {createPickerItems(24)}
        </div>
        
        {/* Minutes Picker */}
        <div className="picker-column" ref={minutesRef}>
          {createPickerItems(60)}
        </div>
        
        {/* Seconds Picker */}
        <div className="picker-column" ref={secondsRef}>
          {createPickerItems(60)}
        </div>
      </div>
    </div>
  );
}
