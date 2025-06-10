import { Component } from '@angular/core';
import { ExportCsvService } from '../../services/export-csv.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';


@Component({
  standalone: true,
  selector: 'app-export-csv',
  imports: [ FormsModule , CommonModule ,NgIf],
  templateUrl: './export-csv.component.html',
  styleUrl: './export-csv.component.css'
})
export class ExportCsvComponent {
  codigoResultados: string = '';
  error: string = '';

  constructor(private exportService: ExportCsvService) {}

  downloadCSV() {
    if (!this.codigoResultados) {
      this.error = 'Por favor ingresa un código válido';
      return;
    }

    this.exportService.downloadEstadisticasCSV(this.codigoResultados).subscribe({
      next: (blob) => {
        this.handleDownload(blob);
        this.error = '';
      },
      error: (err) => {
        this.error = 'Error al descargar: ' + err.message;
      }
    });
  }

  private handleDownload(blob: Blob) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `estadisticas_${this.codigoResultados}.csv`;
    a.click();
    window.URL.revokeObjectURL(url); // Liberar memoria
  }
}
