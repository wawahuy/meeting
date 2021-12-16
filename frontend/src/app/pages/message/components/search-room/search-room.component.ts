import { RoomDetail } from './../../../../_models/room';
import { RoomService } from './../../../../_services/room.service';
import { NotifierModule, NotifierService } from 'angular-notifier';
import { UserService } from './../../../../_services/user.service';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { User } from 'src/app/_models/user';
import * as _ from 'lodash';
import { Room } from 'src/app/_models/room';
import { computeOnlineTime } from 'src/app/_helpers/func';

@Component({
  selector: 'app-search-room',
  templateUrl: './search-room.component.html',
  styleUrls: ['./search-room.component.scss'],
})
export class SearchRoomComponent implements OnInit, OnChanges {
  @Input() searchString;
  @Output() selectRoom = new EventEmitter<Room>();

  userData: User[];
  roomData: Room[];
  isLoading = true;

  constructor(
    private userService: UserService,
    private notifierService: NotifierService,
    private roomService: RoomService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    const { searchString } = changes;

    this.isLoading = true;
    if (
      searchString.previousValue !== searchString.currentValue &&
      searchString.currentValue
    ) {
      setTimeout(() => {
        this.loadData();
      });
    }
  }

  ngOnInit(): void {}

  loadData = _.debounce(async () => {
    this.isLoading = true;
    const [ user, room ] = await Promise.all([
      this.fetchDataUser(),
      this.fetchDataRoom()
    ]);

    this.userData = user;
    this.roomData = room;
    this.isLoading = false;
  }, 250);

  async fetchDataRoom() {
    return await this.roomService
      .search(this.searchString, 1, 5)
      .then(res => res?.items)
      .catch((err) => {
        this.notifierService.notify(
          'error',
          err?.error?.message || 'Unknown Error'
        );
        return null;
      });
  }

  async fetchDataUser() {
    return await this.userService
      .search(this.searchString, 1, 5)
      .then(res => res?.items)
      .catch((err) => {
        this.notifierService.notify(
          'error',
          err?.error?.message || 'Unknown Error'
        );
        return null;
      });
  }

  async createRoom(userId: string) {
    const d = await this.roomService.createRoomByUser("", [userId])
      .catch((err) => {
        this.notifierService.notify(
          'error',
          err?.error?.message || 'Unknown Error'
        );
        return null;
      });

    if (d) {
      this.selectRoom.emit(d);
    }
  }

  getOnlineTimeByUser(user: User) {
    return user.onlineLasted ? computeOnlineTime(user.onlineLasted) : '-';
  }

  getRoomNameBySearch(room: Room) {
    return this.roomService.getRoomName(room);
  }

  getStatusRoom(room: Room) {
    return this.roomService.getStatusRoom(room);
  }
}
