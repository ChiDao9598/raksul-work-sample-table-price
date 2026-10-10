import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { CellRef, PaperSize } from '../../models/price.model';

@Component({
  imports: [],
  selector: 'app-order-summary-component',
  styleUrl: './order-summary-component.css',
  templateUrl: './order-summary-component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderSummaryComponent {
  readonly price = input<number | null>(null);
  readonly paperSize = input.required<PaperSize>();
  readonly selected = input<CellRef | null>(null);
  protected readonly hasSelection = computed(() => this.price() !== null)
}
