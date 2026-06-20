import NodeCache from 'node-cache';
import crypto from 'crypto';

interface CacheEntry {
  content: string;
  metadata: {
    createdAt: number;
    processingTime: number;
    prompt: string;
  };
}

interface CacheConfig {
  stdTTL: number;
  checkperiod: number;
  useClones: boolean;
  maxCacheSize: number;
}

export class StoryGenerationCache {
  private cache: NodeCache;
  private readonly config: CacheConfig;
  private cacheHits: number = 0;
  private cacheMisses: number = 0;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      stdTTL: config.stdTTL || 3600,
      checkperiod: config.checkperiod || 600,
      useClones: config.useClones !== false,
      maxCacheSize: config.maxCacheSize || 1000,
    };

    this.cache = new NodeCache({
      stdTTL: this.config.stdTTL,
      checkperiod: this.config.checkperiod,
      useClones: this.config.useClones,
    });
  }

  private generateCacheKey(prompt: string, config: Record<string, any>): string {
    const data = JSON.stringify({ prompt, config });
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  set(prompt: string, content: string, config: Record<string, any>, processingTime: number): void {
    if (this.cache.getStats().keys >= this.config.maxCacheSize) {
      const oldestKey = this.cache.keys()[0];
      if (oldestKey) this.cache.del(oldestKey);
    }

    const key = this.generateCacheKey(prompt, config);
    const entry: CacheEntry = {
      content,
      metadata: {
        createdAt: Date.now(),
        processingTime,
        prompt,
      },
    };

    this.cache.set(key, entry);
  }

  get(prompt: string, config: Record<string, any>): CacheEntry | undefined {
    const key = this.generateCacheKey(prompt, config);
    const entry = this.cache.get<CacheEntry>(key);

    if (entry) {
      this.cacheHits++;
      return entry;
    }

    this.cacheMisses++;
    return undefined;
  }

  has(prompt: string, config: Record<string, any>): boolean {
    const key = this.generateCacheKey(prompt, config);
    return this.cache.has(key);
  }

  invalidate(prompt: string, config: Record<string, any>): boolean {
    const key = this.generateCacheKey(prompt, config);
    return this.cache.del(key) > 0;
  }

  clear(): void {
    this.cache.flushAll();
    this.cacheHits = 0;
    this.cacheMisses = 0;
  }

  getStats() {
    const totalRequests = this.cacheHits + this.cacheMisses;
    const hitRate = totalRequests > 0 ? (this.cacheHits / totalRequests) * 100 : 0;

    return {
      keys: this.cache.getStats().keys,
      hits: this.cacheHits,
      misses: this.cacheMisses,
      hitRate: hitRate.toFixed(2) + '%',
      ksize: this.cache.getStats().ksize,
      vsize: this.cache.getStats().vsize,
    };
  }

  getSize(): number {
    return this.cache.getStats().keys;
  }

  warmUp(entries: Array<{ prompt: string; config: Record<string, any>; content: string; processingTime: number }>): void {
    entries.forEach(({ prompt, config, content, processingTime }) => {
      this.set(prompt, content, config, processingTime);
    });
  }
}

export const storyGenerationCache = new StoryGenerationCache({
  stdTTL: 3600,
  checkperiod: 600,
  maxCacheSize: 1000,
});
