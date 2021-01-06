import { Directive, ElementRef, EventEmitter, NgZone, OnInit, Output } from '@angular/core';
import { Gesture, GestureConfig, createGesture } from '@ionic/core';

@Directive({
  selector: '[appSwipe]'
})
export class SwipeDirective implements OnInit {

  @Output() public swipeLeft = new EventEmitter();
  @Output() public swipeRight = new EventEmitter();

  constructor(
    private zone: NgZone,
    private elementRef: ElementRef
  ) { }

  ngOnInit() {
    this.initGestures();
  }

  initGestures() {
    const windowWidth = window.innerWidth;

    const swipeOptions: GestureConfig = {
      el: this.elementRef.nativeElement,
      gestureName: 'swipe',
      onEnd: (ev) => {
        this.zone.run(() => {
          if (ev.deltaX > windowWidth / 4) {
            this.swipeRight.next();

          } else if (ev.deltaX < -windowWidth / 4) {
            this.swipeLeft.next();
          }
        });
      }
    };

    const swipeGesture: Gesture = createGesture(swipeOptions);

    swipeGesture.enable();
  }
}
