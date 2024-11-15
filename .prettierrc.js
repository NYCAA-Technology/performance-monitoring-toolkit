module.exports = {
  // Disable all formatting by default
  semi: false,
  singleQuote: false,
  trailingComma: 'none',
  printWidth: 9999,
  tabWidth: 2,
  useTabs: false,
  bracketSpacing: false,
  arrowParens: 'avoid',
  
  // Optional: Enable formatting via environment variable
  ...(process.env.ENABLE_PRETTIER ? {
    semi: true,
    singleQuote: true,
    trailingComma: 'all',
    printWidth: 80,
    bracketSpacing: true,
    arrowParens: 'always'
  } : {})
};
