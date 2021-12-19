import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TestWebrtcRoutingModule } from './test-webrtc-routing.module';
import { TestWebrtcComponent } from './test-webrtc.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [TestWebrtcComponent],
  imports: [
    CommonModule,
    TestWebrtcRoutingModule,
    FormsModule
  ]
})
export class TestWebrtcModule { }
