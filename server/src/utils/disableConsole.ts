/**
 * Production-level Console Disabler & Sanitizer (Server-side)
 *
 * Suppresses verbose development console logs in production mode while
 * keeping console.error intact for unhandled exceptions, PM2/Docker stderr streams,
 * and external log aggregators (e.g., Datadog, CloudWatch).
 */

export interface ConsoleOverrideOptions {
  /**
   * Whether to preserve console.error for critical runtime errors and stack traces.
   * @default true
   */
  preserveError?: boolean;

  /**
   * Force silencing regardless of NODE_ENV.
   * @default false
   */
  force?: boolean;
}

// Retain references to native Node console methods for structured loggers or emergency hooks
export const originalConsole = {
  log: console.log.bind(console),
  info: console.info.bind(console),
  debug: console.debug.bind(console),
  warn: console.warn.bind(console),
  error: console.error.bind(console),
} as const;

/**
 * Overrides default Node.js console methods when running in production.
 */
export const disableConsoleInProduction = (options: ConsoleOverrideOptions = {}): void => {
  const { preserveError = true, force = false } = options;

  if (!force && process.env.NODE_ENV !== 'production') {
    return;
  }

  const noop = (): void => {};

  console.log = noop;
  console.debug = noop;
  console.info = noop;
  console.warn = noop;

  if (!preserveError) {
    console.error = noop;
  }
};
