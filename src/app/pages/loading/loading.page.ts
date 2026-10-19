import { Component, DestroyRef, effect, OnInit, signal } from '@angular/core';
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

  protected dots = signal<string>(".");
  private timer?: number;

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
      if(this.dots().length == 4 ){
        this.dots.set(".")
      }
      else{
        this.dots.update(x => x += ".");
      }
    }, 300);
  }
}
