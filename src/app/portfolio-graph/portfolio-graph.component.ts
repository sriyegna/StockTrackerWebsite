import { Component, OnInit, Input } from '@angular/core';
import { StockService } from '../shared/stock.service';
import { Observable } from 'rxjs';
import {NgbDate, NgbCalendar, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';

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
  maxDate: NgbDate;


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
          mode: 'x',
          sensitivity: 0.001,
          speed: 10

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

  constructor(private service:StockService, private calendar: NgbCalendar, public formatter: NgbDateParserFormatter) {
    this.fromDate = calendar.getNext(calendar.getToday(), 'm', -6);
    this.toDate = calendar.getToday();
    this.maxDate = calendar.getToday();
   }

  ngOnInit() {
    //Problem if there is only one stock in the database. We will get an index of 2.
    this.selectedStock = this.service.stocks[this.graphIndex][1];
    //console.log(this.service.stocks[this.graphIndex][1]);
  
    this.changeGraphDays().subscribe(
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
    this.changeGraphDays().subscribe(
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
    this.changeGraphDays().subscribe(
      res => {
        console.log(res);
      },
      err => {
        console.log(err);
      }
    );
  }

  changeGraphDays() {
    let ticker = this.selectedStock;
    let days = this.selectedDays;
    let observable = Observable.create((observer) => {
      observer.next(
        this.service.getMovingDayAverageFromDb(ticker, days, this.fromDate, this.toDate).subscribe(
          res => {
            let historicalResultData: any = res;
            let historicalDataArray = historicalResultData.MovingDayAverage
            // let m = historicalResultData.m
            // let b = historicalResultData.b

            let linearRegressionData = {
              data: [],
              label: days + " Linear Data"
            }

            let lineOfBestFitData = {
              data: historicalResultData.bestFitData,
              label: days + " Best Fit"
            }

            let stockData = {
              data: historicalResultData.histStockData,
              label: ticker
            }

            this.lineChartLabels = [];
            for (let i = 0; i < historicalDataArray.length; i = i + 1) {
              this.lineChartLabels.push(historicalDataArray[i][2]);
              linearRegressionData.data.push(historicalDataArray[i][0])

              // lineOfBestFitData.data.push(m*(i - (historicalDataArray.length - days)) + b);
              /*
              if (i >= historicalDataArray.length - days) {
                lineOfBestFitData.data.push(m*(i - (historicalDataArray.length - days)) + b);
              }
              else {
                lineOfBestFitData.data.push(null);
              }
              */
              
            }


            this.lineChartData = [];
            this.lineChartData.push(linearRegressionData);
            this.lineChartData.push(lineOfBestFitData);
            this.lineChartData.push(stockData);
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

  onDateSelection() {
    if ((this.fromDate != null) && (this.toDate != null)) {
      console.log("Changing graph days");
      this.changeGraphDays().subscribe(
        data => this.service.noOperation(),
        error => console.log(error),
        () => {
          console.log("Graph updated by date");
        }
      )
    }
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || date.equals(this.toDate) || this.isInside(date) || this.isHovered(date);
  }

  validateInput(currentValue: NgbDate, input: string): NgbDate {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }

  dateRange(days) {
    if ((days - 1) < (this.lineChartLabels.length - days)) {
      return true;
    }
    return false;
  }

}
