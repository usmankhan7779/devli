import { Component, OnDestroy, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-billing-terms',
  templateUrl: './billing-terms.component.html',
  styleUrls: ['./billing-terms.component.scss']
})
export class BillingTermsComponent implements OnInit, OnDestroy {

  constructor(private metaService: Meta) { }

  ngOnInit() {
    this.metaService.addTag({ name: 'robots', content: 'noindex, follow, noarchive' });
  }

  ngOnDestroy() {
    this.metaService.removeTag('name=\'robots\'');
  }

}
