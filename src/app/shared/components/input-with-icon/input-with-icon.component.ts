import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-input-with-icon',
  templateUrl: './input-with-icon.component.html',
  styleUrls: ['./input-with-icon.component.scss']
})
export class InputWithIconComponent implements OnInit {
  @Output() actionTaken = new EventEmitter();
  @Input() icon: string;
  @Input() placeholder: string;

  constructor() { }

  ngOnInit() {
  }

  takeAction() {
    this.actionTaken.emit();
  }
}
