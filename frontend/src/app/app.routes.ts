import { Routes } from '@angular/router';
import { ResponderEncuestaComponent } from './responder-encuesta/responder-encuesta.component';

export const routes: Routes = [
    {
        path: 'responder/:codigo',
        component: ResponderEncuestaComponent
    }
];
