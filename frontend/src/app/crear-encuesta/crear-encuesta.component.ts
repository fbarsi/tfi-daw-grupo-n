import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { QRCodeComponent } from 'angularx-qrcode';
import { ApiService } from '../api/api.service';

@Component({
  selector: 'app-crear-encuesta',
  imports: [CommonModule, RouterModule, ReactiveFormsModule, QRCodeComponent],
  templateUrl: './crear-encuesta.component.html',
  styleUrl: './crear-encuesta.component.css'
})


export class CrearEncuestaComponent {
  encuesta: FormGroup;
  mostrarQR = false;
  qrResponder = '';
  urlResultados = '';
  baseUrl = 'http://localhost:4200';
  listaTipos = [
    {value: 'abierta', label: 'Abierta'},
    {value: 'opcion_multiple_seleccion_simple', label: 'Opcion simple'},
    {value: 'opcion_multiple_seleccion_multiple', label: 'Opcion multiple'}
  ];

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private fb: FormBuilder,
    private apiService: ApiService
  ) {
    this.encuesta = this.fb.group({
      nombre: this.fb.control('Titulo encuesta'),
      preguntas: this.fb.array([this.crearPregunta()])
    });
  }

  crearPregunta() {
    return this.fb.group({
        numero: [1],
        texto: [''],
        tipo: ['abierta'],
        opciones: this.fb.array([this.crearOpcion()])
      })
  }

  crearOpcion() {
    return this.fb.group({
      numero: [1],
      texto: ['']
    })
  }

  get preguntasArray() {
    return this.encuesta.get('preguntas') as FormArray;
  }

  getOpcionesArray(preguntaId: number) {
    return this.preguntasArray.at(preguntaId).get('opciones') as FormArray;
  }

  agregarPregunta() {
    const nuevaPregunta = this.crearPregunta();
    nuevaPregunta.patchValue({
      numero: this.preguntasArray.length + 1
    });
    this.preguntasArray.push(nuevaPregunta);
  }

  eliminarPregunta(index: number) {
    this.preguntasArray.removeAt(index);
    this.preguntasArray.controls.forEach((control, i) => {
      control.patchValue({ numero: i + 1 });
    });
  }

  mostrarOpciones(preguntaId: number): boolean {
    const tipo = this.preguntasArray.at(preguntaId).get('tipo')?.value;
    return tipo !== 'abierta'
  }

  agregarOpcion(preguntaId: number) {
    const opcionesPregunta = this.getOpcionesArray(preguntaId)
    const nuevaOpcion = this.crearOpcion();
    nuevaOpcion.patchValue({
      numero: opcionesPregunta.length + 1
    });
    opcionesPregunta.push(nuevaOpcion);
  }  

  eliminarOpcion(preguntaId:number, index: number) {
    const opcionesPregunta = this.getOpcionesArray(preguntaId)
    opcionesPregunta.removeAt(index);
    opcionesPregunta.controls.forEach((control, i) => {
      control.patchValue({ numero: i + 1 });
    });
  }
  
  onSubmit() {
    if (this.encuesta.valid) {
      const encuestaTerminada = this.encuesta.value

      encuestaTerminada.preguntas.forEach((pregunta: any) => {
        if (pregunta.tipo === 'abierta') {
          pregunta.opciones = [];
        }
      });

      this.apiService.crearEncuesta(encuestaTerminada).subscribe({
        next: (res: any) => {
          console.log(res);
          this.qrResponder = `${this.baseUrl}/responder/${res.codigo_respuesta}`;
          this.urlResultados = `${this.baseUrl}/resultados/${res.codigo_resultados}`;
          
          this.mostrarQR = true;
        },
        error: (err) => console.error('Error al enviar:', err)
    });
      console.log(this.encuesta.value);
    }
  }
}
