import { Component, DestroyRef, effect, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AppInitService } from 'src/app/services/app-init.service';

@Component({
  standalone: true,
  imports: [IonicModule],
  selector: 'app-loading',
  templateUrl: './loading.page.html',
  styleUrls: ['./loading.page.scss'],
})
export class  LoadingPage implements OnInit {

  dots: string = ".";
  timer?: number;

  constructor(private appInitService: AppInitService, private destroyRef: DestroyRef) {
    effect(() => {
      const isAppInit = this.appInitService.isAppInit();

      if(isAppInit){
        clearInterval(this.timer)
      }
    });
   }

  ngOnInit() {
    this.appInitService.init();
    
    this.fillDots();
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }

  fillDots(){
    this.timer = setInterval(() => {
      if(this.dots.length == 4 ){
        this.dots = "."
      }
      else{
        this.dots += "."
      }
    }, 300);
  }
}
