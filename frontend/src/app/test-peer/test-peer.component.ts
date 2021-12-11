import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Message } from '../_models/message';
import { WsTestService } from '../_services/ws-test.service';

@Component({
  selector: 'app-test-peer',
  templateUrl: './test-peer.component.html',
  styleUrls: ['./test-peer.component.scss']
})
export class TestPeerComponent implements OnInit, AfterViewInit {
  hasSetConnect: boolean = false;
  peerConnection: RTCPeerConnection;
  dc: RTCDataChannel;
  dcMessage: string;
  logs: { name: string; log: string }[] = [];

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
    this.wsTestService.send({ type: 'setName', data: '__a'});
  }

  handleConnectB() {
    this.hasSetConnect = true;
    this.wsTestService.send({ type: 'setName', data: '__b'});
    this.wsTestService.send({ type: 'setCall', data: '__a'});
  }

  async handleEstablish() {
    this.createPeerConnection();

    this.dc = this.peerConnection.createDataChannel("channel");
    this.dc.onopen = () => this.log('data channel', 'opened!');
    this.dc.onmessage = (e) => this.log('data channel', 'msg: ' + e.data);

    const offer = await this.peerConnection.createOffer();
    this.peerConnection.setLocalDescription(offer);
    this.wsTestService.send({ type: 'offer', data: offer });
    this.log('local offer', offer);
  }

  async handleDCSend() {
    if (!this.dc) {
      return;
    }
    this.dc.send(this.dcMessage);
    this.dcMessage = '';
  }

  private createPeerConnection() {
    this.peerConnection = new RTCPeerConnection({
      iceServers:[
        // {
        //   urls: 'stun:call.metmes.pw:25001'
        // },
        {
          urls: [
            'turn:call.metmes.pw:25001?transport=udp',
            'turn:call.metmes.pw:25001?transport=tcp',
          ],
          username: 'a_admin',
          credential: 'a_admin_pwd'
        }
      ],
    });
    this.peerConnection.onicecandidate = this.handleIceCandidate;
    this.peerConnection.onconnectionstatechange = this.handleConnectionStateChange;
    this.peerConnection.ondatachannel = (ev) => {
      const channel = ev.channel;
      channel.onopen = () => this.log('data channel', 'opened!');
      channel.onmessage = (e) => this.log('data channel', 'msg: ' + e.data);
      this.dc = channel;
    }
  }

  handleIceCandidate = (event: RTCPeerConnectionIceEvent) => {
    // if (event.candidate) {
      this.wsTestService.send({ type: 'ice-candidate', data: event.candidate });
      this.log('local ice', event.candidate);

      if(event.candidate.type == "srflx"){
        this.log("ICE", "The STUN server is reachable!");
        this.log("ICE", `Your Public IP Address is: ${(<any>event.candidate)?.address}`);
      }

      if(event.candidate.type == "relay"){
          this.log("ICE", "The TURN server is reachable !");
      }
    // }
  }

  handleConnectionStateChange = (event: Event) => {
    this.log('connection', this.peerConnection.connectionState);
    switch (this.peerConnection.connectionState) {
      case 'connected':
    }
  }

  private incomingWsMessage() {
    this.wsTestService.connect();
    this.wsTestService.message$.subscribe((msg) => {
      switch (msg.type) {
        case 'offer':
          this.messageOffer(msg.data)
          break;

        case 'answer':
          this.messageAnswer(msg.data);
          break;

        case 'ice-candidate':
          this.messageIceCandidate(msg.data);
          break;
      }
    })
  }

  private async messageOffer(data: RTCSessionDescriptionInit) {
    if (!this.peerConnection) {
      this.createPeerConnection();
    }

    this.log('remote offer', data);
    this.peerConnection.setRemoteDescription(new RTCSessionDescription(data));
    const answer = await this.peerConnection.createAnswer();
    this.peerConnection.setLocalDescription(answer);
    this.wsTestService.send({ type: 'answer', data: answer });
    this.log('local answer', answer);
  }


  private async messageAnswer(data: RTCSessionDescriptionInit) {
    this.peerConnection.setRemoteDescription(new RTCSessionDescription(data));
    this.log('remote answer', data);
  }

  private messageIceCandidate(data: RTCIceCandidate) {
    this.peerConnection.addIceCandidate(data);
    this.log('remote ice', data);
  }


  private log(name: string, data: any) {
    this.logs.push({
      name,
      log: typeof data === "object" ? JSON.stringify(data) : data
    })
  }
}
