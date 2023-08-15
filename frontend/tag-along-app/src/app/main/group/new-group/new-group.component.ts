import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AppService } from 'src/app/app.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
    selector: 'new-group',
    templateUrl: './new-group.component.html',
})
export class NewGroupComponent implements OnInit {

    groupForm!: FormGroup;
    users: any[] = [];

    constructor(
        private readonly fb: FormBuilder,
        private readonly http: HttpClient,
        private readonly appService: AppService,
        private readonly router: Router
    ) { }

    ngOnInit(): void {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.groupForm = this.fb.group({
            'name': ['', Validators.required],
            'description': ['', Validators.required],
            'isPublic': [true],
            'createdBy': [this.appService.loggedInUser?.id],
            'userList': this.fb.array([
                this.fb.control(this.appService.loggedInUser?.email, [Validators.required])
            ], [Validators.required]),
            'eventList': [[]]
        });
    }

    get emailFormArray(): FormArray {
        return this.groupForm.get('userList') as FormArray;
    }

    createUserInput(): FormControl {
        return this.fb.control('', [Validators.required, Validators.email]);
    }

    addUserInput(): void {
        this.emailFormArray.push(this.createUserInput());
    }

    removeUserInput(index: number): void {
        this.emailFormArray.removeAt(index);
    }

    onSubmit(): void {
        if (!this.groupForm.valid) return;
        this.http.post('/groups', this.groupForm.value).subscribe({
            next: _ => {
                Swal.fire({
                    icon: 'success',
                    title: 'Group Created Successfully',
                });
                this.router.navigate(['/'])
            },
            error: _ => {
                Swal.fire({
                    icon: 'error',
                    title: 'Group Creation Failed',
                    text: 'Something went wrong. Please try again after sometime!'
                });
            }
        })
    }
}
