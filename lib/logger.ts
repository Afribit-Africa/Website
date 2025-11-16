/**
 * Logger Utility
 * Provides conditional logging based on environment
 * Prevents console.log pollution in production
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LoggerConfig {
  isDevelopment: boolean;
  enableDebug: boolean;
}

class Logger {
  private config: LoggerConfig;

  constructor() {
    this.config = {
      isDevelopment: process.env.NODE_ENV === 'development',
      enableDebug: process.env.ENABLE_DEBUG_LOGS === 'true',
    };
  }

  /**
   * Info logs - only in development
   */
  info(...args: any[]): void {
    if (this.config.isDevelopment) {
      console.log('[INFO]', ...args);
    }
  }

  /**
   * Warning logs - only in development
   */
  warn(...args: any[]): void {
    if (this.config.isDevelopment) {
      console.warn('[WARN]', ...args);
    }
  }

  /**
   * Error logs - always logged
   */
  error(...args: any[]): void {
    console.error('[ERROR]', ...args);
  }

  /**
   * Debug logs - only when explicitly enabled
   */
  debug(...args: any[]): void {
    if (this.config.isDevelopment && this.config.enableDebug) {
      console.debug('[DEBUG]', ...args);
    }
  }

  /**
   * Group logs - only in development
   */
  group(label: string): void {
    if (this.config.isDevelopment) {
      console.group(label);
    }
  }

  groupEnd(): void {
    if (this.config.isDevelopment) {
      console.groupEnd();
    }
  }

  /**
   * Table logs - only in development
   */
  table(data: any): void {
    if (this.config.isDevelopment) {
      console.table(data);
    }
  }
}

// Export singleton instance
export const logger = new Logger();

// Export for backwards compatibility
export default logger;
