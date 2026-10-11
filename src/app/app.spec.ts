import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { mockPriceResponse } from './testing/price-response.mock';

const API_URL = 'https://us-central1-fe-ws-test.cloudfunctions.net/prices';

/** Integration test: the full user flow with a mocked backend. */
describe('App', () => {
  let fixture: ComponentFixture<App>;
  let el: HTMLElement;
  let httpMock: HttpTestingController;

  const expectRequest = (size: string) =>
    httpMock.expectOne((r) => r.url === API_URL && r.params.get('paper_size') === size);
  const bodyRows = () => el.querySelectorAll('tbody tr');
  const cellButton = (row: number, col: number) =>
    bodyRows()[row].querySelectorAll('td')[col].querySelector<HTMLButtonElement>('button')!;
  const orderPrice = () => el.querySelector('app-order-summary-component strong')!.textContent!.trim();
  const render = () => fixture.detectChanges();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    el = fixture.nativeElement;
    httpMock = TestBed.inject(HttpTestingController);
    render();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('renders the title', () => {
    expectRequest('A4').flush(mockPriceResponse());
    expect(el.querySelector('h1')!.textContent).toContain("RAKSUL'S Work Sample");
  });

  it('shows a loading message, then the A4 table', () => {
    expect(el.querySelector('[role="status"]')!.textContent).toContain('Loading prices');

    expectRequest('A4').flush(mockPriceResponse());
    render();

    expect(el.querySelector('[role="status"]')).toBeNull();
    expect(bodyRows().length).toBe(5);
  });

  it('selects a price, shows it as Order price, and resets after applying another size', () => {
    expectRequest('A4').flush(mockPriceResponse());
    render();

    // Select 200 pcs × 4 days.
    cellButton(2, 3).click();
    render();
    expect(el.querySelectorAll('td.cell-selected').length).toBe(1);
    expect(orderPrice()).toBe(`VND 1,240`); // mockPrice(200, 4) = 1000 + 200 + 40

    // See more.
    el.querySelector<HTMLButtonElement>('button.see-more')!.click();
    render();
    expect(bodyRows().length).toBe(10);

    // Apply B5.
    const select = el.querySelector<HTMLSelectElement>('select')!;
    select.value = 'B5';
    select.dispatchEvent(new Event('change'));
    el.querySelector<HTMLButtonElement>('app-paper-size-selector button[type="submit"]')!.click();
    expectRequest('B5').flush(mockPriceResponse('b5', 5000));
    render();

    expect(el.querySelectorAll('td.cell-selected').length).toBe(0);
    expect(orderPrice()).toBe('-');
    expect(bodyRows().length).toBe(5);
    expect(cellButton(0, 0).textContent!.trim()).toBe('5,020 VND');
  });

  it('shows an error message when the request fails', () => {
    expectRequest('A4').flush('error', { status: 500, statusText: 'Server Error' });
    render();

    expect(el.querySelector('[role="alert"]')!.textContent).toContain('Could not load prices for A4');
    expect(el.querySelector('table')).toBeNull();
  });
});
