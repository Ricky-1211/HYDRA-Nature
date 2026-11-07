/**
 * Production-level Console Disabler & Sanitizer (Client-side)
 *
 * Silences unnecessary console output in production builds to prevent sensitive data exposure
 * (e.g. Redux state, auth tokens, API payloads) and improve browser performance while safely
 * preserving critical error diagnostics.
 */

export interface ConsoleOverrideOptions {
  /**
   * Whether to preserve console.error for critical runtime errors and telemetry.
   * @default true
   */
  preserveError?: boolean;

  /**
   * Force silence regardless of environment (useful for security audits or staging).
   * @default false
   */
  force?: boolean;
}

// Store original console methods for emergency telemetry, debugging, or test harnesses
export const originalConsole = {
  log: console.log.bind(console),
  info: console.info.bind(console),
  debug: console.debug.bind(console),
  warn: console.warn.bind(console),
  error: console.error.bind(console),
} as const;

/**
 * Safely checks if the current environment is production across browser, Vite, and bundler runtimes.
 */
const isProductionEnvironment = (): boolean => {
  // Vite / ESM build check
  if (typeof import.meta !== 'undefined' && import.meta.env?.PROD) {
    return true;
  }

  // Fallback for bundlers injecting process or window.__ENV
  const globalObj = typeof globalThis !== 'undefined' ? (globalThis as Record<string, any>) : undefined;
  if (globalObj?.process?.env?.NODE_ENV === 'production') {
    return true;
  }

  return false;
};

/**
 * Overrides the global console methods in production mode.
 */
export const disableConsoleInProduction = (options: ConsoleOverrideOptions = {}): void => {
  const { preserveError = true, force = false } = options;

  if (!force && !isProductionEnvironment()) {
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
