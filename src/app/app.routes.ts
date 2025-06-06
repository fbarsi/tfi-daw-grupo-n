import { Routes } from '@angular/router';
import { RespuestaComponent } from './respuesta/respuesta.component';
import { EncuestaComponent } from './encuesta/encuesta.component';

export const routes: Routes = [
    {path: 'respuesta/:id', component: RespuestaComponent},
    { path: '', component: EncuestaComponent }
];
