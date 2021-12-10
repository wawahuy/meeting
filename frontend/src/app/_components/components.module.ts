import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ModalProfileComponent } from './modal-profile/modal-profile.component';



@NgModule({
  declarations: [
    ModalProfileComponent
  ],
  exports: [
    ModalProfileComponent
  ],
  imports: [
    CommonModule,
    ModalModule.forRoot()
  ]
})
export class ComponentsModule { }
