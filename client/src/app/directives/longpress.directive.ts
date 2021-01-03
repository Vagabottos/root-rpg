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

    private initClick(): void {
      const interval$ = this.interval$()
        .pipe(
          takeUntil(this.mouseups$)
        );

      combineLatest([this.mousedowns$, interval$])
        .pipe(first())
        .subscribe((val) => {
          this.release.emit(val[0] as MouseEvent);
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
      this.initClick();
      this.mousedowns$.next(event);
    }

    @HostListener('touchend', ['$event'])
    public onTouchEnd(event: MouseEvent): void {
      this.mouseups$.next(event);
    }

    @HostListener('mousedown', ['$event'])
    public onMouseDown(event: MouseEvent): void {
      this.initClick();
      this.mousedowns$.next(event);
    }

    @HostListener('mouseup', ['$event'])
    public onMouseUp(event: MouseEvent): void {
      this.mouseups$.next(event);
    }
}
