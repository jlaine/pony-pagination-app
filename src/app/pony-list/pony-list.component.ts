import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { Observable, Subject, merge } from 'rxjs';
import { debounceTime, map, share, startWith, switchMap } from 'rxjs/operators';

import { Page } from '../pagination';
import { Pony, PonyService } from '../pony.service';

@Component({
  selector: 'app-pony-list',
  templateUrl: './pony-list.component.html',
  styleUrls: ['./pony-list.component.css']
})
export class PonyListComponent {
  filterForm: FormGroup;
  page: Observable<Page<Pony>>;
  pageUrl = new Subject<string>();

  constructor(
    private ponyService: PonyService
  ) {
    this.filterForm = new FormGroup({
      is_available: new FormControl(),
      search: new FormControl()
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
