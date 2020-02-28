
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeamTableSwappableService {
  onPlayersSwap = new Subject();

  constructor(
  ) { }

  swapPlayers(team, originalPlayer, newPlayer) {
    this.onPlayersSwap.next({
      originalPlayer,
      newPlayer,
      team
    });
  }
}
