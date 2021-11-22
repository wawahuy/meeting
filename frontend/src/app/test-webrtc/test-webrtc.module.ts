import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TestWebrtcRoutingModule } from './test-webrtc-routing.module';
import { TestWebrtcComponent } from './test-webrtc.component';


@NgModule({
  declarations: [TestWebrtcComponent],
  imports: [
    CommonModule,
    TestWebrtcRoutingModule
  ]
})
export class TestWebrtcModule { }
