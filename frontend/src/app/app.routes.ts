import { Routes } from '@angular/router';
import { ResponderEncuestaComponent } from './responder-encuesta/responder-encuesta.component';
import { CrearEncuestaComponent } from './crear-encuesta/crear-encuesta.component';
import { EstadisticasComponent } from './estadisticas/estadisticas.component';
import { HomeComponent } from './home/home.component';


export const routes: Routes = [
    { path: '',
         component: HomeComponent 
    },
    {
        path: 'responder/:codigo',
        component: ResponderEncuestaComponent
    },
    {
        path: 'crear',
        component: CrearEncuestaComponent
    },
    { 
        path: 'estadisticas/:codigo',
        component: EstadisticasComponent 
    },
    


];
