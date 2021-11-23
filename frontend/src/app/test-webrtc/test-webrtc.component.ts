import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DataService } from './services/data.service';
import { Message } from './types/message';

@Component({
  selector: 'app-test-webrtc',
  templateUrl: './test-webrtc.component.html',
  styleUrls: ['./test-webrtc.component.scss']
})
export class TestWebrtcComponent implements OnInit, AfterViewInit {
  @ViewChild("local_video") localVideoElement: ElementRef;
  @ViewChild("remote_video") remoteVideoElement: ElementRef;

  localMedia: MediaStream;
  peerConnection: RTCPeerConnection;

  constructor(
    private dataService: DataService
  ) { }

  ngAfterViewInit(): void {
    this.addIncomingMessageHandler();
    this.requestMediaDevice();
  }

  ngOnInit(): void {
  }

  private async requestMediaDevice() {
    this.localMedia = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: {
        width: 540,
        height: 270
      }
    });
    this.handleStopLocal();
  }

  handleStartLocal() {
    this.localMedia.getTracks().forEach(track => {
      track.enabled = true;
    });
    this.localVideoElement.nativeElement.srcObject = this.localMedia;
  }

  handleStopLocal() {
    this.localMedia.getTracks().forEach(track => {
      track.enabled = false;
    });
    this.localVideoElement.nativeElement.srcObject = null;
  }

  async handleCall() {
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
      this.dataService.send({ type: "offer", data: offer });
    } catch (e) {
      this.handleGetUserMediaError(e);
    }
  }

  handleHangUp() {
    this.dataService.send({ type: "hangup", data: '' });
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
      this.dataService.send({
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
    this.dataService.connect();
    this.dataService.message$.subscribe(
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
    if (!this.peerConnection) {
      this.createPeerConnection();
    }

    if (!this.localMedia) {
      this.handleStartLocal();
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
        this.dataService.send({ type: 'answer', data: this.peerConnection.localDescription });
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
