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

  const itemHeight = 44;

  const createWheelColumn = (
    value: number, 
    max: number, 
    onChange: (value: number) => void, 
    ref: React.RefObject<HTMLDivElement>
  ) => {
    const items = [];
    
    // Create enough items for smooth infinite scrolling
    const repeatCount = 5;
    const totalItems = max * repeatCount;
    
    for (let i = 0; i < totalItems; i++) {
      const itemValue = i % max;
      const isSelected = itemValue === value;
      
      items.push(
        <div 
          key={i}
          className={`picker-item ${isSelected ? 'selected' : ''}`}
          data-value={itemValue}
        >
          {itemValue.toString().padStart(2, '0')}
        </div>
      );
    }

    const handleWheel = (e: React.WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 1 : -1;
      const newValue = (value + delta + max) % max;
      onChange(newValue);
    };

    let isScrolling = false;
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      if (!ref.current) return;
      
      isScrolling = true;
      clearTimeout(scrollTimeout);
      
      scrollTimeout = setTimeout(() => {
        if (!ref.current) return;
        
        const scrollTop = ref.current.scrollTop;
        const itemIndex = Math.round(scrollTop / itemHeight);
        const newValue = itemIndex % max;
        
        // Snap to position
        const targetScrollTop = itemIndex * itemHeight;
        ref.current.scrollTo({
          top: targetScrollTop,
          behavior: 'smooth'
        });
        
        if (newValue !== value) {
          onChange(newValue);
        }
        
        isScrolling = false;
      }, 100);
    };

    return (
      <div 
        className="picker-column"
        ref={ref}
        onWheel={handleWheel}
        onScroll={handleScroll}
      >
        {items}
      </div>
    );
  };

  const scrollToValue = (ref: React.RefObject<HTMLDivElement>, value: number, max: number) => {
    if (!ref.current) return;
    
    // Find the middle occurrence of the value
    const middleRepeat = Math.floor(5 / 2); // 5 is repeatCount
    const targetIndex = middleRepeat * max + value;
    const targetScrollTop = targetIndex * itemHeight - (itemHeight * 2); // Center in view
    
    ref.current.scrollTop = targetScrollTop;
  };

  // Initialize scroll positions
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToValue(hoursRef, hours, 24);
      scrollToValue(minutesRef, minutes, 60);
      scrollToValue(secondsRef, seconds, 60);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Update scroll positions when values change externally
  useEffect(() => {
    scrollToValue(hoursRef, hours, 24);
  }, [hours]);

  useEffect(() => {
    scrollToValue(minutesRef, minutes, 60);
  }, [minutes]);

  useEffect(() => {
    scrollToValue(secondsRef, seconds, 60);
  }, [seconds]);

  return (
    <div className="picker-container">
      <div className="picker-overlay"></div>
      <div className="grid grid-cols-3 h-full">
        {createWheelColumn(hours, 24, onHoursChange, hoursRef)}
        {createWheelColumn(minutes, 60, onMinutesChange, minutesRef)}
        {createWheelColumn(seconds, 60, onSecondsChange, secondsRef)}
      </div>
    </div>
  );
}