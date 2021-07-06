import { HttpParams, HttpHeaders, HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Flight } from '@flight-workspace/flight-lib';
import { combineLatest, iif, Observable, of, Subject, Subscription, timer } from 'rxjs';
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

    const loadFlights$ = (city: string) => of(city).pipe(
      // Side-Effect: set loading flag
      tap(() => this.loading = true),
      // Switch to Stream 2
      switchMap(city => this.load(city)),
      // Side-Effect: set loading flag
      tap(() => this.loading = false)
    );

    const emptyFlightsArray$ = () => of([]);

    // Stream 3: Result to render in Template
    this.flights$ =
      // Stream 1: Input field changes
      // Trigger
      // Data Provider
      this.control.valueChanges.pipe(
        // Filter START
        debounceTime(300),
        distinctUntilChanged(),
        // Filter END
        switchMap(city =>
          // Observable pathes
          iif(
            () => city.length > 2,
            // Path 1 resp. condition true: HTTP call
            loadFlights$(city),
            // Path 2 resp. condition false: Empty array
            emptyFlightsArray$()
          )
        )
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
