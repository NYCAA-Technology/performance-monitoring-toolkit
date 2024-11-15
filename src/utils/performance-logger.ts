import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { 
  PerformanceMetricsInterface, 
  PerformanceIssueInterface, 
  PerformanceSeverity 
} from '../interfaces/performance-metrics.interface';

type LogType = 'metric' | 'issue' | 'log';

interface LogEntry {
  type: LogType;
  data: any;
  timestamp: number;
}

/**
 * Advanced Performance Logging Utility
 * Provides comprehensive logging, tracking, and analysis of performance metrics and issues
 */
@Injectable()
export class PerformanceLogger {
  private logLevel: 'error' | 'warn' | 'log' | 'verbose' | 'debug';
  private logs: LogEntry[] = [];

  private logDirectory: string;

  constructor(
    logLevel: string = 'log', 
    logDirectory: string = './performance-logs'
  ) {
    this.logLevel = logLevel as any;
    this.logDirectory = path.resolve(logDirectory);
    
    // Ensure log directory exists
    if (!fs.existsSync(this.logDirectory)) {
      fs.mkdirSync(this.logDirectory, { recursive: true });
    }
  }

  /**
   * Log performance metrics
   * @param metrics Performance metrics to log
   */
  logMetrics(metrics: PerformanceMetricsInterface): void {
    const logEntry: LogEntry = {
      type: 'metric',
      data: metrics,
      timestamp: Date.now()
    };

    this.logs.push(logEntry);

    // Log based on configured log level
    if (this.shouldLog('verbose')) {
      console.log(`[Performance Metrics] ${JSON.stringify(metrics)}`);
    }

    // Write to persistent log file
    this.writeLogToDisk(logEntry);
  }

  /**
   * Log performance issues
   * @param issue Performance issue to log
   */
  logIssue(issue: PerformanceIssueInterface): void {
    const logEntry: LogEntry = {
      type: 'issue',
      data: issue,
      timestamp: Date.now()
    };

    this.logs.push(logEntry);

    // Log based on severity
    switch (issue.severity) {
      case PerformanceSeverity.CRITICAL:
      case PerformanceSeverity.HIGH:
        console.error(`[CRITICAL PERFORMANCE ISSUE] ${JSON.stringify(issue)}`);
        break;
      case PerformanceSeverity.MEDIUM:
        console.warn(`[PERFORMANCE WARNING] ${JSON.stringify(issue)}`);
        break;
      default:
        console.log(`[Performance Issue] ${JSON.stringify(issue)}`);
    }

    // Write to persistent log file
    this.writeLogToDisk(logEntry);
  }

  /**
   * Write log entry to disk
   * @param logEntry Log entry to write
   */
  private writeLogToDisk(logEntry: LogEntry): void {
    try {
      const logFileName = `performance-${new Date().toISOString().split('T')[0]}.log`;
      const logFilePath = path.join(this.logDirectory, logFileName);

      // Append log entry to file
      fs.appendFileSync(logFilePath, JSON.stringify(logEntry) + '\n');
    } catch (error) {
      console.error('Failed to write performance log to disk', error);
    }
  }

  /**
   * Determine if a log should be output based on current log level
   * @param level Desired log level
   */
  private shouldLog(level: string): boolean {
    const logLevels = ['error', 'warn', 'log', 'verbose', 'debug'];
    const currentLevelIndex = logLevels.indexOf(this.logLevel);
    const requestedLevelIndex = logLevels.indexOf(level);

    return requestedLevelIndex <= currentLevelIndex;
  }

  /**
   * Retrieve performance logs
   * @param options Filtering options for log retrieval
   */
  getLogs(options?: {
    type?: LogType;
    startTime?: number;
    endTime?: number;
  }): LogEntry[] {
    return this.logs.filter(log => {
      if (options?.type && log.type !== options.type) return false;
      if (options?.startTime && log.timestamp < options.startTime) return false;
      if (options?.endTime && log.timestamp > options.endTime) return false;
      return true;
    });
  }

  /**
   * Analyze performance logs
   * Provides basic trend analysis and insights
   */
  analyzeLogs(): {
    totalLogs: number;
    metrics: number;
    issues: number;
    criticalIssues: number;
  } {
    return {
      totalLogs: this.logs.length,
      metrics: this.logs.filter(log => log.type === 'metric').length,
      issues: this.logs.filter(log => log.type === 'issue').length,
      criticalIssues: this.logs.filter(log => 
        log.type === 'issue' && 
        log.data.severity === PerformanceSeverity.CRITICAL
      ).length
    };
  }

  /**
   * Clear logs
   * Removes logs from memory and optionally from disk
   * @param clearDiskLogs Whether to clear log files on disk
   */
  clearLogs(clearDiskLogs: boolean = false): void {
    this.logs = [];

    if (clearDiskLogs) {
      try {
        fs.readdirSync(this.logDirectory).forEach(file => {
          if (file.startsWith('performance-')) {
            fs.unlinkSync(path.join(this.logDirectory, file));
          }
        });
      } catch (error) {
        console.error('Failed to clear performance log files', error);
      }
    }
  }
}
