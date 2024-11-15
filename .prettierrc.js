module.exports = {
  // Indentation
  tabWidth: 2,
  useTabs: false,

  // Strings
  singleQuote: true,
  quoteProps: 'as-needed',

  // Formatting
  semi: true,
  trailingComma: 'es5',
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'always',

  // Line breaks and wrapping
  printWidth: 100,
  proseWrap: 'preserve',
  htmlWhitespaceSensitivity: 'css',
  endOfLine: 'auto',

  // TypeScript-specific
  parser: 'typescript',

  // Performance-conscious formatting
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.js', '*.jsx'],
      options: {
        // Optimize for readability and performance analysis
        singleQuote: true,
        trailingComma: 'es5',
        printWidth: 100,
        tabWidth: 2
      }
    },
    {
      files: ['*.json', '*.yml', '*.yaml'],
      options: {
        tabWidth: 2,
        singleQuote: false
      }
    }
  ],

  // Performance monitoring specific plugins
  plugins: [
    // Add any specific Prettier plugins for performance monitoring
  ],

  // Custom performance formatting rules
  performanceFormatting: {
    // Experimental: Optimize for code readability in performance contexts
    maxLineLength: 100,
    preferInlineComments: true,
    optimizeImports: true
  }
};
