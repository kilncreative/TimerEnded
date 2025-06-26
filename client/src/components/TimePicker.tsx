import { useEffect, useState } from 'react';

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
  const [isDragging, setIsDragging] = useState<string | null>(null);
  const [startY, setStartY] = useState(0);
  const [startValue, setStartValue] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);

  const itemHeight = 44;

  const createColumn = (
    value: number, 
    max: number, 
    onChange: (value: number) => void,
    columnId: string
  ) => {
    const visibleItems = [];
    const currentDragOffset = isDragging === columnId ? dragOffset : 0;
    
    // Show 5 items for smooth scrolling effect
    for (let i = -2; i <= 2; i++) {
      const itemValue = (value + i + max) % max;
      const isCenter = i === 0;
      const distance = Math.abs(i);
      
      visibleItems.push(
        <div 
          key={`${itemValue}-${i}`}
          className={`picker-item ${isCenter ? 'selected' : ''}`}
          style={{
            opacity: isCenter ? 1 : Math.max(0.1, 0.6 - (distance * 0.3)),
            fontWeight: isCenter ? 600 : 400,
            transform: `translateY(${(i * itemHeight) + currentDragOffset}px)`,
            position: 'absolute',
            top: '50%',
            left: 0,
            right: 0,
            marginTop: `-${itemHeight / 2}px`,
            transition: isDragging === columnId ? 'none' : 'all 0.3s ease-out'
          }}
        >
          {itemValue.toString().padStart(2, '0')}
        </div>
      );
    }

    const handleMouseDown = (e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(columnId);
      setStartY(e.clientY);
      setStartValue(value);
    };

    const handleWheel = (e: React.WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 1 : -1;
      const newValue = (value + delta + max) % max;
      onChange(newValue);
    };

    const handleClick = (e: React.MouseEvent) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickY = e.clientY - rect.top;
      const centerY = rect.height / 2;
      
      if (clickY < centerY - itemHeight / 2) {
        // Clicked on top item
        const newValue = (value - 1 + max) % max;
        onChange(newValue);
      } else if (clickY > centerY + itemHeight / 2) {
        // Clicked on bottom item
        const newValue = (value + 1) % max;
        onChange(newValue);
      }
    };

    return (
      <div 
        className="picker-column"
        onMouseDown={handleMouseDown}
        onWheel={handleWheel}
        onClick={handleClick}
        style={{ cursor: isDragging === columnId ? 'grabbing' : 'grab' }}
      >
        {visibleItems}
      </div>
    );
  };

  // Global mouse events for dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const deltaY = e.clientY - startY;
      setDragOffset(-deltaY);
      
      const itemsMoved = Math.round(deltaY / itemHeight);
      
      if (isDragging === 'hours') {
        const newValue = (startValue - itemsMoved + 24) % 24;
        if (newValue !== hours) onHoursChange(newValue);
      } else if (isDragging === 'minutes') {
        const newValue = (startValue - itemsMoved + 60) % 60;
        if (newValue !== minutes) onMinutesChange(newValue);
      } else if (isDragging === 'seconds') {
        const newValue = (startValue - itemsMoved + 60) % 60;
        if (newValue !== seconds) onSecondsChange(newValue);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(null);
      setDragOffset(0);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, startY, startValue, hours, minutes, seconds, onHoursChange, onMinutesChange, onSecondsChange]);

  return (
    <div className="picker-container">
      <div className="picker-overlay"></div>
      <div className="grid grid-cols-3 h-full">
        {createColumn(hours, 24, onHoursChange, 'hours')}
        {createColumn(minutes, 60, onMinutesChange, 'minutes')}
        {createColumn(seconds, 60, onSecondsChange, 'seconds')}
      </div>
    </div>
  );
}