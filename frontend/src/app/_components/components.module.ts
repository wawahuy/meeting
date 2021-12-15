import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ModalProfileComponent } from './modal-profile/modal-profile.component';
import { CreateRoomComponent } from './create-room/create-room.component';

@NgModule({
  declarations: [ModalProfileComponent, CreateRoomComponent],
  exports: [ModalProfileComponent, CreateRoomComponent],
  imports: [CommonModule, ModalModule.forRoot()],
})
export class ComponentsModule {}
