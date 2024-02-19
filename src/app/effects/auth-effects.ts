import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {createUser, deleteSession, getUser, setAuthenticatedFlag, setLoggedInUser, setSession} from "../auth-actions";
import {tap} from "rxjs";
import {StoreService} from "../service/store.service";
import {v4} from 'uuid';
import {User} from "../model/user";
import {Router} from "@angular/router";

@Injectable()
export class AuthEffects {

    createUser$ = createEffect(() => this.actions$.pipe(
            ofType(createUser),
            tap(data => {
                const id = v4();
                const user: User = {
                    id,
                    username: data.username,
                    password: data.password,
                };

                this.storeService.updateUserAccounts([...this.storeService.getUserAccounts().value, user]);
                sessionStorage.setItem(data.username, data.password);
                this.router.navigate(['/login']);
            })
        ), {dispatch: false},
    );

    getUser$ = createEffect(() => this.actions$.pipe(
            ofType(getUser),
            tap(data => {
                const found = this.storeService.getUserAccounts()
                    .value
                    .find(user => user.username === data.user.username && user.password === data.user.password);

                if (found) {
                    this.storeService.setExistingUserAccount(found);
                } else {
                    const localPassword = sessionStorage.getItem(data.user.username);
                    if (localPassword && localPassword === data.user.password) {
                        this.storeService.setExistingUserAccount(
                            {username: data.user.username, password: localPassword}
                        );
                    } else {
                        this.storeService.setExistingUserAccount(undefined);
                    }
                }
            })
        ), {dispatch: false},
    );

    setLoggedInUser$ = createEffect(() => this.actions$.pipe(
            ofType(setLoggedInUser),
            tap(data => this.storeService.setLoggedInUser(data.user))
        ), {dispatch: false},
    );

    setSession$ = createEffect(() => this.actions$.pipe(
            ofType(setSession),
            tap(data => {
                this.storeService.setSession(data.session);
                sessionStorage.setItem(data.session.id, JSON.stringify(data.session));
            })
        ), {dispatch: false},
    );

    deleteSession$ = createEffect(() => this.actions$.pipe(
            ofType(deleteSession),
            tap(data => {
                this.storeService.deleteSession();
                sessionStorage.removeItem(data.id);
            })
        ), {dispatch: false},
    );

    setIsAuthenticated$ = createEffect(() => this.actions$.pipe(
            ofType(setAuthenticatedFlag),
            tap(data => {
                this.storeService.setIsAuthenticated(data.isAuthenticated);

                if (data.isAuthenticated) {
                    this.router.navigate(['/dashboard']);
                } else {
                    sessionStorage.setItem('username', '');
                    this.storeService.setLoggedInUser({} as User);
                    this.router.navigate(['/login'])
                        .then(() => {
                            location.reload();
                        });
                }
            })
        ), {dispatch: false},
    );

    constructor(
        private actions$: Actions,
        private storeService: StoreService,
        private router: Router) {
    }
}