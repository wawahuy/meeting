import { Component, Input, OnInit } from '@angular/core';
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

  constructor(private roomService: RoomService) {}

  ngOnInit(): void {}

  public show() {
    this.isShow = true;
  }
  public hidden() {
    this.isShow = false;
  }

  getUser() {
    const user = this.roomService.getRoomName(this.roomCurrent);
    return user;
  }
}
