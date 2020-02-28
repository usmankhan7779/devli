import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-pregame',
  templateUrl: './pregame.component.html',
  styleUrls: ['./pregame.component.scss']
})
export class PregameComponent implements OnInit {
  @Input() data;
  constructor() { }

  ngOnInit() {
  }

}
