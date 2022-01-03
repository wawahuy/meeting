import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/_models/user';
import { RoomService } from 'src/app/_services/room.service';

@Component({
  selector: 'app-modal-profile',
  templateUrl: './modal-profile.component.html',
  styleUrls: ['./modal-profile.component.scss'],
})
export class ModalProfileComponent implements OnInit {
  @Input() roomCurrent;
  isShow = false;

  nickName: String;
  user: User;

  constructor(private roomService: RoomService) {}

  ngOnInit(): void {}

  public show(user: User) {
    this.isShow = true;
    this.user = user;
  }
  public hidden() {
    this.isShow = false;
  }

  getUser() {
    if (!!this.user) {
      const user = this.roomCurrent.users.find(
        (item) => item.user._id === this.user._id
      );
      return user.user;
    }
    const user = this.roomService.getRoomName(this.roomCurrent);
    return user;
  }
}
