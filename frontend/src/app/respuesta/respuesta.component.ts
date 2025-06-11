import { Component, inject, OnInit } from '@angular/core';
import { EncuestaService } from '../services/encuesta.service';
import { ActivatedRoute } from '@angular/router';
import { Encuesta } from '../interfaces/encuesta';
import { CommonModule } from '@angular/common';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { every } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Respuestas } from '../interfaces/respuestas';

@Component({
  selector: 'app-respuesta',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './respuesta.component.html',
  styleUrl: './respuesta.component.css'
})
export class RespuestaComponent implements OnInit {
  encuestaService = inject(EncuestaService);
  ruta = inject(ActivatedRoute);
  urlBase: string = '/api/respuestas';
  private http = inject(HttpClient);

  id = ''; // codigo de la encuesta en url
  encuesta!: Encuesta; // encuesta con sus preguntas y opciones

  respuesta = new FormGroup({
    codigo_respuesta: new FormControl(''),
    preguntas: new FormArray([])
  })

  

  ngOnInit(): void {
    this.ruta.params.subscribe(params => {
      this.id = params['id'];
      this.respuesta.get('codigo_respuesta')?.setValue(this.id);
      this.getEncuestaById(this.id);
    })
  }



  private crearForm(preguntas: any[]) {
    const preguntasArray = this.respuesta.get('preguntas') as FormArray;

    preguntas.forEach(p => {
      let controls: any = {
        numero: new FormControl(p.numero),
      };

      if (p.tipo === 'abierta') {
        controls.texto = new FormControl('', [Validators.required])
      } else {
        controls.opcionesNro = new FormArray([], [Validators.required])
      }

      preguntasArray.push(new FormGroup(controls));
    });
  }


  onCheckChange(e: any, preguntaIndex: number) {
    const preguntasArray = this.respuesta.get('preguntas') as FormArray;
    const preguntaGroup = preguntasArray.at(preguntaIndex) as FormGroup;
    const formArray = preguntaGroup.get('opcionesNro') as FormArray;

    if (this.encuesta.preguntas[preguntaIndex].tipo === 'opcion_multiple_seleccion_simple') {
      if (e.target.checked) {
        formArray.clear();
        formArray.push(new FormControl(e.target.value));
      }
    } else {

      // seleccionadas
      if (e.target.checked) {
        formArray.push(new FormControl(e.target.value));
      }
      // deseleccionar 
      else {
        // encontrar el input deseleccionado
        let i: number = 0;
        formArray.controls.forEach((ctrl) => {
          if (ctrl.value == e.target.value) {
            formArray.removeAt(i);
          }
          i++;
        });
      }
    }
  }

  get preguntas(): FormArray {
    return this.respuesta.get('preguntas') as FormArray;
  }

  get opciones(): FormArray {
    return this.preguntas.get('opcionesNro') as FormArray;
  }

  getEncuestaById(id: string) {
    this.encuestaService.getEncuestaById(id).subscribe((response) => {
      this.encuesta = response;
      // console.log(response);
      this.crearForm(this.encuesta.preguntas);
    }
    );
  }


  obtenerRespuesta(raw: any) {
    console.log('🟡 Form value:', raw.value);
    return {
      ...raw,
      //por cada pregunta
      preguntas: raw.preguntas.map((pregunta: any) => {
        const respuesta: any = {
          numero: Number(pregunta.numero),
          texto: pregunta.texto
        };

        if (pregunta.opcionesNro && pregunta.opcionesNro.length >= 1) {
          respuesta.opcionesNro = pregunta.opcionesNro.map((opN: any) => Number(opN));
          //necesito que si la respuesta tiene texto vacio "" le borre el elemento "texto"
          delete respuesta.texto;
        }

        return respuesta;
      })
    }
  }

  enviarRespuesta() {
    if (this.respuesta.invalid) {
      alert("La encuesta es invalida, complete todos los campos correctamente.")
      return
    }

    let respuestaAEnviar: string = JSON.stringify(this.obtenerRespuesta(this.respuesta.value));

    console.log(respuestaAEnviar);

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.post<Respuestas>((this.urlBase), respuestaAEnviar, { headers }).subscribe({
      next: (res) => {
        console.log('✅ Respuesta enviada con éxito:', res);
      },
      error: (err) => {
        console.error('❌ Error al enviar respuesta:', err);
        return
      }
    })
  }



  //   {
  //   "codigo_respuesta": "9b9189cb-cc7d-4d4c-a1c4-f39652179272",
  //   "preguntas": [{
  //     "numero":1,
  //     "opcionesNro":[1,2] o "texto":"dsadjasd"
  //   }]
  // }
}
