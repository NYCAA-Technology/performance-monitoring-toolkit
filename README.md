# @nestjs-performance/detector

## Advanced Performance Monitoring and Detection Toolkit for NestJS

### 🚀 Features

- 📊 Comprehensive Performance Tracking
- 🕵️ Advanced Performance Issue Detection
- 💡 Easy-to-Use Decorators
- 🔍 Detailed Metrics Collection
- 🛡️ Flexible Configuration

### Installation

```bash
npm install @nestjs-performance/detector
# or
yarn add @nestjs-performance/detector
```

### Quick Start

#### 1. Basic Performance Tracking

```typescript
import { PerformanceTrack } from '@nestjs-performance/detector';

class UserService {
  @PerformanceTrack({
    executionTimeThreshold: 500, // 500ms
    memoryThreshold: 50 * 1024 * 1024 // 50MB
  })
  async getUserProfile(userId: string) {
    // Method implementation
  }
}
```

#### 2. Module Configuration

```typescript
import { Module } from '@nestjs/common';
import { PerformanceDetectorModule } from '@nestjs-performance/detector';

@Module({
  imports: [
    PerformanceDetectorModule.register({
      logLevel: 'verbose',
      thresholds: {
        memoryLeak: 100 * 1024 * 1024, // 100MB
        cpuLoad: 80,
        asyncTimeout: 500
      }
    })
  ]
})
export class AppModule {}
```

### Performance Tracking Capabilities

- **Method-Level Performance Monitoring**
- **Execution Time Tracking**
- **Memory Usage Monitoring**
- **Error Handling and Logging**
- **Customizable Thresholds**

### Metrics Captured

- CPU Utilization
- Memory Consumption
- Execution Duration
- Async Operation Performance
- Request Statistics

### Performance Issue Detection

- Execution Time Violations
- Memory Consumption Limits
- Error Tracking
- Severity Classification

### Configuration Options

```typescript
interface PerformanceConfigInterface {
  logLevel?: 'error' | 'warn' | 'log' | 'verbose' | 'debug';
  
  thresholds?: {
    memoryLeak?: number;
    cpuLoad?: number;
    asyncTimeout?: number;
    memoryUsage?: number;
    requestLatency?: number;
  };
  
  tracking?: {
    memoryLeaks?: boolean;
    cpuPerformance?: boolean;
    asyncBottlenecks?: boolean;
    systemProfiling?: boolean;
  };
}
```

### Advanced Usage

#### Performance Analyzers

```typescript
import { 
  MemoryLeakAnalyzer, 
  CpuPerformanceAnalyzer,
  AsyncBottleneckAnalyzer 
} from '@nestjs-performance/detector';

// Initialize analyzers
const memoryAnalyzer = new MemoryLeakAnalyzer();
const cpuAnalyzer = new CpuPerformanceAnalyzer();
const asyncAnalyzer = new AsyncBottleneckAnalyzer();

// Detect performance issues
const memoryLeakIssue = memoryAnalyzer.detectLeaks();
const cpuBottleneck = cpuAnalyzer.detectBottlenecks();
const asyncBottleneck = await asyncAnalyzer.detectBottlenecks();
```

### Performance Logging

```typescript
import { PerformanceLogger } from '@nestjs-performance/detector';

const logger = new PerformanceLogger('verbose');

// Log performance metrics
logger.logMetrics(performanceMetrics);

// Log performance issues
logger.logIssue(performanceIssue);
```

### Roadmap

- [ ] Machine Learning Performance Prediction
- [ ] Advanced Distributed Tracing
- [ ] Real-time Performance Dashboards
- [ ] Expanded Testing Scenarios

### Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

### Performance Optimization Tips

- Monitor resource utilization
- Identify bottlenecks early
- Use profiling tools
- Implement caching strategies
- Optimize database queries

### Troubleshooting

- Check application logs
- Review performance metrics
- Analyze test results
- Consult monitoring dashboards

### License

MIT License

### Contact

For more information, contact the Performance Monitoring Team
