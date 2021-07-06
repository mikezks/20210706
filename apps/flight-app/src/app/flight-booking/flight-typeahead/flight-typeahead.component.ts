import { HttpParams, HttpHeaders, HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Flight } from '@flight-workspace/flight-lib';
import { combineLatest, Observable, of, Subject, Subscription, timer } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, share, switchMap, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'flight-workspace-flight-typeahead',
  templateUrl: './flight-typeahead.component.html',
  styleUrls: ['./flight-typeahead.component.css']
})
export class FlightTypeaheadComponent implements OnInit, OnDestroy {
  timer$: Observable<number>;
  subscription = new Subscription();
  destroy$ = new Subject<void>();

  control = new FormControl();
  loading: boolean;
  flights$: Observable<Flight[]>;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    // this.rxjsDemo();

    // Stream 3: Result to render in Template
    this.flights$ =
      /* combineLatest([
        this.control.valueChanges,
        of(true)
      ]) */
      // Stream 1: Input field changes
      // Trigger
      // Data Provider
      this.control.valueChanges.pipe(
        /* control$ => combineLatest([
          control$,
          of(true)
        ]), */
        /* filter(([_, online]) => online),
        map(([city, _]) => city), */
        // Filter START
        filter(city => city.length > 2),
        debounceTime(300),
        distinctUntilChanged(),
        // Filter END
        // Side-Effect: set loading flag
        tap(() => this.loading = true),
        // Switch to Stream 2
        switchMap(city => this.load(city)),
        // Side-Effect: set loading flag
        tap(() => this.loading = false)
      );
  }

  // Stream 2: HTTP request to server resp. API
  load(from: string): Observable<Flight[]>  {
    const url = "http://www.angular.at/api/flight";

    const params = new HttpParams()
                        .set('from', from);

    const headers = new HttpHeaders()
                        .set('Accept', 'application/json');

    return this.http.get<Flight[]>(url, {params, headers});
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
    // this.destroy$.next();
    // this.subscription.unsubscribe();
  }
}
