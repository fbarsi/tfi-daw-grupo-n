import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChildren,
  QueryList,
  ElementRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Chart } from 'chart.js';
import { EncuestaService, Respuesta } from '../services/encuesta.service';

interface Pregunta {
  id: number;
  texto: string;
  tipo: 'simple' | 'multiple' | 'abierta';
  opciones?: string[];
}

@Component({
   standalone: true,                                      
  imports: [CommonModule],
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css']
})
export class EstadisticasComponent implements OnInit, AfterViewInit {
  @ViewChildren('chartCanvas')
  canvases!: QueryList<ElementRef<HTMLCanvasElement>>;

  encuestaId!: string;
  preguntas: Pregunta[] = [];
  respuestas: Respuesta[] = [];
  cargando = true;

  constructor(
    private route: ActivatedRoute,
    private svc: EncuestaService
  ) {}

  ngOnInit(): void {
    this.encuestaId = this.route.snapshot.paramMap.get('id')!;
    // 1) Traigo las preguntas
    this.svc
      .getEncuesta(this.encuestaId)
      .subscribe((e: { preguntas: Pregunta[] }) => {
        this.preguntas = e.preguntas;

        // 2) Una vez tengo preguntas, traigo las respuestas
        this.svc
          .getRespuestas(this.encuestaId)
          .subscribe((resps: Respuesta[]) => {
            this.respuestas = resps;
            this.cargando = false;
            this.crearGraficos();
          });
      });
  }

  ngAfterViewInit(): void {
    // no es necesario poner nada aquí
  }

  private crearGraficos(): void {
    this.canvases.forEach((canvasRef, idx) => {
      const ctx = canvasRef.nativeElement.getContext('2d')!;
      const p = this.preguntas[idx];

      if (p.tipo === 'simple' || p.tipo === 'multiple') {
        // Inicializo conteo a cero
        const conteo = p.opciones!.reduce(
          (acc, opt) => ({ ...acc, [opt]: 0 }),
          {} as Record<string, number>
        );

        // Cuento las respuestas
        this.respuestas.forEach((resp: Respuesta) => {
          if (p.tipo === 'simple' && resp.seleccionSimple) {
            conteo[resp.seleccionSimple]++;
          }
          if (p.tipo === 'multiple' && resp.seleccionMultiple) {
            resp.seleccionMultiple.forEach((opt: string) => {
              conteo[opt]++;
            });
          }
        });

        // Dibujo el gráfico de barras
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: Object.keys(conteo),
            datasets: [
              {
                label: 'Respuestas',
                data: Object.values(conteo)
              }
            ]
          },
          options: {
            responsive: true
          }
        });
      } else {
        // Para preguntas abiertas: genero un <ul> con todas las respuestas
        const lista = this.respuestas
          .map((resp: Respuesta) => resp.textoLibre)
          .filter((t): t is string => !!t)
          .map((t: string) => `<li>${t}</li>`)
          .join('');
        canvasRef.nativeElement.parentElement!.insertAdjacentHTML(
          'beforeend',
          `<ul>${lista}</ul>`
        );
      }
    });
  }

  exportarImagenes(): void {
    this.canvases.forEach((c, i) => {
      const url = c.nativeElement.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `pregunta-${i + 1}.png`;
      a.click();
    });
  }
}
