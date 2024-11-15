import { Module } from '@nestjs/common';
import { MemoryLeakService } from './services/memory-leak.service';
import { CpuIntensiveService } from './services/cpu-intensive.service';
import { AsyncBottleneckService } from './services/async-bottleneck.service';
import { PerformanceIssuesController } from './performance-issues.controller';

@Module({
  controllers: [PerformanceIssuesController],
  providers: [
    MemoryLeakService, 
    CpuIntensiveService, 
    AsyncBottleneckService
  ],
  exports: [
    MemoryLeakService, 
    CpuIntensiveService, 
    AsyncBottleneckService
  ]
})
export class PerformanceIssuesModule {}
