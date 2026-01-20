/**
 * Example Docusaurus plugin configuration with verbosity options
 * 
 * This example demonstrates how to configure the verbosity level
 * for description validation warnings during the build process.
 */

module.exports = {
  // ... your existing Docusaurus config
  plugins: [
    [
      'docusaurus-plugin-llms',
      {
        // Suppress all validation warnings (useful for production builds)
        verbosity: 'ignore',
        
        // Other plugin options
        generateLLMsTxt: true,
        generateLLMsFullTxt: true,
        docsDir: 'docs',
      },
    ],
    // ... your other plugins
  ],
};

// Alternative configurations:

// Show only critical errors
// verbosity: 'error'

// Show warnings and errors (default behavior)
// verbosity: 'warn'

// Show all messages including informational ones (useful during development)
// verbosity: 'info'
