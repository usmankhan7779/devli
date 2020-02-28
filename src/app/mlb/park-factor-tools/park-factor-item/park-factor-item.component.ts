import { Component, Input, OnInit } from '@angular/core';
import { ParkFactor } from '../park-factor.model';
import { ParkFactorService } from '../park-factor.service';

@Component({
  selector: 'app-park-factor-item',
  templateUrl: './park-factor-item.component.html',
  styleUrls: ['./park-factor-item.component.scss']
})
export class ParkFactorItemComponent implements OnInit {

  @Input() parkData: ParkFactor;

  constructor(
    private parkFactorService: ParkFactorService
  ) {}

  ngOnInit() {

  }

  getTdColor(value) {
    return this.parkFactorService.getPlayersColor(value);
  }

  getRainColor(value) {
    return this.parkFactorService.getRainColor(value);
  }
}
