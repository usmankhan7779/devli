import { Directive, Input, ElementRef, TemplateRef, ViewContainerRef, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appBrowserIf]'
})
export class BrowserIfDirective {

  constructor(
    private element: ElementRef,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
  }

  @Input()
  set appBrowserIf(val) {
    if (val && isPlatformBrowser(this.platformId)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
