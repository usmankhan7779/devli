import { Component, ElementRef, HostBinding, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-game-box',
  templateUrl: './game-box.component.html',
  styleUrls: ['./game-box.component.scss']
})
export class GameBoxComponent implements OnInit {

  @ViewChild('gameBox', {static: true}) gameBoxRef: ElementRef;
  private gameBox: HTMLDivElement;

  @HostBinding('style.background-image')
  @Input() backgroundImage: string;

  padding = '0';

  constructor() { }

  ngOnInit() {
    this.gameBox = this.gameBoxRef.nativeElement;
    this.refreshSize();
    window.addEventListener('resize', this.refreshSize);
    setTimeout(() => this.refreshSize(), 20);
  }

  OnDestroy() {
    window.removeEventListener('resize', this.refreshSize);
  }

  private refreshSize = () => {
    this.padding = this.gameBox.offsetTop + 'px';
  }
}
