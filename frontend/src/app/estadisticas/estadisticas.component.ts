import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChildren,
  QueryList,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Chart } from 'chart.js';
import { ApiService } from '../api/api.service';
import { Encuesta, Pregunta } from '../models/encuesta.model';

interface ExtendedCanvasElement extends HTMLCanvasElement {
  chart?: Chart;
}

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css'],
})
export class EstadisticasComponent implements OnInit, AfterViewInit {
  @ViewChildren('chartCanvas')
  canvases!: QueryList<ElementRef<HTMLCanvasElement>>;

  codigoResultados: string = '';
  encuesta!: Encuesta;
  cargando = true;

  constructor(private route: ActivatedRoute, private apiService: ApiService) {}

  ngOnInit(): void {
    this.codigoResultados = this.route.snapshot.params['codigo'];
    this.apiService.obtenerEstadisticas(this.codigoResultados).subscribe({
      next: (data) => {
        data.preguntas.forEach((pregunta: Pregunta) => {
          if (pregunta.tipo === 'verdadero_falso' && pregunta.respuestasVFAgrupadas) {
            pregunta.respuestasVFAgrupadas.verdadero = Number(pregunta.respuestasVFAgrupadas.verdadero || 0);
            pregunta.respuestasVFAgrupadas.falso = Number(pregunta.respuestasVFAgrupadas.falso || 0);
          }
          if (pregunta.opciones) {
            pregunta.opciones.forEach(opcion => {
              opcion.totalRespuestas = Number(opcion.totalRespuestas || 0);
            });
          }
        });
        this.encuesta = data;
        this.cargando = false;
        setTimeout(() => {
          this.crearGraficos();
        }, 0);
      },
      error: (err) => {
        console.error('Error al cargar la encuesta', err);
        this.cargando = false;
      },
    });
  }

  ngAfterViewInit(): void {
    this.canvases.changes.subscribe(() => this.crearGraficos());
  }

  private crearGraficos(): void {
    if (!this.encuesta || !this.canvases) return;

    const preguntasConGrafico = this.encuesta.preguntas.filter((pregunta) =>
      pregunta.tipo === 'opcion_multiple_seleccion_multiple' ||
      pregunta.tipo === 'opcion_multiple_seleccion_simple' ||
      pregunta.tipo === 'verdadero_falso'
    );

    this.canvases.forEach((canvasRef, idx) => {
      const pregunta = preguntasConGrafico[idx];
      const canvas = canvasRef.nativeElement as ExtendedCanvasElement;
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      if (canvas.chart) {
        canvas.chart.destroy();
      }

      if (pregunta.tipo === 'opcion_multiple_seleccion_multiple') {
        if (pregunta.opciones) {
            this.crearBarChartHorizontal(ctx, pregunta, canvas);
        }
      } else if (pregunta.tipo === 'opcion_multiple_seleccion_simple' || pregunta.tipo === 'verdadero_falso') {
          this.crearPieChart(ctx, pregunta, canvas);
      }
    });
  }

  private crearBarChartHorizontal(
    ctx: CanvasRenderingContext2D,
    pregunta: Pregunta,
    canvas: ExtendedCanvasElement
  ): void {
    const opcionesOrdenadas = pregunta.opciones ? [...pregunta.opciones].sort(
      (a, b) => a.numero - b.numero
    ) : [];

    const newChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: opcionesOrdenadas.map((op) => op.texto),
        datasets: [
          {
            label: 'Respuestas',
            data: opcionesOrdenadas.map((op) => op.totalRespuestas),
            backgroundColor: 'rgba(54, 162, 235, 0.7)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              precision: 0,
            },
          },
        },
        plugins: {
          title: {
            display: true,
            text: `Pregunta ${pregunta.numero}: ${pregunta.texto}`,
            font: {
              size: 16,
            },
            padding: {
              top: 10,
              bottom: 20,
            },
          },
          legend: {
            display: false,
          },
        },
      },
    });
    canvas.chart = newChart
  }

  private crearPieChart(
    ctx: CanvasRenderingContext2D,
    pregunta: Pregunta,
    canvas: ExtendedCanvasElement
  ): void {
    let labels: string[];
    let data: number[];

    if (pregunta.tipo === 'verdadero_falso' && pregunta.respuestasVFAgrupadas) {
      labels = ['Verdadero', 'Falso'];
      data = [
        pregunta.respuestasVFAgrupadas.verdadero,
        pregunta.respuestasVFAgrupadas.falso,
      ];
    } else if (pregunta.opciones) {
      const opcionesOrdenadas = [...pregunta.opciones].sort(
        (a, b) => a.numero - b.numero
      );
      labels = opcionesOrdenadas.map((op) => op.texto);
      data = opcionesOrdenadas.map((op) => op.totalRespuestas);
    } else {
        labels = ['N/A'];
        data = [0];
    }

    const backgroundColors = [
      'rgba(255, 99, 132, 0.7)',
      'rgba(54, 162, 235, 0.7)',
      'rgba(255, 206, 86, 0.7)',
      'rgba(75, 192, 192, 0.7)',
      'rgba(153, 102, 255, 0.7)',
      'rgba(255, 159, 64, 0.7)',
    ];

    const newChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: backgroundColors.slice(
              0,
              labels.length
            ),
            borderColor: '#fff',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: `Pregunta ${pregunta.numero}: ${pregunta.texto}`,
            font: {
              size: 16,
            },
            padding: {
              top: 10,
              bottom: 20,
            },
          },
          legend: {
            position: 'right',
            labels: {
              padding: 20,
              usePointStyle: true,
              pointStyle: 'circle',
            },
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.label || '';
                const value = context.raw || 0;
                const total = (context.dataset.data as number[]).reduce((a, b) => a + b, 0);
                const percentage = total > 0 ? Math.round((+value / total) * 100) : 0;
                return `${label}: ${value} (${percentage}%)`;
              },
            },
          },
        },
      },
    });
    canvas.chart = newChart
  }

  exportarCSV() {
    this.apiService.obtenerCSV(this.codigoResultados).subscribe({
      next: (blob) => {
        this.manejarDescarga(blob)
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

  manejarDescarga(blob: Blob): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `estadisticas_${this.codigoResultados}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }


  getTotalRespuestas(pregunta: Pregunta): number {
    if (pregunta.tipo === 'abierta') {
      return pregunta.respuestas_abiertas?.length ?? 0;
    } else if (pregunta.tipo === 'verdadero_falso' && pregunta.respuestasVFAgrupadas) {
      return pregunta.respuestasVFAgrupadas.verdadero + pregunta.respuestasVFAgrupadas.falso;
    }
    return pregunta.opciones?.reduce(
      (total, opcion) => total + (opcion.totalRespuestas || 0),
      0
    ) ?? 0;
  }
}