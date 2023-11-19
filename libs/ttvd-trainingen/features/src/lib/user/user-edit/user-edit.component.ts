import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { Subscription } from 'rxjs';
import { IPlayer, ITrainer, IUser } from '@avans-nx-workshop/shared/api';
import { ActivatedRoute, Router } from '@angular/router';
import { Modal, ModalInterface, ModalOptions } from 'flowbite';

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
    password: '',
    type: ['', [Validators.required]],
    rating: ['', []],
    nttb: ['', []],
    playsCompetition: ['', []]
  })

  constructor(private userService: UserService, private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.createUserForm.get('type')?.valueChanges.subscribe((type) => {
      const playerControls = [this.createUserForm.get('rating'),this.createUserForm.get('nttb'),this.createUserForm.get('playsCompetition')]
      switch(type) {
        case 'player': {
          playerControls?.forEach((control) => control?.setValidators([Validators.required]))
          break;
        }
        default: {
          playerControls?.forEach((control) => control?.clearValidators())
          break;
        }
      } 

      playerControls?.forEach((control) => control?.updateValueAndValidity())
    })

    this.routeSub = this.route.params.subscribe(params => {
      if(params['id']) {
        console.log('edit')
        this.subscription = this.userService.read(params['id']).subscribe((results) => {
          console.log(`results: ${JSON.stringify(results)}`);
          this.user = results;
          this.createUserForm.markAllAsTouched();
        });
        const $modalElement: HTMLElement | null = document.querySelector('#popup-modal');
        const $modalOptions: ModalOptions = {
          placement: 'bottom-right',
          backdrop: 'dynamic',
          closable: true
        }
        const modal: ModalInterface = new Modal($modalElement, $modalOptions);
        document.querySelector('#deleteUserBtn')?.addEventListener('click', function() {modal.show()});
        document.querySelector('#closeModalBtn')?.addEventListener('click', function() {modal.hide()});
        document.querySelector('#confirmDeleteBtn')?.addEventListener('click', function() {modal.hide()});
        document.querySelector('#cancelBtn')?.addEventListener('click', function() {modal.hide()});
      }
    });    
  }

  ngOnDestroy(): void {
      if(this.subscription) this.subscription.unsubscribe();
      if(this.routeSub) this.routeSub.unsubscribe();
  }

  onSubmit() {
    if(this.createUserForm.invalid) return this.createUserForm.markAllAsTouched();
    if(this.user != null) {
      console.log(`Updating: ${this.createUserForm}`);
      const id = this.user.id;
      const user: IUser = this.createUserForm.value as unknown as IUser;
      this.subscription = this.userService.update(id, user).subscribe((results) => {
        console.log(`results: ${JSON.stringify(results)}`);
        this.router.navigate(['/user/'+results.results.id])
      });
    } else {
      if(this.createUserForm.get('type')?.value == 'player') {
        console.log(`Creating player: ${this.createUserForm}`);
        const user: IPlayer = this.createUserForm.value as unknown as IPlayer;
        this.subscription = this.userService.create(user).subscribe((results) => {
          console.log(`results: ${JSON.stringify(results)}`);
          this.router.navigate(['/user/'+results.results.id])
        });
      } else {
        console.log(`Creating trainer: ${this.createUserForm}`);
        const user: ITrainer = this.createUserForm.value as unknown as ITrainer;
        this.subscription = this.userService.create(user).subscribe((results) => {
          console.log(`results: ${JSON.stringify(results)}`);
          this.router.navigate(['/user/'+results.results.id])
        });
      }
    }
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