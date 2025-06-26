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

  const createScrollableColumn = (
    value: number, 
    max: number, 
    onChange: (value: number) => void, 
    ref: React.RefObject<HTMLDivElement>
  ) => {
    const items = [];
    
    // Create many repeating items for infinite scroll effect
    const totalItems = max * 10; // 10 repetitions for smooth infinite scroll
    
    for (let i = 0; i < totalItems; i++) {
      const itemValue = i % max;
      items.push(
        <div 
          key={i}
          className="scroll-item"
          data-value={itemValue}
        >
          {itemValue.toString().padStart(2, '0')}
        </div>
      );
    }

    let isUserScrolling = false;
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      if (!ref.current) return;
      
      clearTimeout(scrollTimeout);
      isUserScrolling = true;
      
      scrollTimeout = setTimeout(() => {
        if (!ref.current) return;
        
        const scrollTop = ref.current.scrollTop;
        const containerHeight = ref.current.clientHeight;
        const centerPoint = scrollTop + (containerHeight / 2);
        const itemIndex = Math.round(centerPoint / itemHeight);
        const newValue = itemIndex % max;
        
        if (newValue !== value) {
          onChange(newValue);
        }
        
        // Snap to center
        const targetScrollTop = (itemIndex * itemHeight) - (containerHeight / 2) + (itemHeight / 2);
        ref.current.scrollTo({
          top: targetScrollTop,
          behavior: 'smooth'
        });
        
        isUserScrolling = false;
      }, 100);
    };

    const handleWheel = (e: React.WheelEvent) => {
      e.preventDefault();
      if (!ref.current) return;
      
      const delta = e.deltaY > 0 ? 1 : -1;
      const newValue = (value + delta + max) % max;
      onChange(newValue);
    };

    return (
      <div 
        className="scroll-column"
        ref={ref}
        onScroll={handleScroll}
        onWheel={handleWheel}
      >
        <div className="scroll-spacer"></div>
        {items}
        <div className="scroll-spacer"></div>
      </div>
    );
  };

  const scrollToValue = (ref: React.RefObject<HTMLDivElement>, value: number, max: number) => {
    if (!ref.current) return;
    
    // Find middle repetition and scroll to it
    const middleRepetition = 5; // Use middle of 10 repetitions
    const targetIndex = (middleRepetition * max) + value;
    const containerHeight = ref.current.clientHeight;
    const targetScrollTop = (targetIndex * itemHeight) - (containerHeight / 2) + (itemHeight / 2);
    
    ref.current.scrollTop = targetScrollTop;
  };

  // Initialize positions
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToValue(hoursRef, hours, 24);
      scrollToValue(minutesRef, minutes, 60);
      scrollToValue(secondsRef, seconds, 60);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Update positions when values change
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
        {createScrollableColumn(hours, 24, onHoursChange, hoursRef)}
        {createScrollableColumn(minutes, 60, onMinutesChange, minutesRef)}
        {createScrollableColumn(seconds, 60, onSecondsChange, secondsRef)}
      </div>
    </div>
  );
}