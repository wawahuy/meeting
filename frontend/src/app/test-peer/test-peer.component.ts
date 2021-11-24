import { AfterViewInit, Component, OnInit } from '@angular/core';
import { WsTestService } from '../_services/ws-test.service';

@Component({
  selector: 'app-test-peer',
  templateUrl: './test-peer.component.html',
  styleUrls: ['./test-peer.component.scss']
})
export class TestPeerComponent implements OnInit, AfterViewInit {

  get uuid() {
    return this.wsTestService.uuid;
  }

  constructor(
    private wsTestService: WsTestService
  ) { }

  ngAfterViewInit(): void {
    console.log(this.wsTestService.uuid)
  }

  ngOnInit(): void {
  }
}
