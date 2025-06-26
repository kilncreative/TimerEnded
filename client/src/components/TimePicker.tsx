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

  const createPickerColumn = (value: number, max: number, onChange: (value: number) => void, ref: React.RefObject<HTMLDivElement>) => {
    const items = [];
    
    // Add padding items for smooth scrolling
    for (let i = -2; i < max + 2; i++) {
      const displayValue = i < 0 ? '' : i >= max ? '' : i.toString();
      const isSelected = i === value;
      
      items.push(
        <div 
          key={i} 
          className={`picker-item ${isSelected ? 'selected' : ''}`}
          data-value={i}
        >
          {displayValue}
        </div>
      );
    }
    
    return (
      <div 
        className="picker-column" 
        ref={ref}
        onWheel={(e) => handleWheel(e, onChange, max, value)}
        onScroll={(e) => handleScroll(e.currentTarget, onChange, max)}
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

  const handleScroll = (container: HTMLDivElement, onChange: (value: number) => void, max: number) => {
    const scrollTop = container.scrollTop;
    const itemIndex = Math.round(scrollTop / itemHeight);
    const actualValue = itemIndex - 2; // Account for padding
    
    if (actualValue >= 0 && actualValue < max) {
      onChange(actualValue);
    }
  };

  const scrollToValue = (ref: React.RefObject<HTMLDivElement>, value: number) => {
    if (ref.current) {
      const targetScroll = (value + 2) * itemHeight; // Add 2 for padding
      ref.current.scrollTop = targetScroll;
    }
  };

  useEffect(() => {
    // Set initial positions with delay to ensure DOM is ready
    const timer = setTimeout(() => {
      scrollToValue(hoursRef, hours);
      scrollToValue(minutesRef, minutes);
      scrollToValue(secondsRef, seconds);
    }, 50);
    
    return () => clearTimeout(timer);
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
        {createPickerColumn(hours, 24, onHoursChange, hoursRef)}
        {createPickerColumn(minutes, 60, onMinutesChange, minutesRef)}
        {createPickerColumn(seconds, 60, onSecondsChange, secondsRef)}
      </div>
    </div>
  );
}
