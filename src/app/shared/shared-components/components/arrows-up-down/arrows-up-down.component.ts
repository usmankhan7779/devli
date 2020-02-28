import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-arrows-up-down',
  templateUrl: './arrows-up-down.component.html',
  styleUrls: ['./arrows-up-down.component.scss']
})
export class ArrowsUpDownComponent implements OnInit {
  @Output() upClick = new EventEmitter();
  @Output() downClick = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  onUpClick() {
    console.log('onUpClick');
    this.upClick.emit();
  }

  onDownClick() {
    console.log('onDownClick');
    this.downClick.emit();
  }
}
