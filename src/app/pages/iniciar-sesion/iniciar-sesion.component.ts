import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
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
}
