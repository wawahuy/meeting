import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomComponent } from './room/room.component';
import { MainMessageComponent } from './main-message/main-message.component';
import { ComponentsModule } from 'src/app/_components/components.module';


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
    CommonModule,
    ComponentsModule
  ]
})
export class MessageComponentsModule { }
