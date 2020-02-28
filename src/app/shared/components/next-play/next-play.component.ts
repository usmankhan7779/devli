import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-next-play',
  templateUrl: './next-play.component.html',
  styleUrls: ['./next-play.component.scss']
})
export class NextPlayComponent implements OnInit {
  @Input() pass: string | number;
  @Input() rush: string | number;
  @Input() actual: string;
  @Input() model: string;

  constructor() { }

  ngOnInit() {
  }

}
