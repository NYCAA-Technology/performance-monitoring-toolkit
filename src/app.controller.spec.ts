import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Import performance setup from test directory
const { setupPerformanceTracking, analyzePerformance } = require('../test/setup-performance-tests');

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);

    // Call performance tracking setup
    setupPerformanceTracking();
  });

  afterEach(() => {
    // Call performance analysis
    analyzePerformance();
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
