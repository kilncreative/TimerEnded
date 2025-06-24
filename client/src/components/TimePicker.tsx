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
  const createPickerItems = (max: number, current: number, onChange: (value: number) => void) => {
    const items = [];
    for (let i = 0; i < max; i++) {
      items.push(
        <button
          key={i}
          onClick={() => onChange(i)}
          className={`picker-item text-white transition-opacity duration-150 ${
            i === current ? 'opacity-100' : 'opacity-30 hover:opacity-60'
          }`}
        >
          {i}
        </button>
      );
    }
    return items;
  };

  return (
    <div className="picker-container">
      <div className="picker-overlay"></div>
      <div className="grid grid-cols-3 gap-4 h-full">
        {/* Hours Picker */}
        <div className="picker-column">
          {createPickerItems(24, hours, onHoursChange)}
        </div>
        
        {/* Minutes Picker */}
        <div className="picker-column">
          {createPickerItems(60, minutes, onMinutesChange)}
        </div>
        
        {/* Seconds Picker */}
        <div className="picker-column">
          {createPickerItems(60, seconds, onSecondsChange)}
        </div>
      </div>
    </div>
  );
}
