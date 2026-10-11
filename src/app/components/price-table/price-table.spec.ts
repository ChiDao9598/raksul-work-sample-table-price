import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PriceTableComponent } from './price-table';
import { CellRef, PriceTable } from '../../models/price.model';
import { buildPriceTable } from '../../utils/build-price-table';
import { MOCK_QUANTITIES, mockPriceTable } from '../../testing/price-response.mock';

describe('PriceTableComponent', () => {
  let fixture: ComponentFixture<PriceTableComponent>;
  let el: HTMLElement;

  const render = (inputs: { table?: PriceTable; selected?: CellRef | null; expanded?: boolean } = {}) => {
    fixture.componentRef.setInput('table', inputs.table ?? mockPriceTable());
    if (inputs.selected !== undefined) fixture.componentRef.setInput('selected', inputs.selected);
    if (inputs.expanded !== undefined) fixture.componentRef.setInput('expanded', inputs.expanded);
    fixture.detectChanges();
  };

  const bodyRows = () => Array.from(el.querySelectorAll<HTMLTableRowElement>('tbody tr'));
  const rowHeaders = () => bodyRows().map((row) => row.querySelector('th')!.textContent!.trim());
  const columnHeaders = () =>
    Array.from(el.querySelectorAll('thead th[scope="col"]')).map((th) => th.textContent!.trim());
  /** Cell at (row index, column index) of the visible table body. */
  const cell = (row: number, col: number) => bodyRows()[row].querySelectorAll<HTMLTableCellElement>('td')[col];
  const seeMoreButton = () => el.querySelector<HTMLButtonElement>('button.see-more');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PriceTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PriceTableComponent);
    el = fixture.nativeElement;
  });

  describe('R1 – table of quantity × business days', () => {
    it('shows business days as column headers', () => {
      render();
      expect(columnHeaders()).toEqual(['1 day', '2 days', '3 days', '4 days', '5 days']);
    });

    it('shows quantities as row headers', () => {
      render({ expanded: true });
      expect(rowHeaders()).toEqual(MOCK_QUANTITIES.map(String));
    });

    it('shows the price of each cell formatted with commas', () => {
      render();
      // mockPrice(10, 1) = 1000 + 10 + 10 = 1020; mockPrice(400, 5) = 1450
      expect(cell(0, 0).textContent!.trim()).toBe('1,020 VND');
      expect(cell(4, 4).textContent!.trim()).toBe('1,450 VND');
    });

    it('renders "—" for a missing cell, with no button', () => {
      const table = buildPriceTable({
        paper_size: 'a4',
        prices: [
          [
            { business_day: 1, price: 1000, quantity: 10 },
            { business_day: 2, price: 1100, quantity: 10 },
          ],
          [{ business_day: 1, price: 2000, quantity: 100 }],
        ],
      });
      render({ table });

      expect(cell(1, 1).textContent!.trim()).toBe('—');
      expect(cell(1, 1).querySelector('button')).toBeNull();
    });
  });

  describe('R4 – See more', () => {
    it('shows 5 quantity rows initially', () => {
      render();
      expect(bodyRows().length).toBe(5);
      expect(rowHeaders()).toEqual(['10', '100', '200', '300', '400']);
    });

    it('shows all quantity rows when expanded', () => {
      render({ expanded: true });
      expect(bodyRows().length).toBe(10);
    });

    it('emits expandedChange(true) when "See more" is clicked', () => {
      render();
      const emitted: boolean[] = [];
      fixture.componentInstance.expandedChange.subscribe((v) => emitted.push(v));

      expect(seeMoreButton()!.textContent!.trim()).toBe('See more');
      seeMoreButton()!.click();

      expect(emitted).toEqual([true]);
    });

    it('shows "See less" when expanded, which emits expandedChange(false)', () => {
      render({ expanded: true });
      const emitted: boolean[] = [];
      fixture.componentInstance.expandedChange.subscribe((v) => emitted.push(v));

      expect(seeMoreButton()!.textContent!.trim()).toBe('See less');
      expect(seeMoreButton()!.getAttribute('aria-expanded')).toBe('true');
      seeMoreButton()!.click();

      expect(emitted).toEqual([false]);
    });

    it('hides the button when there are 5 rows or fewer', () => {
      const table = buildPriceTable({
        paper_size: 'a4',
        prices: [10, 100, 200].map((quantity) => [{ business_day: 1, price: 1000, quantity }]),
      });
      render({ table });

      expect(seeMoreButton()).toBeNull();
    });
  });

  describe('R3 – cell selection', () => {
    it('emits cellSelected with the quantity and business day of the clicked cell', () => {
      render();
      const emitted: CellRef[] = [];
      fixture.componentInstance.cellSelected.subscribe((v) => emitted.push(v));

      cell(2, 3).querySelector('button')!.click();

      expect(emitted).toEqual([{ quantity: 200, businessDay: 4 }]);
    });

    it('highlights only the selected cell', () => {
      render({ selected: { quantity: 100, businessDay: 2 } });

      const selectedCells = el.querySelectorAll('td.cell-selected');
      expect(selectedCells.length).toBe(1);
      expect(selectedCells[0]).toBe(cell(1, 1));
    });

    it('highlights nothing when there is no selection', () => {
      render({ selected: null });
      expect(el.querySelectorAll('td.cell-selected').length).toBe(0);
    });
  });

  describe('R5 – hover highlighting', () => {
    const hover = (row: number, col: number) => {
      cell(row, col).dispatchEvent(new MouseEvent('mouseenter'));
      fixture.detectChanges();
    };

    it('strongly highlights only the hovered cell', () => {
      render();
      hover(2, 3);

      const hovered = el.querySelectorAll('td.cell-hovered');
      expect(hovered.length).toBe(1);
      expect(hovered[0]).toBe(cell(2, 3));
    });

    it('weakly highlights every cell in the hovered row', () => {
      render();
      hover(2, 3);

      const rowCells = Array.from(bodyRows()[2].querySelectorAll('td'));
      expect(rowCells.every((td) => td.classList.contains('row--hovered'))).toBe(true);
      expect(el.querySelectorAll('td.row--hovered').length).toBe(5);
    });

    it('weakly highlights every cell in the hovered column', () => {
      render();
      hover(2, 3);

      const colCells = bodyRows().map((row) => row.querySelectorAll('td')[3]);
      expect(colCells.every((td) => td.classList.contains('col--hovered'))).toBe(true);
      expect(el.querySelectorAll('td.col--hovered').length).toBe(5);
    });

    it('highlights the matching quantity and business day headers', () => {
      render();
      hover(2, 3);

      const highlighted = Array.from(el.querySelectorAll('th.header--hovered')).map((th) =>
        th.textContent!.trim(),
      );
      expect(highlighted).toEqual(['4 days', '200']);
    });

    it('moves the highlight when another cell is hovered', () => {
      render();
      hover(0, 0);
      hover(4, 4);

      expect(el.querySelectorAll('td.cell-hovered').length).toBe(1);
      expect(cell(4, 4).classList.contains('cell-hovered')).toBe(true);
      expect(cell(0, 0).classList.contains('row--hovered')).toBe(false);
    });

    it('clears the highlight when the mouse leaves the table', () => {
      render();
      hover(2, 3);

      el.querySelector('table')!.dispatchEvent(new MouseEvent('mouseleave'));
      fixture.detectChanges();

      expect(el.querySelectorAll('.cell-hovered, .row--hovered, .col--hovered, .header--hovered').length).toBe(0);
    });

    it('applies the same highlight on keyboard focus, and clears it on blur', () => {
      render();
      const button = cell(1, 2).querySelector('button')!;

      button.dispatchEvent(new FocusEvent('focus'));
      fixture.detectChanges();
      expect(cell(1, 2).classList.contains('cell-hovered')).toBe(true);

      button.dispatchEvent(new FocusEvent('blur'));
      fixture.detectChanges();
      expect(el.querySelectorAll('td.cell-hovered').length).toBe(0);
    });

    it('keeps the selected class on a selected cell while it is hovered', () => {
      render({ selected: { quantity: 200, businessDay: 4 } });
      hover(2, 3);

      expect(cell(2, 3).classList.contains('cell-selected')).toBe(true);
      expect(cell(2, 3).classList.contains('cell-hovered')).toBe(true);
    });
  });
});
