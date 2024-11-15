import { Injectable } from '@nestjs/common';
import { performance } from 'perf_hooks';

interface CpuIntensiveAnalytics {
  fibonacciResult: {
    value: number;
    executionTime: number;
    complexity: number;
  };
  cpuIntensiveTaskResult: {
    value: number;
    executionTime: number;
    iterations: number;
  };
  concurrentTaskResults: {
    results: number[];
    totalExecutionTime: number;
    taskCount: number;
  };
  recursiveTaskResult: {
    value: number;
    executionTime: number;
    depth: number;
    memoryUsage: number;
  };
}

interface CpuPerformanceMetrics {
  totalCpuTime: number;
  averageTaskTime: number;
  maxTaskTime: number;
  minTaskTime: number;
  complexityFactor: number;
}

@Injectable()
export class CpuIntensiveService {
  /**
   * Calculate Fibonacci number recursively with memoization
   * @param n Fibonacci number to calculate
   * @param memo Memoization cache
   */
  calculateFibonacci(n: number, memo: Map<number, number> = new Map()): number {
    // Memoized recursive implementation to improve performance
    if (n <= 1) return n;
    
    const memoizedResult = memo.get(n);
    if (memoizedResult !== undefined) return memoizedResult;
    
    const result = this.calculateFibonacci(n - 1, memo) + this.calculateFibonacci(n - 2, memo);
    memo.set(n, result);
    
    return result;
  }

  /**
   * Create a CPU-intensive task with complex calculations and error handling
   * @param iterations Number of iterations to perform
   */
  createCpuIntensiveTask(iterations: number = 1000000): number {
    try {
      let result = 0;
      for (let i = 1; i < iterations; i++) {
        result += Math.sqrt(
          Math.pow(i, 2) + 
          Math.log(i) * 
          Math.sin(i)
        );
        
        // Periodic sanity check to prevent infinite loops
        if (i % 100000 === 0 && result > Number.MAX_SAFE_INTEGER / 2) {
          console.warn('Potential overflow detected, breaking computation');
          break;
        }
      }
      return result;
    } catch (error) {
      console.error('CPU-intensive task failed:', error);
      return 0;
    }
  }

  /**
   * Create multiple concurrent CPU-intensive tasks with advanced tracking
   * @param taskCount Number of concurrent tasks
   * @param complexity Complexity of each task
   */
  createConcurrentCpuTasks(taskCount: number = 10, complexity: number = 500000): number[] {
    const startTime = performance.now();
    const results: number[] = [];
    
    for (let i = 0; i < taskCount; i++) {
      try {
        results.push(this.createCpuIntensiveTask(complexity));
      } catch (error) {
        console.error(`Concurrent task ${i} failed:`, error);
        results.push(0);
      }
    }
    
    return results;
  }

  /**
   * Simulate a recursive CPU and memory-intensive task with improved tracking
   * @param depth Recursion depth
   */
  recursiveCpuAndMemoryIntensiveTask(depth: number = 10): number {
    const startMemory = process.memoryUsage().heapUsed;
    
    const recursiveComputation = (currentDepth: number): number => {
      if (currentDepth <= 0) return 0;
      
      // Create a large array to consume memory
      const largeArray = new Array(10000).fill(currentDepth);
      
      // Recursive computation with memory allocation and error handling
      try {
        return currentDepth + 
          recursiveComputation(currentDepth - 1) + 
          largeArray.reduce((a, b) => a + b, 0);
      } catch (error) {
        console.error(`Recursive task failed at depth ${currentDepth}:`, error);
        return 0;
      }
    };
    
    const result = recursiveComputation(depth);
    const memoryUsed = process.memoryUsage().heapUsed - startMemory;
    
    return result;
  }

