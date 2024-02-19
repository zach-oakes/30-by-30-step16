import {createAction, props} from "@ngrx/store";
import {User} from "./model/user";
import {Session} from "./model/session";

export const createUser = createAction(
    '[User Service] Create User',
    props<{ username: string, password: string}>()
);

export const getUser = createAction(
    '[User Service] Find User',
    props<{ user: User}>()
);

export const setLoggedInUser = createAction(
    '[Auth Service] Set LoggedIn User',
    props<{ user: User }>()
);

export const setAuthenticatedFlag = createAction(
    '[Auth Service] Set Authenticated',
    props<{ isAuthenticated: boolean}>()
);

export const setSession = createAction(
    '[Session Service] Set Session',
    props<{ session: Session}>()
)

export const deleteSession = createAction(
    '[Session Service] Delete Session',
    props<{ id : string}>()
);