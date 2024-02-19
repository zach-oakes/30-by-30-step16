import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {AuthFacadeService} from "../service/auth.facade";
import {BehaviorSubject} from "rxjs";
import {User} from "../model/user";

@Component({
    selector: 'app-create-account',
    templateUrl: './create-account.component.html',
    styleUrl: './create-account.component.css'
})
export class CreateAccountComponent {
    hidePassword = true;
    hideConfirmPassword = true;
    username = '';
    password = '';
    confirmPassword = '';
    accountExists = false;
    private existingUserAccount$: BehaviorSubject<User | undefined> = new BehaviorSubject<User | undefined>(undefined);
    private account: User | undefined = undefined;

    constructor(private authFacadeService: AuthFacadeService,
                private router: Router) {
        this.existingUserAccount$ = this.authFacadeService.getExistingUserAccount();
        this.existingUserAccount$.subscribe(u => this.account = u);
    }

    createAccount(): void {
        this.authFacadeService.getUser({
            username: this.username,
            password: this.password,
        });

        if (this.account) {
            this.accountExists = true;
            return;
        }

        this.authFacadeService.createUser(this.username, this.password);
    }

    get isDisabled(): boolean {
        return this.isEmpty ||
            !this.passwordsAreEqual ||
            !this.hasSpecialCharacter ||
            !this.hasUppercase ||
            !this.hasCorrectPasswordLength;
    }

    private get isEmpty(): boolean {
        return this.username === '' ||
            this.username === undefined ||
            this.password === '' ||
            this.password === undefined;
    }

    private get passwordsAreEqual(): boolean {
        return this.password === this.confirmPassword;
    }

    private get hasSpecialCharacter(): boolean {
        const regex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

        return regex.test(this.password) || regex.test(this.confirmPassword);
    }

    private get hasUppercase(): boolean {
        const regex = /[A-Z]+/;

        return regex.test(this.password) || regex.test(this.confirmPassword);
    }

    private get hasCorrectPasswordLength(): boolean {
        return this.password.length >= 5 || this.confirmPassword.length >= 5;
    }

}
