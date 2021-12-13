import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SocketService extends Socket {
  constructor(
    private authService: AuthService
  ) {
    super({
      url: environment.ioEndpoint,
      options: {
        autoConnect: false,
        reconnection: true
      },
    });

    this.authService.currentUser$.subscribe(user => {
      this.disconnect();
      if (!user) {
        return;
      }
      this.ioSocket.io.opts.extraHeaders = {
        Authorization: this.authService.currentUserValue?.token
      }
      this.connect();
    })
  }


}
