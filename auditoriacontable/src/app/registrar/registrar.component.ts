import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.scss']
})
export class RegistrarComponent implements OnInit {

  
  registerForm!: FormGroup;
  password1: any;
  password2: any;
  
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
        rut: [
          '',
          [
            Validators.required,
            Validators.pattern('^[0-9]{1,2}\.[0-9]{3}\.[0-9]{3}[-][0-9kK]{1}$'),
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
        password2: [''],
      });
    }
    formValid() {
      return !this.registerForm.valid || this.password1 != this.password2;
    }
  
    equalPass(): boolean {
      if (this.password1 == this.password2) {
        return true;
      } else {
        return false;
      }
    }

    validarDV():boolean{
      return true //falta esto
    }
  }
