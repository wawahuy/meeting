import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {

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

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
  }

  handleLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
