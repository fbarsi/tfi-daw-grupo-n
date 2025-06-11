import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Respuesta {
  preguntaId: number;
  seleccionSimple?: string;
  seleccionMultiple?: string[];
  textoLibre?: string;
}

@Injectable({ providedIn: 'root' })
export class EncuestaService {
  private apiUrl = 'http://localhost:3000/api'; // ajusta la URL de tu backend

  constructor(private http: HttpClient) {}

  /** Trae una encuesta con su lista de preguntas */
  getEncuesta(id: string): Observable<{ preguntas: any[] }> {
    return this.http.get<{ preguntas: any[] }>(
      `${this.apiUrl}/encuestas/${id}`
    );
  }

  /** Trae todas las respuestas de esa encuesta */
  getRespuestas(id: string): Observable<Respuesta[]> {
    return this.http.get<Respuesta[]>(
      `${this.apiUrl}/encuestas/${id}/respuestas`
    );
  }
}
