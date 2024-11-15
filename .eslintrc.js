module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
    ecmaVersion: 2021
  },
  plugins: [
    '@typescript-eslint/eslint-plugin',
    'performance-plugin'
  ],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ],
  root: true,
  env: {
    node: true,
    jest: true
  },
  ignorePatterns: ['.eslintrc.js', 'dist', 'node_modules'],
  rules: {
    // TypeScript-specific rules
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'error',
    '@typescript-eslint/explicit-module-boundary-types': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
    
    // Performance-specific rules
    'performance-plugin/no-complex-conditionals': 'warn',
    'performance-plugin/avoid-unnecessary-async': 'warn',
    
    // General best practices
    'complexity': ['warn', { max: 10 }],
    'max-depth': ['warn', 4],
    'max-lines-per-function': ['warn', { max: 50, skipBlankLines: true }],
    
    // Error handling
    'no-throw-literal': 'error',
    'no-unused-expressions': 'error',
    
    // Memory and resource management
    'no-var': 'error',
    'prefer-const': 'error',
    
    // Code style and readability
    'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
    'no-debugger': 'error',
    
    // Potential performance bottlenecks
    'no-loop-func': 'warn',
    'require-await': 'warn'
  },
  
  // Custom plugin for performance-specific linting
  plugins: [
    {
      rules: {
        'no-complex-conditionals': {
          create: function(context) {
            return {
              IfStatement(node) {
                if (node.test.type === 'LogicalExpression' && 
                    node.test.operator === '&&' && 
                    node.test.right.type === 'LogicalExpression') {
                  context.report({
                    node,
                    message: 'Avoid deeply nested conditional logic for better performance'
                  });
                }
              }
            };
          }
        },
        'avoid-unnecessary-async': {
          create: function(context) {
            return {
              FunctionDeclaration(node) {
                if (node.async && 
                    node.body.body.length === 1 && 
                    node.body.body[0].type === 'ReturnStatement' &&
                    !node.body.body[0].argument.type.includes('Await')) {
                  context.report({
                    node,
                    message: 'Unnecessary async function without await'
                  });
                }
              }
            };
          }
        }
      }
    }
  ]
};
