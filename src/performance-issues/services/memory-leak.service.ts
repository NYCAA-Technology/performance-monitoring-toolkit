import { Injectable } from '@nestjs/common';

interface MemoryLeakAnalytics {
  leakedObjectCount: number;
  severity: 'low' | 'medium' | 'high';
  leakDetails: {
    cacheSizeCount: number;
    arraySize: number;
    closureLeakCount: number;
    eventListenerLeakCount: number;
  };
  potentialImpact: string;
  recommendedActions: string[];
}

@Injectable()
export class MemoryLeakService {
  // Simulated memory leak scenarios
  private leakyCache: Map<string, any> = new Map();
  private leakyArray: any[] = [];
  private closureLeak: (() => void)[] = [];
  private eventListenerLeaks: EventTarget[] = [];

  /**
   * Generate comprehensive memory leaks
   * @param count Number of leak objects to create
   */
  generateMemoryLeaks(count: number = 1000): void {
    // Clear previous leaks
    this.resetLeaks();

    // Create different types of memory leaks
    this.createCacheMemoryLeak(count);
    this.createArrayMemoryLeak(count);
    this.createClosureLeak(count);
    this.createEventListenerLeak(count);
  }

  /**
   * Create a cache-based memory leak
   * @param count Number of leak objects to create
   */
  private createCacheMemoryLeak(count: number): void {
    for (let i = 0; i < count; i++) {
      const key = `cache-leak-${Math.random().toString(36).substring(7)}`;
      
      const largeObject = {
        id: key,
        data: new Array(10000).fill(`Cache leak data ${i}`),
        timestamp: Date.now()
      };
      
      this.leakyCache.set(key, largeObject);
    }
  }

  /**
   * Create an array-based memory leak
   * @param count Number of leak objects to create
   */
  private createArrayMemoryLeak(count: number): void {
    for (let i = 0; i < count; i++) {
      const largeArray = new Array(10000).fill(`Array leak data ${i}`);
      this.leakyArray.push(largeArray);
    }
  }

  /**
   * Create closure-based memory leak
   * @param count Number of closure leaks to create
   */
  private createClosureLeak(count: number): void {
    const createLeakyFunction = () => {
      const leakyData: any[] = [];
      
      return () => {
        leakyData.push(new Array(10000).fill(`Closure leak data ${Date.now()}`));
      };
    };

    for (let i = 0; i < count; i++) {
      this.closureLeak.push(createLeakyFunction());
    }
  }

  /**
   * Create event listener memory leak
   * @param count Number of event listeners to create
   */
  private createEventListenerLeak(count: number): void {
    for (let i = 0; i < count; i++) {
      const eventSource = new EventTarget();
      const leakyHandler = () => {
        const largeData = new Array(10000).fill(`Event listener leak ${i}`);
      };

      // Add multiple listeners without removal
      for (let j = 0; j < 10; j++) {
        eventSource.addEventListener(`leak-event-${i}`, leakyHandler);
      }

      this.eventListenerLeaks.push(eventSource);
    }
  }

  /**
   * Analyze memory leaks and provide comprehensive analytics
   */
  analyzeMemoryLeaks(): MemoryLeakAnalytics {
    const leakStats = this.getLeakStatistics();
    const totalLeakedObjects = 
      leakStats.cacheSizeCount + 
      leakStats.arraySize + 
      leakStats.closureLeakCount +
      leakStats.eventListenerLeakCount;

    // Determine severity based on leaked object count
    let severity: 'low' | 'medium' | 'high' = 'low';
    if (totalLeakedObjects > 1000) severity = 'high';
    else if (totalLeakedObjects > 500) severity = 'medium';

    return {
      leakedObjectCount: totalLeakedObjects,
      severity,
      leakDetails: leakStats,
      potentialImpact: this.getPotentialImpact(severity),
      recommendedActions: this.getRecommendedActions(severity)
    };
  }

  /**
   * Get current memory leak statistics
   */
  private getLeakStatistics(): {
    cacheSizeCount: number;
    arraySize: number;
    closureLeakCount: number;
    eventListenerLeakCount: number;
  } {
    return {
      cacheSizeCount: this.leakyCache.size,
      arraySize: this.leakyArray.length,
      closureLeakCount: this.closureLeak.length,
      eventListenerLeakCount: this.eventListenerLeaks.length
    };
  }

  /**
   * Determine potential impact based on severity
   * @param severity Leak severity
   */
  private getPotentialImpact(severity: 'low' | 'medium' | 'high'): string {
    switch (severity) {
      case 'high': 
        return 'Severe memory consumption, potential application crash';
      case 'medium': 
        return 'Gradual memory growth, potential performance degradation';
      default: 
        return 'Minimal memory impact, within acceptable limits';
    }
  }

  /**
   * Determine recommended actions based on severity
   * @param severity Leak severity
   */
  private getRecommendedActions(severity: 'low' | 'medium' | 'high'): string[] {
    switch (severity) {
      case 'high': 
        return [
          'Immediate memory leak investigation',
          'Implement aggressive memory management',
          'Use weak references',
          'Add memory leak detection middleware'
        ];
      case 'medium': 
        return [
          'Review memory allocation patterns',
          'Implement cache size limits',
          'Add periodic memory cleanup',
          'Monitor memory consumption'
        ];
      default: 
        return [
          'Continue monitoring memory usage',
          'Conduct periodic code reviews',
          'Maintain current memory management strategies'
        ];
    }
  }

  /**
   * Reset all leak sources
   */
  private resetLeaks(): void {
    this.leakyCache.clear();
    this.leakyArray = [];
    this.closureLeak = [];
    this.eventListenerLeaks = [];
  }

  /**
   * Attempt to clear memory leaks
   */
  attemptMemoryCleanup(): void {
    this.resetLeaks();
  }
}
