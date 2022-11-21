import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-ingresar',
  templateUrl: './ingresar.component.html',
  styleUrls: ['./ingresar.component.scss']
})
export class IngresarComponent implements OnInit {

  
  registerForm!: FormGroup;
  password1: any;
  
  constructor(private readonly fb: FormBuilder) {}
  
    ngOnInit(): void {
      this.registerForm = this.initForm();
    }
  
    onSubmit(): void {
      console.log('Form ->');
      console.log(this.registerForm.value);
    }
  
    initForm(): FormGroup {
      return this.fb.group({
        username: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(18),
          ],
        ],
        email: [
          '',
          [Validators.required, Validators.email],
        ],
        password1: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(15),
          ],
        ],
      });
    }
    
  
    
  }