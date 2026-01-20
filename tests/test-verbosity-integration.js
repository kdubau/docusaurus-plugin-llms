const fs = require('fs').promises;
const path = require('path');
const { processMarkdownFile } = require('../lib/processor');

async function setupTestDir() {
  const testDir = path.join(__dirname, 'test-verbosity-integration-temp');
  
  // Clean up if exists
  try {
    await fs.rm(testDir, { recursive: true });
  } catch (err) {
    // Ignore if doesn't exist
  }
  
  await fs.mkdir(testDir, { recursive: true });
  
  return testDir;
}

async function runTests() {
  console.log('Running verbosity integration tests...\n');
  
  const testDir = await setupTestDir();
  let allTestsPassed = true;
  
  // Capture console output
  let logsGenerated = [];
  const originalWarn = console.warn;
  
  try {
    // Create a test markdown file with a description that will trigger warnings
    const testFilePath = path.join(testDir, 'test-doc.md');
    
    // Generate a long description (>500 chars) to trigger length warning
    const longDescription = 'A'.repeat(501);
    
    const testContent = `---
title: Test Document
---

# Test Document

This is a description with HTML tags <div>like this</div> and it's also very long: ${longDescription}

## Content Section

Some content here.
`;
    
    await fs.writeFile(testFilePath, testContent);
    
    // Test 1: Default verbosity (warn) should show warnings
    console.log('Test 1: Default verbosity (warn) should show warnings');
    logsGenerated = [];
    console.warn = (msg) => logsGenerated.push(msg);
    
    await processMarkdownFile(
      testFilePath,
      testDir,
      'https://example.com',
      'docs',
      undefined,
      false,
      false,
      undefined,
      'warn'
    );
    
    const warnCount = logsGenerated.filter(msg => 
      msg.includes('HTML tags') || msg.includes('very long')
    ).length;
    
    if (warnCount === 2) {
      console.log('  ✅ PASS: Warnings were logged with default verbosity\n');
    } else {
      console.log(`  ❌ FAIL: Expected 2 warnings, got ${warnCount}\n`);
      allTestsPassed = false;
    }
    
    // Test 2: Verbosity set to 'ignore' should not show warnings
    console.log('Test 2: Verbosity set to "ignore" should not show warnings');
    logsGenerated = [];
    console.warn = (msg) => logsGenerated.push(msg);
    
    await processMarkdownFile(
      testFilePath,
      testDir,
      'https://example.com',
      'docs',
      undefined,
      false,
      false,
      undefined,
      'ignore'
    );
    
    const ignoreWarnCount = logsGenerated.filter(msg => 
      msg.includes('HTML tags') || msg.includes('very long')
    ).length;
    
    if (ignoreWarnCount === 0) {
      console.log('  ✅ PASS: No warnings were logged when verbosity is "ignore"\n');
    } else {
      console.log(`  ❌ FAIL: Expected 0 warnings, got ${ignoreWarnCount}\n`);
      allTestsPassed = false;
    }
    
    // Test 3: Verbosity set to 'error' should not show warnings (but would show errors)
    console.log('Test 3: Verbosity set to "error" should not show warnings');
    logsGenerated = [];
    console.warn = (msg) => logsGenerated.push(msg);
    
    await processMarkdownFile(
      testFilePath,
      testDir,
      'https://example.com',
      'docs',
      undefined,
      false,
      false,
      undefined,
      'error'
    );
    
    const errorVerbosityWarnCount = logsGenerated.filter(msg => 
      msg.includes('HTML tags') || msg.includes('very long')
    ).length;
    
    if (errorVerbosityWarnCount === 0) {
      console.log('  ✅ PASS: No warnings were logged when verbosity is "error"\n');
    } else {
      console.log(`  ❌ FAIL: Expected 0 warnings, got ${errorVerbosityWarnCount}\n`);
      allTestsPassed = false;
    }
    
    // Test 4: Verbosity set to 'info' should show warnings
    console.log('Test 4: Verbosity set to "info" should show warnings');
    logsGenerated = [];
    console.warn = (msg) => logsGenerated.push(msg);
    
    await processMarkdownFile(
      testFilePath,
      testDir,
      'https://example.com',
      'docs',
      undefined,
      false,
      false,
      undefined,
      'info'
    );
    
    const infoWarnCount = logsGenerated.filter(msg => 
      msg.includes('HTML tags') || msg.includes('very long')
    ).length;
    
    if (infoWarnCount === 2) {
      console.log('  ✅ PASS: Warnings were logged when verbosity is "info"\n');
    } else {
      console.log(`  ❌ FAIL: Expected 2 warnings, got ${infoWarnCount}\n`);
      allTestsPassed = false;
    }
    
  } catch (error) {
    console.error('Test error:', error);
    allTestsPassed = false;
  } finally {
    // Restore console
    console.warn = originalWarn;
    
    // Clean up test directory
    try {
      await fs.rm(testDir, { recursive: true });
    } catch (err) {
      // Ignore cleanup errors
    }
  }
  
  // Summary
  if (allTestsPassed) {
    console.log('Results: All verbosity integration tests passed.');
    console.log('🎉 Verbosity configuration works correctly with description validation!');
  } else {
    console.log('Results: Some tests failed.');
    process.exit(1);
  }
}

// Run tests
runTests().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
