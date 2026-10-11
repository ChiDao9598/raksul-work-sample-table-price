import { PriceResponse } from '../models/price.model';
import { MOCK_BUSINESS_DAYS, MOCK_QUANTITIES, mockPrice, mockPriceResponse } from '../testing/price-response.mock';
import { buildPriceTable, cellKey, getCellPrice } from './build-price-table';

describe('cellKey', () => {
  it('joins quantity and business day with "-"', () => {
    expect(cellKey(100, 2)).toBe('100-2');
  });

  it('gives different keys for different cells', () => {
    expect(cellKey(10, 12)).not.toBe(cellKey(101, 2));
  });
});

describe('buildPriceTable', () => {
  it('uses quantities as rows and business days as columns', () => {
    const table = buildPriceTable(mockPriceResponse());

    expect(table.quantities).toEqual(MOCK_QUANTITIES);
    expect(table.businessDays).toEqual(MOCK_BUSINESS_DAYS);
  });

  it('stores one price per (quantity, business day) pair', () => {
    const table = buildPriceTable(mockPriceResponse());

    expect(table.cells.size).toBe(MOCK_QUANTITIES.length * MOCK_BUSINESS_DAYS.length);
    expect(getCellPrice(table, 10, 1)).toBe(mockPrice(10, 1));
    expect(getCellPrice(table, 500, 3)).toBe(mockPrice(500, 3));
    expect(getCellPrice(table, 900, 5)).toBe(mockPrice(900, 5));
  });

  it('works with the sample response from the API spec', () => {
    const response: PriceResponse = {
      paper_size: 'a5',
      prices: [
        [
          { business_day: 1, price: 1000, quantity: 10 },
          { business_day: 2, price: 900, quantity: 10 },
        ],
        [
          { business_day: 1, price: 1500, quantity: 100 },
          { business_day: 2, price: 1400, quantity: 100 },
        ],
      ],
    };

    const table = buildPriceTable(response);

    expect(table.quantities).toEqual([10, 100]);
    expect(table.businessDays).toEqual([1, 2]);
    expect(getCellPrice(table, 10, 2)).toBe(900);
    expect(getCellPrice(table, 100, 1)).toBe(1500);
  });

  it('sorts the axes even when the response is not sorted', () => {
    const response: PriceResponse = {
      paper_size: 'a4',
      prices: [
        [
          { business_day: 3, price: 30, quantity: 200 },
          { business_day: 1, price: 10, quantity: 200 },
        ],
        [{ business_day: 2, price: 20, quantity: 10 }],
      ],
    };

    const table = buildPriceTable(response);

    expect(table.quantities).toEqual([10, 200]);
    expect(table.businessDays).toEqual([1, 2, 3]);
  });

  it('leaves a cell empty when a row is missing a business day', () => {
    const response: PriceResponse = {
      paper_size: 'a4',
      prices: [
        [
          { business_day: 1, price: 100, quantity: 10 },
          { business_day: 2, price: 200, quantity: 10 },
        ],
        [{ business_day: 1, price: 300, quantity: 100 }],
      ],
    };

    const table = buildPriceTable(response);

    expect(table.businessDays).toEqual([1, 2]);
    expect(getCellPrice(table, 100, 2)).toBeNull();
  });

  it('skips invalid items instead of failing', () => {
    const response = {
      paper_size: 'a4',
      prices: [
        [
          { business_day: 1, price: 100, quantity: 10 },
          { business_day: 2, price: 'abc', quantity: 10 },
          { business_day: 3, quantity: 10 },
          { business_day: Number.NaN, price: 100, quantity: 10 },
          null,
          'not an item',
        ],
        'not a row',
      ],
    } as unknown as PriceResponse;

    const table = buildPriceTable(response);

    expect(table.quantities).toEqual([10]);
    expect(table.businessDays).toEqual([1]);
    expect(table.cells.size).toBe(1);
  });

  it('returns an empty table when there are no prices', () => {
    const empty = { quantities: [], businessDays: [], cells: new Map() };

    expect(buildPriceTable({ paper_size: 'a4', prices: [] })).toEqual(empty);
    expect(buildPriceTable({ paper_size: 'a4' } as unknown as PriceResponse)).toEqual(empty);
    expect(buildPriceTable(null as unknown as PriceResponse)).toEqual(empty);
  });
});

describe('getCellPrice', () => {
  it('returns null for a cell that does not exist', () => {
    const table = buildPriceTable(mockPriceResponse());

    expect(getCellPrice(table, 10, 99)).toBeNull();
    expect(getCellPrice(table, 12345, 1)).toBeNull();
  });
});
