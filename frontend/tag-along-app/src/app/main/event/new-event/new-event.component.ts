import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AppService } from 'src/app/app.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
    selector: 'new-event',
    templateUrl: './new-event.component.html',
})
export class NewEventComponent implements OnInit {

    eventForm!: FormGroup;

    constructor(
        private readonly fb: FormBuilder,
        private readonly http: HttpClient,
        private readonly appService: AppService,
        private readonly router: Router,
        private readonly route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.route.params.subscribe(params => {
            const groupID = params['id'];
            this.eventForm = this.fb.group({
                'name': ['', Validators.required],
                'description': ['', Validators.required],
                'groupId': [groupID, Validators.required],
                'createdBy': [this.appService.loggedInUser!.id, Validators.required],
                'startTime': ['', Validators.required],
                'duration': ['', Validators.required],
                'invitedUsers': this.fb.array([
                    this.fb.control(this.appService.loggedInUser?.email, [Validators.required])
                ], [Validators.required]),
                'acceptedUsers': [[this.appService.loggedInUser?.email]]
            });
        })
    }

    get emailFormArray(): FormArray {
        return this.eventForm.get('invitedUsers') as FormArray;
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
        if (!this.eventForm.valid) return;
        const body = { ...this.eventForm.value }
        body.startTime = body.startTime + ':00Z'
        this.http.post('/events', body).subscribe({
            next: _ => {
                Swal.fire({
                    icon: 'success',
                    title: 'Event Created Successfully',
                });
                this.router.navigate(['/'])
            },
            error: err => {
                Swal.fire({
                    icon: 'error',
                    title: 'Event Creation Failed',
                    text: err.error && err.error.error && 'Something went wrong. Please try again after sometime!'
                });
            }
        })
    }

}
