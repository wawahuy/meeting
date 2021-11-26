import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Message } from '../_models/message';
import { WsTestService } from '../_services/ws-test.service';

// const iceConfig: RTCIceServer = [
//   {
//     urls: 'stun:call.zayuh.me:25001'
//   },
//   {
//     urls: 'turn:call.zayuh.me:25001?transport=udp',
//     username: 'a_admin',
//     credential: 'a_admin_pwd'
//   }
// ];

@Component({
  selector: 'app-test-peer',
  templateUrl: './test-peer.component.html',
  styleUrls: ['./test-peer.component.scss']
})
export class TestPeerComponent implements OnInit, AfterViewInit {
  hasSetConnect: boolean = false;

  constructor(
    private wsTestService: WsTestService
  ) { }

  ngAfterViewInit(): void {
    this.incomingWsMessage();
  }

  ngOnInit(): void {
  }

  handleConnectA() {
    this.hasSetConnect = true;
    this.wsTestService.send({ type: 'setCall', data: '__a'});
  }

  handleConnectB() {
    this.hasSetConnect = true;
    this.wsTestService.send({ type: 'setCall', data: '__b'});
  }

  incomingWsMessage() {
    this.wsTestService.connect();
    this.wsTestService.message$.subscribe((msg) => {
      switch (msg.type) {
      }
    })
  }
}
