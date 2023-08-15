import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';
import { AppService } from 'src/app/app.service';

@Component({
    selector: 'register',
    templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit {

    registrationForm!: FormGroup;

    constructor(
        private readonly fb: FormBuilder,
        private readonly httpClient: HttpClient,
        private readonly router: Router,
        private readonly appService: AppService,
    ) { }

    ngOnInit(): void {
        this.appService.loggedInUser = null;
        this.registrationForm = this.fb.group({
            'name': ['', Validators.required],
            'email': ['', [Validators.required, Validators.email]],
            'gender': ['', Validators.required],
            'dateOfBirth': ['', Validators.required],
            'password': ['', [Validators.required]],
            'confirmPassword': ['', Validators.required]
        });
    }

    onSubmit() {
        if (this.registrationForm.invalid) return;
        const formValues = this.registrationForm.value;
        if (formValues['password'] != formValues['confirmPassword']) {
            Swal.fire({
                icon: 'error',
                title: 'Password Didn\'t Match',
                text: 'Please cross check the passwords entered',
            });
            return;
        }
        formValues['dateOfBirth'] = (new Date(formValues['dateOfBirth'])).toISOString();
        delete formValues['confirmPassword'];
        this.httpClient.post('/users', formValues).subscribe({
            next: data => {
                Swal.fire({
                    icon: 'success',
                    title: 'Registration Success',
                    text: 'Account registered successfully!',
                });
                this.router.navigate(['/']);
            },
            error: err => {
                Swal.fire({
                    icon: 'error',
                    title: 'Registration Failed',
                    text: (err && err.error) ? err.error.error : 'Please verify the details and try agin after sometime!',
                });
            }
        })
    }

}
