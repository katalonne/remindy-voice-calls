"use client";

import { useEffect, useState } from "react";
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from "date-fns";

interface CountdownTimerProps {
  scheduledTime: string; // ISO string
  initialSecondsRemaining: number;
}

export function CountdownTimer({ scheduledTime, initialSecondsRemaining }: CountdownTimerProps) {
  const [secondsRemaining, setSecondsRemaining] = useState(initialSecondsRemaining);

  useEffect(() => {
    // Calculate the exact time remaining based on scheduled time
    const updateCountdown = () => {
      const now = new Date();
      const scheduled = new Date(scheduledTime);
      const remaining = Math.max(0, differenceInSeconds(scheduled, now));
      setSecondsRemaining(remaining);
    };

    // Update immediately
    updateCountdown();

    // Update every second
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [scheduledTime]);

  if (secondsRemaining === 0) {
    return <span className="text-sm font-mono text-muted-foreground">Due now</span>;
  }

  const scheduled = new Date(scheduledTime);
  const now = new Date();

  const days = differenceInDays(scheduled, now);
  const hours = differenceInHours(scheduled, now) % 24;
  const minutes = differenceInMinutes(scheduled, now) % 60;
  const seconds = secondsRemaining % 60;

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  parts.push(`${seconds}s`);

  return (
    <span className="text-sm font-mono text-primary font-semibold">
      {parts.join(" ")}
    </span>
  );
}

