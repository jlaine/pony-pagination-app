import { Component } from '@angular/core';

import { PonyListComponent } from './pony-list/pony-list.component';

@Component({
  imports: [PonyListComponent],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected title = 'pony-pagination-app';
}
