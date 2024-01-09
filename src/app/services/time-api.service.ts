import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimeApiService {
  private apiUrl = 'https://worldtimeapi.org/api/timezone/Europe/London'; // URL de la API de WorldTimeAPI

  constructor(private http: HttpClient) {}

  getLondonTime(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
