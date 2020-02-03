import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class StockService {
  stocks = [];
  previousDayStocks = []

  constructor(private http:HttpClient) { }

  getLatestStocksFromDbFn() {
    this.stocks = [];

    let observable = Observable.create((observer) => {
      observer.next(
        this.getLatestStocksFromDb().subscribe(
          res => {
            console.log(res);
            let stockResultData: any = res;
            let stockData = stockResultData.LatestStocks
    
            stockData.forEach(element => {
              this.stocks.push(element);
            });
            observer.complete();
          },
          err => {
            console.log(err);
            observer.complete();
          }
        )
      );

      //setTimeout(() => observer.complete(), 1000);
    })

    return observable;
    
  }

  getPreviousDayStockFromDbFn() {
    this.previousDayStocks = [];

    let observable = Observable.create((observer) => {
      observer.next(
        this.getPreviousDayStockFromDb().subscribe(
          res => {
            console.log(res);
            let stockResultData: any = res;
            let stockData = stockResultData.PreviousStocks

            stockData.forEach(element => {
              this.previousDayStocks.push(element);
            });
            observer.complete();
          },
          err => {
            console.log(err);
            observer.complete();
          }
        )
      );
      //setTimeout(() => observer.complete(), 1000);
    })

    return observable;
  }

  getHistoricalData(ticker) {
    return this.http.get("http://127.0.0.1:5000/GetHistoricalData/" + ticker);
  }

  getLatestStocksFromDb() {
    return this.http.get("http://127.0.0.1:5000/GetLatestStocksFromDb/");
  }

  getPreviousDayStockFromDb() {
    return this.http.get("http://127.0.0.1:5000/GetPreviousDayStockFromDb/");
  }

  UpdateDailyStockDbByTicker(stkticker) {
    let reqObj: any;
    reqObj = {
      ticker: stkticker
    }
    return this.http.post("http://127.0.0.1:5000/UpdateDailyStockDb/", reqObj);
  }

getMovingDayAverageFromDb(ticker, days) {
  return this.http.get("http://127.0.0.1:5000/MovingDayAverage/" + ticker + "&" + days);
}

getSAndP500() {
  return this.http.get("http://127.0.0.1:5000/GetSAndP500/");
}

  



}
