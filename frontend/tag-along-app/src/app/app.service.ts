import { Injectable } from '@angular/core';
import { User } from './models/user.model';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'

@Injectable()
export class AppService {

    loggedInUser: User | null = null;

    constructor(private readonly router: Router) { }

    logout() {
        this.loggedInUser = null;
        this.router.navigate(['/login']);
    }
}
