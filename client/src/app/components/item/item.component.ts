
import { Component, ElementRef, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';
import { Gesture, GestureConfig, createGesture } from '@ionic/core';
import { IItem } from '../../../interfaces';
import { ItemService } from '../../services/item.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
})
export class ItemComponent implements OnInit {

  @Input() item: IItem;

  @Output() public swipeLeft = new EventEmitter();
  @Output() public swipeRight = new EventEmitter();
  @Output() public longpress = new EventEmitter();

  public get boxSlots(): boolean[] {
    return Array(this.item.wear).fill(false);
  }

  constructor(
    private zone: NgZone,
    private elementRef: ElementRef,
    public itemService: ItemService
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
