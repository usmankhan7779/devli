import { Inject, Injectable, PLATFORM_ID, Renderer2, RendererFactory2 } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import * as _ from 'lodash';

@Injectable()
export class SchemaService {
  script;
  breadcrumbScript;
  firstBrowserLoad: boolean;
  renderer2: Renderer2;
  constructor(
    rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.firstBrowserLoad = true;
    }
    this.renderer2 = rendererFactory.createRenderer(null, null);
    // sync all ld+json scripts created by universal on init
    Array.apply(null, document.querySelectorAll('head script[type="application/ld+json"]'))
      .forEach(script => {
        if (script.innerText) {
          const json = JSON.parse(script.innerText);
          if (json['@type'] === 'BreadcrumbList') {
            this.breadcrumbScript = script;
          } else {
            this.script = script;
          }
        }
      });
  }

  addSchema(json, isBreadcrumb = false) {
    if (this.firstBrowserLoad) {
      return;
    }
    if (isBreadcrumb) {
      let validBreadcrumb: any;
      try {
        validBreadcrumb = json;
        validBreadcrumb.itemListElement = _.uniqBy(validBreadcrumb.itemListElement, (item: any) => {
          return item.item['@id'];
        });
        validBreadcrumb.itemListElement.forEach((item, index) => {
          return item.position = index + 1;
        })
      } catch (e) {
        console.error('addSchema Error:', e)
      }
      if (this.breadcrumbScript && JSON.stringify(validBreadcrumb) === this.breadcrumbScript.innerText) {
        return;
      }
      this.removeSchema(true);
      this.breadcrumbScript = this.renderer2.createElement('script');
      this.breadcrumbScript.type = 'application/ld+json';
      this.breadcrumbScript.text = JSON.stringify(validBreadcrumb);
      this.renderer2.insertBefore(this.document.head, this.breadcrumbScript, this.document.querySelector('head meta[name="viewport"]'));
    } else {
      if (this.script && JSON.stringify(json) === this.script.innerText) {
        return;
      }
      this.removeSchema();
      this.script = this.renderer2.createElement('script');
      this.script.type = 'application/ld+json';
      this.script.text = JSON.stringify(json);

      this.renderer2.insertBefore(this.document.head, this.script, this.document.querySelector('head meta[name="viewport"]'));
    }
  }

  removeSchema(isBreadcrumb = false) {
    if (isBreadcrumb && this.breadcrumbScript) {
      this.renderer2.removeChild(this.document.head, this.breadcrumbScript);
      this.breadcrumbScript = null;
    }
    if (!isBreadcrumb && this.script) {
      this.renderer2.removeChild(this.document.head, this.script);
      this.script = null;
    }
  }

  setDefaultSchema() {
    this.addSchema([
      {
        '@context': 'http://schema.org',
        '@type': 'WebSite',
        '@id': 'https://www.lineups.com/',
        'url': 'https://www.lineups.com/',
        'sameAs': [
          'https://twitter.com/lineups',
          'https://www.youtube.com/channel/UCwt1Qfb2G4fha_S2RyErVqQ',
          'https://www.facebook.com/lineups',
          'https://www.linkedin.com/company/lineups-com',
          'https://www.instagram.com/lineups/',
          'https://www.crunchbase.com/organization/lineups',
          'https://angel.co/lineups'
        ]
      },
      {
        '@context': 'http://schema.org',
        '@type': 'Corporation',
        '@id': 'https://www.lineups.com/',
        'logo': 'https://www.lineups.com/assets/images/logo/logo.png',
        'legalName': 'Lineups.com, Inc',
        'url': 'https://www.lineups.com/',
        'description': 'Lineups.com, Inc. is an online sports analytics company specializing in ' +
        'betting predictions and tools. It is based in Irvine, California, United Stats.',
        'email': 'info@lineups.com',
        'foundingDate': '2017',
        'address': {
          '@type': 'PostalAddress',
          'addressLocality': 'Irvine',
          'addressRegion': 'CA',
        },
        'founder': {
          '@type': 'Person',
          'name': 'Sam Shefrin'
        },
        'contactPoint': {
          '@type': 'ContactPoint',
          'contactType': 'Customer service',
          'telephone': '+1-310-906-0648',
        }
      }
    ]);
  }

  getSportType(league) {
    switch (league.toLowerCase()) {
      case 'mlb': {
        return 'Baseball';
      }
      case 'nfl': {
        return 'American Football';
      }
      case 'nba': {
        return 'Basketball';
      }
    }
  }
}
