import { Component, OnInit } from '@angular/core';
import { StockService } from '../shared/stock.service';

@Component({
  selector: 'app-stock-table',
  templateUrl: './stock-table.component.html',
  styleUrls: ['./stock-table.component.css']
})
export class StockTableComponent implements OnInit {
  
  tickerField = "";

  constructor(private service:StockService) { }

  ngOnInit() {
    this.service.getLatestStocksFromDbFn();
  }



  SubmitStockToDb(ticker) {
    this.service.UpdateDailyStockDbByTicker(ticker).subscribe(
      res => {
        console.log("updated");
        this.service.getLatestStocksFromDbFn();
      },
      err => {
        console.log(err)
      }
    )
  }

  UpdateStock(stk) {
    this.SubmitStockToDb(stk[1]);
  }

  AddStock() {
    this.SubmitStockToDb(this.tickerField)
  }

}
