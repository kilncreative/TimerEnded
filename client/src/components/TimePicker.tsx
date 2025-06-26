import { useEffect, useRef, useState } from 'react';

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

  const createPickerColumn = (value: number, max: number, onChange: (value: number) => void, ref: React.RefObject<HTMLDivElement>, label: string) => {
    const items = [];
    
    // Create visible items (only show 3 items at once)
    for (let i = 0; i < max; i++) {
      const isSelected = i === value;
      
      items.push(
        <div 
          key={i} 
          className={`picker-item ${isSelected ? 'selected' : ''}`}
          data-value={i}
          onClick={() => onChange(i)}
        >
          {i}
        </div>
      );
    }
    
    return (
      <div 
        className="picker-column" 
        ref={ref}
        onWheel={(e) => handleWheel(e, onChange, max, value)}
      >
        {items}
      </div>
    );
  };

  const handleWheel = (e: React.WheelEvent, onChange: (value: number) => void, max: number, currentValue: number) => {
    e.preventDefault();
    
    const delta = e.deltaY > 0 ? 1 : -1;
    const newValue = currentValue + delta;
    
    if (newValue >= 0 && newValue < max) {
      onChange(newValue);
    }
  };

  const scrollToValue = (ref: React.RefObject<HTMLDivElement>, value: number) => {
    if (ref.current) {
      const container = ref.current;
      const selectedItem = container.querySelector(`[data-value="${value}"]`) as HTMLElement;
      if (selectedItem) {
        const containerRect = container.getBoundingClientRect();
        const itemRect = selectedItem.getBoundingClientRect();
        const offset = itemRect.top - containerRect.top - (containerRect.height / 2) + (itemHeight / 2);
        container.scrollTop += offset;
      }
    }
  };

  useEffect(() => {
    // Set initial positions
    setTimeout(() => {
      scrollToValue(hoursRef, hours);
      scrollToValue(minutesRef, minutes);
      scrollToValue(secondsRef, seconds);
    }, 100);
  }, []);

  useEffect(() => {
    scrollToValue(hoursRef, hours);
  }, [hours]);

  useEffect(() => {
    scrollToValue(minutesRef, minutes);
  }, [minutes]);

  useEffect(() => {
    scrollToValue(secondsRef, seconds);  
  }, [seconds]);

  return (
    <div className="picker-container">
      <div className="picker-overlay"></div>
      <div className="grid grid-cols-3 h-full">
        {createPickerColumn(hours, 24, onHoursChange, hoursRef, 'hours')}
        {createPickerColumn(minutes, 60, onMinutesChange, minutesRef, 'minutes')}
        {createPickerColumn(seconds, 60, onSecondsChange, secondsRef, 'seconds')}
      </div>
    </div>
  );
}
