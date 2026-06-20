interface PerformanceMetrics {
  totalGenerations: number;
  successfulGenerations: number;
  failedGenerations: number;
  averageProcessingTime: number;
  cacheHits: number;
  cacheMisses: number;
  cacheHitRate: number;
  p95ProcessingTime: number;
  p99ProcessingTime: number;
  maxProcessingTime: number;
  minProcessingTime: number;
}

interface GenerationRecord {
  taskId: string;
  timestamp: number;
  processingTime: number;
  success: boolean;
  fromCache: boolean;
  errorMessage?: string;
}

export class GenerationPerformanceMonitor {
  private records: GenerationRecord[] = [];
  private readonly maxRecords: number;
  private cacheHits: number = 0;
  private cacheMisses: number = 0;

  constructor(maxRecords: number = 10000) {
    this.maxRecords = maxRecords;
  }

  recordGeneration(
    taskId: string,
    processingTime: number,
    success: boolean,
    fromCache: boolean,
    errorMessage?: string
  ): void {
    this.records.push({
      taskId,
      timestamp: Date.now(),
      processingTime,
      success,
      fromCache,
      errorMessage,
    });

    if (fromCache) {
      this.cacheHits++;
    } else {
      this.cacheMisses++;
    }

    if (this.records.length > this.maxRecords) {
      this.records = this.records.slice(-this.maxRecords);
    }
  }

  recordCacheHit(): void {
    this.cacheHits++;
  }

  recordCacheMiss(): void {
    this.cacheMisses++;
  }

  getMetrics(): PerformanceMetrics {
    if (this.records.length === 0) {
      return {
        totalGenerations: 0,
        successfulGenerations: 0,
        failedGenerations: 0,
        averageProcessingTime: 0,
        cacheHits: 0,
        cacheMisses: 0,
        cacheHitRate: 0,
        p95ProcessingTime: 0,
        p99ProcessingTime: 0,
        maxProcessingTime: 0,
        minProcessingTime: 0,
      };
    }

    const processingTimes = this.records.map((r) => r.processingTime).sort((a, b) => a - b);
    const successful = this.records.filter((r) => r.success).length;
    const totalRequests = this.cacheHits + this.cacheMisses;
    const cacheHitRate = totalRequests > 0 ? (this.cacheHits / totalRequests) * 100 : 0;

    return {
      totalGenerations: this.records.length,
      successfulGenerations: successful,
      failedGenerations: this.records.length - successful,
      averageProcessingTime: processingTimes.reduce((a, b) => a + b, 0) / processingTimes.length,
      cacheHits: this.cacheHits,
      cacheMisses: this.cacheMisses,
      cacheHitRate,
      p95ProcessingTime: processingTimes[Math.floor(processingTimes.length * 0.95)],
      p99ProcessingTime: processingTimes[Math.floor(processingTimes.length * 0.99)],
      maxProcessingTime: Math.max(...processingTimes),
      minProcessingTime: Math.min(...processingTimes),
    };
  }

  getMetricsSince(timestamp: number): PerformanceMetrics {
    const recentRecords = this.records.filter((r) => r.timestamp >= timestamp);

    if (recentRecords.length === 0) {
      return this.getMetrics();
    }

    const processingTimes = recentRecords.map((r) => r.processingTime).sort((a, b) => a - b);
    const successful = recentRecords.filter((r) => r.success).length;
    const recentCacheHits = recentRecords.filter((r) => r.fromCache).length;
    const recentCacheMisses = recentRecords.filter((r) => !r.fromCache).length;
    const totalRequests = recentCacheHits + recentCacheMisses;
    const cacheHitRate = totalRequests > 0 ? (recentCacheHits / totalRequests) * 100 : 0;

    return {
      totalGenerations: recentRecords.length,
      successfulGenerations: successful,
      failedGenerations: recentRecords.length - successful,
      averageProcessingTime: processingTimes.reduce((a, b) => a + b, 0) / processingTimes.length,
      cacheHits: recentCacheHits,
      cacheMisses: recentCacheMisses,
      cacheHitRate,
      p95ProcessingTime: processingTimes[Math.floor(processingTimes.length * 0.95)] || 0,
      p99ProcessingTime: processingTimes[Math.floor(processingTimes.length * 0.99)] || 0,
      maxProcessingTime: Math.max(...processingTimes),
      minProcessingTime: Math.min(...processingTimes),
    };
  }

  reset(): void {
    this.records = [];
    this.cacheHits = 0;
    this.cacheMisses = 0;
  }

  getDetailedMetrics() {
    return {
      summary: this.getMetrics(),
      recentRecords: this.records.slice(-100),
      errorRate: this.records.length > 0
        ? (this.records.filter((r) => !r.success).length / this.records.length) * 100
        : 0,
    };
  }
}

export const performanceMonitor = new GenerationPerformanceMonitor();
