import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Encuesta } from '../models/encuesta.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'api';

  constructor(private http:HttpClient) { }

  crearEncuesta(encuestaData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/encuestas`, encuestaData);
  }

  obtenerEncuesta(codigo: string): Observable<Encuesta> {
    return this.http.get<Encuesta>(`${this.baseUrl}/encuestas/${codigo}`);
  }

  enviarRespuestas(respuestasData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/respuestas`, respuestasData);
  }
}
