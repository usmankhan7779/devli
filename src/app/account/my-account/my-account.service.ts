import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class MyAccountService {
  planWasChanged = new Subject<any>();
  cardWasChanged = new Subject<any>();

  constructor() {}

  updatePlan() {
    this.planWasChanged.next();
  }

  updateCard() {
    this.cardWasChanged.next();
  }
}
