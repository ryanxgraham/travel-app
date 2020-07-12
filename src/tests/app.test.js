 const { dateChecker } = require('../client/js/app');

describe('Tests dateChecker() existence, type, and conditionals', () => {
  test('Existence', () => {
    expect(dateChecker).toBeDefined();
  });
  test('Type', () => {
    expect(typeof dateChecker).toBe('function');
  });
  test('Invalid date format', () => {
    expect(dateChecker('1 nov 2021')).toBe(false);
  });
  test('Invalid date data', () => {
    expect(dateChecker('2020-13-31')).toBe(false);
  });
  test('Valid Date', () => {
    expect(dateChecker('2020-11-01')).toBe(true);
  });
});
