import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './_helpers/auth.guard';

const routes: Routes = [
  { path: 'test-webrtc', loadChildren: () => import('./test-webrtc/test-webrtc.module').then(m => m.TestWebrtcModule) },
  { path: 'test-peer', loadChildren: () => import('./test-peer/test-peer.module').then(m => m.TestPeerModule) },
  { path: 'login', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule) },
  { path: 'sign-up', loadChildren: () => import('./pages/sign-up/sign-up.module').then(m => m.SignUpModule) },
  { path: '', loadChildren: () => import('./pages/message/message.module').then(m => m.MessageModule), canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
