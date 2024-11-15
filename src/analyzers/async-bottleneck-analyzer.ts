import { Injectable } from '@nestjs/common';
import { PerformanceLogger } from '../utils/performance-logger';
import { 
  PerformanceIssueInterface, 
  PerformanceSeverity 
} from '../interfaces/performance-metrics.interface';

@Injectable()
export class AsyncBottleneckAnalyzer {
  constructor(private readonly logger: PerformanceLogger) {}

  /**
   * Create concurrent async operations
   * @param operationCount Number of concurrent async operations
   * @param maxDelay Maximum delay for async operations
   */
  async createConcurrentAsyncBottleneck(
    operationCount: number = 50, 
    maxDelay: number = 2000
  ): Promise<number[]> {
    const startTime = Date.now();
    
    // Create array of promises with varying delays
    const asyncOperations = Array(operationCount).fill(null).map(async (_, index) => {
      const delay = Math.random() * maxDelay;
      return new Promise<number>((resolve) => {
        setTimeout(() => {
          resolve(index);
        }, delay);
      });
    });

    // Wait for all operations to complete
    const results = await Promise.all(asyncOperations);
    const totalExecutionTime = Date.now() - startTime;

    // Check for async bottleneck
    if (totalExecutionTime > maxDelay) {
      const issue: PerformanceIssueInterface = {
        id: `async-bottleneck-${Date.now()}`,
        type: 'async_bottleneck',
        severity: totalExecutionTime > maxDelay * 1.5 
          ? PerformanceSeverity.CRITICAL 
          : PerformanceSeverity.HIGH,
        description: `Async Operations Bottleneck: Total Execution Time ${totalExecutionTime}ms`,
        recommendedActions: [
          'Optimize async operation handling',
          'Implement concurrency limits',
          'Use Promise.race() for timeout management'
        ],
        metrics: {
          cpu: { 
            cores: require('os').cpus().length, 
            currentLoad: 0, 
            processLoad: 0 
          },
          memory: {
            total: require('os').totalmem(),
            free: require('os').freemem(),
            used: 0,
            processMemory: 0,
            usagePercentage: 0
          },
          timestamp: Date.now(),
          performance: {
            asyncOperations: {
              pendingOperations: operationCount,
              averageLatency: totalExecutionTime / operationCount,
              maxLatency: totalExecutionTime
            },
            requests: {
              totalRequests: operationCount,
              failedRequests: 0,
              averageLatency: totalExecutionTime / operationCount,
              p95Latency: totalExecutionTime
            },
            eventLoop: {
              lag: totalExecutionTime,
              pendingTasks: operationCount
            }
          }
        },
        timestamp: Date.now()
      };

      this.logger.logIssue(issue);
    }

    return results;
  }

  /**
   * Simulate a promise chain bottleneck
   */
  async createPromiseChainBottleneck(): Promise<number> {
    const startTime = Date.now();
    
    const chainLength = 10;
    let result = 0;

    // Create a promise chain with increasing delays
    const chainPromise = new Promise<number>((resolve) => {
      let currentPromise = Promise.resolve(0);

      for (let i = 0; i < chainLength; i++) {
        currentPromise = currentPromise.then((prev) => {
          return new Promise<number>((innerResolve) => {
            setTimeout(() => {
              innerResolve(prev + i);
            }, i * 100);
          });
        });
      }

      currentPromise.then(resolve);
    });

    result = await chainPromise;
    const totalExecutionTime = Date.now() - startTime;

    // Check for promise chain bottleneck
    if (totalExecutionTime > 1000) {
      const issue: PerformanceIssueInterface = {
        id: `promise-chain-bottleneck-${Date.now()}`,
        type: 'async_bottleneck',
        severity: totalExecutionTime > 2000 
          ? PerformanceSeverity.CRITICAL 
          : PerformanceSeverity.HIGH,
        description: `Promise Chain Bottleneck: Total Execution Time ${totalExecutionTime}ms`,
        recommendedActions: [
          'Refactor promise chains',
          'Use Promise.all() for parallel processing',
          'Implement more efficient async patterns'
        ],
        metrics: {
          cpu: { 
            cores: require('os').cpus().length, 
            currentLoad: 0, 
            processLoad: 0 
          },
          memory: {
            total: require('os').totalmem(),
            free: require('os').freemem(),
            used: 0,
            processMemory: 0,
            usagePercentage: 0
          },
          timestamp: Date.now(),
          performance: {
            asyncOperations: {
              pendingOperations: chainLength,
              averageLatency: totalExecutionTime / chainLength,
              maxLatency: totalExecutionTime
            },
            requests: {
              totalRequests: chainLength,
              failedRequests: 0,
              averageLatency: totalExecutionTime / chainLength,
              p95Latency: totalExecutionTime
            },
            eventLoop: {
              lag: totalExecutionTime,
              pendingTasks: chainLength
            }
          }
        },
        timestamp: Date.now()
      };

      this.logger.logIssue(issue);
    }

    return result;
  }

