import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { CellRef, INIT_VISIBLE_ROWS, PriceTable } from '../../models/price.model';
import { getCellPrice } from '../../utils/build-price-table';

@Component({
  imports: [],
  selector: 'app-price-table',
  styleUrl: './price-table.css',
  templateUrl: './price-table.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PriceTableComponent {

  ngOnInit(): void {
    // Log table to debug
    console.log(this.table())
  }
  readonly table = input.required<PriceTable>();
  readonly selected = input<CellRef | null>(null);
  readonly expanded = input(false);

  readonly cellSelected = output<CellRef>();
  readonly expandedChange = output<boolean>();

  // Cell under the mouse (or keyboard focus).
  protected readonly hovered = signal<CellRef | null>(null);

  protected readonly visibleQuantities = computed(() => {
    const quantites = this.table().quantities
    return this.expanded() ? quantites : quantites.slice(0, INIT_VISIBLE_ROWS)
  })

  protected readonly canExpand = computed(() => {
    return this.table().quantities.length > INIT_VISIBLE_ROWS;
  });

  protected priceOf(quantity: number, businessDay: number): number | null {
    return getCellPrice(this.table(),quantity, businessDay)
  }

  protected isSelected(quantity: number, businessDay: number): boolean {
    const selected = this.selected();
    return selected !== null && selected.quantity === quantity && selected.businessDay === businessDay;
  }

  protected isHovered(quantity: number, businessDay: number): boolean {
    const hovered = this.hovered();
    return hovered !== null && hovered.quantity === quantity && hovered.businessDay === businessDay;
  }

  protected setHover(quantity: number, businessDay: number): void {
    this.hovered.set({ quantity, businessDay });
  }

  protected clearHover(): void {
    this.hovered.set(null);
  }

  protected select(quantity: number, businessDay: number): void {
    this.cellSelected.emit({ quantity, businessDay });
    console.log('Cell selected:', { quantity, businessDay });
    console.log(this.table())
  }

  protected toggleExpand(): void {
    this.expandedChange.emit(!this.expanded());
  }

  protected dayLabel(businessDay: number): string {
    return businessDay === 1 ? '1 day' : `${businessDay} days`
  }
  
}
