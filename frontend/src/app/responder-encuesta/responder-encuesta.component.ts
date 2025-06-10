import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Encuesta, Pregunta } from '../models/encuesta.model';
import { ApiService } from '../api/api.service';

@Component({
  selector: 'app-responder-encuesta',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './responder-encuesta.component.html',
  styleUrls: ['./responder-encuesta.component.css']
})
export class ResponderEncuestaComponent implements OnInit {
  encuesta!: Encuesta;
  preguntas!: Pregunta[];
  codigoRespuesta: string = '';
  encuestaEnviada: boolean = false;
  testForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private fb: FormBuilder,
    private apiService: ApiService
  ) {
    this.testForm = this.fb.group({});
  }

  ngOnInit() {
    this.codigoRespuesta = this.route.snapshot.params['codigo'];
    this.apiService.obtenerEncuesta(this.codigoRespuesta)
      .subscribe({
        next: (data) => {
          this.encuesta = data,
          this.preguntas = this.encuesta.preguntas,
          this.buildForm();
        },
        error: (err) => console.error('Error al cargar la encuesta', err)
      });
  }
  
  private buildForm() {
    const formControls: Record<string, any> = {};
    this.preguntas.forEach(pregunta => {
      if (pregunta.tipo === 'abierta') {
        formControls[`pregunta_${pregunta.numero}`] = ['', Validators.required];
      } else if (pregunta.tipo === 'opcion_multiple_seleccion_simple') {
        formControls[`pregunta_${pregunta.numero}`] = ['', Validators.required];
      } else {
        formControls[`pregunta_${pregunta.numero}`] = this.fb.array(
          pregunta.opciones.map(() => this.fb.control(false)),
          [Validators.required, Validators.minLength(1)]
        );
      }
    });
    this.testForm = this.fb.group(formControls)
  }

  getOpcionesArray(preguntaNumero: number): FormArray {
    return this.testForm.get(`pregunta_${preguntaNumero}`) as FormArray;
  }

  onSubmit() {
    if (this.testForm.valid) {
      const formValue = this.testForm.value;
      
      const respuestas = {
        codigo_respuesta: this.codigoRespuesta,
        preguntas: this.preguntas.map(pregunta => {
          if (pregunta.tipo === 'abierta') {
            return {
              numero: pregunta.numero,
              texto: formValue[`pregunta_${pregunta.numero}`]
            };
          } else if (pregunta.tipo === 'opcion_multiple_seleccion_multiple') {
            return {
              numero: pregunta.numero,
              opcionesNro: pregunta.opciones
                .filter((_, index) => formValue[`pregunta_${pregunta.numero}`][index])
                .map(opcion => opcion.numero)
            };
          } else {
            return {
              numero: pregunta.numero,
              opcionesNro: [formValue[`pregunta_${pregunta.numero}`]]
            };
          }
        })
      }

      this.apiService.enviarRespuestas(respuestas).subscribe({
        next: () => this.encuestaEnviada = true,
        error: (err) => console.error('Error al enviar:', err)
    });
      
      console.log('Respuestas procesadas:', respuestas);
    } else {
      console.log('Formulario inválido');
    }
  }
}
