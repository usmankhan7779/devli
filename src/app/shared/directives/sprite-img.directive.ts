import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import * as _ from 'lodash';

@Directive({ selector: '[appSpriteImg]' })
export class SpriteImgDirective {
  customClasses: string[] = [];
  @Input() appSpriteImg; // nfl | mlb
  @Input() type = ''; // white | bordered
  @Input() size = ''; // small

  private league;
  @Input() set src(value: string) {
    if (!value) {
      return;
    }
    if (this.customClasses.length) {
      this.customClasses.forEach((customClass) => {
        this.renderer.removeClass(this.el.nativeElement, customClass);
      })
    }
    this.customClasses = [];
    if (value.indexOf('/') === 0) {
      value = value.substr(1);
    }
    this.league = this.appSpriteImg === 'college-football' ? 'cfb' : (this.appSpriteImg || this.getLeague(value));
    if (this.league === 'mlb' && _.includes(value, '-bordered.svg')) {
      value = value.replace('-bordered.svg', '-largest.svg')
    }
    let spriteName = 'sprite';
    if (this.type) {
      spriteName += `-${this.type}`;
    }
    if (this.size) {
      spriteName += `-${this.size}`;
    }
    if (typeof navigator !== 'undefined' && navigator && navigator.userAgent &&
      (navigator.userAgent.indexOf('Safari') !== -1 && navigator.userAgent.indexOf('Chrome') === -1)
    ) {
      this.renderer.setAttribute(this.el.nativeElement, 'src', value);
    } else {
      const src = `/assets/images/${
        this.league
      }/logos/${spriteName}.svg#${value.replace(/\//g, '--').slice(0, -4)}`;
      this.renderer.setAttribute(this.el.nativeElement, 'src', src);
    }
    if (this.type === 'white') {
      switch (this.league) {
        case 'mlb': {
          const teamName = value.replace(/\//g, '-')
            .replace(/assets-images-mlb-logos-white/, 'mlb').slice(0, -4);
          this.customClasses.push(`${spriteName}-${teamName}`);
          break;
        }
        case 'nfl': {
          const teamName = value.replace(/\//g, '-')
            .replace(/assets-images-nfl-logos-white/, 'nfl').slice(0, -4);
          this.customClasses.push(`${spriteName}-${teamName}`);
          break;
        }
        case 'nba': {
          const teamName = value.replace(/\//g, '-')
            .replace(/assets-images-nba-logos-white/, 'nba').slice(0, -4);
          this.customClasses.push(`${spriteName}-${teamName}`);
          this.customClasses.push(`${spriteName}-nba-logo`);
          break;
        }
      }
    }
    if (this.customClasses.length) {
      this.customClasses.forEach((customClass) => {
        this.renderer.addClass(this.el.nativeElement, customClass);
      })
    }
  }

  private getLeague(src) {
    const leagues = ['nba', 'mlb', 'nfl', 'cfb'];
    if (src) {
      for (let i = 0; i < leagues.length; i++) {
        if (src.indexOf('/' + leagues[i] + '/') !== -1) {
          return leagues[i];
        }
      }
    }
  }

  constructor(private el: ElementRef, private renderer: Renderer2) {}
}
