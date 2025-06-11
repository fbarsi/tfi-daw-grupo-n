import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-email',
  imports: [],
  templateUrl: './email.component.html',
  styleUrl: './email.component.css'
})
export class EmailComponent {
   @Input() id: string = '';

  email = new FormGroup({
    to: new FormControl(''),
    message: new FormControl('')
  });

  ngOnInit() {
    this.email.get('message')?.setValue(`urlcompleta`);
  }
}
