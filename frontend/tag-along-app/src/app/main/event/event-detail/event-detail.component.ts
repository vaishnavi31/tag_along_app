import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppService } from 'src/app/app.service';
import Swal from 'sweetalert2'
import { Event } from 'src/app/models/event.model';
import { Router } from '@angular/router';

@Component({
    selector: 'event-detail',
    templateUrl: './event-detail.component.html',
})
export class EventDetailComponent implements OnInit {

    @Input() event!: Event;
    @Output() onStatusChange = new EventEmitter<boolean>();
    isAccepted: boolean = false;
    isInvited: boolean = false;
    isCreator: boolean = false;

    constructor(
        private readonly http: HttpClient,
        public readonly appService: AppService,
        public readonly router: Router
    ) { }

    ngOnInit(): void {
        this.isAccepted = this.event.acceptedUsers.includes(this.appService.loggedInUser!.id)
        this.isInvited = this.event.invitedUsers.includes(this.appService.loggedInUser!.id)
        this.isCreator = this.event.createdBy == this.appService.loggedInUser!.id
    }

    acceptRSVP() {
        Swal.fire({
            title: 'Confirm Action',
            text: 'Are you sure about accepting the event invite?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Accept Invite',
            confirmButtonColor: '#28a745',
        }).then((result) => {
            if (result.isConfirmed) {
                this.event.acceptedUsers.push(this.appService.loggedInUser!.id)
                this.http.put('/events', this.event)
                    .subscribe({
                        next: _ => {
                            Swal.fire({
                                icon: 'success',
                                title: 'Invitation Accepted',
                                text: 'Your response have been saved successfully'
                            });
                            this.router.navigate(['/']);
                            this.onStatusChange.emit(true);
                        },
                        error: err => {
                            Swal.fire({
                                icon: 'error',
                                title: 'Server Error',
                                text: err.error && err.error.error && 'Something went wrong. Please try again after sometime.'
                            });
                        }
                    })
            }
        })

    }

    cancelRSVP() {
        Swal.fire({
            title: 'Confirm Action',
            text: 'Are you sure about cancelling the event?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Cancel Invite',
            confirmButtonColor: '#dc3545',
        }).then((result) => {
            if (result.isConfirmed) {
                this.event.acceptedUsers = this.event.acceptedUsers.filter(userId => userId != this.appService.loggedInUser!.id)
                this.http.put('/events', this.event)
                    .subscribe({
                        next: _ => {
                            Swal.fire({
                                icon: 'success',
                                title: 'Event Cancelled',
                                text: 'Your response have been saved successfully'
                            });
                            this.router.navigate(['/']);
                            this.onStatusChange.emit(true);
                        },
                        error: err => {
                            Swal.fire({
                                icon: 'error',
                                title: 'Server Error',
                                text: err.error && err.error.error && 'Something went wrong. Please try again after sometime.'
                            });
                        }
                    })
            }
        })
    }

    tagAlong() {
        Swal.fire({
            title: 'Confirm Action',
            text: 'Are you sure to tag along in this event?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Tag Along',
            confirmButtonColor: '#28a745',
        }).then((result) => {
            if (result.isConfirmed) {
                this.event.acceptedUsers.push(this.appService.loggedInUser!.id)
                this.http.put('/events', this.event)
                    .subscribe({
                        next: _ => {
                            Swal.fire({
                                icon: 'success',
                                title: 'You are Tagged!!',
                                text: 'Your response have been saved successfully'
                            });
                            this.router.navigate(['/']);
                            this.onStatusChange.emit(true);
                        },
                        error: err => {
                            Swal.fire({
                                icon: 'error',
                                title: 'Server Error',
                                text: err.error && err.error.error && 'Something went wrong. Please try again after sometime.'
                            });
                        }
                    })
            }
        })
    }

}
