import { EMPTY_VALUE, FormatPricePipe } from './format-price-pipe';

describe('FormatPricePipe', () => {
  const pipe = new FormatPricePipe();

  it('formats a price with a comma every 3 digits', () => {
    expect(pipe.transform(1568)).toBe('1,568');
    expect(pipe.transform(1234567)).toBe('1,234,567');
    expect(pipe.transform(999)).toBe('999');
  });

  it('returns the empty value for null and undefined', () => {
    expect(pipe.transform(null)).toBe(EMPTY_VALUE);
    expect(pipe.transform(undefined)).toBe(EMPTY_VALUE);
  });

  it('returns the empty value instead of throwing for invalid prices', () => {
    expect(pipe.transform(0)).toBe(EMPTY_VALUE);
    expect(pipe.transform(-1)).toBe(EMPTY_VALUE);
    expect(pipe.transform(1.5)).toBe(EMPTY_VALUE);
    expect(pipe.transform(Number.NaN)).toBe(EMPTY_VALUE);
  });
});
