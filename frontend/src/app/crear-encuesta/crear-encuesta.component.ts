import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { QRCodeComponent } from 'angularx-qrcode';
import { Validators } from '@angular/forms';
import { ApiService } from '../api/api.service';

@Component({
  selector: 'app-crear-encuesta',
  imports: [CommonModule, RouterModule, ReactiveFormsModule, QRCodeComponent],
  templateUrl: './crear-encuesta.component.html',
  styleUrl: './crear-encuesta.component.css'
})
export class CrearEncuestaComponent implements OnInit {
  encuesta: FormGroup;
  mostrarQR = false;
  qrResponder = '';
  urlResultados = '';
  baseUrl = 'http://localhost:4200';
  listaTipos = [
    { value: 'abierta', label: 'Abierta' },
    { value: 'opcion_multiple_seleccion_simple', label: 'Opción simple' },
    { value: 'opcion_multiple_seleccion_multiple', label: 'Opción múltiple' },
    { value: 'verdadero_falso', label: 'Verdadero/Falso' }
  ];

  //configuraciones del correo
  urlActual = '';
  email = new FormGroup({
    to: new FormControl('', [Validators.required, Validators.email]),
    message: new FormControl('')
  });
  ngOnInit(): void {
    this.urlActual = window.location.href;
  }
  //
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private fb: FormBuilder,
    private apiService: ApiService
  ) {
    this.encuesta = this.fb.group({
      nombre: this.fb.control('', [Validators.required, Validators.minLength(2)]),
      preguntas: this.fb.array([this.crearPregunta()]),
      fechaVencimiento: this.fb.control<string | null>(null)
    });
  }

  crearPregunta() {
    return this.fb.group({
      numero: [1],
      texto: ['', [Validators.required, Validators.minLength(2)]],
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
    return tipo === 'opcion_multiple_seleccion_simple' || tipo === 'opcion_multiple_seleccion_multiple';
  }

  agregarOpcion(preguntaId: number) {
    const opcionesPregunta = this.getOpcionesArray(preguntaId)
    const nuevaOpcion = this.crearOpcion();
    nuevaOpcion.patchValue({
      numero: opcionesPregunta.length + 1
    });
    opcionesPregunta.push(nuevaOpcion);
  }

  eliminarOpcion(preguntaId: number, index: number) {
    const opcionesPregunta = this.getOpcionesArray(preguntaId)
    opcionesPregunta.removeAt(index);
    opcionesPregunta.controls.forEach((control, i) => {
      control.patchValue({ numero: i + 1 });
    });
  }

  onSubmit() {
    if (this.encuesta.valid) {
      const encuestaTerminada = this.encuesta.value;

      encuestaTerminada.preguntas.forEach((pregunta: any) => {
        if (pregunta.tipo === 'abierta' || pregunta.tipo === 'verdadero_falso') {
          pregunta.opciones = [];
        }
      });

      this.apiService.crearEncuesta(encuestaTerminada).subscribe({
        next: (res: any) => {
          console.log(res);
          this.qrResponder = `${this.baseUrl}/responder/${res.codigo_respuesta}`;
          this.urlResultados = `${this.baseUrl}/estadisticas/${res.codigo_resultados}`;

          this.mostrarQR = true;
          this.enviarEmail(res)
        },
        error: (err) => console.error('Error al enviar:', err)
      });
      console.log(this.encuesta.value);
    }
  }

  enviarEmail(res: any) {
    const urlConCodigo = `${this.urlActual}respuesta/${res.codigo_respuesta}`;
    this.email.get('message')?.setValue(urlConCodigo);

    if (this.email.valid) {
      const emailEnviar = this.email.value;
      console.log(emailEnviar)
      this.http.post<{ to: string, message: string }>("/api/email/send", emailEnviar).subscribe({
        next: (res) => { console.log('Email enviado') },
        error: (err) => {
          console.error(err);
        }
      })
    }
  }
}