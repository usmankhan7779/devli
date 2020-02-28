import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ownership',
  templateUrl: './ownership.component.html',
  styleUrls: ['./ownership.component.scss']
})
export class OwnershipComponent implements OnInit {
  btnGroupOneCurrentValue: any;
  btnGroupTwoCurrentValue: any;
  btnGroupOneOpts: Array<any>;
  btnGroupTwoOpts: Array<any>;

  loading = false;
  items: Array<any>;

  constructor() {
    this.btnGroupOneOpts = [
      {label: 'DraftKings'},
      {label: 'Warriors'}
    ];
    this.btnGroupTwoOpts = [
      {label: 'Base Model'},
      {label: 'Advanced Model'}
    ];

    this.btnGroupOneCurrentValue = this.btnGroupOneOpts[0];
    this.btnGroupTwoCurrentValue = this.btnGroupTwoOpts[0];
  }

  ngOnInit() {
    this.items = [
      { pos: 'SP', player: 'Jarrod Saltalamacchia', rating: 95 },
      { pos: 'SP', player: 'Jarrod Saltalamacchia', rating: 95 },
      { pos: 'SP', player: 'Jarrod Saltalamacchia', rating: 95 },
      { pos: 'SP', player: 'Jarrod Saltalamacchia', rating: 95 },
      { pos: 'SP', player: 'Jarrod Saltalamacchia', rating: 95 }
    ];
  }

  onToggleTab(index) { }

  onUpdateDate(date: string) { }
}
