import {
  AfterViewInit,
  Component, EventEmitter, OnDestroy, Output, Renderer2, ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { CommonService } from '../../../../services/common.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../../../environments/environment';


@Component({
  selector: 'app-ad-video-component',
  templateUrl: './ad-video.component.html',
  styleUrls: ['./ad-video.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdVideoComponent implements OnDestroy, AfterViewInit {

  @ViewChild('container', {static: false}) private container: any;

  @Output() videoEnded = new EventEmitter();
  @Output() videoAdded = new EventEmitter();

  observer: any;
  isDev = !environment.production;

  constructor(
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private commonService: CommonService
  ) { }

  ngAfterViewInit() {
    if (this.commonService.isBrowser()) {
      this.route.params.subscribe(() => {
        this.resetVideoContainer();
        this.addScript()
      });
    }
  }

  ngOnDestroy() {
    this.disconnectObserver();
  }

  private disconnectObserver() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = undefined;
    }
  }

  private resetVideoContainer() {
    this.container.nativeElement.textContent = '';
  }

  private addScript() {
    const script = this.renderer.createElement('script');
    if (this.isDev) {
      script.src = 'https://cdn.springserve.com/assets/0/playerJS/exampleIAV.js';
    } else {
      script.src = 'https://cdn.springserve.com/assets/0/playerJS/lineupsIAV.js';
    }
    setTimeout(() => {
      this.renderer.appendChild(this.container.nativeElement, script);
      this.watchPlayer();
    });
  }

  private watchPlayer() {
    const target = this.container.nativeElement;

    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && Array.prototype.slice.call(mutation.removedNodes).length > 0) {
          if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
          }
          this.videoEnded.emit();
        }
        if (mutation.type === 'childList' && Array.prototype.slice.call(mutation.addedNodes).length > 0 &&
          Array.prototype.slice.call(mutation.addedNodes)[0].getAttribute('id') === 'parentVideoSlot') {
          setTimeout(() => {
            const videos = Array.prototype.slice.call(this.container.nativeElement.querySelectorAll('video'));
            if (videos.length > 0) {
              this.videoAdded.emit();
            }
          }, 1000)
        }
      });
    });

    const config = { attributes: true, childList: true, characterData: true };

    this.observer.observe(target, config);
  }

}
