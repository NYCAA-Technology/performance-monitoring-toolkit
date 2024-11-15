/**
 * Performance Metrics Interface
 * Provides a comprehensive structure for capturing system and application performance data
 */
export interface PerformanceMetricsInterface {
  /**
   * CPU Performance Metrics
   */
  cpu: {
    /**
     * Number of CPU cores
     */
    cores: number;

    /**
     * Current overall CPU load percentage
     */
    currentLoad: number;

    /**
     * Current process-specific CPU load
     */
    processLoad: number;

    /**
     * Detailed per-core CPU usage
     */
    coreUsage?: number[];
  };

  /**
   * Memory Performance Metrics
   */
  memory: {
    /**
     * Total system memory in bytes
     */
    total: number;

    /**
     * Free system memory in bytes
     */
    free: number;

    /**
     * Used system memory in bytes
     */
    used: number;

    /**
     * Memory used by the current process in bytes
     */
    processMemory: number;

    /**
     * Memory usage percentage
     */
    usagePercentage: number;
  };

  /**
   * Timestamp of metric collection
   */
  timestamp: number;

  /**
   * Detailed performance metrics
   */
  performance: {
    /**
     * Async operation metrics
     */
    asyncOperations: {
      /**
       * Number of pending async operations
       */
      pendingOperations: number;

      /**
       * Average latency of async operations in milliseconds
       */
      averageLatency: number;

      /**
       * Maximum latency of async operations in milliseconds
       */
      maxLatency: number;
    };

    /**
     * Request-related metrics
     */
    requests: {
      /**
       * Total number of requests
       */
      totalRequests: number;

      /**
       * Number of failed requests
       */
      failedRequests: number;

      /**
       * Average request latency in milliseconds
       */
      averageLatency: number;

      /**
       * 95th percentile request latency
       */
      p95Latency: number;
    };

    /**
     * Event loop metrics
     */
    eventLoop: {
      /**
       * Lag of the event loop in milliseconds
       */
      lag: number;

      /**
       * Number of tasks in the event loop
       */
      pendingTasks: number;
    };
  };

  /**
   * Custom metrics from plugins or additional sources
   */
  custom?: Record<string, any>;
}

/**
 * Performance Issue Severity Levels
 */
export enum PerformanceSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

/**
 * Performance Issue Detection Result
 */
export interface PerformanceIssueInterface {
  /**
   * Unique identifier for the performance issue
   */
  id: string;

  /**
   * Type of performance issue
   */
  type: 'memory_leak' | 'cpu_bottleneck' | 'async_bottleneck' | 'event_loop' | 'custom';

  /**
   * Severity of the performance issue
   */
  severity: PerformanceSeverity;

  /**
   * Detailed description of the issue
   */
  description: string;

  /**
   * Recommended actions to mitigate the issue
   */
  recommendedActions: string[];

  /**
   * Metrics related to the performance issue
   */
  metrics?: Partial<PerformanceMetricsInterface>;

  /**
   * Timestamp of issue detection
   */
  timestamp: number;

  /**
   * Stack trace or additional context
   */
  context?: {
    stackTrace?: string;
    additionalInfo?: Record<string, any>;
  };
}

/**
 * Performance Trend Interface
 * Tracks performance changes over time
 */
export interface PerformanceTrendInterface {
  /**
   * Unique identifier for the trend
   */
  id: string;

  /**
   * Type of performance metric being tracked
   */
  metricType: string;

  /**
   * Historical performance data points
   */
  dataPoints: {
    timestamp: number;
    value: number;
  }[];

  /**
   * Trend analysis
   */
  analysis: {
    /**
     * Overall trend direction
     */
    direction: 'improving' | 'degrading' | 'stable';

    /**
     * Rate of change
     */
    rateOfChange: number;

    /**
     * Predicted future performance
     */
    prediction?: number;
  };
}
