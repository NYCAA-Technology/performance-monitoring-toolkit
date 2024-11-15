import { Injectable } from '@nestjs/common';

interface CpuIntensiveAnalytics {
  fibonacciResult: number;
  cpuIntensiveTaskResult: number;
  concurrentTaskResults: number[];
  recursiveTaskResult: number;
}

@Injectable()
export class CpuIntensiveService {
  /**
   * Calculate Fibonacci number recursively
   * @param n Fibonacci number to calculate
   */
  calculateFibonacci(n: number): number {
    // Intentionally inefficient recursive implementation
    if (n <= 1) return n;
    return this.calculateFibonacci(n - 1) + this.calculateFibonacci(n - 2);
  }

  /**
   * Create a CPU-intensive task with complex calculations
   * @param iterations Number of iterations to perform
   */
  createCpuIntensiveTask(iterations: number = 1000000): number {
    let result = 0;
    for (let i = 0; i < iterations; i++) {
      // Simulate complex mathematical computations
      result += Math.sqrt(
        Math.pow(i, 2) + 
        Math.log(i + 1) * 
        Math.sin(i)
      );
    }
    return result;
  }

  /**
   * Create multiple concurrent CPU-intensive tasks
   * @param taskCount Number of concurrent tasks
   * @param complexity Complexity of each task
   */
  createConcurrentCpuTasks(taskCount: number = 10, complexity: number = 500000): number[] {
    const results: number[] = [];
    
    for (let i = 0; i < taskCount; i++) {
      results.push(this.createCpuIntensiveTask(complexity));
    }
    
    return results;
  }

  /**
   * Simulate a recursive CPU and memory-intensive task
   * @param depth Recursion depth
   */
  recursiveCpuAndMemoryIntensiveTask(depth: number = 10): number {
    if (depth <= 0) return 0;
    
    // Create a large array to consume memory
    const largeArray = new Array(10000).fill(depth);
    
    // Recursive computation with memory allocation
    return depth + 
      this.recursiveCpuAndMemoryIntensiveTask(depth - 1) + 
      largeArray.reduce((a, b) => a + b, 0);
  }

  /**
   * Comprehensive CPU-intensive task analysis
   */
  analyzeCpuIntensiveTasks(): CpuIntensiveAnalytics {
    const complexity = 15; // Moderate complexity for demonstration
    const iterations = 1000000;

    return {
      fibonacciResult: this.calculateFibonacci(complexity),
      cpuIntensiveTaskResult: this.createCpuIntensiveTask(iterations),
      concurrentTaskResults: this.createConcurrentCpuTasks(),
      recursiveTaskResult: this.recursiveCpuAndMemoryIntensiveTask()
    };
  }

  /**
   * Determine potential impact based on task complexity
   * @param complexity Task complexity
   */
  getPotentialImpact(complexity: number): string {
    if (complexity > 20) {
      return 'Severe CPU utilization, potential system unresponsiveness';
    } else if (complexity > 10) {
      return 'Significant CPU load, may impact application performance';
    } else {
      return 'Minimal CPU impact, within acceptable limits';
    }
  }

  /**
   * Get recommended actions based on complexity
   * @param complexity Task complexity
   */
  getRecommendedActions(complexity: number): string[] {
    if (complexity > 20) {
      return [
        'Immediate algorithm optimization required',
        'Consider using memoization or dynamic programming',
        'Implement worker threads or parallel processing',
        'Evaluate algorithmic complexity'
      ];
    } else if (complexity > 10) {
      return [
        'Optimize recursive algorithms',
        'Implement caching mechanisms',
        'Consider breaking down complex computations',
        'Profile and identify bottlenecks'
      ];
    } else {
      return [
        'Continue monitoring CPU usage',
        'Conduct periodic code reviews',
        'Maintain current optimization strategies'
      ];
    }
  }
}
