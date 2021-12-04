import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  constructor() { }

  listUserConnect = [
    {
      username: "GiaHuy",
      listMessage: [
        {
          id: 1,
          content: 'asd'
        }
      ],
      status: true,
      avatarUrl: ""
    },
    {
      username: "Heyday",
      listMessage: [
        {
          id: 1,
          content: 'cba'
        }
      ],
      status: false,
      avatarUrl: ""
    },
    {
      username: "Thien",
      listMessage: [
        {
          id: 1,
          content: 'abc'
        }
      ],
      status: false,
      avatarUrl: ""
    },
  ]

  ngOnInit(): void {
  }

}
