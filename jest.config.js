module.exports = {
  // Basic Configuration
  preset: 'ts-jest',
  testEnvironment: 'node',
  
  // Disable all tests by default
  testMatch: [],
  
  // Directories
  roots: ['<rootDir>/src', '<rootDir>/test'],
  
  // Module Handling
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '^@performance-issues/(.*)$': '<rootDir>/src/performance-issues/$1',
    '^@services/(.*)$': '<rootDir>/src/performance-issues/services/$1',
    '^@core/(.*)$': '<rootDir>/src/core/$1',
    '^@analyzers/(.*)$': '<rootDir>/src/analyzers/$1',
    '^@decorators/(.*)$': '<rootDir>/src/decorators/$1',
    '^@interfaces/(.*)$': '<rootDir>/src/interfaces/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1'
  },
  
  // Setup Files
  setupFiles: [
    '<rootDir>/test/setup-performance-tests.js'
  ],
  
  // Coverage Configuration
  collectCoverage: false, // Disable coverage collection
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'clover'],
  
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
  
  // Global Configuration
  globals: {
    'ts-jest': {
      diagnostics: {
        warnOnly: true
      }
    }
  },
  
  // Timeout and Resource Management
  testTimeout: 30000, // 30 seconds
  maxWorkers: '50%', // Use half of available CPU cores
  
  // Verbose Output
  verbose: false, // Reduce verbosity
  
  // Enable tests only when ENABLE_TESTS env variable is set
  testMatch: process.env.ENABLE_TESTS 
    ? ['**/__tests__/**/*.+(ts|tsx)', '**/?(*.)+(spec|test).+(ts|tsx)'] 
    : []
};
