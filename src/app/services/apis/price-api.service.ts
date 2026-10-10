import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PaperSize, PriceResponse } from '../../models/price.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PriceApiService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = 'https://us-central1-fe-ws-test.cloudfunctions.net/prices';

    getPrices(size: PaperSize): Observable<PriceResponse> {
        return this.http.get<PriceResponse>(this.apiUrl, {params: {paper_size: size}});
    }
}
