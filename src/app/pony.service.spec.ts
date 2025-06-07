import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { PonyService } from './pony.service';

describe('PonyService', () => {
  let service: PonyService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [PonyService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
    });

    service = TestBed.inject(PonyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve first page of results - no filter', () => {
    service.list().subscribe(page => {
      expect(page.count).toBe(3);
      expect(page.results).toEqual([
        {
          id: 1,
          is_available: true,
          name: 'Rainbow Runner',
        },
        {
          id: 2,
          is_available: false,
          name: 'Super Sparkles'
        }
      ]);
    });

    httpMock.expectOne({
      method: 'GET',
      url: 'http://localhost:8000/v1/ponies'
    }).flush({
      count: 3,
      next: 'http://localhost:8000/v1/ponies?offset=2&limit=2',
      previous: null,
      results: [
        {
          id: 1,
          is_available: true,
          name: 'Rainbow Runner',
        },
        {
          id: 2,
          is_available: false,
          name: 'Super Sparkles'
        }
      ]
    });
  });

  it('should retrieve next page of results', () => {
    service.list(
      'http://localhost:8000/v1/ponies?limit=2&offset=2'
    ).subscribe(page => {
      expect(page.count).toBe(3);
      expect(page.results).toEqual([
        {
          id: 3,
          is_available: true,
          name: 'Turbo Tammy'
        }
      ]);
    });

    httpMock.expectOne({
      method: 'GET',
      url: 'http://localhost:8000/v1/ponies?limit=2&offset=2'
    }).flush({
      count: 3,
      next: null,
      previous: 'http://localhost:8000/v1/ponies?limit=2&offset=0',
      results: [
        {
          id: 3,
          is_available: true,
          name: 'Turbo Tammy'
        }
      ]
    });
  });

  it('should retrieve first page of results - with filter', () => {
    service.list({
      available: true,
      search: 'sparkles'
    }).subscribe(page => {
      expect(page.count).toBe(1);
      expect(page.results).toEqual([
        {
          id: 2,
          is_available: true,
          name: 'Super Sparkles'
        }
      ]);
    });

    httpMock.expectOne({
      method: 'GET',
      url: 'http://localhost:8000/v1/ponies?available=true&search=sparkles'
    }).flush({
      count: 1,
      next: null,
      previous: null,
      results: [
        {
          id: 2,
          is_available: true,
          name: 'Super Sparkles'
        }
      ]
    });
  });
});
