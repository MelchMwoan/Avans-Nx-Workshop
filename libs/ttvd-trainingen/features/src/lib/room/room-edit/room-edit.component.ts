/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { IRoom } from '@avans-nx-workshop/shared/api';
import { ActivatedRoute, Router } from '@angular/router';
import { Modal, ModalInterface, ModalOptions } from 'flowbite';
import { CreateRoomDto, UpdateRoomDto } from '@avans-nx-workshop/backend/dto';
import { AuthService } from '../../auth/auth.service';
import { RoomService } from '../room.service';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { AlertService } from 'libs/ttvd-trainingen/ui/src/lib/alert/alert.service';

@Component({
  selector: 'avans-nx-workshop-user-edit',
  templateUrl: './room-edit.component.html',
  styles: [],
})
export class RoomEditComponent implements OnInit, OnDestroy {
  room: IRoom | null = null;
  subscription: Subscription | undefined = undefined;
  routeSub: Subscription | undefined = undefined;
  curUser?: any | null;

  createRoomForm = this.formBuilder.group({
    name: ['', Validators.required],
    maxAmountOfTables: ['', Validators.required],
    isInMaintenance: '',
  })

  constructor(private roomService: RoomService, private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private authService: AuthService, private alertService: AlertService) {}

  ngOnInit(): void {
    this.authService.userIsTrainer().subscribe((result) => {
      if(!result) {
        this.router.navigate(['/']);
        this.alertService.show("warning", "Alleen trainers mogen dit doen.");
      }
    })
    this.routeSub = this.route.params.subscribe(async params => {
      await this.authService
        .getUserFromLocalStorage()
        .subscribe((results: any) => {
          this.curUser = results.results.user;
        });
      if(params['id']) {
        this.subscription = this.roomService.read(params['id']).subscribe((results) => {
          this.room = results;
          if (this.room.owner != this.curUser._id) {
            this.router.navigate(['/rooms']);
            this.alertService.show(
              'warning',
              'Jij mag deze zaal niet bewerken.'
            );
          }
          this.createRoomForm.markAllAsTouched();
        });
        const $modalElement: HTMLElement | null = document.querySelector('#popup-modal');
        const $modalOptions: ModalOptions = {
          placement: 'bottom-right',
          backdrop: 'dynamic',
          closable: true
        }
        const modal: ModalInterface = new Modal($modalElement, $modalOptions);
        document.querySelector('#deleteRoomBtn')?.addEventListener('click', function() {modal.show()});
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
    if(this.createRoomForm.invalid) return this.createRoomForm.markAllAsTouched();
    if(this.room != null) {
      console.log(`Updating: ${this.createRoomForm}`);
      const id = this.room.name;
        const room: UpdateRoomDto = this.createRoomForm.value as UpdateRoomDto;
        this.subscription = this.roomService.update(id, room).subscribe((results) => {
          console.log(results);
          this.router.navigate(['/room/'+results.results.name])
        });
    } else {
        console.log(`Creating room: ${JSON.stringify(this.createRoomForm.value)}`);
        const room: CreateRoomDto = this.createRoomForm.value as unknown as CreateRoomDto;
        this.subscription = this.roomService.create(room).subscribe((results) => {
          this.router.navigate(['/room/'+results.results.name])
        });
      }
  }

  deleteRoom() {
    console.log(`Delete: ${this.room?._id}`);
    const roomId = this.room?.name;
    if(!roomId) return console.log('Room ID is not defined')
    this.subscription = this.roomService.delete(roomId).subscribe((results) => {
      this.router.navigate(['/rooms'])
    });
  }
  getIsInMaintenanceValue(): boolean | null {
    if (this.room) {
      return this.room.isInMaintenance;
    }
    return null;
  }

}