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

  obtenerEncuesta(codigo_respuesta: string): Observable<Encuesta> {
    return this.http.get<Encuesta>(`${this.baseUrl}/encuestas/${codigo_respuesta}`);
  }

  obtenerEncuestaPorCodigoResultados(codigo_resultados: string): Observable<Encuesta> {
    return this.http.get<Encuesta>(`${this.baseUrl}/encuestas/estadisticas/${codigo_resultados}`);
  }


  enviarRespuestas(respuestasData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/respuestas`, respuestasData);
  }

  obtenerEstadisticas(codigo_resultados: string): Observable<Encuesta> {
    return this.http.get<Encuesta>(`${this.baseUrl}/encuestas/estadisticas/${codigo_resultados}`);
  }

  obtenerRespuestasDeEncuesta(codigo_resultados: string, page: number, limit: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/encuestas/respuestas/${codigo_resultados}?page=${page}&limit=${limit}`);
  }

  obtenerCSV(codigo_resultados: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/encuestas/estadisticas/csv/${codigo_resultados}`, {responseType: 'blob'});
  }

  enviarMail(email :{ to: string, message: string }) : Observable<any>{
    return this.http.post<{ to: string, message: string }>("/api/email/send", email)
  }
}