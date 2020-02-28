import {
  Component, ElementRef, HostBinding, HostListener, Inject, Input, OnInit, PLATFORM_ID, Renderer2,
  ViewChild
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-twitter-follow-btn',
  templateUrl: './twitter-follow-btn.component.html',
  styleUrls: ['./twitter-follow-btn.component.scss']
})
export class TwitterFollowBtnComponent implements OnInit {
  @Input() textElement: HTMLElement;
  @Input() containerElement: HTMLElement;

  @HostBinding('class.hide-label') isLabelHidden = false;
  @HostBinding('class.next-line-full-width') isFullWidth = false;

  showBtn: boolean;

  readonly btnWidth = 85;
  readonly btnWrapperWidth = 235;
  twitterInit = false;
  @HostListener('window:resize', ['$event']) onResize() {
    if (this.textElement && this.containerElement) {
      const isMoreThanContainer = (this.textElement.offsetWidth + this.btnWrapperWidth)
        >= this.containerElement.offsetWidth;
      const smIsMoreThanContainer = (this.textElement.offsetWidth + this.btnWidth) >= this.containerElement.offsetWidth;
      if (isMoreThanContainer && !this.isLabelHidden && !this.isFullWidth) {
        this.isLabelHidden = true;
      } else if (!this.isFullWidth && this.isLabelHidden && smIsMoreThanContainer) {
        this.isLabelHidden = false;
        this.isFullWidth = true;
      } else if (!isMoreThanContainer && this.isLabelHidden && !this.isFullWidth ) {
        this.isLabelHidden = false;
      } else if (this.isFullWidth && !smIsMoreThanContainer) {
        this.isFullWidth = false;
        this.isLabelHidden = true;
      }
    }
  }
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private renderer: Renderer2,
    private _element: ElementRef,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    const openedInIframe = this.commonService.openedInIframe();
    if (!(isPlatformBrowser(this.platformId) && !openedInIframe && window.innerWidth > 767)) {
      this.renderer.setStyle(this._element.nativeElement, 'display', 'none');
      return;
    }
    this.showBtn = true;
    this.initTwitter();
  }

  private initTwitter() {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        if ((<any>window).twttr) {
          (<any>window).twttr.widgets.load()
            .then(() => {
              this.twitterInit = true;
              setTimeout(this.onResize.bind(this), 10);
            });
        }
      }, 10);
    }
  }

}
