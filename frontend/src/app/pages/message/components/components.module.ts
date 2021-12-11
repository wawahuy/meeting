import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomComponent } from './room/room.component';
import { MainMessageComponent } from './main-message/main-message.component';
import { ComponentsModule } from 'src/app/_components/components.module';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDropdownModule, BsDropdownConfig  } from 'ngx-bootstrap/dropdown'



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
    ComponentsModule,
    TooltipModule.forRoot(),
    BsDropdownModule.forRoot()
  ],
})
export class MessageComponentsModule { }
