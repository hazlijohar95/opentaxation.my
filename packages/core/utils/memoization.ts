/**
 * Memoization utilities for expensive calculations
 */

/**
 * Simple memoization cache with size limit
 */
export class MemoCache<K, V> {
  private cache = new Map<K, V>();
  private maxSize: number;

  constructor(maxSize = 100) {
    this.maxSize = maxSize;
  }

  get(key: K): V | undefined {
    return this.cache.get(key);
  }

  set(key: K, value: V): void {
    // If cache is full, remove oldest entry
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }
    this.cache.set(key, value);
  }

  clear(): void {
    this.cache.clear();
  }

  has(key: K): boolean {
    return this.cache.has(key);
  }
}

/**
 * Create a memoized function with cache
 */
export function memoize<Args extends unknown[], Return>(
  fn: (...args: Args) => Return,
  keyGenerator?: (...args: Args) => string,
  maxCacheSize = 100
): (...args: Args) => Return {
  const cache = new MemoCache<string, Return>(maxCacheSize);
  
  return (...args: Args): Return => {
    const key = keyGenerator 
      ? keyGenerator(...args)
      : JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

