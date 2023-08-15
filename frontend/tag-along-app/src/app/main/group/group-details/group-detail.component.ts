import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Group } from 'src/app/models/group.model';
import { concatMap, delay, finalize } from 'rxjs';
import Swal from 'sweetalert2';
import { AppService } from 'src/app/app.service';
import { Event } from 'src/app/models/event.model';

@Component({
    selector: 'group-detail',
    templateUrl: './group-detail.component.html',
})
export class GroupDetailComponent implements OnInit {

    groupData!: Group
    events: Event[] = []
    isGroupLoading: boolean = false;
    isEventLoading: boolean = false;

    constructor(
        private readonly http: HttpClient,
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly appService: AppService
    ) { }

    ngOnInit(): void {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.route.params.subscribe(params => this.initScreen(params['id']))
    }

    initScreen(groupID: string) {
        this.isGroupLoading = true;
        this.isEventLoading = true;
        this.http.get<Group>('/groups/' + groupID)
            .pipe(finalize(() => this.isGroupLoading = false))
            .subscribe({
                next: data => this.groupData = data,
                error: err => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Server Error',
                        html: err.error && err.error.error && 'Something went wrong fetching the group details!<br>Please try again!!'
                    })
                    this.router.navigate(['/']);
                }
            })
        this.http.get<Event[]>('/events/group/' + groupID)
            .pipe(finalize(() => this.isEventLoading = false))
            .subscribe({
                next: data => this.events = data,
                error: err => Swal.fire({
                    icon: 'error',
                    title: 'Internal Server Error',
                    text: (err && err.error) ? err.error.error : 'Something went wrong fetching group events',
                })
            });
    }

}
