import { RoomDetail } from './../../../../_models/room';
import { RoomService } from './../../../../_services/room.service';
import { NotifierModule, NotifierService } from 'angular-notifier';
import { UserService } from './../../../../_services/user.service';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
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
    this.userData = await this.userService
      .search(this.searchString)
      .catch((err) => {
        this.notifierService.notify(
          'error',
          err?.error?.message || 'Unknown Error'
        );
        return null;
      });

    this.roomData = await this.roomService
      .search(this.searchString)
      .catch((err) => {
        this.notifierService.notify(
          'error',
          err?.error?.message || 'Unknown Error'
        );
        return null;
      });

    this.isLoading = false;
  }, 250);

  getOnlineTimeByUser(user: User) {
    return user.onlineLasted ? computeOnlineTime(user.onlineLasted) : '-';
  }

  getRoomNameBySearch(room: Room) {
    return this.roomService.getRoomName(room);
  }
}
