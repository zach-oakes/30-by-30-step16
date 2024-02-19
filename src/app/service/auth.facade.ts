import {Injectable} from "@angular/core";
import {StoreService} from "./store.service";
import {BehaviorSubject} from "rxjs";
import {User} from "../model/user";
import {Session} from "../model/session";
import {Store} from "@ngrx/store";
import {createUser, deleteSession, getUser, setAuthenticatedFlag, setLoggedInUser, setSession} from "../auth-actions";

@Injectable({
    providedIn: 'root'
})

export class AuthFacadeService {

    constructor(private storeService: StoreService,
                private store: Store) {
    }

    getIsAuthenticated(): BehaviorSubject<boolean> {
        return this.storeService.getIsAuthenticated();
    }

    setIsAuthenticated(isAuthenticated: boolean): void {
        this.store.dispatch(setAuthenticatedFlag({isAuthenticated}));
    }

    getLoggedInUser(): BehaviorSubject<User | undefined> {
        return this.storeService.getLoggedInUser();
    }

    setLoggedInUser(user: User): void {
        this.store.dispatch(setLoggedInUser({user}));
    }

    createUser(username: string, password: string): void {
        this.store.dispatch(createUser({username, password}));
    }

    getUser(user: User): void {
        this.store.dispatch(getUser({user}));
    }

    createSession(session: Session): void {
        this.store.dispatch(setSession({session}));
    }

    getSession(): BehaviorSubject<Session | undefined> {
        return this.storeService.getSession();
    }

    deleteSession(id: string): void {
        this.store.dispatch(deleteSession({id}));
    }

    getExistingUserAccount(): BehaviorSubject<User | undefined> {
        return this.storeService.getExistingUserAccount();
    }
}