import {inject} from "@angular/core";
import {Router} from "@angular/router";
import {AuthFacadeService} from "./service/auth.facade";

export const authorizationGuard = () => {
    const authFacadeService = inject(AuthFacadeService);
    const router = inject(Router);

    authFacadeService.getSession().subscribe(s => {
        if (!s) {
            router.navigate(['/unauthorized']);
            return false;
        }

        return true;
    })
};