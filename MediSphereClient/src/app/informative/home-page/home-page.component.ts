import { Component, OnInit } from '@angular/core';

interface Stats {
  doctorCount: number;
  departmentCount: number;
  laboratoryCount: number;
  awardCount: number;
}

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})

export class HomePageComponent implements OnInit, Stats {
  public doctorCount = 0;
  public departmentCount = 0;
  public laboratoryCount = 0;
  public awardCount = 0;

  ngOnInit() {
    this.animateValue('doctorCount', 45, 2000);
    this.animateValue('departmentCount', 5, 2000);
    this.animateValue('laboratoryCount', 8, 2000);
    this.animateValue('awardCount', 82, 2000);
  }

  animateValue(property: keyof Stats, value: number, duration: number): void {
    let start = 0;
    const end = value;
    const range = end - start;
    const increment = end > start ? 1 : -1;
    const stepTime = Math.abs(Math.floor(duration / range));
    const timer = setInterval(() => {
      start += increment;
      this[property as keyof Stats] = start;
      if (start === end) {
        clearInterval(timer);
      }
    }, stepTime);
  }
  
}
