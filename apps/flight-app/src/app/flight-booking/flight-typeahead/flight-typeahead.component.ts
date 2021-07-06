import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, Subscription, timer } from 'rxjs';
import { share, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'flight-workspace-flight-typeahead',
  templateUrl: './flight-typeahead.component.html',
  styleUrls: ['./flight-typeahead.component.css']
})
export class FlightTypeaheadComponent implements OnInit, OnDestroy {
  timer$: Observable<number>;
  subscription = new Subscription();
  destroy$ = new Subject<void>();

  constructor() { }

  ngOnInit(): void {
    this.rxjsDemo();
  }

  rxjsDemo(): void {
    this.timer$ = timer(0, 2000).pipe(
      tap(value => console.log('Observable processing', value)),
      takeUntil(this.destroy$),
      share()
    );

    this.subscription.add(
      this.timer$.subscribe(console.log)
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    // this.subscription.unsubscribe();
  }
}