  /**
   * Comprehensive CPU-intensive task analysis with enhanced tracking
   */
  analyzeCpuIntensiveTasks(): CpuIntensiveAnalytics {
    const startTime = performance.now();
    
    const complexity = 15; // Moderate complexity for demonstration
    const iterations = 1000000;
    
    const fibonacciStart = performance.now();
    const fibonacciResult = this.calculateFibonacci(complexity);
    const fibonacciTime = performance.now() - fibonacciStart;
    
    const cpuTaskStart = performance.now();
    const cpuIntensiveTaskResult = this.createCpuIntensiveTask(iterations);
    const cpuTaskTime = performance.now() - cpuTaskStart;
    
    const concurrentTasksStart = performance.now();
    const concurrentTaskResults = this.createConcurrentCpuTasks();
    const concurrentTasksTime = performance.now() - concurrentTasksStart;
    
    const recursiveTaskStart = performance.now();
    const recursiveTaskResult = this.recursiveCpuAndMemoryIntensiveTask();
    const recursiveTaskTime = performance.now() - recursiveTaskStart;
    
    return {
      fibonacciResult: {
        value: fibonacciResult,
        executionTime: fibonacciTime,
        complexity
      },
      cpuIntensiveTaskResult: {
        value: cpuIntensiveTaskResult,
        executionTime: cpuTaskTime,
        iterations
      },
      concurrentTaskResults: {
        results: concurrentTaskResults,
        totalExecutionTime: concurrentTasksTime,
        taskCount: concurrentTaskResults.length
      },
      recursiveTaskResult: {
        value: recursiveTaskResult,
        executionTime: recursiveTaskTime,
        depth: 10,
        memoryUsage: process.memoryUsage().heapUsed
      }
    };
  }

  /**
   * Determine potential impact based on task complexity with more detailed metrics
   * @param complexity Task complexity
   */
  getPotentialImpact(complexity: number): {
    impact: string;
    metrics: CpuPerformanceMetrics;
  } {
    const metrics: CpuPerformanceMetrics = {
      totalCpuTime: complexity * 100, // Estimated total CPU time
      averageTaskTime: complexity * 10, // Estimated average task time
      maxTaskTime: complexity * 20, // Estimated max task time
      minTaskTime: complexity * 5, // Estimated min task time
      complexityFactor: complexity
    };

    let impact: string;
    if (complexity > 20) {
      impact = 'Severe CPU utilization, potential system unresponsiveness';
    } else if (complexity > 10) {
      impact = 'Significant CPU load, may impact application performance';
    } else {
      impact = 'Minimal CPU impact, within acceptable limits';
    }

    return { impact, metrics };
  }

  /**
   * Get recommended actions based on complexity with more comprehensive strategies
   * @param complexity Task complexity
   */
  getRecommendedActions(complexity: number): {
    actions: string[];
    optimizationStrategy: 'aggressive' | 'moderate' | 'minimal';
  } {
    const { impact } = this.getPotentialImpact(complexity);

    let actions: string[];
    let optimizationStrategy: 'aggressive' | 'moderate' | 'minimal';

    if (complexity > 20) {
      actions = [
        'Immediate algorithm optimization required',
        'Implement advanced memoization techniques',
        'Use worker threads or parallel processing',
        'Evaluate and refactor algorithmic complexity',
        'Implement dynamic programming solutions',
        'Consider distributed computing approaches'
      ];
      optimizationStrategy = 'aggressive';
    } else if (complexity > 10) {
      actions = [
        'Optimize recursive algorithms',
        'Implement intelligent caching mechanisms',
        'Break down complex computations',
        'Profile and identify performance bottlenecks',
        'Use lazy evaluation techniques',
        'Implement incremental computation strategies'
      ];
      optimizationStrategy = 'moderate';
    } else {
      actions = [
        'Continue monitoring CPU usage',
        'Conduct periodic code reviews',
        'Maintain current optimization strategies',
        'Implement lightweight performance logging',
        'Use performance profiling tools',
        'Keep dependencies updated'
      ];
      optimizationStrategy = 'minimal';
    }

    return { 
      actions, 
      optimizationStrategy 
    };
  }
}
