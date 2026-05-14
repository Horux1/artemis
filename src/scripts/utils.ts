/**
 * Clamp a number between min and max (inclusive).
 */
export const clamp = (v: number, lo = 0, hi = 1): number =>
  Math.max(lo, Math.min(hi, v));

/**
 * Linear interpolation between a and b.
 */
export const lerp = (a: number, b: number, t: number): number =>
  a + (b - a) * t;

/**
 * Smoothstep easing: like linear but with eased start and end.
 */
export const smooth = (t: number): number => t * t * (3 - 2 * t);

/**
 * RequestAnimationFrame throttle. Wraps a function so it only runs once
 * per animation frame, no matter how many times it's called.
 */
export function rafThrottle<T extends (...args: never[]) => void>(fn: T): T {
  let ticking = false;
  return ((...args: never[]) => {
    if (!ticking) {
      requestAnimationFrame(() => {
        fn(...args);
        ticking = false;
      });
      ticking = true;
    }
  }) as T;
}
