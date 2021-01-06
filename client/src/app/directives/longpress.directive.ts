import { Directive, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { Observable, race, Subject, timer } from 'rxjs';
import { map, mergeMap, takeUntil } from 'rxjs/operators';

@Directive({
  selector: '[appLongPress]'
})
export class LongPressDirective implements OnInit, OnDestroy {

  @Input() public longPress = 1000;
  @Output() public release: EventEmitter<MouseEvent> = new EventEmitter();

  public destroy$ = new Subject();

  public touchStartSubject: Subject<any> = new Subject<any>();
  public touchStartObservable: Observable<any> = this.touchStartSubject.asObservable();

  public touchEndSubject: Subject<any> = new Subject<any>();
  public touchEndObservable: Observable<any> = this.touchEndSubject.asObservable();

  constructor() {}

  ngOnInit(): void {
    this.touchStartObservable
      .pipe(
        takeUntil(this.destroy$),
        mergeMap((res) => race(
          timer(this.longPress).pipe(map(() => res)),
          this.touchEndObservable,
        )),
      )
      .subscribe((res: TouchEvent) => {
        if (!res) { return; }
        this.release.emit();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  @HostListener('touchstart', ['$event'])
  public touchStart($event: TouchEvent): void {
    this.touchStartSubject.next($event);
  }

  @HostListener('mousedown', ['$event'])
  public mouseDown($event: TouchEvent): void {
    this.touchStartSubject.next($event);
  }

  @HostListener('touchend', ['$event'])
  public touchEnd(): void {
    this.touchEndSubject.next(null);
  }

  @HostListener('mouseup', ['$event'])
  public mouseUp(): void {
    this.touchEndSubject.next(null);
  }
}
