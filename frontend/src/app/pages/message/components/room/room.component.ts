import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

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
          content: 'Em sẽ cố gắng hết sức anh ơi'
        }
      ],
      status: true,
      avatarUrl: "../../../../../assets/images/huy.jpg"
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
      avatarUrl: "../../../../../assets/images/thinh.jpg"
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
      avatarUrl: "../../../../../assets/images/thien.jpg"
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
      avatarUrl: "../../../../../assets/images/thien.jpg"
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
      avatarUrl: "../../../../../assets/images/thien.jpg"
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
      avatarUrl: "../../../../../assets/images/thien.jpg"
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
      avatarUrl: "../../../../../assets/images/thien.jpg"
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
      avatarUrl: "../../../../../assets/images/thien.jpg"
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
      avatarUrl: "../../../../../assets/images/thien.jpg"
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
      avatarUrl: "../../../../../assets/images/thien.jpg"
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
      avatarUrl: "../../../../../assets/images/thien.jpg"
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
      avatarUrl: "../../../../../assets/images/thien.jpg"
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
      avatarUrl: "../../../../../assets/images/thien.jpg"
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
