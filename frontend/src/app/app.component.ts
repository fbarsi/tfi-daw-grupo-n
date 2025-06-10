import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CrearEncuestaComponent } from "./crear-encuesta/crear-encuesta.component";

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'mundo';
}
