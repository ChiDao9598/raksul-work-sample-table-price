import { formatPrice } from './format-price';

describe('formatPrice', () => {
  describe('adds a comma after every 3 digits, counted from the right', () => {
    it.each([
      [1, '1'],
      [9, '9'],
      [10, '10'],
      [99, '99'],
      [100, '100'],
      [999, '999'],
      [1000, '1,000'],
      [1568, '1,568'],
      [9999, '9,999'],
      [10000, '10,000'],
      [100000, '100,000'],
      [999999, '999,999'],
      [1000000, '1,000,000'],
      [1234567, '1,234,567'],
      [12345678, '12,345,678'],
      [123456789, '123,456,789'],
      [1000000000, '1,000,000,000'],
    ])('formatPrice(%i) -> "%s"', (value, expected) => {
      expect(formatPrice(value)).toBe(expected);
    });

    it('formats the largest safe integer', () => {
      expect(formatPrice(Number.MAX_SAFE_INTEGER)).toBe('9,007,199,254,740,991');
    });
  });

  describe('rejects values that are not natural numbers', () => {
    it.each([
      ['zero', 0],
      ['a negative number', -1],
      ['a negative large number', -1000],
      ['a decimal', 1.5],
      ['a decimal above 1000', 1234.56],
      ['NaN', Number.NaN],
      ['Infinity', Number.POSITIVE_INFINITY],
      ['-Infinity', Number.NEGATIVE_INFINITY],
      ['a value above MAX_SAFE_INTEGER', Number.MAX_SAFE_INTEGER + 1],
    ])('throws a RangeError for %s', (_label, value) => {
      expect(() => formatPrice(value)).toThrow(RangeError);
    });

    it('includes the received value in the error message', () => {
      expect(() => formatPrice(-5)).toThrow('received: -5');
    });
  });

  describe('does not use the forbidden APIs', () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('never calls Number.prototype.toLocaleString()', () => {
      const spy = vi.spyOn(Number.prototype, 'toLocaleString');
      formatPrice(1234567);
      expect(spy).not.toHaveBeenCalled();
    });

    it('never calls Intl.NumberFormat()', () => {
      const spy = vi.spyOn(Intl, 'NumberFormat');
      formatPrice(1234567);
      expect(spy).not.toHaveBeenCalled();
    });
  });
});
