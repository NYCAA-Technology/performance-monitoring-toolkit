import { Module, DynamicModule, Provider } from '@nestjs/common';
import { PerformanceDetectorService } from './performance-detector.service';
import { PerformanceConfigInterface } from '../interfaces/performance-config.interface';

@Module({})
export class PerformanceDetectorModule {
  /**
   * Register performance detector with static configuration
   * @param config Performance configuration options
   */
  static register(config?: PerformanceConfigInterface): DynamicModule {
    const providers: Provider[] = [
      {
        provide: 'PERFORMANCE_CONFIG',
        useValue: config || {}
      },
      PerformanceDetectorService
    ];

    return {
      module: PerformanceDetectorModule,
      providers: providers,
      exports: providers
    };
  }

  /**
   * Register performance detector with async configuration
   * @param options Async configuration options
   */
  static registerAsync(options: {
    useFactory: (...args: any[]) => PerformanceConfigInterface;
    inject?: any[];
  }): DynamicModule {
    const providers: Provider[] = [
      {
        provide: 'PERFORMANCE_CONFIG',
        useFactory: options.useFactory,
        inject: options.inject || []
      },
      PerformanceDetectorService
    ];

    return {
      module: PerformanceDetectorModule,
      providers: providers,
      exports: providers
    };
  }
}
