interface TimerDisplayProps {
  remainingTime: number;
  isPaused: boolean;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
}

export default function TimerDisplay({ remainingTime, isPaused, onPause, onResume, onStop }: TimerDisplayProps) {
  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="text-center">
      {/* Countdown Display */}
      <div className="mb-12">
        <div className="countdown-display text-8xl font-light mb-4 text-white">
          {formatTime(remainingTime)}
        </div>
        <div 
          className="text-lg"
          style={{ color: 'var(--text-secondary)' }}
        >
          Timer
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex justify-center gap-6">
        <button
          onClick={isPaused ? onResume : onPause}
          className="w-20 h-20 rounded-full flex items-center justify-center text-lg font-medium transition-all duration-200 active:scale-95"
          style={{ backgroundColor: 'var(--cancel-gray)' }}
        >
          {isPaused ? 'Resume' : 'Pause'}
        </button>
        <button
          onClick={onStop}
          className="w-20 h-20 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center text-lg font-semibold transition-all duration-200 active:scale-95"
        >
          Stop
        </button>
      </div>
    </div>
  );
}
