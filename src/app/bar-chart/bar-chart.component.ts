import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {
  
  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };

  public barChartLabels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012']
  public barChartType = "bar";
  public barChartLegend = true;

  public barChartData = [
    {data: [10, 20, 30, 40, 50, 60, 70], label: 'Series A'},
    {data: [0, 20, 40, 60, 80, 100, 120], label: 'Series B'}
  ];


  constructor() { }

  

  ngOnInit() {
  }

}
