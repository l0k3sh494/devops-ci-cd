// Simple test file for CI/CD pipeline
console.log('🧪 Running tests...\n');

let testsPassed = 0;
let testsFailed = 0;

function test(description, fn) {
  try {
    fn();
    console.log(`✓ ${description}`);
    testsPassed++;
  } catch (error) {
    console.log(`✗ ${description}`);
    console.error(`  Error: ${error.message}`);
    testsFailed++;
  }
}

function assertEquals(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(message || `Expected ${expected} but got ${actual}`);
  }
}

// Test 1: Check if app module exists
test('app.js module should be loadable', () => {
  const app = require('./app.js');
  if (typeof app !== 'object' && typeof app !== 'function') {
    throw new Error('App should export an object or function');
  }
});

// Test 2: Check if Express is installed
test('Express should be available', () => {
  const express = require('express');
  assertEquals(typeof express, 'function', 'Express should be a function');
});

// Test 3: Basic arithmetic test
test('Basic addition should work', () => {
  const result = 2 + 2;
  assertEquals(result, 4, 'Addition should work correctly');
});

// Test 4: Environment variables
test('Environment should be defined', () => {
  assertEquals(typeof process.env, 'object', 'Process.env should exist');
});

// Test 5: Node version check
test('Node version should be adequate', () => {
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.split('.')[0].substring(1));
  if (majorVersion < 14) {
    throw new Error('Node version should be 14 or higher');
  }
});

// Summary
console.log('\n' + '='.repeat(50));
console.log(`Tests Passed: ${testsPassed}`);
console.log(`Tests Failed: ${testsFailed}`);
console.log('='.repeat(50));

// Exit with appropriate code
if (testsFailed > 0) {
  console.log('\n❌ Some tests failed!');
  process.exit(1);
} else {
  console.log('\n✅ All tests passed!');
  process.exit(0);
}