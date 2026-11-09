import React from 'react';

interface ReadingProgressBarProps {
  progress: number;
}

export const ReadingProgressBar: React.FC<ReadingProgressBarProps> = ({
  progress,
}) => {
  return (
    <aside
      aria-label="Reading progress indicator"
      className="fixed top-[calc(4rem+10vh)] bottom-[10vh] right-0.5 sm:right-1 z-30 flex flex-col items-end gap-1 pointer-events-none select-none"
    >
      <div
        role="progressbar"
        aria-label="Reading progress"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        className="w-[2px] sm:w-1 flex-1 bg-stone-200/80 rounded-full overflow-hidden mr-0.5"
      >
        <div
          className="w-full bg-stone-800 rounded-full transition-all duration-150 ease-out"
          style={{ height: `${progress}%` }}
        />
      </div>
      <span className="text-[8px] sm:text-[9px] font-mono tabular-nums tracking-tighter text-stone-400 leading-none">
        {progress}%
      </span>
    </aside>
  );
};