  /**
   * Simulate slow database-like operations
   */
  async simulateSlowDatabaseOperations(): Promise<number> {
    const startTime = Date.now();
    const operationCount = 5;
    let totalOperations = 0;

    // Simulate database-like async operations
    const databaseOperations = Array(operationCount).fill(null).map(async (_, index) => {
      return new Promise<number>((resolve) => {
        setTimeout(() => {
          // Simulate some database query or operation
          resolve(index * Math.random());
        }, 200 * (index + 1));
      });
    });

    const results = await Promise.all(databaseOperations);
    totalOperations = results.reduce((sum, val) => sum + val, 0);

    const totalExecutionTime = Date.now() - startTime;

    // Check for database operation bottleneck
    if (totalExecutionTime > 1000) {
      const issue: PerformanceIssueInterface = {
        id: `database-bottleneck-${Date.now()}`,
        type: 'async_bottleneck',
        severity: totalExecutionTime > 2000 
          ? PerformanceSeverity.CRITICAL 
          : PerformanceSeverity.HIGH,
        description: `Slow Database Operations: Total Execution Time ${totalExecutionTime}ms`,
        recommendedActions: [
          'Optimize database queries',
          'Implement connection pooling',
          'Use caching mechanisms'
        ],
        metrics: {
          cpu: { 
            cores: require('os').cpus().length, 
            currentLoad: 0, 
            processLoad: 0 
          },
          memory: {
            total: require('os').totalmem(),
            free: require('os').freemem(),
            used: 0,
            processMemory: 0,
            usagePercentage: 0
          },
          timestamp: Date.now(),
          performance: {
            asyncOperations: {
              pendingOperations: operationCount,
              averageLatency: totalExecutionTime / operationCount,
              maxLatency: totalExecutionTime
            },
            requests: {
              totalRequests: operationCount,
              failedRequests: 0,
              averageLatency: totalExecutionTime / operationCount,
              p95Latency: totalExecutionTime
            },
            eventLoop: {
              lag: totalExecutionTime,
              pendingTasks: operationCount
            }
          }
        },
        timestamp: Date.now()
      };

      this.logger.logIssue(issue);
    }

    return totalOperations;
  }

  /**
   * Detect async operation bottlenecks
   */
  async detectBottlenecks(): Promise<PerformanceIssueInterface | null> {
    try {
      await this.createConcurrentAsyncBottleneck();
      await this.createPromiseChainBottleneck();
      await this.simulateSlowDatabaseOperations();
    } catch (error: unknown) {
      // Ensure error is an Error object
      const errorObj = error instanceof Error 
        ? error 
        : new Error(typeof error === 'string' ? error : 'Unknown async bottleneck detection error');

      const issue: PerformanceIssueInterface = {
        id: `async-detection-error-${Date.now()}`,
        type: 'async_bottleneck',
        severity: PerformanceSeverity.CRITICAL,
        description: `Async Bottleneck Detection Failed: ${errorObj.message}`,
        recommendedActions: [
          'Review async operation implementations',
          'Check for unhandled promise rejections',
          'Implement comprehensive error handling'
        ],
        metrics: {
          cpu: { 
            cores: require('os').cpus().length, 
            currentLoad: 0, 
            processLoad: 0 
          },
          memory: {
            total: require('os').totalmem(),
            free: require('os').freemem(),
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
              totalRequests: 0,
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
        timestamp: Date.now(),
        context: {
          stackTrace: errorObj.stack
        }
      };

      this.logger.logIssue(issue);
      return issue;
    }

    return null;
  }
}
