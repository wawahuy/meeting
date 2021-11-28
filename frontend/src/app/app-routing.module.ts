import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'test-webrtc', loadChildren: () => import('./test-webrtc/test-webrtc.module').then(m => m.TestWebrtcModule) },
  { path: 'test-peer', loadChildren: () => import('./test-peer/test-peer.module').then(m => m.TestPeerModule) },
  { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule) },
  { path: 'sign-up', loadChildren: () => import('./sign-up/sign-up.module').then(m => m.SignUpModule) },
  { path: 'message', loadChildren: () => import('./message/message.module').then(m => m.MessageModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
