import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit, AfterViewInit {

  isLoading = true

  constructor(
    private titleService: Title
  ) {
    this.titleService.setTitle("Metmes - Message")
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.isLoading = false, 0);
  }
}
