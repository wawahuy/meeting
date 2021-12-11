import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  isLoading = true

  constructor(
    private titleService: Title
  ) {
    this.titleService.setTitle("Metmes - Message")
  }

  ngOnInit(): void {
    this.setLoading();
  }

  setLoading() {
    setTimeout(()=>{
      this.isLoading = false;
    }, 2000)
  }

}
