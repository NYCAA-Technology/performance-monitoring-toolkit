const axios = require('axios');
const { performance } = require('perf_hooks');

class PerformanceLoadTester {
  constructor(baseUrl = 'http://localhost:3000/api/performance-issues') {
    this.baseUrl = baseUrl;
    this.results = {
      memoryLeak: [],
      cpuIntensive: [],
      asyncBottleneck: []
    };
  }

  /**
   * Run performance load test
   * @param {number} concurrentRequests Number of concurrent requests
   * @param {number} iterations Number of test iterations
   */
  async runLoadTest(concurrentRequests = 50, iterations = 100) {
    console.log(`Starting Performance Load Test
    Concurrent Requests: ${concurrentRequests}
    Iterations: ${iterations}`);

    await Promise.all([
      this.testMemoryLeakEndpoint(concurrentRequests, iterations),
      this.testCpuIntensiveEndpoint(concurrentRequests, iterations),
      this.testAsyncBottleneckEndpoint(concurrentRequests, iterations)
    ]);

    this.generateReport();
  }

  /**
   * Test Memory Leak Endpoint
   * @param {number} concurrentRequests 
   * @param {number} iterations 
   */
  async testMemoryLeakEndpoint(concurrentRequests, iterations) {
    const endpoint = `${this.baseUrl}/memory-leak`;
    const testResults = [];

    for (let i = 0; i < iterations; i++) {
      const requests = Array(concurrentRequests).fill().map(async () => {
        const start = performance.now();
        try {
          const response = await axios.get(endpoint, { 
            params: { count: 1000 } 
          });
          const end = performance.now();
          return {
            duration: end - start,
            status: response.status,
            data: response.data
          };
        } catch (error) {
          return {
            duration: performance.now() - start,
            status: error.response ? error.response.status : 'ERROR',
            error: error.message
          };
        }
      });

      const iterationResults = await Promise.all(requests);
      testResults.push(...iterationResults);
    }

    this.results.memoryLeak = testResults;
  }

  /**
   * Test CPU Intensive Endpoint
   * @param {number} concurrentRequests 
   * @param {number} iterations 
   */
  async testCpuIntensiveEndpoint(concurrentRequests, iterations) {
    const endpoint = `${this.baseUrl}/cpu-intensive`;
    const testResults = [];

    for (let i = 0; i < iterations; i++) {
      const requests = Array(concurrentRequests).fill().map(async () => {
        const start = performance.now();
        try {
          const response = await axios.get(endpoint, { 
            params: { 
              iterations: 1000000, 
              complexity: 15 
            } 
          });
          const end = performance.now();
          return {
            duration: end - start,
            status: response.status,
            data: response.data
          };
        } catch (error) {
          return {
            duration: performance.now() - start,
            status: error.response ? error.response.status : 'ERROR',
            error: error.message
          };
        }
      });

      const iterationResults = await Promise.all(requests);
      testResults.push(...iterationResults);
    }

    this.results.cpuIntensive = testResults;
  }

  /**
   * Test Async Bottleneck Endpoint
   * @param {number} concurrentRequests 
   * @param {number} iterations 
   */
  async testAsyncBottleneckEndpoint(concurrentRequests, iterations) {
    const endpoint = `${this.baseUrl}/async-bottleneck`;
    const testResults = [];

    for (let i = 0; i < iterations; i++) {
      const requests = Array(concurrentRequests).fill().map(async () => {
        const start = performance.now();
        try {
          const response = await axios.get(endpoint, { 
            params: { 
              operationCount: 50, 
              maxDelay: 2000 
            } 
          });
          const end = performance.now();
          return {
            duration: end - start,
            status: response.status,
            data: response.data
          };
        } catch (error) {
          return {
            duration: performance.now() - start,
            status: error.response ? error.response.status : 'ERROR',
            error: error.message
          };
        }
      });

      const iterationResults = await Promise.all(requests);
      testResults.push(...iterationResults);
    }

    this.results.asyncBottleneck = testResults;
  }

  /**
   * Generate comprehensive performance report
   */
  generateReport() {
    const generateEndpointReport = (results) => {
      const durations = results.map(r => r.duration);
      const successfulRequests = results.filter(r => r.status === 200);
      const failedRequests = results.filter(r => r.status !== 200);

      return {
        totalRequests: results.length,
        successfulRequests: successfulRequests.length,
        failedRequests: failedRequests.length,
        averageResponseTime: this.calculateAverage(durations),
        minResponseTime: Math.min(...durations),
        maxResponseTime: Math.max(...durations),
        percentile95: this.calculatePercentile(durations, 95)
      };
    };

    const report = {
      memoryLeak: generateEndpointReport(this.results.memoryLeak),
      cpuIntensive: generateEndpointReport(this.results.cpuIntensive),
      asyncBottleneck: generateEndpointReport(this.results.asyncBottleneck)
    };

    console.log('Performance Load Test Report:');
    console.log(JSON.stringify(report, null, 2));
    return report;
  }

  /**
   * Calculate average of an array of numbers
   * @param {number[]} arr 
   */
  calculateAverage(arr) {
    return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
  }

  /**
   * Calculate percentile of an array of numbers
   * @param {number[]} arr 
   * @param {number} percentile 
   */
  calculatePercentile(arr, percentile) {
    if (arr.length === 0) return 0;
    const sorted = [...arr].sort((a, b) => a - b);
    const index = Math.floor(percentile / 100 * sorted.length);
    return sorted[index];
  }
}

// Run the load test
async function runTest() {
  const tester = new PerformanceLoadTester();
  await tester.runLoadTest();
}

runTest().catch(console.error);
