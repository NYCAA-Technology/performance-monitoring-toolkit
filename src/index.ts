// Performance Monitoring Package - Main Entry Point

// Core Performance Detection Module and Service
import { PerformanceDetectorModule } from './core/performance-detector.module';
import { PerformanceDetectorService } from './core/performance-detector.service';

// Performance Tracking Decorator
import { 
  PerformanceTrack, 
  PerformanceTrackOptions,
  getPerformanceTrackMetadata 
} from './decorators/performance-track.decorator';

// Interfaces
import { 
  PerformanceConfigInterface 
} from './interfaces/performance-config.interface';

import { 
  PerformanceMetricsInterface, 
  PerformanceIssueInterface, 
  PerformanceSeverity,
  PerformanceTrendInterface
} from './interfaces/performance-metrics.interface';

// Utility Classes
import { PerformanceLogger } from './utils/performance-logger';

// Analyzers
import { MemoryLeakAnalyzer } from './analyzers/memory-leak-analyzer';
import { CpuPerformanceAnalyzer } from './analyzers/cpu-performance-analyzer';
import { AsyncBottleneckAnalyzer } from './analyzers/async-bottleneck-analyzer';

// Performance Services
import { AsyncBottleneckService } from './performance-issues/services/async-bottleneck.service';
import { CpuIntensiveService } from './performance-issues/services/cpu-intensive.service';
import { MemoryLeakService } from './performance-issues/services/memory-leak.service';

// Package Version and Configuration
export const VERSION = '0.1.0';

// Default Configuration
export const DEFAULT_CONFIG: PerformanceConfigInterface = {
  logLevel: 'log',
  thresholds: {
    memoryLeak: 100 * 1024 * 1024, // 100MB
    cpuLoad: 80,
    asyncTimeout: 500
  },
  tracking: {
    memoryLeaks: true,
    cpuPerformance: true,
    asyncBottlenecks: true,
    systemProfiling: false
  }
};

/**
 * Create a performance monitoring configuration
 * @param config Partial configuration to merge with defaults
 */
export function createPerformanceConfig(config: Partial<PerformanceConfigInterface> = {}): PerformanceConfigInterface {
  return {
    ...DEFAULT_CONFIG,
    ...config,
    thresholds: {
      ...DEFAULT_CONFIG.thresholds,
      ...config.thresholds
    },
    tracking: {
      ...DEFAULT_CONFIG.tracking,
      ...config.tracking
    }
  };
}

// Performance Monitoring Toolkit
export const PerformanceMonitoringToolkit = {
  VERSION,
  DEFAULT_CONFIG,
  createPerformanceConfig,
  PerformanceDetectorModule,
  PerformanceDetectorService,
  PerformanceTrack,
  PerformanceLogger,
  MemoryLeakAnalyzer,
  CpuPerformanceAnalyzer,
  AsyncBottleneckAnalyzer,
  // Added Performance Services
  AsyncBottleneckService,
  CpuIntensiveService,
  MemoryLeakService
};

// Exports
export {
  PerformanceDetectorModule,
  PerformanceDetectorService,
  PerformanceTrack,
  PerformanceTrackOptions,
  getPerformanceTrackMetadata,
  PerformanceConfigInterface,
  PerformanceMetricsInterface,
  PerformanceIssueInterface,
  PerformanceSeverity,
  PerformanceTrendInterface,
  PerformanceLogger,
  MemoryLeakAnalyzer,
  CpuPerformanceAnalyzer,
  AsyncBottleneckAnalyzer,
  // Added Performance Services
  AsyncBottleneckService,
  CpuIntensiveService,
  MemoryLeakService
};

// Default Export
export default PerformanceMonitoringToolkit;
