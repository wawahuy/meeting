import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TestPeerComponent } from './test-peer.component';

const routes: Routes = [{ path: '', component: TestPeerComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestPeerRoutingModule { }
