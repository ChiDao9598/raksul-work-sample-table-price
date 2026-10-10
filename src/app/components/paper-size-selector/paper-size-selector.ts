import { PAPER_SIZES, PaperSize } from './../../models/price.model';
import { ChangeDetectionStrategy, Component, computed, input, linkedSignal, output } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-paper-size-selector',
  styleUrl: './paper-size-selector.css',
  templateUrl: './paper-size-selector.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaperSizeSelector {
  readonly value = input.required<PaperSize>();
  readonly apply = output<PaperSize>();

  protected readonly sizes = PAPER_SIZES;

  // Local selection, reset whenever the values are appplied changes from outside
  protected readonly draft = linkedSignal(() => this.value());
  protected readonly hasPendingChange = computed(() => this.draft() !== this.value());


  protected onChange(event: Event): void {
    this.draft.set((event.target as HTMLSelectElement).value as PaperSize)
  }

  protected onSubmit(event: Event): void {
    event.preventDefault();
    this.apply.emit(this.draft());
  }
}
