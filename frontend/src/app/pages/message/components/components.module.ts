import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomComponent } from './room/room.component';
import { MainMessageComponent } from './main-message/main-message.component';
import { ComponentsModule } from 'src/app/_components/components.module';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDropdownModule, BsDropdownConfig } from 'ngx-bootstrap/dropdown';
import { SearchRoomComponent } from './search-room/search-room.component';
import { FormsModule } from '@angular/forms';
import { PickerModule } from '@ctrl/ngx-emoji-mart';

@NgModule({
  declarations: [RoomComponent, MainMessageComponent, SearchRoomComponent],
  exports: [RoomComponent, MainMessageComponent],
  imports: [
    PickerModule,
    CommonModule,
    ComponentsModule,
    TooltipModule.forRoot(),
    BsDropdownModule.forRoot(),
    FormsModule,
  ],
})
export class MessageComponentsModule {}
