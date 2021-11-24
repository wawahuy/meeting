import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TestPeerRoutingModule } from './test-peer-routing.module';
import { TestPeerComponent } from './test-peer.component';


@NgModule({
  declarations: [TestPeerComponent],
  imports: [
    CommonModule,
    TestPeerRoutingModule
  ]
})
export class TestPeerModule { }
