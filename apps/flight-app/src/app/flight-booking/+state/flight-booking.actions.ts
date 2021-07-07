import { Flight } from '@flight-workspace/flight-lib';
import { createAction, props } from '@ngrx/store';

export const flightsLoad = createAction(
  '[FlightBooking] Flights load',
  props<{ from: string, to: string }>()
);

export const flightsLoaded = createAction(
  '[FlightBooking] Flights loaded',
  props<{ flights: Flight[] }>()
);

export const flightsUpdate = createAction(
  '[FlightBooking] Flights update',
  props<{ flight: Flight }>()
);

export const flightsLoadedFailure = createAction(
  '[FlightBooking] Flights loaded Failure',
  props<{ error: any }>()
);
