import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';
import { performance } from 'perf_hooks';
import { PerformanceConfigInterface } from '../interfaces/performance-config.interface';
import { 
  PerformanceMetricsInterface, 
  PerformanceIssueInterface, 
  PerformanceSeverity 
} from '../interfaces/performance-metrics.interface';
import { PerformanceLogger } from '../utils/performance-logger';

// Custom V8 Profiling Interface
interface V8Profiler {
  startProfiling: (name: string, recordSamples?: boolean) => void;
  stopProfiling: (name: string) => { delete: () => void; export: (callback: (error: Error | null, result: string) => void) => void };
}

// Dynamically import v8-profiler-next
let v8Profiler: V8Profiler | null = null;
try {
  v8Profiler = require('v8-profiler-next');
} catch (error) {
  console.warn('V8 Profiler not available:', error);
}

@Injectable()
export class PerformanceDetectorService implements OnModuleInit {
  private logger: PerformanceLogger;

  constructor(
    @Inject('PERFORMANCE_CONFIG')
    private readonly config: PerformanceConfigInterface
  ) {
    this.logger = new PerformanceLogger(
      config.logLevel || 'log', 
      './performance-logs'
    );
  }

  /**
   * Initialize performance monitoring on module startup
   */
  async onModuleInit() {
    // Initial system profiling
    await this.profileSystem();
  }

  /**
   * Collect comprehensive system performance metrics
   */
  async profileSystem(): Promise<PerformanceMetricsInterface> {
    const cpus = os.cpus();
    const memoryUsage = process.memoryUsage();
    const systemMemory = os.totalmem();
    const freeMemory = os.freemem();

    // Default thresholds
    const defaultThresholds = {
      cpuLoad: 80,
      memoryUsage: 90,
      asyncTimeout: 500
    };

    // Merge config thresholds with defaults
    const thresholds = {
      ...defaultThresholds,
      ...this.config.thresholds
    };

    const metrics: PerformanceMetricsInterface = {
      cpu: {
        cores: cpus.length,
        currentLoad: this.calculateCpuLoad(cpus),
        processLoad: 0 // Placeholder for process-specific CPU load
      },
      memory: {
        total: systemMemory,
        free: freeMemory,
        used: systemMemory - freeMemory,
        processMemory: memoryUsage.heapUsed,
        usagePercentage: (memoryUsage.heapUsed / systemMemory) * 100
      },
      timestamp: Date.now(),
      performance: {
        asyncOperations: {
          pendingOperations: 0, // Placeholder
          averageLatency: 0,
          maxLatency: 0
        },
        requests: {
          totalRequests: 0,
          failedRequests: 0,
          averageLatency: 0,
          p95Latency: 0
        },
        eventLoop: {
          lag: 0,
          pendingTasks: 0
        }
      }
    };

    // Log and potentially analyze metrics
    this.logger.logMetrics(metrics);
    this.analyzeSystemMetrics(metrics, thresholds);

    return metrics;
  }

  /**
   * Calculate overall CPU load
   * @param cpus CPU information from os.cpus()
   */
  private calculateCpuLoad(cpus: os.CpuInfo[]): number {
    const totalLoad = cpus.reduce((acc, cpu) => {
      const { user, nice, sys, idle } = cpu.times;
      return acc + ((user + nice + sys) / (user + nice + sys + idle)) * 100;
    }, 0);

    return totalLoad / cpus.length;
  }

  /**
   * Analyze system metrics and detect potential performance issues
   * @param metrics System performance metrics
   * @param thresholds Performance thresholds
   */
  private analyzeSystemMetrics(
    metrics: PerformanceMetricsInterface, 
    thresholds: { cpuLoad: number; memoryUsage: number; asyncTimeout: number }
  ): void {
    // CPU Load Analysis
    if (metrics.cpu.currentLoad > thresholds.cpuLoad) {
      const issue: PerformanceIssueInterface = {
        id: `cpu-load-${Date.now()}`,
        type: 'cpu_bottleneck',
        severity: metrics.cpu.currentLoad > 95 
          ? PerformanceSeverity.CRITICAL 
          : PerformanceSeverity.HIGH,
        description: `High CPU Load Detected: ${metrics.cpu.currentLoad.toFixed(2)}%`,
        recommendedActions: [
          'Investigate running processes',
          'Optimize CPU-intensive tasks',
          'Consider scaling infrastructure'
        ],
        metrics,
        timestamp: Date.now()
      };

      this.logger.logIssue(issue);
    }

    // Memory Usage Analysis
    if (metrics.memory.usagePercentage > thresholds.memoryUsage) {
      const issue: PerformanceIssueInterface = {
        id: `memory-usage-${Date.now()}`,
        type: 'memory_leak',
        severity: metrics.memory.usagePercentage > 95 
          ? PerformanceSeverity.CRITICAL 
          : PerformanceSeverity.HIGH,
        description: `High Memory Usage Detected: ${metrics.memory.usagePercentage.toFixed(2)}%`,
        recommendedActions: [
          'Check for memory leaks',
          'Optimize memory-intensive operations',
          'Increase system memory'
        ],
        metrics,
        timestamp: Date.now()
      };

      this.logger.logIssue(issue);
    }
  }

  /**
   * Start performance profiling
   * @returns Profiling session identifier
   */
  startProfiling(): string {
    const profilingId = `performance-${Date.now()}`;
    
    // Use performance hooks as a fallback
    const startTime = performance.now();
    
    // V8 Profiler integration if available
    if (v8Profiler) {
      try {
        v8Profiler.startProfiling(profilingId, true);
      } catch (error) {
        console.warn('V8 Profiling failed:', error);
      }
    }

    return profilingId;
  }

  /**
   * Stop performance profiling and generate profile
   * @param profilingId Profiling session identifier
   * @returns Path to generated profile
   */
  stopProfiling(profilingId: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const endTime = performance.now();
      const profilesDir = path.join(process.cwd(), 'performance-profiles');
      
      // Ensure profiles directory exists
      if (!fs.existsSync(profilesDir)) {
        fs.mkdirSync(profilesDir, { recursive: true });
      }

      const profilePath = path.join(profilesDir, `${profilingId}.cpuprofile`);

      // V8 Profiler integration if available
      if (v8Profiler) {
        try {
          const profile = v8Profiler.stopProfiling(profilingId);
          profile.export((error, result) => {
            if (error) {
              console.error('Profile export failed:', error);
              reject(error);
              return;
            }

            fs.writeFileSync(profilePath, result);
            profile.delete();
            resolve(profilePath);
          });
        } catch (error) {
          console.warn('V8 Profiling failed:', error);
          resolve(profilePath);
        }
      } else {
        // Fallback: Write performance timing
        const performanceData = {
          startTime: endTime,
          duration: endTime - performance.now()
        };
        
        fs.writeFileSync(profilePath, JSON.stringify(performanceData, null, 2));
        resolve(profilePath);
      }
    });
  }
}
