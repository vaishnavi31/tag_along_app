import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppService } from 'src/app/app.service';
import { Group } from 'src/app/models/group.model';
import Swal from 'sweetalert2'
import { finalize } from 'rxjs';
import { Event } from 'src/app/models/event.model';

@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {

    isGroupLoading = false;
    groups: Group[] = [];

    isEventLoading = false;
    events: Event[] = [];

    constructor(
        private readonly http: HttpClient,
        public readonly appService: AppService
    ) { }

    ngOnInit(): void {
        this.isGroupLoading = true;
        this.http.get<Group[]>('/groups/user/' + this.appService.loggedInUser?.id)
            .pipe(finalize(() => this.isGroupLoading = false))
            .subscribe({
                next: data => this.groups = data,
                error: err => Swal.fire({
                    icon: 'error',
                    title: 'Internal Server Error',
                    text: (err && err.error) ? err.error.error : 'Something went wrong fetching group details',
                })
            });

        this.isEventLoading = true;
        this.http.get<Event[]>('/events/user/' + this.appService.loggedInUser?.id)
            .pipe(finalize(() => this.isEventLoading = false))
            .subscribe({
                next: data => this.events = data,
                error: err => Swal.fire({
                    icon: 'error',
                    title: 'Internal Server Error',
                    text: (err && err.error) ? err.error.error : 'Something went wrong fetching group details',
                })
            });
    }


    reloadPage() {
        this.ngOnInit();
    }

    leaveGroup(group: Group) {
        Swal.fire({
            title: 'Confirm Action',
            html: 'Are you sure you want to leave <b>' + group.name + '</b>?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Leave Group',
            confirmButtonColor: '#dc3545',
        }).then((result) => {
            if (result.isConfirmed) {
                group.userList = group.userList.filter(userId => userId != this.appService.loggedInUser!.id)
                this.http.put('/groups', group)
                    .subscribe({
                        next: _ => {
                            Swal.fire({
                                icon: 'success',
                                title: 'Left Group Successfully',
                                text: 'Your response have been saved successfully'
                            });
                            this.reloadPage();
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
