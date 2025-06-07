import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { of } from 'rxjs';

import { PaginatorComponent } from '../paginator/paginator.component';
import { PonyListComponent } from './pony-list.component';
import { PonyService } from '../pony.service';

class PonyServiceMock {
  list() {
    return of({
      count: 2,
      next: null,
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
  }
}

describe('PonyListComponent', () => {
  let component: PonyListComponent;
  let fixture: ComponentFixture<PonyListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        PonyListComponent,
      ],
      providers: [
        { provide: PonyService, useClass: PonyServiceMock }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PonyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
