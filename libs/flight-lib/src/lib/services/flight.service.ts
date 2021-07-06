import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {BehaviorSubject, Observable, of} from 'rxjs';
import {tap} from 'rxjs/operators';
import {Flight} from '../models/flight';


@Injectable({
  providedIn: 'root'
})
export class FlightService {

  flights: Flight[] = [];
  baseUrl = `http://www.angular.at/api`;
  // baseUrl = `http://localhost:3000`;

  flightsCount$ = new BehaviorSubject<number>(0);

  reqDelay = 1000;

  myFlights: Flight[] = [];
  myNumber: number;
  secoundReqFlights: Flight[] = [];

  callback: (num: number) => void;

  constructor(private http: HttpClient) {

    /* this.callback = (num: number) => {

      this.myNumber = num;
    }

    this.find('Graz', 'Hamburg')
      .subscribe(
        numberValue => { // 4711
          this.myNumber = numberValue;
        }
      );

    const from = this.myFlights[0].from;
    const to = this.myFlights[0].to;

    this.find(from, to)
      .subscribe(
        flights => {
          this.secoundReqFlights = flights;
        }
      ); */
  }

  load(from: string, to: string, urgent: boolean): void {
    this.find(from, to, urgent)
      .subscribe(
        flights => {
          this.flights = flights;
        },
        err => console.error('Error loading flights', err)
      );

    /* this.callback(1234); */
  }

  find(from: string, to: string, urgent: boolean = false): Observable<Flight[]> {

    // For offline access
    // let url = '/assets/data/data.json';

    // For online access
    let url = [this.baseUrl, 'flight'].join('/');

    if (urgent) {
      url = [this.baseUrl,'error?code=403'].join('/');
    }

    const params = new HttpParams()
      .set('from', from)
      .set('to', to);

    const headers = new HttpHeaders()
      .set('Accept', 'application/json');

    return this.http.get<Flight[]>(url, {params, headers}).pipe(
      tap(flights => this.flightsCount$.next(flights.length))
    );
    // return of(flights).pipe(delay(this.reqDelay))

    /* return of([
      {
        id: 999,
        from: 'London',
        to: 'New York',
        date: '',
        delayed: true
      }
    ]); */
  }

  findById(id: string): Observable<Flight> {
    const reqObj = { params: null };
    reqObj.params = new HttpParams().set('id', id);
    const url = [this.baseUrl, 'flight'].join('/');
    return this.http.get<Flight>(url, reqObj);
    // return of(flights[0]).pipe(delay(this.reqDelay))
  }

  save(flight: Flight): Observable<Flight> {
    const url = [this.baseUrl, 'flight'].join('/');
    return this.http.post<Flight>(url, flight);
  }

  delay() {
    const ONE_MINUTE = 1000 * 60;

    const oldFlights = this.flights;
    const oldFlight = oldFlights[0];
    const oldDate = new Date(oldFlight.date);

    // Mutable
    oldDate.setTime(oldDate.getTime() + 15 * ONE_MINUTE);
    oldFlight.date = oldDate.toISOString();
  }

}
