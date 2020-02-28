import { Directive, Input, ElementRef, TemplateRef, ViewContainerRef, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';

@Directive({
  selector: '[appServerIf]'
})
export class ServerIfDirective {

  constructor(
    private element: ElementRef,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
  }

  @Input()
  set appServerIf(val) {
    if (val && isPlatformServer(this.platformId)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
