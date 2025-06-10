// import { bootstrapApplication } from '@angular/platform-browser';
// import { provideHttpClient } from '@angular/common/http'; 
// import { importProvidersFrom } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { appConfig } from './app/app.config';
// import { AppComponent } from './app/app.component';


// bootstrapApplication(AppComponent,appConfig, {providers: [provideHttpClient(),importProvidersFrom(FormsModule)]},)
//   .catch((err) => console.error(err));

import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { RouterModule } from '@angular/router';

bootstrapApplication(AppComponent, {
  ...appConfig,  // 👈 Desestructura la configuración existente
  providers: [
    ...(appConfig.providers || []),  // 👈 Mantén los providers existentes de appConfig
    provideHttpClient(),              // 👈 Añade HttpClient
    importProvidersFrom(FormsModule, RouterModule.forRoot([]))  // 👈 Añade FormsModule para ngModel
  ]
}).catch((err) => console.error(err));