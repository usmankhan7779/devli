import { Component } from '@angular/core';
// import { gameData } from './gameData';

@Component({
  selector: 'app-nfl-animation',
  templateUrl: './animation.component.html',
  styleUrls: ['./animation.component.css']
})
export class AnimationComponent {
  title = 'app';
  // gameData = gameData;

  closed() {
    alert('Close button clicked');
  }
}
