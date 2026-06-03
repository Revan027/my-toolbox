import { Component } from '@angular/core';
import { DashboardService } from 'src/app/services/entities/dashboard-service';

@Component({
    standalone: false,
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {

    displayDashboard?: boolean = undefined;

    constructor(private dashboardService: DashboardService) { }

    onDisplayDashboard(){
      this.displayDashboard = !this.displayDashboard;
    }

    onAnimationDone(event: any){
      if (this.displayDashboard === false){
        this.displayDashboard = undefined;
      }
    }
}
