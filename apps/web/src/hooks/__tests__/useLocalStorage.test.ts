/**
 * Unit Tests for useLocalStorage Hook
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '../useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('returns initial value when no stored value exists', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    expect(result.current[0]).toBe('initial');
  });

  it('returns stored value when it exists in localStorage', () => {
    localStorage.setItem('test-key', JSON.stringify('stored-value'));
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    expect(result.current[0]).toBe('stored-value');
  });

  it('updates localStorage when value changes', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    act(() => {
      result.current[1]('new-value');
    });

    expect(result.current[0]).toBe('new-value');
    expect(JSON.parse(localStorage.getItem('test-key')!)).toBe('new-value');
  });

  it('supports function updater pattern', () => {
    const { result } = renderHook(() => useLocalStorage('counter', 0));

    act(() => {
      result.current[1]((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(1);
  });

  it('clears value correctly', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    act(() => {
      result.current[1]('changed');
    });

    expect(result.current[0]).toBe('changed');
    expect(JSON.parse(localStorage.getItem('test-key')!)).toBe('changed');

    act(() => {
      result.current[2](); // clearValue
    });

    // Value should be reset to initial
    expect(result.current[0]).toBe('initial');
    // Note: useEffect will re-persist the initial value to localStorage
    expect(JSON.parse(localStorage.getItem('test-key')!)).toBe('initial');
  });

  it('handles object values', () => {
    const initialObj = { foo: 'bar', count: 0 };
    const { result } = renderHook(() => useLocalStorage('obj-key', initialObj));

    expect(result.current[0]).toEqual(initialObj);

    act(() => {
      result.current[1]({ foo: 'baz', count: 1 });
    });

    expect(result.current[0]).toEqual({ foo: 'baz', count: 1 });
    expect(JSON.parse(localStorage.getItem('obj-key')!)).toEqual({ foo: 'baz', count: 1 });
  });

  it('handles JSON parse errors gracefully', () => {
    // Set invalid JSON in localStorage
    localStorage.setItem('bad-key', 'not valid json');
    const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const { result } = renderHook(() => useLocalStorage('bad-key', 'fallback'));

    expect(result.current[0]).toBe('fallback');
    expect(consoleWarn).toHaveBeenCalled();

    consoleWarn.mockRestore();
  });

  it('uses different keys independently', () => {
    const { result: result1 } = renderHook(() => useLocalStorage('key1', 'value1'));
    const { result: result2 } = renderHook(() => useLocalStorage('key2', 'value2'));

    expect(result1.current[0]).toBe('value1');
    expect(result2.current[0]).toBe('value2');

    act(() => {
      result1.current[1]('changed1');
    });

    expect(result1.current[0]).toBe('changed1');
    expect(result2.current[0]).toBe('value2');
  });
});
