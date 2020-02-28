import { Component, OnDestroy, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-terms-use',
  templateUrl: './terms-use.component.html',
  styleUrls: ['./terms-use.component.scss']
})
export class TermsUseComponent implements OnInit, OnDestroy {

  constructor(private metaService: Meta) { }

  ngOnInit() {
    this.metaService.addTag({ name: 'robots', content: 'noindex, follow, noarchive' });
  }

  ngOnDestroy() {
    this.metaService.removeTag('name=\'robots\'');
  }

}
