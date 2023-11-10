import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { Subscription } from 'rxjs';
import { IUser } from '@avans-nx-workshop/shared/api';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'avans-nx-workshop-user-edit',
  templateUrl: './user-edit.component.html',
  styles: [],
})
export class UserCreateComponent implements OnInit, OnDestroy {
  user: IUser | null = null;
  subscription: Subscription | undefined = undefined;
  routeSub: Subscription | undefined = undefined;

  createUserForm = this.formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required]],
      birthDate: [null, [Validators.required]],
    id: `user-${Math.floor(Math.random() * 10000)}`,
  })

  constructor(private userService: UserService, private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute) {}
  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {
      if(params['id']) {
        console.log('edit')
        this.subscription = this.userService.read(params['id']).subscribe((results) => {
          console.log(`results: ${results}`);
          this.user = results;
        });
      }
    });    
  }

  ngOnDestroy(): void {
      if(this.subscription) this.subscription.unsubscribe();
      if(this.routeSub) this.routeSub.unsubscribe();
  }

  onSubmit() {
    console.log(`Submitted: ${this.createUserForm}`);
    const user: IUser = this.createUserForm.value as unknown as IUser;
    this.subscription = this.userService.create(user).subscribe((results) => {
      console.log(`results: ${JSON.stringify(results)}`);
      this.router.navigate(['/user/'+results.results.id])
    });
  }

  deleteUser() {
    console.log(`Delete: ${this.user?.id}`);
    const userId = this.user?.id;
    if(!userId) return console.log('User ID is not defined')
    this.subscription = this.userService.delete(userId).subscribe((results) => {
      console.log(`results: ${JSON.stringify(results)}`);
      this.router.navigate(['/users'])
    });
  }
}