import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { TestPeerRoutingModule } from './test-peer-routing.module';
import { TestPeerComponent } from './test-peer.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [TestPeerComponent],
  imports: [
    CommonModule,
    TestPeerRoutingModule,
    TooltipModule.forRoot(),
    FormsModule
  ]
})
export class TestPeerModule { }
