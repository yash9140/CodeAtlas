/**
 * Centralized logger utility for backend logging.
 * Helps trace cache hits, API calls, errors, and system startups.
 */
export const logger = {
  info: (message, ...args) => {
    console.log(`\x1b[36m[INFO] [${new Date().toISOString()}] ${message}\x1b[0m`, ...args);
  },
  success: (message, ...args) => {
    console.log(`\x1b[32m[SUCCESS] [${new Date().toISOString()}] ${message}\x1b[0m`, ...args);
  },
  warn: (message, ...args) => {
    console.warn(`\x1b[33m[WARN] [${new Date().toISOString()}] ${message}\x1b[0m`, ...args);
  },
  error: (message, error) => {
    console.error(`\x1b[31m[ERROR] [${new Date().toISOString()}] ${message}\x1b[0m`, error ? error.message || error : '');
  },
  cacheHit: (key) => {
    console.log(`\x1b[35m[CACHE HIT] [${new Date().toISOString()}] Key: ${key}\x1b[0m`);
  },
  cacheMiss: (key) => {
    console.log(`\x1b[34m[CACHE MISS] [${new Date().toISOString()}] Key: ${key}\x1b[0m`);
  }
};
