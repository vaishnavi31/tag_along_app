import { Pipe, PipeTransform } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Group } from 'src/app/models/group.model';

@Pipe({
    name: 'groupName'
})
export class GroupNamePipe implements PipeTransform {

    constructor(private http: HttpClient) { }

    transform(groupID: string): Observable<string> {
        return this.http.get<Group>('/groups/' + groupID).pipe(map(data => data.name));
    }

}
