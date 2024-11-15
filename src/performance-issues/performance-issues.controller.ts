import { 
  Controller, 
  Get, 
  Query,
  Post,
  HttpCode,
  HttpStatus,
  Logger
} from '@nestjs/common';
import * as os from 'os';
import { MemoryLeakService } from './services/memory-leak.service';
import { CpuIntensiveService } from './services/cpu-intensive.service';
import { AsyncBottleneckService } from './services/async-bottleneck.service';

interface SystemResources {
  memoryUsed: number;
  memoryTotal: number;
  cpuUsage?: number;
  freeMemory: number;
  systemLoad: number[];
}

interface PerformanceMetrics {
  executionTime: number;
  resourceUsage: SystemResources;
  peakMemoryUsage?: number;
}

interface PerformanceAnalytics {
  problemDetected: boolean;
  severity: 'low' | 'medium' | 'high';
  metrics: PerformanceMetrics;
  details: any;
  potentialImpact: string;
  recommendedActions: string[];
  diagnosticContext?: {
    timestamp: number;
    processId: number;
    nodeVersion: string;
    hostname?: string;
    platform?: string;
    arch?: string;
  };
  errorDetails?: {
    message: string;
    stack?: string;
    errorType?: string;
    context?: Record<string, any>;
  };
}

@Controller('performance-issues')
export class PerformanceIssuesController {
  private readonly logger = new Logger(PerformanceIssuesController.name);

  constructor(
    private readonly memoryLeakService: MemoryLeakService,
    private readonly cpuIntensiveService: CpuIntensiveService,
    private readonly asyncBottleneckService: AsyncBottleneckService
  ) {}

  /**
   * Collect comprehensive system resources
   */
  private collectSystemResources(): SystemResources {
    const memoryUsage = process.memoryUsage();
    return {
      memoryUsed: memoryUsage.heapUsed,
      memoryTotal: memoryUsage.heapTotal,
      cpuUsage: process.cpuUsage ? process.cpuUsage().system : undefined,
      freeMemory: os.freemem(),
      systemLoad: os.loadavg()
    };
  }

  /**
   * Comprehensive performance measurement with advanced tracking
   * @param fn Function to measure
   * @param label Optional label for logging
   */
  private measurePerformance<T>(
    fn: () => T, 
    label?: string
  ): PerformanceAnalytics {
    const startResources = this.collectSystemResources();
    const start = process.hrtime();
    const startTimestamp = Date.now();

    let peakMemoryUsage = startResources.memoryUsed;

    try {
      // Execute the function with resource tracking
      const result = fn();
      
      // Calculate execution time
      const [seconds, nanoseconds] = process.hrtime(start);
      const executionTime = seconds * 1000 + nanoseconds / 1_000_000;

      // Collect end resources
      const endResources = this.collectSystemResources();
      const memoryUsed = endResources.memoryUsed - startResources.memoryUsed;
      peakMemoryUsage = Math.max(peakMemoryUsage, endResources.memoryUsed);

      // Log performance details with enhanced context
      this.logger.log(`Performance Metrics for ${label || 'Operation'}:
        Execution Time: ${executionTime.toFixed(2)}ms
        Memory Used: ${(memoryUsed / 1024 / 1024).toFixed(2)}MB
        Peak Memory: ${(peakMemoryUsage / 1024 / 1024).toFixed(2)}MB
        System Load: ${endResources.systemLoad.join(', ')}
        Free Memory: ${(endResources.freeMemory / 1024 / 1024).toFixed(2)}MB`);

      // Determine severity based on performance
      let severity: 'low' | 'medium' | 'high' = 'low';
      if (executionTime > 5000 || memoryUsed > 100 * 1024 * 1024) severity = 'high';
      else if (executionTime > 2000 || memoryUsed > 50 * 1024 * 1024) severity = 'medium';

      return {
        problemDetected: severity !== 'low',
        severity,
        metrics: {
          executionTime,
          resourceUsage: endResources,
          peakMemoryUsage
        },
        details: result,
        potentialImpact: this.getPotentialImpact(severity),
        recommendedActions: this.getRecommendedActions(severity),
        diagnosticContext: {
          timestamp: startTimestamp,
          processId: process.pid,
          nodeVersion: process.version,
          hostname: os.hostname(),
          platform: os.platform(),
          arch: os.arch()
        }
      };
    } catch (error) {
      // Comprehensive error handling with enhanced context
      this.logger.error(`Error in ${label || 'performance measurement'}`, error);

      return {
        problemDetected: true,
        severity: 'high',
        metrics: {
          executionTime: 0,
          resourceUsage: {
            memoryUsed: 0,
            memoryTotal: 0,
            freeMemory: 0,
            systemLoad: [0, 0, 0]
          },
          peakMemoryUsage: 0
        },
        details: null,
        potentialImpact: 'Critical failure in performance test',
        recommendedActions: [
          'Investigate and fix the underlying issue',
          'Check service dependencies',
          'Review recent code changes'
        ],
        diagnosticContext: {
          timestamp: startTimestamp,
          processId: process.pid,
          nodeVersion: process.version,
          hostname: os.hostname(),
          platform: os.platform(),
          arch: os.arch()
        },
        errorDetails: {
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          errorType: error instanceof Error ? error.constructor.name : 'UnknownError',
          context: {
            operationLabel: label,
            timestamp: startTimestamp,
            nodeVersion: process.version,
            platform: os.platform(),
            arch: os.arch()
          }
        }
      };
    }
  }

