import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { Observable, Subject, merge } from 'rxjs';
import { debounceTime, share, startWith, switchMap } from 'rxjs/operators';

import { Page } from '../pagination';
import { PaginatorComponent } from '../paginator/paginator.component';
import { Pony, PonyService } from '../pony.service';

@Component({
  imports: [
    CommonModule,
    PaginatorComponent,
    ReactiveFormsModule,
  ],
  selector: 'app-pony-list',
  styleUrl: './pony-list.component.css',
  templateUrl: './pony-list.component.html',
})
export class PonyListComponent {
  filterForm: FormGroup<{
    is_available: FormControl<boolean | null>,
    search: FormControl<string | null>,
  }>;
  page: Observable<Page<Pony>>;
  pageUrl = new Subject<string>();

  constructor(
    private ponyService: PonyService
  ) {
    this.filterForm = new FormGroup({
      is_available: new FormControl<boolean | null>(null),
      search: new FormControl<string | null>(null)
    });

    const filterValue = this.filterForm.valueChanges.pipe(
      debounceTime(200),
      startWith(this.filterForm.value),
    );
    this.page = merge(filterValue, this.pageUrl).pipe(
      switchMap(urlOrFilter => this.ponyService.list(urlOrFilter)),
      share()
    );
  }

  onPageChanged(url: string) {
    this.pageUrl.next(url);
  }
}
