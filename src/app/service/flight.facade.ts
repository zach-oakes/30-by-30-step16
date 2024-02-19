import {Injectable} from "@angular/core";
import {StoreService} from "./store.service";
import {BehaviorSubject, Observable, tap} from "rxjs";
import {Flight} from "../model/flight";
import {Store} from "@ngrx/store";
import {createFlight, deleteFlight, loadFlight, loadFlights, updateFlight} from "../flights.actions";

@Injectable({
    providedIn: 'root'
})

export class FlightFacadeService {

    constructor(private storeService: StoreService,
                private store: Store) {
    }

    getFlightList(): BehaviorSubject<Flight[]> {
        return this.storeService.getFlightList();
    }

    setSelectedFlight(flight: Flight): void {
        this.storeService.setSelectedFlight(flight);
    }

    getSelectedFlight(): BehaviorSubject<Flight> {
        return this.storeService.getSelectedFlight();
    }

    createFlight(flight: Flight): void {
        this.store.dispatch(createFlight({ flight }));
    }

    getFlights(): void {
        this.store.dispatch(loadFlights());
    }

    getFlight(id: string): void {
        this.store.dispatch(loadFlight({ id }));
    }

    updateFlight(flight: Flight): void {
        this.store.dispatch(updateFlight({ flight }));
    }

    deleteFlight(id: string): void {
        this.store.dispatch(deleteFlight({ id }));
    }
}