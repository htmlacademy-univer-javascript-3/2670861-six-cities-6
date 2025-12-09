import { describe, it, expect } from 'vitest';
import { capitalizeFirst, getWidthByRatingPercent } from './formatters';

describe('capitalizeFirst', () => {
  it('should capitalize first letter of lowercase string', () => {
    expect(capitalizeFirst('hello')).toBe('Hello');
  });

  it('should not change already capitalized string', () => {
    expect(capitalizeFirst('Hello')).toBe('Hello');
  });

  it('should handle empty string', () => {
    expect(capitalizeFirst('')).toBe('');
  });

  it('should handle single character', () => {
    expect(capitalizeFirst('a')).toBe('A');
    expect(capitalizeFirst('z')).toBe('Z');
    expect(capitalizeFirst('A')).toBe('A');
  });

  it('should handle single character uppercase', () => {
    expect(capitalizeFirst('A')).toBe('A');
  });

  it('should preserve rest of string', () => {
    expect(capitalizeFirst('hello world')).toBe('Hello world');
    expect(capitalizeFirst('UPPERCASE')).toBe('UPPERCASE');
    expect(capitalizeFirst('MixEd caSe')).toBe('MixEd caSe');
  });

  it('should handle strings with numbers and special characters', () => {
    expect(capitalizeFirst('123abc')).toBe('123abc');
    expect(capitalizeFirst('!@#hello')).toBe('!@#hello');
    expect(capitalizeFirst(' test')).toBe(' test');
  });

  it('should handle non-English characters', () => {
    expect(capitalizeFirst('ñandú')).toBe('Ñandú');
    expect(capitalizeFirst('привет')).toBe('Привет');
  });

  it('should handle mixed case with special characters', () => {
    expect(capitalizeFirst('héllo')).toBe('Héllo');
  });
});

describe('getWidthByRatingPercent', () => {
  it('should convert rating to width percentage by rounding and multiplying by 20', () => {
    expect(getWidthByRatingPercent(4.7)).toBe(100); // 5 * 20
    expect(getWidthByRatingPercent(3.2)).toBe(60); // 3 * 20
    expect(getWidthByRatingPercent(0.1)).toBe(0); // 0 * 20
    expect(getWidthByRatingPercent(5.0)).toBe(100); // 5 * 20
    expect(getWidthByRatingPercent(2.5)).toBe(60); // 5 * 20
  });
});
