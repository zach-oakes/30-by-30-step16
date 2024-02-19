import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {FlightHttpService} from "../service/flight-http.service";
import {catchError, exhaustMap, map, of, tap} from "rxjs";
import {StoreService} from "../service/store.service";
import {
    createFlight,
    createFlightSuccess, dataLoadFailure, deleteFlight, deleteFlightSuccess, loadFlight,
    loadFlights,
    loadFlightsSuccess, loadFlightSuccess,
    updateFlight,
    updateFlightSuccess
} from "../flights.actions";
import {Flight} from "../model/flight";
import {Router} from "@angular/router";

@Injectable()
export class FlightsEffects {

    loadFlights$ = createEffect(() => this.actions$.pipe(
            ofType(loadFlights),
            exhaustMap(() => this.flightHttpService.getFlights()
                .pipe(
                    map(flights => (loadFlightsSuccess({flights}))),
                    catchError(() => of(dataLoadFailure))
                ))
        )
    );

    loadFlightsSuccess$ = createEffect(() => this.actions$.pipe(
            ofType(loadFlightsSuccess),
            tap(data => {
                // it's also possible to have a reducer listen for success, set it in the store, and having a selector read it out
                this.storeService.setFlightList(data.flights);
            })
            // https://this-is-angular.github.io/ngrx-essentials-course/docs/chapter-11/#not-all-effects-should-dispatch
        ), {dispatch: false}
    );

    loadFlight$ = createEffect(() => this.actions$.pipe(
            ofType(loadFlight),
            exhaustMap(({id}) => this.flightHttpService.getFlight(id)
                .pipe(
                    map(flight => (loadFlightSuccess({flight}))),
                    catchError(() => of(dataLoadFailure))
                ))
        )
    );

    loadFlightSuccess$ = createEffect(() => this.actions$.pipe(
            ofType(loadFlightSuccess),
            tap(data => {
                const flight = Object.assign({}, data.flight);
                this.storeService.setSelectedFlight(flight);
                this.router.navigate(['/flight', flight.id]);
            })
        ), {dispatch: false}
    );


    createFlight$ = createEffect(() => this.actions$.pipe(
        ofType(createFlight),
        exhaustMap((data) => this.flightHttpService.createFlight(data.flight)
            .pipe(
                map(flight => createFlightSuccess({flight})),
                catchError(() => of(dataLoadFailure))
            )
        )
    ));

    createFlightSuccess$ = createEffect(() => this.actions$.pipe(
            ofType(createFlightSuccess),
            tap(result => {
                // make a copy of the array and add the new flight to it
                this.storeService.setFlightList([...this.storeService.getFlightList().value, result.flight]);
                this.storeService.setSelectedFlight({} as Flight);
                this.router.navigate(['/flights']);
            })
        ), {dispatch: false}
    );

    updateFlight$ = createEffect(() => this.actions$.pipe(
        ofType(updateFlight),
        exhaustMap((data) => this.flightHttpService.updateFlight(data.flight)
            .pipe(
                map(flight => updateFlightSuccess({flight})),
                catchError(() => of(dataLoadFailure))
            )
        )
    ));

    updateFlightSuccess$ = createEffect(() => this.actions$.pipe(
            ofType(updateFlightSuccess),
            tap(updated => {
                // make a copy of the array and add the new flight to it
                this.storeService.getFlightList().next(
                    this.storeService.getFlightList().value.map(flight => {
                        // if the ids match, we want to replace the item with the updated one
                        return flight.id === updated.flight.id ? updated.flight : flight;
                    })
                );
                this.router.navigate(['/flights']);
            })
        ), {dispatch: false}
    );

    deleteFlight$ = createEffect(() => this.actions$.pipe(
        ofType(deleteFlight),
        exhaustMap(({id}) => this.flightHttpService.deleteFlight(id)
            .pipe(
                map(flight => deleteFlightSuccess({flight})),
                catchError(() => of(dataLoadFailure))
            )
        )
    ));

    deleteFlightSuccess$ = createEffect(() => this.actions$.pipe(
            ofType(deleteFlightSuccess),
            tap(deleted => {
                // make a copy of the array and add the new flight to it
                this.storeService.getFlightList().next(
                    // remove the deleted one from the list and update the store
                    this.storeService.getFlightList().value.filter(fl => fl.id !== deleted.flight.id)
                );
                window.location.reload();
            })
        ), {dispatch: false}
    );

    dataLoadFailure$ = createEffect(() => this.actions$.pipe(
            ofType(dataLoadFailure),
            tap(() => {
                this.router.navigate(['/dataError']);
            })
        ), {dispatch: false}
    );

    constructor(private actions$: Actions,
                private flightHttpService: FlightHttpService,
                private storeService: StoreService,
                private router: Router) {
    }

}