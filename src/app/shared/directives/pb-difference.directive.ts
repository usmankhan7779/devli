import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appPbDifference]'
})
export class PbDifferenceDirective {
  div = this.renderer.createElement('div');
  private diff;
  @Input() set appPbDifference(value) {
    if (value == null || value === 0 || value === '') {
      this.diff = null;
      this.resetElStyles();
      return;
    }
    this.diff = value;
    this.setElStyles();
  }
  constructor(private elRef: ElementRef, private renderer: Renderer2) {
    this.renderer.setStyle(this.elRef.nativeElement, 'position', 'relative');
  }

  @HostListener('mouseover')
  onMouseOver() {
    if (this.diff == null || this.diff === 0 || this.diff === '') {
      return;
    }
    console.log('diff', this.diff);
    this.div.textContent = this.setText();
    this.renderer.addClass(this.div, 'diff-box');
    this.renderer.addClass(this.div, 'd-flex');
    this.renderer.addClass(this.div, 'align-items-center');
    this.renderer.addClass(this.div, 'justify-content-center');
    this.renderer.addClass(this.div, this.getColor());
    this.renderer.appendChild(this.elRef.nativeElement, this.div);
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    if (this.div && this.div.parentNode === this.elRef.nativeElement) {
      this.renderer.removeChild(this.elRef.nativeElement, this.div);
    }
  }

  private setText(): string {
    if (typeof this.diff === 'string') {
      return this.diff;
    }
    if (this.diff > 0) {
      return `+ ${this.diff}`;
    } else {
      return `- ${this.diff * -1}`;
    }
  }

  private getColor() {
    const green = 'green';
    const red = 'red';
    if (typeof this.diff === 'string') {
      if (this.diff.indexOf('-') !== -1) {
        return red;
      } else {
        return green;
      }
    }
    if (typeof this.diff === 'boolean') {
      return this.diff ? green : red;
    }
    return this.diff > 0 ? green : red;
  }

  private setElStyles() {
    this.renderer.setStyle(this.elRef.nativeElement, 'border', `1px solid ${this.getColor()}`);
    this.renderer.setStyle(this.elRef.nativeElement, 'border-style', 'double');
  }

  private resetElStyles() {
    this.renderer.removeStyle(this.elRef.nativeElement, 'border');
    this.renderer.removeStyle(this.elRef.nativeElement, 'border-style');
  }

}
