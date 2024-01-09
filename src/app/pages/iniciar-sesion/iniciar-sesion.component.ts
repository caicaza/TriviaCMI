import { Component, ViewChild, ElementRef, OnInit,  } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ConstantsService } from 'src/app/constants.service';

@Component({
  selector: 'app-iniciar-sesion',
  templateUrl: './iniciar-sesion.component.html',
  styleUrls: ['./iniciar-sesion.component.css'],
})
export class IniciarSesionComponent implements OnInit {
  isLogin: boolean = true;
  isVideoEnded: boolean = false;

  @ViewChild('videoHorizontal') videoHorizontal!: ElementRef;
  @ViewChild('videoVertical') videoVertical!: ElementRef;

  constructor(private constantsService: ConstantsService) {}

  ngOnInit(): void {
    this.constantsService.loading(false);
  }

  playVideo(video: any) {
    if (video) {
      video.play();
    }
  }

  cambiarBoolLogin(nuevoValor: boolean) {
    this.isLogin = nuevoValor;
  }

  vidEnded() {
    console.log('Entro al video');
    this.isVideoEnded = true;
  }

  isIOS(): boolean {
    var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    var isAppleDevice = navigator.userAgent.includes('Macintosh');

    var isTouchScreen = navigator.maxTouchPoints >= 1; // true for iOS 13 (and hopefully beyond)

    return isIOS || (isAppleDevice && (isTouchScreen || this.iOS1to12quirk()));  }

    iOS1to12quirk() {

      var audio = new Audio(); // temporary Audio object
  
      audio.volume = 0.5; // has no effect on iOS <= 12
  
      return audio.volume === 1;
  
    };

    onVideoClick() {
      if (this.isIOS()) {
        const videoH = this.videoHorizontal.nativeElement as HTMLVideoElement;        
        videoH.play();
        videoH.controls = false;

        const videoV = this.videoVertical.nativeElement as HTMLVideoElement;
        videoV.play();
        videoV.controls = false;
      }
    }
}
