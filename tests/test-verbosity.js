const { logWithVerbosity } = require('../lib/utils');

/**
 * Test the verbosity logging utility
 */
function runVerbosityTests() {
  console.log('Running verbosity tests...\n');
  
  let allTestsPassed = true;
  let logsGenerated = [];
  
  // Capture console output
  const originalWarn = console.warn;
  const originalError = console.error;
  const originalLog = console.log;
  
  console.warn = (msg) => logsGenerated.push({ level: 'warn', msg });
  console.error = (msg) => logsGenerated.push({ level: 'error', msg });
  console.log = (msg) => {
    // Only capture messages from logWithVerbosity, not our test output
    if (msg && typeof msg === 'string' && msg.startsWith('Test message')) {
      logsGenerated.push({ level: 'info', msg });
    }
  };
  
  // Test 1: Default verbosity (warn) should show warn and error messages
  console = { ...console, log: originalLog };
  console.log('Test 1: Default verbosity (warn) should show warn and error messages');
  logsGenerated = [];
  console.warn = (msg) => logsGenerated.push({ level: 'warn', msg });
  console.error = (msg) => logsGenerated.push({ level: 'error', msg });
  console.log = (msg) => {
    if (msg && typeof msg === 'string' && msg.startsWith('Test message')) {
      logsGenerated.push({ level: 'info', msg });
    }
  };
  
  logWithVerbosity('Test message: warn', 'warn', 'warn');
  logWithVerbosity('Test message: error', 'error', 'warn');
  logWithVerbosity('Test message: info', 'info', 'warn');
  
  if (logsGenerated.length === 2 && 
      logsGenerated.find(log => log.level === 'warn') &&
      logsGenerated.find(log => log.level === 'error') &&
      !logsGenerated.find(log => log.level === 'info')) {
    console = { ...console, log: originalLog };
    console.log('  ✅ PASS: Correct messages logged with default verbosity\n');
  } else {
    console = { ...console, log: originalLog };
    console.log('  ❌ FAIL: Incorrect messages logged');
    console.log(`  Expected: 2 logs (warn + error), Got: ${logsGenerated.length}`);
    console.log(`  Logs: ${JSON.stringify(logsGenerated)}\n`);
    allTestsPassed = false;
  }
  
  // Test 2: Verbosity set to 'error' should only show error messages
  console = { ...console, log: originalLog };
  console.log('Test 2: Verbosity set to "error" should only show error messages');
  logsGenerated = [];
  console.warn = (msg) => logsGenerated.push({ level: 'warn', msg });
  console.error = (msg) => logsGenerated.push({ level: 'error', msg });
  console.log = (msg) => {
    if (msg && typeof msg === 'string' && msg.startsWith('Test message')) {
      logsGenerated.push({ level: 'info', msg });
    }
  };
  
  logWithVerbosity('Test message: warn', 'warn', 'error');
  logWithVerbosity('Test message: error', 'error', 'error');
  logWithVerbosity('Test message: info', 'info', 'error');
  
  if (logsGenerated.length === 1 && logsGenerated[0].level === 'error') {
    console = { ...console, log: originalLog };
    console.log('  ✅ PASS: Only error messages logged\n');
  } else {
    console = { ...console, log: originalLog };
    console.log('  ❌ FAIL: Incorrect messages logged');
    console.log(`  Expected: 1 log (error), Got: ${logsGenerated.length}`);
    console.log(`  Logs: ${JSON.stringify(logsGenerated)}\n`);
    allTestsPassed = false;
  }
  
  // Test 3: Verbosity set to 'info' should show all messages
  console = { ...console, log: originalLog };
  console.log('Test 3: Verbosity set to "info" should show all messages');
  logsGenerated = [];
  console.warn = (msg) => logsGenerated.push({ level: 'warn', msg });
  console.error = (msg) => logsGenerated.push({ level: 'error', msg });
  console.log = (msg) => {
    if (msg && typeof msg === 'string' && msg.startsWith('Test message')) {
      logsGenerated.push({ level: 'info', msg });
    }
  };
  
  logWithVerbosity('Test message: warn', 'warn', 'info');
  logWithVerbosity('Test message: error', 'error', 'info');
  logWithVerbosity('Test message: info', 'info', 'info');
  
  if (logsGenerated.length === 3 &&
      logsGenerated.find(log => log.level === 'warn') &&
      logsGenerated.find(log => log.level === 'error') &&
      logsGenerated.find(log => log.level === 'info')) {
    console = { ...console, log: originalLog };
    console.log('  ✅ PASS: All messages logged\n');
  } else {
    console = { ...console, log: originalLog };
    console.log('  ❌ FAIL: Incorrect messages logged');
    console.log(`  Expected: 3 logs (warn + error + info), Got: ${logsGenerated.length}`);
    console.log(`  Logs: ${JSON.stringify(logsGenerated)}\n`);
    allTestsPassed = false;
  }
  
  // Test 4: Verbosity set to 'ignore' should not show any messages
  console = { ...console, log: originalLog };
  console.log('Test 4: Verbosity set to "ignore" should not show any messages');
  logsGenerated = [];
  console.warn = (msg) => logsGenerated.push({ level: 'warn', msg });
  console.error = (msg) => logsGenerated.push({ level: 'error', msg });
  console.log = (msg) => {
    if (msg && typeof msg === 'string' && msg.startsWith('Test message')) {
      logsGenerated.push({ level: 'info', msg });
    }
  };
  
  logWithVerbosity('Test message: warn', 'warn', 'ignore');
  logWithVerbosity('Test message: error', 'error', 'ignore');
  logWithVerbosity('Test message: info', 'info', 'ignore');
  
  if (logsGenerated.length === 0) {
    console = { ...console, log: originalLog };
    console.log('  ✅ PASS: No messages logged\n');
  } else {
    console = { ...console, log: originalLog };
    console.log('  ❌ FAIL: Messages were logged when they should not be');
    console.log(`  Expected: 0 logs, Got: ${logsGenerated.length}`);
    console.log(`  Logs: ${JSON.stringify(logsGenerated)}\n`);
    allTestsPassed = false;
  }
  
  // Restore console
  console.warn = originalWarn;
  console.error = originalError;
  console.log = originalLog;
  
  // Summary
  if (allTestsPassed) {
    console.log('Results: All verbosity tests passed.');
    console.log('🎉 Verbosity configuration is working correctly!');
  } else {
    console.log('Results: Some tests failed.');
    process.exit(1);
  }
}

// Run tests
runVerbosityTests();
