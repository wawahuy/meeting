import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TestWebrtcComponent } from './test-webrtc.component';

const routes: Routes = [{ path: '', component: TestWebrtcComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestWebrtcRoutingModule { }
