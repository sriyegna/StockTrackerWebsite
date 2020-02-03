import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  stocks = [];
  previousDayStocks = []

  constructor(private http:HttpClient) { }

  getLatestStocksFromDbFn() {
    this.stocks = [];
    this.getLatestStocksFromDb().subscribe(
      res => {
        console.log(res);
        let stockResultData: any = res;
        let stockData = stockResultData.LatestStocks

        stockData.forEach(element => {
          this.stocks.push(element);
        });
        
        this.getPreviousDayStockFromDbFn();
      },
      err => {
        console.log(err);
      }
    )
  }

  getPreviousDayStockFromDbFn() {
    this.previousDayStocks = [];
    this.getPreviousDayStockFromDb().subscribe(
      res => {
        console.log(res);
        let stockResultData: any = res;
        let stockData = stockResultData.PreviousStocks

        stockData.forEach(element => {
          this.previousDayStocks.push(element);
        });
      },
      err => {
        console.log(err);
      }
    )
  }

  getHistoricalData(ticker) {
    return this.http.get("http://127.0.0.1:5000/GetHistoricalData/" + ticker);
  }

  getLatestStocksFromDb() {
    return this.http.get("http://127.0.0.1:5000/GetLatestStocksFromDb/")
  }

  getPreviousDayStockFromDb() {
    return this.http.get("http://127.0.0.1:5000/GetPreviousDayStockFromDb/")
  }

  UpdateDailyStockDbByTicker(stkticker) {
    let reqObj: any;
    reqObj = {
      ticker: stkticker
    }
    return this.http.post("http://127.0.0.1:5000/UpdateDailyStockDb/", reqObj)
  }

  



}
