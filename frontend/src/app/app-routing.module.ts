import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'test-webrtc', loadChildren: () => import('./test-webrtc/test-webrtc.module').then(m => m.TestWebrtcModule) },
  { path: 'test-peer', loadChildren: () => import('./test-peer/test-peer.module').then(m => m.TestPeerModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
