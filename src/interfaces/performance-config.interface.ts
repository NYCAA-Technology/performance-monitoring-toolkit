export interface PerformanceConfigInterface {
  /**
   * Logging level for performance detection
   */
  logLevel?: 'error' | 'warn' | 'log' | 'verbose' | 'debug';

  /**
   * Performance thresholds for different metrics
   */
  thresholds?: {
    /**
     * Memory leak detection threshold in bytes
     */
    memoryLeak?: number;

    /**
     * CPU load threshold in percentage
     */
    cpuLoad?: number;

    /**
     * Async operation timeout threshold in milliseconds
     */
    asyncTimeout?: number;

    /**
     * Maximum allowed memory usage percentage
     */
    memoryUsage?: number;

    /**
     * Maximum allowed request latency in milliseconds
     */
    requestLatency?: number;
  };

  /**
   * Performance tracking options
   */
  tracking?: {
    /**
     * Enable memory leak tracking
     */
    memoryLeaks?: boolean;

    /**
     * Enable CPU performance tracking
     */
    cpuPerformance?: boolean;

    /**
     * Enable async operation bottleneck tracking
     */
    asyncBottlenecks?: boolean;

    /**
     * Enable system-wide profiling
     */
    systemProfiling?: boolean;
  };

  /**
   * Advanced machine learning prediction options
   */
  mlPrediction?: {
    /**
     * Enable ML-based performance prediction
     */
    enabled?: boolean;

    /**
     * Machine learning model configuration
     */
    modelConfig?: Record<string, any>;
  };

  /**
   * Custom performance detection plugins
   */
  plugins?: Array<{
    name: string;
    handler: (metrics: any) => void;
  }>;
}
