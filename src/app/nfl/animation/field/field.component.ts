import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss']
})
export class FieldComponent implements OnInit {

  @Input() touchdown = false;
  @Input() touchdownColor = '';

  @ViewChild('canvas', {static: false}) private canvasRef: ElementRef;
  get canvas() { return this.canvasRef && this.canvasRef.nativeElement; }

  constructor() { }

  ngOnInit() {
  }

}
