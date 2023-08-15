import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';

@Component({
    selector: 'user-pill',
    templateUrl: 'user-pill.component.html',
})
export class UserPillComponent implements OnInit {
    @Input() userID: string = '';

    constructor(private readonly httpClient: HttpClient) { }

    user!: User;

    ngOnInit(): void {
        this.httpClient.get<User>('/users/' + this.userID).subscribe(data => this.user = data);
    }

}
