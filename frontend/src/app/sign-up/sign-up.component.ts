import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ESignUpFormField } from './model';

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
    private formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      [ESignUpFormField.Username]: [null, Validators.required],
      [ESignUpFormField.Password]: [null, Validators.required],
    });
  }

  ngOnInit(): void {
  }

  submitSignUp() {
    const username = this.form.value.username
    alert("Sign Up "+ username)
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
}
