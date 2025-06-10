import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExportCsvService {
  private apiUrl = 'http://localhost:4200/api'; // Ajusta tu URL base

  constructor(private http: HttpClient) {}

  downloadEstadisticasCSV(codigo_resultados: string) {
    return this.http.get(
      `${this.apiUrl}/encuestas/estadisticas/csv/${codigo_resultados}`,
      { responseType: 'blob' } // 👈 Importante para archivos binarios
    );
  }
}
