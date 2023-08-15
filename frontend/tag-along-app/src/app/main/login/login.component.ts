import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { User } from 'src/app/models/user.model';


@Component({
    selector: 'login',
    templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {

    public loginForm!: FormGroup;

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly httpClient: HttpClient,
        private readonly router: Router,
        private readonly appService: AppService
    ) { }

    ngOnInit(): void {
        this.appService.logout();
        this.loginForm = this.formBuilder.group({
            'email': ['', [Validators.required, Validators.email]],
            'password': ['', [Validators.required]],
        });
    }

    onSubmit(): void {
        if (this.loginForm.invalid) {
            Swal.fire({
                icon: 'error',
                title: 'Login Failed!',
                text: 'Please check your credentials!',
            });
            return;
        }

        const email = this.loginForm.controls['email'].value;
        const password = this.loginForm.controls['password'].value;

        let params = new HttpParams();
        params = params.append('userEmail', email);
        params = params.append('password', password);
        this.httpClient.get<User>('/users/validate', { params })
            .subscribe({
                next: (data) => {
                    this.appService.loggedInUser = data;
                    this.router.navigate(['/']);
                },
                error: (err) => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Login Failed',
                        text: 'Please verify your credentials',
                    });
                }
            });
    }

}
