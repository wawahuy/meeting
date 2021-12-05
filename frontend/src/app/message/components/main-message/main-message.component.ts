import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-message',
  templateUrl: './main-message.component.html',
  styleUrls: ['./main-message.component.scss']
})
export class MainMessageComponent implements OnInit {

  userConnect = {
    id: 2,
    username: "Heyday",
    listMessage: [],
    status: false,
    lastActivity: "16:00 12/05/2021"
  }

  constructor() { }

  ngOnInit(): void {
  }

}
