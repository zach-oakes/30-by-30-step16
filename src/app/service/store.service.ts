import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {Flight} from "../model/flight";
import {SessionService} from "./session.service";
import CookieUtil from "../util/cookie-util";
import {User} from "../model/user";
import {Session} from "../model/session";

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private flightList$: BehaviorSubject<Flight[]> = new BehaviorSubject<Flight[]>([]);
  private selectedFlight$: BehaviorSubject<Flight> = new BehaviorSubject<Flight>({} as Flight);
  private isAuthenticated$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private loggedInUser$: BehaviorSubject<User | undefined> = new BehaviorSubject<User | undefined>({} as User);
  private userAccounts$: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
  private existingUserAccount$: BehaviorSubject<User | undefined> = new BehaviorSubject<User | undefined>(undefined);
  private session$: BehaviorSubject<Session | undefined> = new BehaviorSubject<Session | undefined>(undefined);

  constructor(private sessionService: SessionService) {
    // set initial value for is authenticated by checking to see if we have a session
    const id = CookieUtil.getIdFromCookie();

    if (id !== '') {
      const session = this.sessionService.getSession(id);

      this.isAuthenticated$.next(session !== null);
    }
  }

  getFlightList(): BehaviorSubject<Flight[]> {
    return this.flightList$;
  }

  setFlightList(flightList: Flight[]): void {
    this.flightList$.next(flightList);
  }

  getSelectedFlight(): BehaviorSubject<Flight> {
    return this.selectedFlight$;
  }

  setSelectedFlight(flight: Flight): void {
    this.selectedFlight$.next(flight);
  }

  setIsAuthenticated(authenticated: boolean): void {
    this.isAuthenticated$.next(authenticated);
  }

  getIsAuthenticated(): BehaviorSubject<boolean> {
    return this.isAuthenticated$;
  }

  getLoggedInUser(): BehaviorSubject<User | undefined> {
    return this.loggedInUser$;
  }

  setLoggedInUser(user: User | undefined): void {
    this.loggedInUser$.next(user);
  }

  getUserAccounts(): BehaviorSubject<User[]> {
    return this.userAccounts$;
  }

  updateUserAccounts(users: User[]): void {
    this.userAccounts$.next(users);
  }

  setExistingUserAccount(user: User | undefined): void {
    this.existingUserAccount$.next(user);
  }

  getExistingUserAccount(): BehaviorSubject<User | undefined> {
    return this.existingUserAccount$;
  }

  setSession(session: Session): void {
    this.session$.next(session);
  }

  getSession(): BehaviorSubject<Session | undefined> {
    return this.session$;
  }

  deleteSession() {
    this.session$.next(undefined);
  }
}
