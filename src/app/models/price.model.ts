export const PAPER_SIZES = ['A4', 'A5', 'B4', 'B5'] as const

export type PaperSize = (typeof PAPER_SIZES)[number]

export const PAPER_SIZE_DEFAULT: PaperSize = 'A4'

export const INIT_VISIBLE_ROWS: Number = 5;

export interface PriceItem {
    business_day: number;
    price: number;
    quantity: number;
}

export interface PriceResponse {
    paper_size: string;
    prices: PriceItem[][];
}

export interface PriceTable {
    quantities: number[]; //row headers
    businessDays: number[]; // column headers
    cells: Map<string, number>; //key: $quantity - $businessDay => price

}

export interface CellRef {
    quantity: number;
    businessDay: number;
}