import { Component, OnInit } from '@angular/core';
import { StockService } from '../shared/stock.service';


@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {

  

  
  public lineChart2Labels = []
  public lineChart2Data = [];
  selected2Stock = "";
  selected2Days = 5;

  sAndPValue = 0;
  portfolioValue = "0";

  constructor(private service:StockService) { }

  ngOnInit() {
    this.service.getLatestStocksFromDbFn().subscribe(
      data => this.service.noOperation(),
      error => console.log(error),
      () => {     
        this.service.getPreviousDayStockFromDbFn().subscribe(
          data => this.service.noOperation(),
          error => console.log(error),
          () => {
            this.determinePortfolioValue();
            this.service.stocksObtained = true;   
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
