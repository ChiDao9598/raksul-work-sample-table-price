import type { PriceItem, PriceResponse, PriceTable } from '../models/price.model';

/**
 * Builds the lookup key for a single cell of the price table.
 *
 * The "-" is only a separator between the two numbers (e.g. quantity 100,
 * 2 business days -> "100-2"). Always use this helper to build keys so that
 * writing to and reading from `PriceTable.cells` can never drift apart.
 */
export function cellKey(quantity: number, businessDay: number): string {
  return `${quantity}-${businessDay}`;
}

/**
 * Returns the price for a given cell, or `null` if the API did not provide one.
 */
export function getCellPrice(
  table: PriceTable,
  quantity: number,
  businessDay: number,
): number | null {
  return table.cells.get(cellKey(quantity, businessDay)) ?? null;
}

/**
 * Transforms the raw API response into a structure that is easy to render
 * as a "Quantity (rows) x Delivery in business days (columns)" table.
 *
 * - `quantities`:   unique quantities, ascending  -> row headers
 * - `businessDays`: unique business days, ascending -> column headers
 * - `cells`:        Map of `cellKey(quantity, businessDay)` -> price
 *
 * The axes are derived from the data instead of being hard-coded, so the
 * table still renders correctly if the API adds/removes a delivery option
 * or if some row does not contain every business day.
 *
 * Invalid items (missing or non-numeric fields) are skipped rather than
 * breaking the whole table.
 */
export function buildPriceTable(response: PriceResponse): PriceTable {
  const quantitySet = new Set<number>();
  const businessDaySet = new Set<number>();
  const cells = new Map<string, number>();

  const rows = Array.isArray(response?.prices) ? response.prices : [];

  for (const row of rows) {
    if (!Array.isArray(row)) continue;

    for (const item of row) {
      if (!isValidPriceItem(item)) continue;

      quantitySet.add(item.quantity);
      businessDaySet.add(item.business_day);
      cells.set(cellKey(item.quantity, item.business_day), item.price);
    }
  }

  return {
    quantities: sortAscending(quantitySet),
    businessDays: sortAscending(businessDaySet),
    cells,
  };
}

function isValidPriceItem(item: unknown): item is PriceItem {
  if (item === null || typeof item !== 'object') return false;
  const { quantity, business_day, price } = item as Record<string, unknown>;
  return isFiniteNumber(quantity) && isFiniteNumber(business_day) && isFiniteNumber(price);
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function sortAscending(values: Iterable<number>): number[] {
  return [...values].sort((a, b) => a - b);
}