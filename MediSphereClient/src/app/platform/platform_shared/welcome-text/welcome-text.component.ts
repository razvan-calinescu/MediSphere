import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome-text',
  templateUrl: './welcome-text.component.html',
  styleUrls: ['./welcome-text.component.scss']
})
export class WelcomeTextComponent implements OnInit{
  public accountType: any;
  @Input() userName: any;

  constructor(
   
  ){

  }

  ngOnInit(){

    this.accountType = localStorage.getItem('userRole')
  }

 
}
