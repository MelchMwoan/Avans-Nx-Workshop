import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { Subscription } from 'rxjs';
import { IUser } from '@avans-nx-workshop/shared/api';
import { Router } from '@angular/router';

@Component({
  selector: 'avans-nx-workshop-user-create',
  templateUrl: './user-create.component.html',
  styles: [],
})
export class UserCreateComponent {
  subscription: Subscription | undefined = undefined;

  createUserForm = this.formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required]],
      birthDate: [null, [Validators.required]],
    id: `user-${Math.floor(Math.random() * 10000)}`,
  })

  constructor(private userService: UserService, private formBuilder: FormBuilder, private router: Router) {}

  onSubmit() {
    console.log(`Submitted: ${this.createUserForm}`);
    const user: IUser = this.createUserForm.value as unknown as IUser;
    this.subscription = this.userService.create(user).subscribe((results) => {
      console.log(`results: ${JSON.stringify(results)}`);
      this.router.navigate(['/user/'+results.results.id])
    });
  }
}