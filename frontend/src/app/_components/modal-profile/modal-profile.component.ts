import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-modal-profile',
  templateUrl: './modal-profile.component.html',
  styleUrls: ['./modal-profile.component.scss'],
})
export class ModalProfileComponent implements OnInit {
  isShow = false;

  nickName: String;

  constructor() {}

  ngOnInit(): void {}

  public show() {
    this.isShow = true;
  }
  public hidden() {
    this.isShow = false;
  }
}
