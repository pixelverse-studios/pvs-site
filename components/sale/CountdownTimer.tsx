'use client';

import { useEffect, useState } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownTimerProps {
  endDate: string;
  onExpire?: () => void;
  compact?: boolean;
  className?: string;
}

export function CountdownTimer({
  endDate,
  onExpire,
  compact = false,
  className = '',
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const calculateTimeLeft = (): TimeLeft | null => {
      const difference = new Date(endDate).getTime() - Date.now();
      if (difference <= 0) {
        onExpire?.();
        return null;
      }
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate, onExpire]);

  // Prevent hydration mismatch
  if (!mounted || !timeLeft) return null;

  const TimeUnit = ({
    value,
    label,
  }: {
    value: number;
    label: string;
  }) => (
    <div
      className={`flex flex-col items-center ${
        compact ? 'min-w-[28px] px-1 py-0.5' : 'min-w-[36px] px-1.5 py-1'
      } rounded-md bg-black/15`}
    >
      <span
        className={`font-semibold tabular-nums leading-tight text-white ${
          compact ? 'text-sm' : 'text-base'
        }`}
      >
        {value.toString().padStart(2, '0')}
      </span>
      {!compact && (
        <span className="text-[0.5rem] font-medium uppercase tracking-widest text-white/70">
          {label}
        </span>
      )}
    </div>
  );

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {timeLeft.days > 0 && (
        <>
          <TimeUnit value={timeLeft.days} label="days" />
          <span className="animate-pulse text-base font-bold text-white/50">
            :
          </span>
        </>
      )}
      <TimeUnit value={timeLeft.hours} label="hrs" />
      <span className="animate-pulse text-base font-bold text-white/50">:</span>
      <TimeUnit value={timeLeft.minutes} label="min" />
      <span className="animate-pulse text-base font-bold text-white/50">:</span>
      <TimeUnit value={timeLeft.seconds} label="sec" />
    </div>
  );
}
