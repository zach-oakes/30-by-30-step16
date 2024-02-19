import {ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot} from "@angular/router";
import {Flight} from "./model/flight";
import {inject} from "@angular/core";
import {Observable, of} from "rxjs";
import {FlightHttpService} from "./service/flight-http.service";

export const FlightsResolver: ResolveFn<Flight[]> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    flightHttpService: FlightHttpService = inject(FlightHttpService)
): Observable<Flight[]> => {

    return flightHttpService.getFlights();
};
