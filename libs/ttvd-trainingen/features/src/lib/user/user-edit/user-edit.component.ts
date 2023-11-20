import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { Subscription } from 'rxjs';
import { IPlayer, ITrainer, IUser } from '@avans-nx-workshop/shared/api';
import { ActivatedRoute, Router } from '@angular/router';
import { Modal, ModalInterface, ModalOptions } from 'flowbite';
import { CreatePlayerDto, CreateTrainerDto, CreateUserDto } from '@avans-nx-workshop/backend/dto';

@Component({
  selector: 'avans-nx-workshop-user-edit',
  templateUrl: './user-edit.component.html',
  styles: [],
})
export class UserEditComponent implements OnInit, OnDestroy {
  user: (IPlayer | ITrainer) | null = null;
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
    userType: ['', [Validators.required]],
    rating: [null, []],
    NTTBnumber: [null, []],
    playsCompetition: [null, []],
    loan: [null, []]
  })

  constructor(private userService: UserService, private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.createUserForm.get('userType')?.valueChanges.subscribe((type) => {
      const playerControls = [this.createUserForm.get('rating'),this.createUserForm.get('NTTBnumber'),this.createUserForm.get('playsCompetition')];
      const trainerControls = [this.createUserForm.get('loan')];
      switch(type) {
        case 'player': {
          playerControls?.forEach((control) => control?.setValidators([Validators.required]))
          trainerControls?.forEach((control) => control?.clearValidators())
          trainerControls?.forEach((control) => control?.setValue(null))
          break;
        }
        case 'trainer': {
          trainerControls?.forEach((control) => control?.setValidators([Validators.required]))
          playerControls?.forEach((control) => control?.clearValidators())
          playerControls?.forEach((control) => control?.setValue(null))
          break;
        }
        default: {
          playerControls?.forEach((control) => control?.clearValidators())
          trainerControls?.forEach((control) => control?.clearValidators())
          playerControls?.forEach((control) => control?.setValue(null))
          trainerControls?.forEach((control) => control?.setValue(null))
          break;
        }
      } 

      playerControls?.forEach((control) => control?.updateValueAndValidity())
      trainerControls?.forEach((control) => control?.updateValueAndValidity())
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
      if(this.createUserForm.get('userType')?.value == 'player') {
        console.log(`Creating player: ${JSON.stringify(this.createUserForm.value)}`);
        const user: CreateUserDto = {
          userType: 'player',
          player: removeNullProperties(this.createUserForm.value) as CreatePlayerDto,
        };
        this.subscription = this.userService.create(user).subscribe((results) => {
          console.log(`results: ${JSON.stringify(results)}`);
          this.router.navigate(['/user/'+results.results.id])
        });
      } else {
        console.log(`Creating trainer: ${JSON.stringify(this.createUserForm.value)}`);
        const user: CreateUserDto = {
          userType: 'trainer',
          trainer: removeNullProperties(this.createUserForm.value) as CreateTrainerDto,
        };
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
function removeNullProperties(obj: any): any {
  const newObj: any = {};

  for (const [key, value] of Object.entries(obj)) {
    if (value !== null) {
      newObj[key] = value;
    }
  }

  return newObj;
}