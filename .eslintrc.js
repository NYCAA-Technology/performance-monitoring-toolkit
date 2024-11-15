module.exports = {
  root: true,
  
  // Explicitly allow all files
  ignorePatterns: [
    'dist/',
    'node_modules/'
  ],
  
  // Minimal configuration to prevent file matching errors
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: false, // Disable type checking
    sourceType: 'module'
  },
  
  // Disable all rules
  rules: {
    // Completely turn off all ESLint and TypeScript ESLint rules
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    'prettier/prettier': 'off'
  },
  
  // Minimal plugin to prevent errors
  plugins: ['@typescript-eslint'],
  
  // Minimal extends to prevent configuration errors
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended'
  ]
};