  /**
   * Determine potential impact based on severity
   * @param severity Performance severity
   */
  private getPotentialImpact(severity: 'low' | 'medium' | 'high'): string {
    switch (severity) {
      case 'high': 
        return 'Severe performance degradation, potential system instability';
      case 'medium': 
        return 'Noticeable performance slowdown, may impact user experience';
      default: 
        return 'Minimal performance impact, within acceptable limits';
    }
  }

  /**
   * Determine recommended actions based on severity
   * @param severity Performance severity
   */
  private getRecommendedActions(severity: 'low' | 'medium' | 'high'): string[] {
    switch (severity) {
      case 'high': 
        return [
          'Immediate code optimization required',
          'Investigate potential memory leaks',
          'Consider architectural refactoring',
          'Implement advanced caching strategies'
        ];
      case 'medium': 
        return [
          'Optimize critical code paths',
          'Review and reduce memory allocations',
          'Implement lazy loading',
          'Consider performance profiling'
        ];
      default: 
        return [
          'Continue monitoring performance',
          'Conduct periodic code reviews',
          'Maintain current optimization strategies'
        ];
    }
  }

  @Get('memory-leak')
  @HttpCode(HttpStatus.OK)
  triggerMemoryLeak(@Query('count') count: number = 1000): PerformanceAnalytics {
    return this.measurePerformance(
      () => {
        // Trigger different types of memory leaks
        this.memoryLeakService.generateMemoryLeaks(count);
        
        // Analyze memory leaks
        return this.memoryLeakService.analyzeMemoryLeaks();
      },
      'Memory Leak Detection'
    );
  }

  @Get('cpu-intensive')
  @HttpCode(HttpStatus.OK)
  triggerCpuIntensiveTask(
    @Query('iterations') iterations: number = 1000000,
    @Query('complexity') complexity: number = 10
  ): PerformanceAnalytics {
    return this.measurePerformance(
      () => ({
        fibonacciResult: this.cpuIntensiveService.calculateFibonacci(complexity),
        cpuIntensiveTaskResult: this.cpuIntensiveService.createCpuIntensiveTask(iterations),
        concurrentTaskResults: this.cpuIntensiveService.createConcurrentCpuTasks(),
        recursiveTaskResult: this.cpuIntensiveService.recursiveCpuAndMemoryIntensiveTask()
      }),
      'CPU Intensive Task'
    );
  }

  @Get('async-bottleneck')
  @HttpCode(HttpStatus.OK)
  async triggerAsyncBottleneck(
    @Query('operationCount') operationCount: number = 50,
    @Query('maxDelay') maxDelay: number = 2000
  ): Promise<PerformanceAnalytics> {
    return this.measurePerformance(
      async () => ({
        concurrentOperations: await this.asyncBottleneckService.createConcurrentAsyncBottleneck(operationCount, maxDelay),
        promiseChainResult: await this.asyncBottleneckService.createPromiseChainBottleneck(),
        slowDatabaseSimulation: await this.asyncBottleneckService.simulateSlowDatabaseOperations(),
        memoryIntensiveAsync: await this.asyncBottleneckService.createMemoryIntensiveAsyncOperation()
      }),
      'Async Bottleneck'
    );
  }

  @Post('cleanup')
  @HttpCode(HttpStatus.OK)
  performCleanup(): any {
    this.memoryLeakService.attemptMemoryCleanup();
    return { 
      message: 'Cleanup attempted',
      status: 'success'
    };
  }
}
