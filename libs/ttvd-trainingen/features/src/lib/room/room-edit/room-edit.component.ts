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

@Component({
  selector: 'avans-nx-workshop-user-edit',
  templateUrl: './room-edit.component.html',
  styles: [],
})
export class RoomEditComponent implements OnInit, OnDestroy {
  room: IRoom | null = null;
  subscription: Subscription | undefined = undefined;
  routeSub: Subscription | undefined = undefined;

  createRoomForm = this.formBuilder.group({
    name: ['', Validators.required],
    maxAmountOfTables: ['', Validators.required],
    isInMaintenance: '',
  })

  constructor(private roomService: RoomService, private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private authService: AuthService) {}

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {
      if(params['id']) {
        this.subscription = this.roomService.read(params['id']).subscribe((results) => {
          this.authService.userIsTrainer().subscribe((result) => {
            console.log(result)
            if(!result) this.router.navigate(['/'])
          })
          this.room = results;
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
    console.log(`Delete: ${this.room?.id}`);
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