import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Page } from '../pagination';

@Component({
  selector: 'app-paginator',
  styleUrl: './paginator.component.css',
  templateUrl: './paginator.component.html',
})
export class PaginatorComponent {
  @Input() page: Page<any> | null = null;
  @Output() pageChange = new EventEmitter<string>();
}
