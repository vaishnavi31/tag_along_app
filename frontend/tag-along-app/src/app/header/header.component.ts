import { Component } from '@angular/core';
import { AppService } from '../app.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
})
export class HeaderComponent {
    constructor(
        public readonly appService: AppService,
    ) { }
}

