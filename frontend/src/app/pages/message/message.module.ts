import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MessageRoutingModule } from './message-routing.module';
import { MessageComponent } from './message.component';
import { ComponentsModule } from './components/components.module';
import { TooltipModule } from 'ngx-bootstrap/tooltip';


@NgModule({
  declarations: [
    MessageComponent,
  ],
  imports: [
    CommonModule,
    MessageRoutingModule,
    ComponentsModule,
    TooltipModule.forRoot()
  ]
})
export class MessageModule { }
