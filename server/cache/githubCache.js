import NodeCache from 'node-cache';
import { logger } from '../utils/logger.js';

// Initialize cache with default TTL of 60 seconds and checkperiod of 10 seconds for expired keys deletion
const cache = new NodeCache({ stdTTL: 60, checkperiod: 10 });

/**
 * Get item from cache
 * @param {string} key 
 * @returns {any}
 */
export const get = (key) => {
  const value = cache.get(key);
  if (value !== undefined) {
    logger.cacheHit(key);
    return value;
  }
  logger.cacheMiss(key);
  return null;
};

/**
 * Set item in cache
 * @param {string} key 
 * @param {any} value 
 * @param {number} [ttl] - Optional TTL overrides default 60s
 * @returns {boolean}
 */
export const set = (key, value, ttl = 60) => {
  logger.info(`Setting Cache Key: ${key} with TTL: ${ttl}s`);
  return cache.set(key, value, ttl);
};

/**
 * Check if key exists in cache
 * @param {string} key 
 * @returns {boolean}
 */
export const has = (key) => {
  return cache.has(key);
};

/**
 * Delete item from cache
 * @param {string} key 
 * @returns {number}
 */
export const del = (key) => {
  logger.info(`Deleting Cache Key: ${key}`);
  return cache.del(key);
};

/**
 * Flush cache (useful for admin or test resets)
 */
export const flush = () => {
  logger.warn('Flushing entire GitHub Cache');
  cache.flushAll();
};

export default {
  get,
  set,
  has,
  del,
  flush
};
