import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ModalProfileComponent } from './modal-profile/modal-profile.component';
import { CreateRoomComponent } from './create-room/create-room.component';
import { LoadingComponent } from './loading/loading.component';

@NgModule({
  declarations: [ModalProfileComponent, CreateRoomComponent, LoadingComponent],
  exports: [ModalProfileComponent, CreateRoomComponent, LoadingComponent],
  imports: [
    CommonModule,
    ModalModule.forRoot(),
    FormsModule,
    TooltipModule.forRoot(),
  ],
})
export class ComponentsModule {}
