import {Component} from '@angular/core';
import {AuthFacadeService} from "../service/auth.facade";

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
    username: string | null = '';

    constructor(private authFacadeService: AuthFacadeService) {
        this.authFacadeService.getLoggedInUser()
            .subscribe(u => {
                this.username = u?.username ?? sessionStorage.getItem('username');
            });
    }
}
