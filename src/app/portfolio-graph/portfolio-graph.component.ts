import { Component, OnInit, Input } from '@angular/core';
import { StockService } from '../shared/stock.service';
import { Observable } from 'rxjs';
import {NgbDate, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-portfolio-graph',
  templateUrl: './portfolio-graph.component.html',
  styleUrls: ['./portfolio-graph.component.css']
})
export class PortfolioGraphComponent implements OnInit {
  @Input() graphIndex: number;

  hoveredDate: NgbDate;
  fromDate: NgbDate;
  toDate: NgbDate;


  public lineChartOptions = {
    scaleShowVerticalLines: true,
    responsive: true,
    scales: {
      xAxes: [{
        ticks: {
          fontColor: 'white'
        }
      }],
      yAxes: [{
        ticks: {
          fontColor: 'white'
        }
      }]
    },
    legend: {
      labels: {
        fontColor: 'white'
      }
    },
    plugins: {
      zoom: {
        pan: {
          enabled: true,
          mode: 'x'
        },
        zoom: {
          enabled: true,
          mode: 'x'
        }
      }
    }
  };
  public lineChartType = "line";
  public lineChartLegend = true;
  public lineChartLabels = []
  public lineChartData = [];
  selectedStock = "AMD";
  selectedDays = 5;

  constructor(private service:StockService, calendar: NgbCalendar) {
    this.fromDate = calendar.getNext(calendar.getToday(), 'm', -6);
    this.toDate = calendar.getToday();
   }

  ngOnInit() {
    console.log(this.graphIndex);
    //Problem if there is only one stock in the database. We will get an index of 2.
    this.selectedStock = this.service.stocks[this.graphIndex][1];
    //console.log(this.service.stocks[this.graphIndex][1]);
  
    this.changeGraphDays(this.selectedDays).subscribe(
      data => this.service.noOperation(),
      error => console.log(error),
      () => {
          this.service.noOperation();
        }
      );
  }
  

  
  lineChartDataPopulated() {
    if (this.lineChartData.length > 0) {
      return true;
    }
    return false;
  }

  changeGraphTicker(stk) {
    this.selectedStock = stk[1]
    this.changeGraphDays(this.selectedDays).subscribe(
      res => {
        this.service.noOperation();
      },
      err => {
        console.log(err);
      }
    );
  }

  htmlChangeGraphDays(days) {
    this.selectedDays = days;
    this.changeGraphDays(this.selectedDays).subscribe(
      res => {
        console.log(res);
      },
      err => {
        console.log(err);
      }
    );
  }

  changeGraphDays(days) {
    let ticker = this.selectedStock;
    days = this.selectedDays;
    let observable = Observable.create((observer) => {
      observer.next(
        this.service.getMovingDayAverageFromDb(ticker, days).subscribe(
          res => {
            let historicalResultData: any = res;
            let historicalDataArray = historicalResultData.MovingDayAverage
            let m = historicalResultData.m
            let b = historicalResultData.b

            let tickerData = {
              data: [],
              label: ticker
            }

            let linearData = {
              data: [],
              label: days + " Linear Data"
            }

            this.lineChartLabels = [];
            for (let i = 0; i < historicalDataArray.length; i = i + 1) {
              this.lineChartLabels.push(historicalDataArray[i][2]);
              tickerData.data.push(historicalDataArray[i][0])

              linearData.data.push(m*(i - (historicalDataArray.length - days)) + b);
              /*
              if (i >= historicalDataArray.length - days) {
                linearData.data.push(m*(i - (historicalDataArray.length - days)) + b);
              }
              else {
                linearData.data.push(null);
              }
              */
              
            }

            this.lineChartData = [];
            this.lineChartData.push(tickerData);
            this.lineChartData.push(linearData);
            observer.complete()

          },
          err => {
            console.log(err);
            observer.complete()
          }
        )
      )
    })
    return observable;
  }

}
