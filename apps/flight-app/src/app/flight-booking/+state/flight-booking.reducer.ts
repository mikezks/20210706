import { Flight } from '@flight-workspace/flight-lib';
import { Action, createReducer, on } from '@ngrx/store';
import * as FlightBookingActions from './flight-booking.actions';

export const flightBookingFeatureKey = 'flightBooking';

export interface State {
  flights: Flight[];
}

export const initialState: State = {
  flights: []
};


export const reducer = createReducer(
  initialState,

  on(FlightBookingActions.flightsLoaded, (state, action) => {
    const flights = action.flights;
    return { ...state, flights };
  }),
  on(FlightBookingActions.flightsUpdate, (state, action) => {
    const flights = state.flights.map(
      flight => flight.id === action.flight.id ? action.flight : flight
    );
    return { ...state, flights };
  }),
);

