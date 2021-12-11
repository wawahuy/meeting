import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ESignUpFormField } from './model';
import { Router } from '@angular/router';
import { AuthService } from '../../_services/auth.service';
import { NotifierService } from 'angular-notifier';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  form: FormGroup;

  readonly ESignUpFormField = ESignUpFormField;

  get hasErrorConfirmPassword() {
    const control = this.form.controls[ESignUpFormField.ConfirmPassword];
    if (control.invalid && (control.touched || control.dirty)) {
      return this.form.get(ESignUpFormField.Password).value !== this.form.get(ESignUpFormField.ConfirmPassword).value;
    }
    return false;
  }

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private notifierService: NotifierService,
    private titleService: Title
  ) {
    this.titleService.setTitle("Metmes - Sign Up");
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      [ESignUpFormField.Username]: [null, Validators.required],
      [ESignUpFormField.Password]: [null, Validators.required],
      [ESignUpFormField.ConfirmPassword]: [null, [Validators.required, this.passwordConfirming]]
    });
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

  passwordConfirming = (c: AbstractControl): { invalid: boolean } => {
    if (this.form && this.form.get(ESignUpFormField.Password).value !== this.form.get(ESignUpFormField.ConfirmPassword).value) {
      return {invalid: true};
    }
  }

  async submitSignUp() {
    const values = this.form.value;
    await this.authService.register(values.username, values.password)
      .then(res => {
        this.router.navigate(['/login']);
      })
      .catch(err => {
        this.notifierService.notify('error', err?.error?.message || 'Unknown Error')
      })
  }
}
