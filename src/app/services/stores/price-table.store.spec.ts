import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PriceTableStore } from './price-table.store';
import { MOCK_QUANTITIES, mockPrice, mockPriceResponse } from '../../testing/price-response.mock';

const API_URL = 'https://us-central1-fe-ws-test.cloudfunctions.net/prices';

describe('PriceTableStore', () => {
  let store: PriceTableStore;
  let httpMock: HttpTestingController;

  const expectRequest = (size: string) =>
    httpMock.expectOne((r) => r.url === API_URL && r.params.get('paper_size') === size);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    store = TestBed.inject(PriceTableStore);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('starts with A4, no table, nothing selected and collapsed', () => {
    expect(store.paperSize()).toBe('A4');
    expect(store.table()).toBeNull();
    expect(store.loading()).toBe(false);
    expect(store.error()).toBeNull();
    expect(store.selected()).toBeNull();
    expect(store.selectedPrice()).toBeNull();
    expect(store.expanded()).toBe(false);
  });

  describe('apply()', () => {
    it('sets the paper size and loading while the request is in flight', () => {
      store.apply('B4');

      expect(store.paperSize()).toBe('B4');
      expect(store.loading()).toBe(true);

      expectRequest('B4').flush(mockPriceResponse('b4'));
      expect(store.loading()).toBe(false);
    });

    it('stores the table built from the response', () => {
      store.apply('A4');
      expectRequest('A4').flush(mockPriceResponse());

      const table = store.table();
      expect(table?.quantities).toEqual(MOCK_QUANTITIES);
      expect(table?.businessDays).toEqual([1, 2, 3, 4, 5]);
    });

    it('clears the selection and collapses the table when a new size is loaded', () => {
      store.apply('A4');
      expectRequest('A4').flush(mockPriceResponse());
      store.select({ quantity: 100, businessDay: 2 });
      store.setExpanded(true);

      store.apply('A5');
      expectRequest('A5').flush(mockPriceResponse('a5', 2000));

      expect(store.selected()).toBeNull();
      expect(store.selectedPrice()).toBeNull();
      expect(store.expanded()).toBe(false);
    });

    it('cancels the previous request when another size is applied (switchMap)', () => {
      store.apply('A4');
      const first = expectRequest('A4');

      store.apply('B5');
      const second = expectRequest('B5');

      expect(first.cancelled).toBe(true);
      second.flush(mockPriceResponse('b5', 5000));

      expect(store.paperSize()).toBe('B5');
      expect(store.selectedPrice()).toBeNull();
      store.select({ quantity: 10, businessDay: 1 });
      expect(store.selectedPrice()).toBe(mockPrice(10, 1, 5000));
    });

    it('serves an already loaded size from the cache without a new request', () => {
      store.apply('A4');
      expectRequest('A4').flush(mockPriceResponse());
      const a4Table = store.table();

      store.apply('A5');
      expectRequest('A5').flush(mockPriceResponse('a5', 2000));

      store.apply('A4');
      httpMock.expectNone((r) => r.url === API_URL);

      expect(store.table()).toBe(a4Table);
      expect(store.loading()).toBe(false);
    });
  });

  describe('error handling', () => {
    it('sets an error message and clears the table when the request fails', () => {
      store.apply('B5');
      expectRequest('B5').flush('Server error', { status: 500, statusText: 'Internal Server Error' });

      expect(store.error()).toBe('Could not load prices for B5. Please try again.');
      expect(store.table()).toBeNull();
      expect(store.loading()).toBe(false);
    });

    it('does not cache a failed request, and clears the error on the next try', () => {
      store.apply('B5');
      expectRequest('B5').error(new ProgressEvent('network error'));
      expect(store.error()).not.toBeNull();

      store.apply('B5');
      expect(store.error()).toBeNull();
      expectRequest('B5').flush(mockPriceResponse('b5'));

      expect(store.table()).not.toBeNull();
    });
  });

  describe('selection', () => {
    beforeEach(() => {
      store.apply('A4');
      expectRequest('A4').flush(mockPriceResponse());
    });

    it('selectedPrice is the price of the selected cell', () => {
      store.select({ quantity: 300, businessDay: 4 });

      expect(store.selected()).toEqual({ quantity: 300, businessDay: 4 });
      expect(store.selectedPrice()).toBe(mockPrice(300, 4));
    });

    it('selecting another cell replaces the previous selection', () => {
      store.select({ quantity: 10, businessDay: 1 });
      store.select({ quantity: 900, businessDay: 5 });

      expect(store.selectedPrice()).toBe(mockPrice(900, 5));
    });

    it('selectedPrice is null for a cell that does not exist', () => {
      store.select({ quantity: 12345, businessDay: 1 });

      expect(store.selectedPrice()).toBeNull();
    });

    it('select(null) clears the selection', () => {
      store.select({ quantity: 10, businessDay: 1 });
      store.select(null);

      expect(store.selectedPrice()).toBeNull();
    });
  });

  it('setExpanded() toggles the expanded state', () => {
    store.setExpanded(true);
    expect(store.expanded()).toBe(true);

    store.setExpanded(false);
    expect(store.expanded()).toBe(false);
  });
});
