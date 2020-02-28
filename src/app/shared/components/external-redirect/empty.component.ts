import { Component, OnDestroy, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-empty-component',
  template: ''
})
export class EmptyComponent implements OnInit, OnDestroy {
  constructor(private metaService: Meta) { }

  ngOnInit() {
    this.metaService.addTag({ name: 'robots', content: 'noindex, follow, noarchive' });
  }

  ngOnDestroy() {
    this.metaService.removeTag('name=\'robots\'');
  }
}
