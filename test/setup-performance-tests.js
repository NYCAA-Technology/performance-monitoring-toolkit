// Performance Test Setup and Monitoring

// Ensure Jest global functions are available
const { beforeEach, afterEach, expect } = require('@jest/globals');

// Global performance tracking
if (!global.performanceMetrics) {
  global.performanceMetrics = {
    testStartTime: null,
    memoryUsageBefore: null,
    cpuUsageBefore: null
  };
}

// Performance tracking setup function
function setupPerformanceTracking() {
  global.performanceMetrics.testStartTime = Date.now();
  global.performanceMetrics.memoryUsageBefore = process.memoryUsage().heapUsed;
  
  // Attempt to track CPU usage (may vary by platform)
  if (process.cpuUsage) {
    global.performanceMetrics.cpuUsageBefore = process.cpuUsage();
  }
}

// Performance analysis function
function analyzePerformance() {
  const testEndTime = Date.now();
  const executionTime = testEndTime - global.performanceMetrics.testStartTime;
  const memoryUsageAfter = process.memoryUsage().heapUsed;
  const memoryUsed = memoryUsageAfter - global.performanceMetrics.memoryUsageBefore;
  
  // Log performance metrics
  console.log(`Test Execution Time: ${executionTime}ms`);
  console.log(`Memory Used: ${memoryUsed / 1024 / 1024}MB`);
  
  // Check against performance thresholds
  const config = global.performanceTestConfig || {};
  const maxExecutionTime = config.maxExecutionTime || 100;
  const memoryLeakThreshold = config.memoryLeakThreshold || (50 * 1024 * 1024);
  
  if (executionTime > maxExecutionTime) {
    console.warn(`Performance Warning: Test took ${executionTime}ms (threshold: ${maxExecutionTime}ms)`);
  }
  
  if (memoryUsed > memoryLeakThreshold) {
    console.warn(`Memory Leak Warning: ${memoryUsed / 1024 / 1024}MB used (threshold: ${memoryLeakThreshold / 1024 / 1024}MB)`);
  }

  // Cleanup and reset global metrics
  global.performanceMetrics = {
    testStartTime: null,
    memoryUsageBefore: null,
    cpuUsageBefore: null
  };
}

// Expose functions globally to ensure they can be used in test files
global.setupPerformanceTracking = setupPerformanceTracking;
global.analyzePerformance = analyzePerformance;

// Optional: Global error handler for unhandled promises
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Optionally throw to fail the test
  throw reason;
});

// Advanced Performance Monitoring Utilities
const performanceMonitor = {
  /**
   * Measure function execution performance
   * @param {Function} fn Function to measure
   * @param {string} label Optional label for the measurement
   */
  measureExecutionTime: (fn, label = 'Anonymous Function') => {
    const start = process.hrtime();
    
    try {
      const result = fn();
      
      const [seconds, nanoseconds] = process.hrtime(start);
      const executionTime = seconds * 1000 + nanoseconds / 1_000_000;
      
      console.log(`Performance Measurement for ${label}:
        Execution Time: ${executionTime.toFixed(2)}ms`);
      
      return result;
    } catch (error) {
      console.error(`Error in performance measurement for ${label}:`, error);
      throw error;
    }
  },

  /**
   * Track memory allocation
   * @param {Function} fn Function to track
   * @param {string} label Optional label for tracking
   */
  trackMemoryAllocation: (fn, label = 'Anonymous Function') => {
    const memoryBefore = process.memoryUsage().heapUsed;
    
    try {
      const result = fn();
      
      const memoryAfter = process.memoryUsage().heapUsed;
      const memoryUsed = memoryAfter - memoryBefore;
      
      console.log(`Memory Allocation for ${label}:
        Memory Used: ${memoryUsed / 1024 / 1024}MB`);
      
      return result;
    } catch (error) {
      console.error(`Error in memory tracking for ${label}:`, error);
      throw error;
    }
  }
};

// Expose performance monitor globally
global.performanceMonitor = performanceMonitor;

// Export for potential module usage
module.exports = {
  setupPerformanceTracking,
  analyzePerformance,
  performanceMonitor
};
