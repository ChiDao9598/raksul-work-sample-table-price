import { Pipe, PipeTransform } from '@angular/core';
import { formatPrice } from '../utils/format-price';

export const EMPTY_VALUE = '-'

@Pipe({
  name: 'formatPrice',
})
export class FormatPricePipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if(value == null) {
      return EMPTY_VALUE;
    } try {
      return formatPrice(value);
    } catch {
      return EMPTY_VALUE;
    }
  }
}
