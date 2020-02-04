import { Component, OnInit } from '@angular/core';
import { StockService } from '../shared/stock.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {

  public lineChartOptions = {
    scaleShowVerticalLines: true,
    responsive: true,
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
  public lineChartLegend = false;
  public lineChart1Labels = []
  public lineChart1Data = [];
  selected1Stock = "";
  selected1Days = 5;

  
  public lineChart2Labels = []
  public lineChart2Data = [];
  selected2Stock = "";
  selected2Days = 5;

  sAndPValue = 0;
  portfolioValue = "0";

  constructor(private service:StockService) { }

  ngOnInit() {
    this.service.getLatestStocksFromDbFn().subscribe(
      data => console.log(data),
      error => console.log(error),
      () => {
        if (this.service.stocks.length > 1) {
          this.selected1Stock = this.service.stocks[0][1];
          this.selected2Stock = this.service.stocks[1][1];
        }
        else if (this.service.stocks.length == 1) {
          this.selected1Stock = this.service.stocks[0][1];
          this.selected2Stock = this.service.stocks[0][1];
        }
        else {
          this.selected1Stock = "No Stocks";
          this.selected2Stock = "No Stocks";
        }
        
        this.service.getPreviousDayStockFromDbFn().subscribe(
          data => console.log(data),
          error => console.log(error),
          () => {
            this.determinePortfolioValue();
            this.changeGraph1Days(this.selected1Days).subscribe(
             data => console.log(data),
             error => console.log(error),
             () => {
              this.changeGraph2Days(this.selected2Days).subscribe(
                data => console.log(data),
                error => console.log(error),
                () => {
                  this.getSAndP500();
                }
              );
             } 
            );
          }
        );
      }
    );
  }

  previousStockAvailable() {
    if (this.service.previousDayStocks.length > 0) {
      return true;
    }
    return false;
  }

  currentStockAvailable() {
    if (this.service.stocks.length > 0) {
      return true;
    }
    return false;
  }

  lineChartDataPopulated(chartNum) {
    if (chartNum == 0) {
      if (this.lineChart1Data.length > 0) {
        return true;
      }
      return false;
    }
    else {
      if (this.lineChart2Data.length > 0) {
        return true;
      }
      return false;
    }
  }


  changeGraph1Ticker(stk) {
    this.selected1Stock = stk[1]
    this.changeGraph1Days(this.selected1Days).subscribe(
      res => {
        console.log(res);
      },
      err => {
        console.log(err);
      }
    );
  }

  htmlChangeGraph1Days(days) {
    this.selected1Days = days;
    this.changeGraph1Days(this.selected1Days).subscribe(
      res => {
        console.log(res);
      },
      err => {
        console.log(err);
      }
    );
  }

  changeGraph1Days(days) {
    let ticker = this.selected1Stock;
    let observable = Observable.create((observer) => {
      observer.next(
        this.service.getMovingDayAverageFromDb(ticker, days).subscribe(
          res => {
            let historicalResultData: any = res;
            let historicalDataArray = historicalResultData.MovingDayAverage
            let m = historicalResultData.m
            let b = historicalResultData.b
            console.log(m)
            console.log(b)

            let tickerData = {
              data: [],
              label: ticker
            }

            let linearData = {
              data: [],
              label: days + " Linear Data"
            }

            this.lineChart1Labels = [];
            for (let i = 0; i < historicalDataArray.length; i = i + 1) {
              this.lineChart1Labels.push(historicalDataArray[i][2]);
              tickerData.data.push(historicalDataArray[i][0])

              linearData.data.push(m*(i - (historicalDataArray.length - days)) + b);
              if (i >= historicalDataArray.length - days) {
                //linearData.data.push(m*(i - (historicalDataArray.length - days)) + b);
              }
              else {
                linearData.data.push(null);
              }
              
            }

            this.lineChart1Data = [];
            this.lineChart1Data.push(tickerData);
            this.lineChart1Data.push(linearData);
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

  changeGraph2Ticker(stk) {
    this.selected2Stock = stk[1]
    this.changeGraph2Days(this.selected2Days).subscribe(
      res => {
        console.log(res);
      },
      err => {
        console.log(err);
      }
    );
  }

  htmlChangeGraph2Days(days) {
    this.selected2Days = days;
    this.changeGraph2Days(this.selected2Days).subscribe(
      res => {
        console.log(res);
      },
      err => {
        console.log(err);
      }
    );
  }

  changeGraph2Days(days) {
    let ticker = this.selected2Stock;
    let observable = Observable.create((observer) => {
      observer.next(
        this.service.getMovingDayAverageFromDb(ticker, days).subscribe(
          res => {
            let historicalResultData: any = res;

            let historicalDataArray = historicalResultData.MovingDayAverage

            let newData = {
              data: [],
              label: ticker
            }

            this.lineChart2Labels = [];
            for (let i = 0; i < historicalDataArray.length; i = i + 1) {
              this.lineChart2Labels.push(historicalDataArray[i][2]);
              newData.data.push(historicalDataArray[i][0])
            }

            this.lineChart2Data = [];
            this.lineChart2Data.push(newData);

            observer.complete();
          },
          err => {
            console.log(err);
          }
        )
      )
    });
    return observable;
  }

  determineGainLoss(pp, cp) {
    return (((cp/pp) * 100) - 100).toFixed(2);
  }

  getSAndP500() {
    this.service.getSAndP500().subscribe(
      res => {
        let resultData: any = res;

        let sAndPValue = resultData.SAndP500
        this.sAndPValue = sAndPValue;
      },
      err => {
        console.log(err);
      }
    )
  }

  determinePortfolioValue() {
    let portfolioSum = 0;
    for (let i = 0; i < this.service.stocks.length; i++) {
      portfolioSum = portfolioSum + (this.service.stocks[i][6] - this.service.previousDayStocks[i][6])
    }
    this.portfolioValue = portfolioSum.toFixed(2)
  }

  stockArraysPopulated() {
    if (this.service.stocks.length > 0 && this.service.previousDayStocks.length > 0) {
      return true;
    }
    return false;
  }

}
