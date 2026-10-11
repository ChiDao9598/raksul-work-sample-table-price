import { PriceResponse } from '../models/price.model';
import { buildPriceTable } from '../utils/build-price-table';

export const MOCK_QUANTITIES = [10, 100, 200, 300, 400, 500, 600, 700, 800, 900];
export const MOCK_BUSINESS_DAYS = [1, 2, 3, 4, 5];

/**
 * Creates a response with the same shape as the real API:
 * 10 rows sorted by quantity, each with 5 business days.
 * Price = base + quantity + businessDay * 10, so every cell is unique and predictable.
 */
export function mockPriceResponse(paperSize = 'a4', base = 1000): PriceResponse {
  return {
    paper_size: paperSize,
    prices: MOCK_QUANTITIES.map((quantity) =>
      MOCK_BUSINESS_DAYS.map((business_day) => ({
        business_day,
        quantity,
        price: mockPrice(quantity, business_day, base),
      })),
    ),
  };
}

export function mockPrice(quantity: number, businessDay: number, base = 1000): number {
  return base + quantity + businessDay * 10;
}

export function mockPriceTable(paperSize = 'a4', base = 1000) {
  return buildPriceTable(mockPriceResponse(paperSize, base));
}
