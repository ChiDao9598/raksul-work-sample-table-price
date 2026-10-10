import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PaperSizeSelector } from "./components/paper-size-selector/paper-size-selector";
import { PriceTableStore } from './services/stores/price-table.store';
import { PAPER_SIZE_DEFAULT } from './models/price.model';
import { PriceTableComponent } from "./components/price-table/price-table";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PaperSizeSelector, PriceTableComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App implements OnInit {

  protected readonly store = inject(PriceTableStore)

  ngOnInit(): void {
    this.store.apply(PAPER_SIZE_DEFAULT)
  }
  
}
