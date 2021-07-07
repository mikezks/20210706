import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as FlightBookingActions from './flight-booking.actions';
import { FlightService } from '@flight-workspace/flight-lib';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';


@Injectable()
export class FlightBookingEffects {

  flightsLoad$ = createEffect(() =>
    // Stream 1: Actions stream
    // Trigger
    // Data Provider
    this.actions$.pipe(
      // Filter
      ofType(FlightBookingActions.flightsLoad),
      // Switch to 2nd Stream: Load Flights
      switchMap(action => this.flightService.find(action.from, action.to).pipe(
        // Type conversion: Flight[] -> Action flightsLoaded
        map(flights => FlightBookingActions.flightsLoaded({ flights })),
        catchError(err => of(FlightBookingActions.flightsLoadedFailure({ error: err })))
      ))
    )
  );

  constructor(
    private actions$: Actions,
    private flightService: FlightService) {}
}
