import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PriceApiService } from './price-api.service';
import { mockPriceResponse } from '../../testing/price-response.mock';

const API_URL = 'https://us-central1-fe-ws-test.cloudfunctions.net/prices';

describe('PriceApiService', () => {
  let service: PriceApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(PriceApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('sends GET /prices with the paper_size parameter', () => {
    service.getPrices('B5').subscribe();

    const req = httpMock.expectOne((r) => r.url === API_URL);
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('paper_size')).toBe('B5');
    req.flush(mockPriceResponse('b5'));
  });

  it('uses HTTPS', () => {
    service.getPrices('A4').subscribe();

    const req = httpMock.expectOne((r) => r.url === API_URL);
    expect(req.request.urlWithParams).toBe(`${API_URL}?paper_size=A4`);
    req.flush(mockPriceResponse());
  });

  it('returns the response body', () => {
    const body = mockPriceResponse('a5');
    let result: unknown;

    service.getPrices('A5').subscribe((response) => (result = response));
    httpMock.expectOne((r) => r.url === API_URL).flush(body);

    expect(result).toEqual(body);
  });
});
