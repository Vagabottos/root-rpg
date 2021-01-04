import { Directive, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { combineLatest, interval, Observable, Subject } from 'rxjs';
import { filter, first, map, takeUntil } from 'rxjs/operators';

@Directive({
  selector: '[appLongPress]'
})
export class LongPressDirective implements OnInit, OnDestroy {

    @Input() public longPress = 500;
    @Output() public release: EventEmitter<MouseEvent> = new EventEmitter();

    public mouseups$ = new Subject();
    public mousedowns$ = new Subject();
    public destroys$ = new Subject();

    constructor() {}

    ngOnInit(): void {
    }

    private initClick(event: MouseEvent): void {
      const interval$ = this.interval$()
        .pipe(
          takeUntil(this.mouseups$)
        );

      combineLatest([this.mousedowns$, this.mouseups$, interval$])
        .pipe(first())
        .subscribe((val) => {
          const endEvent = val[0] as MouseEvent;
          const startEvent = val[1] as MouseEvent;
          
          const dist = Math.sqrt(
            Math.pow(endEvent.x - startEvent.x, 2) + Math.pow(endEvent.y - startEvent.y, 2)
          );

          if(dist > 50) return;

          this.release.emit(endEvent);
        });
    }

    public ngOnDestroy(): void {
      this.destroys$.next();
      this.destroys$.unsubscribe();
    }

    public interval$(): Observable<number> {
      return interval()
        .pipe(
          map(i => i * 10),
          filter(i => i >= this.longPress)
        );
    }

    @HostListener('contextmenu', ['$event'])
    onCtx(event): boolean {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }

    @HostListener('touchstart', ['$event'])
    public onTouchStart(event: MouseEvent): void {
      this.initClick(event);
      this.mousedowns$.next(event);
    }

    @HostListener('touchend', ['$event'])
    public onTouchEnd(event: MouseEvent): void {
      this.mouseups$.next(event);
    }

    @HostListener('mousedown', ['$event'])
    public onMouseDown(event: MouseEvent): void {
      this.initClick(event);
      this.mousedowns$.next(event);
    }

    @HostListener('mouseup', ['$event'])
    public onMouseUp(event: MouseEvent): void {
      this.mouseups$.next(event);
    }
}
