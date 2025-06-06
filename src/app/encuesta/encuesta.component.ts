import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Encuesta } from '../interfaces/encuesta';
import { TiposRespuesta } from '../interfaces/enum';
import { HttpClient, HttpHeaders, } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-encuesta',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './encuesta.component.html',
  styleUrl: './encuesta.component.css'
})
export class EncuestaComponent {


  // Encuesta rellena con cosas del formulario html
  encuestaForm = new FormGroup({
    nombre: new FormControl('', [Validators.required, Validators.minLength(3)]),
    preguntas: new FormArray([
      new FormGroup({
        numero: new FormControl('1'),
        texto: new FormControl('', [Validators.required, Validators.minLength(2)]),
        tipo: new FormControl('abierta'),
        opciones: new FormArray([
          new FormGroup({
            numero: new FormControl('1'),
            texto: new FormControl('', [Validators.required, Validators.minLength(2)]),
          })
        ])
      })
    ])
  })

  get preguntas(): FormArray {
    return this.encuestaForm.get('preguntas') as FormArray;
  }

  getOpciones(preguntaIndex: number): FormArray {
    return this.preguntas.at(preguntaIndex).get('opciones') as FormArray;
  }

  crearOpcion(i: number) {
    this.getOpciones(i).push(
      new FormGroup({
        numero: new FormControl(String(this.getOpciones(i).length + 1)),
        texto: new FormControl('', [Validators.required, Validators.minLength(2)]),
      })
    );
  }

  borrarOpcion(preg: number, opcion: number) {
    this.getOpciones(preg).removeAt(opcion);
    this.getOpciones(preg).controls.forEach((control, i) => {
      (control as FormGroup).get('numero')?.setValue(String(i + 1));
    });
  }

  borrarPregunta(preg: number) {
    this.preguntas.removeAt(preg);
    this.preguntas.controls.forEach((pregunta, i) => {
      (pregunta as FormGroup).get('numero')?.setValue(i + 1);
    })
  }

  crearPregunta() {
    this.preguntas.push(
      new FormGroup({
        numero: new FormControl(this.preguntas.length + 1),
        texto: new FormControl('', [Validators.required, Validators.minLength(1)]),
        tipo: new FormControl('abierta'),
        opciones: new FormArray([
          new FormGroup({
            numero: new FormControl('1'),
            texto: new FormControl('', [Validators.required, Validators.minLength(2)]),
          })
        ])
      }) 
    );
  }

  obtenerEncuesta(encuesta: any) {
    console.log('🟡 Form value:', JSON.stringify(encuesta.value));
    return {
      ...encuesta,
      preguntas: encuesta.preguntas.map((preg: any) => {
        const pregunta: any = {
          numero: Number(preg.numero),
          texto: preg.texto,
          tipo: preg.tipo
        };

        if (preg.tipo !== 'abierta') {
          pregunta.opciones = preg.opciones.map((op: any) => ({
            numero: Number(op.numero),
            texto: op.texto
          }));
        }

        return pregunta;
      })
    };
  }

  urlBase: string = '/api/encuestas';
  private http = inject(HttpClient);


  enviarEncuesta() {
    if (this.obtenerEncuesta(this.encuestaForm.value).invalid){
      alert("La encuesta es invalida, complete todos los campos correctamente.")
      return
    }
    const encuestaCompleta: string = JSON.stringify(this.obtenerEncuesta(this.encuestaForm.value));
    console.log(encuestaCompleta)
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.post<Encuesta>(this.urlBase, encuestaCompleta, { headers }).subscribe({
      next: (res) => console.log('✅ Encuesta enviada con éxito:', res),
      error: (err) => {
        console.error('❌ Error al enviar encuesta:', err);
      }
    });
  }
}
