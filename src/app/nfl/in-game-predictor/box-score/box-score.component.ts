import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-box-score',
  templateUrl: './box-score.component.html',
  styleUrls: ['./box-score.component.scss']
})
export class BoxScoreComponent implements OnInit {
  @Input() data;
  constructor() { }

  ngOnInit() {
  }

}
