import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomComponent } from './room/room.component';
import { MainMessageComponent } from './main-message/main-message.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';



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
    TooltipModule.forRoot()
  ]
})
export class ComponentsModule { }
