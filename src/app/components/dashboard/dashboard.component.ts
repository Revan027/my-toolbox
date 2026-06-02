import { Component } from '@angular/core';

@Component({
    standalone: false,
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {

    displayDashboard?: boolean = undefined;

    constructor() { }

    onDisplayDashboard(){
        this.displayDashboard = !this.displayDashboard;
    }

    onAnimationDone(event: any){
      if (this.displayDashboard === false){console.log("f")
        this.displayDashboard = undefined;
      }
    }
}
