import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  constructor(
    private titleService: Title
  ) {
    this.titleService.setTitle("Meet - Message")
  }

  ngOnInit(): void {
  }

}
