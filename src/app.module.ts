import { Module } from '@nestjs/common';
import { PerformanceIssuesModule } from './performance-issues/performance-issues.module';

@Module({
  imports: [
    PerformanceIssuesModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
