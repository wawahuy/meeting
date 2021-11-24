import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Message } from '../_models/message';
import { WsTestService } from '../_services/ws-test.service';

@Component({
  selector: 'app-test-peer',
  templateUrl: './test-peer.component.html',
  styleUrls: ['./test-peer.component.scss']
})
export class TestPeerComponent implements OnInit, AfterViewInit {
  @ViewChild('local_video') localVideoElement: ElementRef;
  @ViewChild('remote_video') remoteVideoElement: ElementRef;

  isCalling: boolean;
  uuidCall: string;
  localMedia: MediaStream;
  peerConnection: RTCPeerConnection;

  get uuid() {
    return this.wsTestService.uuid;
  }

  constructor(
    private wsTestService: WsTestService
  ) { }

  ngAfterViewInit(): void {
    this.addIncomingMessageHandler();
    this.requestMediaDevice();
  }

  ngOnInit(): void {
  }

  onCopy() {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.uuid;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  private async requestMediaDevice() {
    this.localMedia = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: {
        width: 1280,
        height: 720
      }
    });
    this.localMedia.getTracks().forEach(track => {
      track.enabled = true;
    });
    this.localVideoElement.nativeElement.srcObject = this.localMedia;
  }

  async handleCall() {
    this.isCalling = true;
    this.wsTestService.send({ type: "setCall", data: this.uuidCall });
    this.createPeerConnection();
    this.localMedia.getTracks().forEach(track => {
      this.peerConnection.addTrack(track, this.localMedia);
    });

    try {
      const offer = await this.peerConnection.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
      })
      await this.peerConnection.setLocalDescription(offer);
      this.wsTestService.send({ type: "offer", data: offer });
    } catch (e) {
      this.handleGetUserMediaError(e);
    }
  }

  handleHangUp() {
    this.wsTestService.send({ type: "hangup", data: '' });
    this.closeVideoCall();
  }

  private createPeerConnection() {
    this.peerConnection = new RTCPeerConnection({
      iceServers: [
        {
          urls: 'stun:call.zayuh.me:25001'
        },
        {
          urls: 'turn:call.zayuh.me:25001?transport=udp',
          username: 'a_admin',
          credential: 'a_admin_pwd'
        }
      ]
    });

    this.peerConnection.onicecandidate = this.handleICECandidateEvent;
    this.peerConnection.onicegatheringstatechange = this.handleConnectionStateChangeEvent;
    this.peerConnection.onsignalingstatechange = this.handleSignalingStateChange;
    this.peerConnection.ontrack = this.handleTrackEvent;
  }

  closeVideoCall() {
    this.isCalling = false;
    if (this.peerConnection) {
      this.peerConnection.onicecandidate = null;
      this.peerConnection.onicegatheringstatechange =null;
      this.peerConnection.onsignalingstatechange = null;
      this.peerConnection.ontrack = null;
    }

    this.peerConnection.getTransceivers().forEach(trans => {
      trans.stop();
    })

    this.peerConnection.close();
    this.peerConnection = null;
  }

  private handleGetUserMediaError(e: Error) {
    switch (e.name) {
      case 'NotFoundError':
        alert('Unable camera/micro');

      default:
        console.log(e);
        alert('Error ' + e.message);
    }

    this.closeVideoCall();
  }


  private handleICECandidateEvent = (event: RTCPeerConnectionIceEvent) => {
    console.log(event);
    if (event.candidate) {
      this.wsTestService.send({
        type: 'ice-candidate',
        data: event.candidate
      })
    }
  }


  private handleConnectionStateChangeEvent = (event: Event) => {
    console.log(event);
    switch (this.peerConnection.iceConnectionState) {
      case 'closed':
      case 'failed':
      case 'disconnected':
        this.closeVideoCall();
        break;
    }
  }

  private handleSignalingStateChange = (event: Event) => {
    console.log(event);
    switch (this.peerConnection.signalingState) {
      case 'closed':
        this.closeVideoCall();
        break;
    }
  }

  private handleTrackEvent = (event: RTCTrackEvent) => {
    console.log(event);
    this.remoteVideoElement.nativeElement.srcObject = event.streams[0];
  }

  private addIncomingMessageHandler() {
    this.wsTestService.connect();

    setTimeout(() => {
      this.wsTestService.send({type: 'setName', data: this.uuid});
    }, 1000);

    this.wsTestService.message$.subscribe(
      msg => {
        switch (msg.type) {
          case 'offer':
            this.handleOfferMessage(msg.data);
            break;

          case 'answer':
            this.handleAnswerMessage(msg.data);
            break;

          case 'hangup':
            this.handleHangUpMessage(msg);
            break;

          case 'ice-candidate':
            this.handleICECandidateMessage(msg.data);
            break;

          default:
            console.log('unknown message', msg.type);
        }
      },
      err => console.log(err)
    );
  }


  private handleOfferMessage(msg: RTCSessionDescriptionInit) {
    this.isCalling = true;
    if (!this.peerConnection) {
      this.createPeerConnection();
    }

    this.peerConnection.setRemoteDescription(new RTCSessionDescription(msg))
      .then(() => {
        this.localVideoElement.nativeElement.srcObject = this.localMedia;
        this.localMedia.getTracks().forEach(
          track =>  this.peerConnection.addTrack(track, this.localMedia)
        )
      })
      .then(() => {
        return this.peerConnection.createAnswer();
      })
      .then((answer) => {
        return this.peerConnection.setLocalDescription(answer);
      })
      .then(() => {
        this.wsTestService.send({ type: 'answer', data: this.peerConnection.localDescription });
      })
      .catch(this.handleGetUserMediaError)
  }

  private handleAnswerMessage(data) {
    this.peerConnection.setRemoteDescription(data);
  }

  private handleHangUpMessage(msg: Message) {
    this.closeVideoCall();
  }

  private handleICECandidateMessage(data) {
    this.peerConnection.addIceCandidate(data).catch((e) => {
      console.log(e);
    })
  }



}
