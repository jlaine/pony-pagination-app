import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { Observable, Subject } from 'rxjs';
import { debounceTime, merge, share, startWith, switchMap } from 'rxjs/operators';

import { Page } from '../pagination';
import { Pony, PonyService } from '../pony.service';

@Component({
  selector: 'app-pony-list',
  templateUrl: './pony-list.component.html',
  styleUrls: ['./pony-list.component.css']
})
export class PonyListComponent {
  filterForm: FormGroup;
  page: Observable<Page<Pony>>
  pageUrl = new Subject<string>();

  constructor(
    private ponyService: PonyService
  ) {
    this.filterForm = new FormGroup({
      is_available: new FormControl(),
      search: new FormControl()
    });
    this.page = this.filterForm.valueChanges.pipe(
      debounceTime(200),
      startWith(this.filterForm.value),
      merge(this.pageUrl),
      switchMap(urlOrFilter => this.ponyService.list(urlOrFilter)),
      share()
    );
  }

  onPageChanged(url: string) {
    this.pageUrl.next(url);
  }
}
