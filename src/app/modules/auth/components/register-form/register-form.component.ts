import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '@services/auth.service';

import { CustomValidators } from '@utils/validators';
import { RequestStatus } from '@models/request-status';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
})
export class RegisterFormComponent {

  form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.minLength(8), Validators.required]],
    confirmPassword: ['', [Validators.required]],
  }, {
    validators: [ CustomValidators.MatchValidator('password', 'confirmPassword') ]
  });

  formUser = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required]]
  });

  status: RequestStatus = 'init';
  statusUser: RequestStatus = 'init';

  faEye = faEye;
  faEyeSlash = faEyeSlash;
  showPassword = false;
  showRegister = false;

  message: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  register() {
    if (this.form.valid) {
      this.status = 'loading';
      const { name, email, password } = this.form.getRawValue();
      this.authService.register(name, email, password)
      .subscribe({
        next: () => {
          this.status = 'success';
        this.router.navigate(['/login']);
        },
        error: (error) => {
          if(error.error.code === 'SQLITE_CONSTRAINT_UNIQUE'){
            this.message = 'This user already exists. Do you want to Login?';
          }

          this.status = 'failed';
          console.log(error);
        }
      })

    } else {
      this.form.markAllAsTouched();
    }
  }

  validateUser(){
    if(this.formUser.valid){
      this.statusUser = 'success';
      const { email } = this.formUser.getRawValue();

      this.authService.isAvailable(this.formUser.controls.email.getRawValue())
      .subscribe({
        next: (rta) => {
          this.statusUser = 'success';
          if(rta.isAvailable){
            this.showRegister = true;
            this.form.controls.email.setValue(email);
          }
          else{
            this.router.navigate(['/login'], { queryParams: { email }});
          }
        },
        error: () => {
          this.statusUser = 'failed';
        }
      })

    }
    else {
      this.statusUser = 'failed';
    }
  }
}
