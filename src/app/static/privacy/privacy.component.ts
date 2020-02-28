import { Component, OnDestroy, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss']
})
export class PrivacyComponent implements OnInit, OnDestroy {

  constructor(private metaService: Meta) { }

  ngOnInit() {
    this.metaService.addTag({ name: 'robots', content: 'noindex, follow, noarchive' });
  }

  ngOnDestroy() {
    this.metaService.removeTag('name=\'robots\'');
  }

}
