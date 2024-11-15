import { Test, TestingModule } from '@nestjs/testing';
import { MemoryLeakService } from '../src/performance-issues/services/memory-leak.service';
import { CpuIntensiveService } from '../src/performance-issues/services/cpu-intensive.service';
import { AsyncBottleneckService } from '../src/performance-issues/services/async-bottleneck.service';
import { PerformanceIssuesController } from '../src/performance-issues/performance-issues.controller';

describe('Performance Issues Test Suite', () => {
  let memoryLeakService: MemoryLeakService;
  let cpuIntensiveService: CpuIntensiveService;
  let asyncBottleneckService: AsyncBottleneckService;
  let performanceController: PerformanceIssuesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PerformanceIssuesController],
      providers: [
        MemoryLeakService,
        CpuIntensiveService,
        AsyncBottleneckService
      ]
    }).compile();

    memoryLeakService = module.get<MemoryLeakService>(MemoryLeakService);
    cpuIntensiveService = module.get<CpuIntensiveService>(CpuIntensiveService);
    asyncBottleneckService = module.get<AsyncBottleneckService>(AsyncBottleneckService);
    performanceController = module.get<PerformanceIssuesController>(PerformanceIssuesController);
  });

  describe('Memory Leak Service', () => {
    it('should generate memory leaks', () => {
      const leakCount = 1000;
      memoryLeakService.generateMemoryLeaks(leakCount);
      
      const leakAnalytics = memoryLeakService.analyzeMemoryLeaks();
      
      expect(leakAnalytics).toBeDefined();
      expect(leakAnalytics.leakedObjectCount).toBeGreaterThan(0);
      expect(leakAnalytics.severity).toBeDefined();
    });

    it('should handle memory cleanup', () => {
      memoryLeakService.generateMemoryLeaks(1000);
      
      const beforeCleanup = memoryLeakService.analyzeMemoryLeaks();
      memoryLeakService.attemptMemoryCleanup();
      const afterCleanup = memoryLeakService.analyzeMemoryLeaks();
      
      expect(beforeCleanup.leakedObjectCount).toBeGreaterThan(0);
      expect(afterCleanup.leakedObjectCount).toBe(0);
    });
  });

  describe('CPU Intensive Service', () => {
    it('should calculate fibonacci with performance tracking', () => {
      const complexity = 15;
      const fibResult = cpuIntensiveService.calculateFibonacci(complexity);
      
      expect(fibResult).toBeGreaterThan(0);
    });

    it('should create CPU-intensive task', () => {
      const iterations = 1000000;
      const taskResult = cpuIntensiveService.createCpuIntensiveTask(iterations);
      
      expect(taskResult).toBeDefined();
      expect(typeof taskResult).toBe('number');
    });

    it('should handle concurrent CPU tasks', () => {
      const concurrentTasks = cpuIntensiveService.createConcurrentCpuTasks();
      
      expect(concurrentTasks).toBeDefined();
      expect(concurrentTasks.length).toBeGreaterThan(0);
    });
  });

  describe('Async Bottleneck Service', () => {
    it('should create concurrent async operations', async () => {
      const operationCount = 50;
      const maxDelay = 2000;
      
      const concurrentOperations = await asyncBottleneckService.createConcurrentAsyncBottleneck(
        operationCount, 
        maxDelay
      );
      
      expect(concurrentOperations).toBeDefined();
      expect(concurrentOperations.length).toBe(operationCount);
    });

    it('should simulate promise chain bottleneck', async () => {
      const chainResult = await asyncBottleneckService.createPromiseChainBottleneck();
      
      expect(chainResult).toBeDefined();
      expect(typeof chainResult).toBe('number');
    });

    it('should simulate slow database operations', async () => {
      const databaseSimulation = await asyncBottleneckService.simulateSlowDatabaseOperations();
      
      expect(databaseSimulation).toBeGreaterThan(0);
    });
  });

  describe('Performance Issues Controller', () => {
    it('should trigger memory leak endpoint', () => {
      const memoryLeakResult = performanceController.triggerMemoryLeak();
      
      expect(memoryLeakResult).toBeDefined();
      expect(memoryLeakResult.problemDetected).toBeDefined();
      expect(memoryLeakResult.metrics).toBeDefined();
    });

    it('should trigger CPU-intensive endpoint', () => {
      const cpuIntensiveResult = performanceController.triggerCpuIntensiveTask();
      
      expect(cpuIntensiveResult).toBeDefined();
      expect(cpuIntensiveResult.problemDetected).toBeDefined();
      expect(cpuIntensiveResult.metrics).toBeDefined();
    });

    it('should trigger async bottleneck endpoint', async () => {
      const asyncBottleneckResult = await performanceController.triggerAsyncBottleneck();
      
      expect(asyncBottleneckResult).toBeDefined();
      expect(asyncBottleneckResult.problemDetected).toBeDefined();
      expect(asyncBottleneckResult.metrics).toBeDefined();
    });
  });

  // Performance Threshold Tests
  describe('Performance Thresholds', () => {
    it('should detect high memory usage', () => {
      memoryLeakService.generateMemoryLeaks(10000);
      const leakAnalytics = memoryLeakService.analyzeMemoryLeaks();
      
      if (leakAnalytics.severity === 'high') {
        console.warn('High memory usage detected:', leakAnalytics);
      }
      
      expect(leakAnalytics.severity).toBeDefined();
    });

    it('should detect long-running CPU tasks', () => {
      const startTime = Date.now();
      cpuIntensiveService.createCpuIntensiveTask(5000000);
      const executionTime = Date.now() - startTime;
      
      console.log(`CPU Intensive Task Execution Time: ${executionTime}ms`);
      
      expect(executionTime).toBeLessThan(5000); // Ensure task completes within 5 seconds
    });
  });
});
