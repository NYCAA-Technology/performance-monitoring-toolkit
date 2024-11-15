module.exports = {
  // Basic Configuration
  preset: 'ts-jest',
  testEnvironment: 'node',
  
  // Directories
  roots: ['<rootDir>/src', '<rootDir>/test'],
  
  // Test File Patterns
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx)',
    '**/?(*.)+(spec|test).+(ts|tsx)'
  ],
  
  // Module Handling
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '^@performance-issues/(.*)$': '<rootDir>/src/performance-issues/$1',
    '^@services/(.*)$': '<rootDir>/src/performance-issues/services/$1',
    '^@core/(.*)$': '<rootDir>/src/core/$1'
  },
  
  // Coverage Configuration
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'clover'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  
  // Performance Testing Specific
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.module.ts'
  ],
  
  // Transformation
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest', 
      { 
        tsconfig: 'tsconfig.json',
        diagnostics: {
          warnOnly: true
        }
      }
    ]
  },
  
  // Performance Monitoring Setup
  setupFiles: ['<rootDir>/test/setup-performance-tests.js'],
  
  // Performance Test Specific Configuration
  globals: {
    'ts-jest': {
      diagnostics: {
        warnOnly: true
      }
    },
    performanceTestConfig: {
      maxExecutionTime: 100, // ms
      memoryLeakThreshold: 50 * 1024 * 1024, // 50MB
      cpuUsageThreshold: 0.8
    }
  },
  
  // Reporters
  reporters: [
    'default',
    ['jest-performance-reporter', {
      maxExecutionTimeWarning: 100,
      slowTestThreshold: 50
    }]
  ],
  
  // Performance Profiling
  profilerConfig: {
    enabled: true,
    outputDir: '<rootDir>/performance-profiles',
    reportFormat: ['json', 'html']
  },
  
  // Timeout and Resource Management
  testTimeout: 30000, // 30 seconds
  maxWorkers: '50%', // Use half of available CPU cores
  
  // Verbose Output
  verbose: true,
  
  // Performance Monitoring Plugins
  setupFilesAfterEnv: [
    '<rootDir>/test/performance-monitoring-setup.js'
  ]
};
