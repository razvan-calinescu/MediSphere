import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  loginForm!: FormGroup;
  passwordHide: boolean = true;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {

    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Form Submitted', this.loginForm.value);
      // Perform your authentication logic here
    }
  }
}
