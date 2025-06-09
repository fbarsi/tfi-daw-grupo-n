import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Injectable } from '@angular/core';
import { Encuesta } from '../interfaces/encuesta';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EncuestaService {

  urlBase: string = '/api/encuestas/';
  private http = inject(HttpClient);
 
  getEncuestaById(id: string): Observable<Encuesta> {
    return this.http.get<Encuesta>(`${this.urlBase}${id}`);
  }
}
