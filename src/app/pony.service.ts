import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Page, queryPaginated } from './pagination';

export interface Pony {
  id: number;
  is_available: boolean;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class PonyService {
  baseUrl = 'http://localhost:8000/v1/ponies';

  constructor(
    private http: HttpClient
  ) { }

  list(urlOrFilter?: string | object): Observable<Page<Pony>> {
    return queryPaginated<Pony>(this.http, this.baseUrl, urlOrFilter);
  }
}
