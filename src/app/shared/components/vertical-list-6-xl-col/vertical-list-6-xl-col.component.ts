import { Component, EventEmitter, HostListener, Inject, Input, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-vertical-list-6-xl-col',
  templateUrl: './vertical-list-6-xl-col.component.html',
  styleUrls: ['./vertical-list-6-xl-col.component.scss']
})
export class VerticalList6XlColComponent implements OnInit {
  @Input() data: {name: string, url: string}[];
  @Input() linkToAll: string;
  @Input() linkToAll2: string;
  @Input() textToAll: string;
  @Input() textToAll2: string;
  @Input() linkClass = 'link-black-underline mobile-margin';
  @Output() urlClicked = new EventEmitter();

  itemsPerColToChange: number;
  cap = [0, 1, 2, 3, 4, 5];

  @HostListener('window:resize', ['$event']) onResize(event) {
    if (typeof window !== 'undefined') {
      const windowWidth = event.target.innerWidth;
      if (windowWidth >= 1200) {
        this.itemsPerColToChange = Math.ceil(this.data.length / 6);
      }
      if (windowWidth < 1200) {
        this.itemsPerColToChange = Math.ceil(this.data.length / 4);
      }
      if (windowWidth < 992) {
        this.itemsPerColToChange = Math.ceil(this.data.length / 3);
      }
      if (windowWidth < 768) {
        this.itemsPerColToChange = Math.ceil(this.data.length / 2);
      }
      if (windowWidth < 576) {
        this.itemsPerColToChange = this.data.length;
      }
    }
  }

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit() {
    // emit resize on first call

    // window/document and other Browser DOM things can't be used on the server
    // and will cause the server not to render anything and break node
    // try not to use this or be really careful and test for their existance first
    if (isPlatformBrowser(this.platformId)) {
      this.onResize({target: {
          innerWidth: typeof window !== 'undefined' ? window.innerWidth : 900
        }});
    } else {
      this.itemsPerColToChange = Math.ceil(this.data.length / 6);
    }
  }

  onUrlClick() {
    this.urlClicked.emit();
  }

}
