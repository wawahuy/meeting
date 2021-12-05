import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ESignUpFormField } from './model';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  // username: string;
  // password: string;

  form: FormGroup;

  readonly ESignUpFormField = ESignUpFormField;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private notifierService: NotifierService
  ) {
    this.form = this.formBuilder.group({
      [ESignUpFormField.Username]: [null, Validators.required],
      [ESignUpFormField.Password]: [null, Validators.required],
      [ESignUpFormField.ConfirmPassword]: [null, Validators.required]
    });
  }

  ngOnInit(): void {
  }

  isControlError(field: ESignUpFormField, type: string) {
    const control = this.form.controls[field];
    if (control.invalid && (control.touched || control.dirty)) {
      if (control.errors[type]) {
        return true;
      }
    }
    return false;
  }
  async submitSignUp() {
    const values = this.form.value;
    if (values.password === values.confirmPassword){
      await this.authService.register(values.username, values.password)
        .then(res => {
          this.router.navigate(['/login']);
        })
        .catch(err => {
          this.notifierService.notify('error', err?.error?.message || 'Unknown Error')
        })
    }
  }
}
