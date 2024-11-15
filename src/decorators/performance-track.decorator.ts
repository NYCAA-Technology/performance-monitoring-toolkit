import 'reflect-metadata';
import { PerformanceLogger } from '../utils/performance-logger';
import { 
  PerformanceMetricsInterface, 
  PerformanceIssueInterface, 
  PerformanceSeverity 
} from '../interfaces/performance-metrics.interface';

/**
 * Performance Tracking Metadata Key
 */
const PERFORMANCE_METADATA_KEY = 'performance:track';

/**
 * Performance Tracking Options
 */
export interface PerformanceTrackOptions {
  /**
   * Threshold for method execution time (in milliseconds)
   */
  executionTimeThreshold?: number;

  /**
   * Memory usage threshold (in bytes)
   */
  memoryThreshold?: number;

  /**
   * Custom name for the tracked method
   */
  name?: string;
}

/**
 * Performance Tracking Decorator
 * Adds performance monitoring to methods
 * @param options Performance tracking configuration
 */
export function PerformanceTrack(options: PerformanceTrackOptions = {}) {
  return (
    target: any, 
    propertyKey: string, 
    descriptor: PropertyDescriptor
  ) => {
    const originalMethod = descriptor.value;
    const logger = new PerformanceLogger();

    descriptor.value = async function (...args: any[]) {
      const startMemory = process.memoryUsage().heapUsed;
      const startTime = process.hrtime();

      try {
        // Execute the original method
        const result = await originalMethod.apply(this, args);

        // Calculate execution time
        const [seconds, nanoseconds] = process.hrtime(startTime);
        const executionTime = seconds * 1000 + nanoseconds / 1_000_000;

        // Calculate memory usage
        const endMemory = process.memoryUsage().heapUsed;
        const memoryUsed = endMemory - startMemory;

        // Log performance metrics
        const metrics: PerformanceMetricsInterface = {
          cpu: {
            cores: require('os').cpus().length,
            currentLoad: 0, // Placeholder, can be enhanced with more detailed tracking
            processLoad: 0  // Placeholder
          },
          memory: {
            total: require('os').totalmem(),
            free: require('os').freemem(),
            used: require('os').totalmem() - require('os').freemem(),
            processMemory: memoryUsed,
            usagePercentage: (memoryUsed / require('os').totalmem()) * 100
          },
          timestamp: Date.now(),
          performance: {
            asyncOperations: {
              pendingOperations: 0,
              averageLatency: executionTime,
              maxLatency: executionTime
            },
            requests: {
              totalRequests: 1,
              failedRequests: 0,
              averageLatency: executionTime,
              p95Latency: executionTime
            },
            eventLoop: {
              lag: 0,
              pendingTasks: 0
            }
          }
        };

        logger.logMetrics(metrics);

        // Check against thresholds
        const {
          executionTimeThreshold = 1000, 
          memoryThreshold = 100 * 1024 * 1024 // 100MB
        } = options;

        if (executionTime > executionTimeThreshold || memoryUsed > memoryThreshold) {
          const issue: PerformanceIssueInterface = {
            id: `performance-issue-${Date.now()}`,
            type: 'cpu_bottleneck',
            severity: executionTime > executionTimeThreshold * 2 
              ? PerformanceSeverity.CRITICAL 
              : PerformanceSeverity.HIGH,
            description: `Method ${options.name || propertyKey} exceeded performance thresholds`,
            recommendedActions: [
              'Optimize method implementation',
              'Consider breaking down complex operations',
              'Implement caching mechanisms'
            ],
            metrics,
            timestamp: Date.now(),
            context: {
              stackTrace: new Error().stack
            }
          };

          logger.logIssue(issue);
        }

        return result;
      } catch (error: unknown) {
        // Ensure error is an Error object
        const errorObj = error instanceof Error 
          ? error 
          : new Error(typeof error === 'string' ? error : 'Unknown error');

        // Log error as a performance issue
        const issue: PerformanceIssueInterface = {
          id: `performance-error-${Date.now()}`,
          type: 'custom',
          severity: PerformanceSeverity.CRITICAL,
          description: `Error in method ${options.name || propertyKey}`,
          recommendedActions: [
            'Review method implementation',
            'Check for potential error sources',
            'Implement proper error handling'
          ],
          metrics: {
            cpu: { cores: 0, currentLoad: 0, processLoad: 0 },
            memory: { 
              total: 0, 
              free: 0, 
              used: 0, 
              processMemory: 0,
              usagePercentage: 0 
            },
            timestamp: Date.now(),
            performance: {
              asyncOperations: {
                pendingOperations: 0,
                averageLatency: 0,
                maxLatency: 0
              },
              requests: {
                totalRequests: 1,
                failedRequests: 1,
                averageLatency: 0,
                p95Latency: 0
              },
              eventLoop: {
                lag: 0,
                pendingTasks: 0
              }
            }
          },
          context: {
            stackTrace: errorObj.stack,
            additionalInfo: { errorMessage: errorObj.message }
          },
          timestamp: Date.now()
        };

        logger.logIssue(issue);
        throw errorObj;
      }
    };

    return descriptor;
  };
}

/**
 * Retrieve performance tracking metadata
 * @param target Class or prototype
 * @param propertyKey Method name
 */
export function getPerformanceTrackMetadata(
  target: any, 
  propertyKey: string
): PerformanceTrackOptions | undefined {
  return Reflect.getMetadata(PERFORMANCE_METADATA_KEY, target, propertyKey);
}
