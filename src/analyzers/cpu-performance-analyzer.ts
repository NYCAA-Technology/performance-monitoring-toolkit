import { Injectable } from '@nestjs/common';
import { PerformanceLogger } from '../utils/performance-logger';
import { 
  PerformanceIssueInterface, 
  PerformanceSeverity 
} from '../interfaces/performance-metrics.interface';

@Injectable()
export class CpuPerformanceAnalyzer {
  constructor(private readonly logger: PerformanceLogger) {}

  /**
   * Calculate Fibonacci to simulate CPU-intensive task
   * @param n Fibonacci sequence number
   */
  calculateFibonacci(n: number): number {
    if (n <= 1) return n;
    return this.calculateFibonacci(n - 1) + this.calculateFibonacci(n - 2);
  }

  /**
   * Create a CPU-intensive task
   * @param iterations Number of computational iterations
   */
  createCpuIntensiveTask(iterations: number = 1000000): number {
    const startTime = Date.now();
    let result = 0;

    for (let i = 0; i < iterations; i++) {
      result += Math.sqrt(i) * Math.sin(i);
    }

    const executionTime = Date.now() - startTime;

    // Check for performance bottleneck
    if (executionTime > 1000) {
      const issue: PerformanceIssueInterface = {
        id: `cpu-intensive-${Date.now()}`,
        type: 'cpu_bottleneck',
        severity: executionTime > 2000 
          ? PerformanceSeverity.CRITICAL 
          : PerformanceSeverity.HIGH,
        description: `CPU-Intensive Task Exceeded Threshold: ${executionTime}ms`,
        recommendedActions: [
          'Optimize computational logic',
          'Consider async processing',
          'Implement caching mechanisms'
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
        },
        timestamp: Date.now()
      };

      this.logger.logIssue(issue);
    }

    return result;
  }

  /**
   * Create concurrent CPU-intensive tasks
   * @param taskCount Number of concurrent tasks
   */
  createConcurrentCpuTasks(taskCount: number = 5): number[] {
    const tasks: number[] = [];

    for (let i = 0; i < taskCount; i++) {
      tasks.push(this.createCpuIntensiveTask(100000 * (i + 1)));
    }

    return tasks;
  }

  /**
   * Detect CPU performance bottlenecks
   */
  detectBottlenecks(): PerformanceIssueInterface | null {
    //const startTime = Date.now();
    const complexityLevels = [10, 20, 30];
    let maxExecutionTime = 0;

    complexityLevels.forEach(complexity => {
      const startComplex = Date.now();
      this.calculateFibonacci(complexity);
      const executionTime = Date.now() - startComplex;
      maxExecutionTime = Math.max(maxExecutionTime, executionTime);
    });

    // Threshold for CPU bottleneck (e.g., 500ms)
    const CPU_BOTTLENECK_THRESHOLD = 500;

    if (maxExecutionTime > CPU_BOTTLENECK_THRESHOLD) {
      const issue: PerformanceIssueInterface = {
        id: `cpu-bottleneck-${Date.now()}`,
        type: 'cpu_bottleneck',
        severity: maxExecutionTime > 1000 
          ? PerformanceSeverity.CRITICAL 
          : PerformanceSeverity.HIGH,
        description: `CPU Bottleneck Detected: Max Execution Time ${maxExecutionTime}ms`,
        recommendedActions: [
          'Analyze computational complexity',
          'Implement algorithmic optimizations',
          'Consider parallel processing'
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
              averageLatency: maxExecutionTime,
              maxLatency: maxExecutionTime
            },
            requests: {
              totalRequests: complexityLevels.length,
              failedRequests: 0,
              averageLatency: maxExecutionTime,
              p95Latency: maxExecutionTime
            },
            eventLoop: {
              lag: 0,
              pendingTasks: 0
            }
          }
        },
        timestamp: Date.now()
      };

      this.logger.logIssue(issue);
      return issue;
    }

    return null;
  }
}
