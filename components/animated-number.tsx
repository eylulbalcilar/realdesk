'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView, useMotionValue, useSpring } from 'framer-motion';

export function AnimatedNumber({
  value,
  decimals = 0,
  prefix = '',
  suffix = '',
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { duration: 1500, bounce: 0 });
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, value, motionValue]);

  useEffect(() => {
    const unsubscribe = spring.on('change', (latest) => {
      setDisplay(
        latest.toLocaleString('en-US', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })
      );
    });
    return unsubscribe;
  }, [spring, decimals]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
