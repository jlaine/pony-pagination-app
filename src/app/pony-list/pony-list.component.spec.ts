import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { PonyListComponent } from './pony-list.component';

describe('PonyListComponent', () => {
  let component: PonyListComponent;
  let fixture: ComponentFixture<PonyListComponent>;
  let httpMock: HttpTestingController;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        PonyListComponent,
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    httpMock = TestBed.inject(HttpTestingController);

    fixture = TestBed.createComponent(PonyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    httpMock.expectOne({
      method: 'GET',
      url: 'http://localhost:8000/v1/ponies',
    }).flush({
      count: 3,
      next: 'http://localhost:8000/v1/ponies?offset=2',
      previous: null,
      results: [
        {
          id: 1,
          name: 'Rainbow Runner'
        },
        {
          id: 2,
          name: 'Super Sparkles'
        }
      ]
    });
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();

    // Check ponies.
    const elems: NodeList = fixture.debugElement.nativeElement.querySelectorAll('div.pony');
    const texts = Array.from(elems).map((el) => el.textContent?.trim());
    expect(texts).toEqual(['Rainbow Runner', 'Super Sparkles']);
  });

  it('should navigate to next page', () => {
    component.onPageChanged('http://localhost:8000/v1/ponies?offset=2');

    httpMock.expectOne({
      method: 'GET',
      url: 'http://localhost:8000/v1/ponies?offset=2',
    }).flush({
      count: 3,
      next: null,
      previous: 'http://localhost:8000/v1/ponies',
      results: [
        {
          "is_available": false,
          "name": "Turbo Tammy"
        }
      ]
    });
    fixture.detectChanges();

    // Check ponies.
    const elems: NodeList = fixture.debugElement.nativeElement.querySelectorAll('div.pony');
    const texts = Array.from(elems).map((el) => el.textContent?.trim());
    expect(texts).toEqual(['Turbo Tammy']);
  });
});
