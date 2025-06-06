import { Component, inject, OnInit } from '@angular/core';
import { EncuestaService } from '../services/encuesta.service';
import { ActivatedRoute } from '@angular/router';
import { Encuesta } from '../interfaces/encuesta';
import { CommonModule } from '@angular/common';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-respuesta',
  imports: [CommonModule],
  templateUrl: './respuesta.component.html',
  styleUrl: './respuesta.component.css'
})
export class RespuestaComponent {
  encuestaService = inject(EncuestaService);
  ruta = inject(ActivatedRoute);
  id = '';
  encuesta? : Encuesta;

  ngOnInit():void {
    this.ruta.params.subscribe(params =>{
      this.id = params['id'];
    })
    this.getEncuestaById(this.id);
  }

  // respuestaForm = new FormGroup({
  //   numero : 
  // })

  getEncuestaById(id : string){
    this.encuestaService.getEncuestaById(id).subscribe((response) => {
      this.encuesta = response;
      console.log(response);
    }
  );
  }
}
