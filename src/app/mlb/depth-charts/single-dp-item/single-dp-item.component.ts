import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-single-dp-item',
  templateUrl: './single-dp-item.component.html',
  styleUrls: ['./single-dp-item.component.scss']
})
export class SingleDpItemComponent implements OnInit {
  @Input() tableData: any;
  @Input() teamName: string;

  @ViewChild('tableContent', {static: true}) tableContent: ElementRef;
  constructor() {}

  ngOnInit() {
    this.tableContent.nativeElement.insertAdjacentHTML('beforeend', this.tableData.table.outerHTML);
  }
}
