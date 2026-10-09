export type PaperSize = 'A4' | 'A5' | 'B4' | 'B5'

export interface PriceItem {
    business_day: number;
    price: number;
    quantify: number;
}

export interface PriceResponse {
    paper_size: string;
    prices: PriceItem[][];
}

export interface PriceTable {
    quantities: number[]; //row headers
    businessDays: number[]; // column headers
    cells: Map<string, number>; //key: $quantity * $businessDay => price

}

export interface CellRef {
    quantity: number;
    businessDay: number;
}