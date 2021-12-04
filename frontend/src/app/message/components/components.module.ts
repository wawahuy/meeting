import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomComponent } from './room/room.component';
import { MainMessageComponent } from './main-message/main-message.component';



@NgModule({
  declarations: [
    RoomComponent,
    MainMessageComponent
  ],
  exports: [
    RoomComponent,
    MainMessageComponent
  ],
  imports: [
    CommonModule
  ]
})
export class ComponentsModule { }
