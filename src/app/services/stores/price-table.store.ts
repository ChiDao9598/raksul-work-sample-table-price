import { Injectable, computed, inject, signal } from "@angular/core";
import { PriceApiService } from "../apis/price-api.service";
import { catchError, map, Observable, of, Subject, switchMap, tap } from "rxjs";
import { CellRef, PaperSize, PriceTable } from "../../models/price.model";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { buildPriceTable, getCellPrice } from "../../utils/build-price-table";

@Injectable({ providedIn: 'root' })
export class PriceTableStore {
    private readonly api = inject(PriceApiService);
    private readonly $apply = new Subject<PaperSize>();
    private readonly cache = new Map<PaperSize, PriceTable>();

    readonly paperSize = signal<PaperSize>('A4');
    readonly table = signal<PriceTable | null>(null);
    readonly loading = signal<boolean>(false);
    readonly error = signal<string | null>(null);
    readonly selected = signal<CellRef | null>(null);
    readonly expanded = signal<boolean>(false);

    // Price of the selected cell, or null when nothing is selected.
    readonly selectedPrice = computed(() => {
        const t = this.table();
        const s = this.selected();
        return t && s ? getCellPrice(t, s.quantity, s.businessDay) : null;
    })

    constructor() {
        this.$apply.pipe(
            tap(() => {
                this.loading.set(true);
                this.error.set(null);
            }),
            switchMap(size => this.fetchTable(size)),
            takeUntilDestroyed(),
        ).subscribe( table => {
            this.table.set(table);
            this.selected.set(null);
            this.expanded.set(false);
            this.loading.set(false);
        });
    }
    
    apply(paperSize: PaperSize) {
        this.paperSize.set(paperSize);
        this.$apply.next(paperSize);
    }

    select(cellRef: CellRef | null) {
        this.selected.set(cellRef);
    }

    setExpanded(expanded: boolean): void {
        this.expanded.set(expanded);
    }

    fetchTable(size: PaperSize): Observable<PriceTable | null> {
        const cached = this.cache.get(size);
        if (cached) {
            return of(cached);
        }

        return this.api.getPrices(size).pipe(
            map(buildPriceTable),
            tap((table) => this.cache.set(size, table)),
            catchError(() => {
                this.error.set(`Could not load prices for ${size}. Please try again.`);
                return of(null);
            }),
        );
    }
}