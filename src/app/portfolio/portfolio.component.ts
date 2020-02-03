import { Component, OnInit } from '@angular/core';
import { StockService } from '../shared/stock.service';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {

  public lineChartOptions = {
    scaleShowVerticalLines: true,
    responsive: true
  };

  //public lineChartLabels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012']
  public lineChartLabels = []
  public lineChartType = "line";
  public lineChartLegend = true;

  public lineChartData = [
    //{data: [10, 20, 30, 40, 50, 60, 70], label: 'Series A'},
    //{data: [0, 20, 40, 60, 80, 100, 120], label: 'Series B'}
  ];


  constructor(private service:StockService) { }

  ngOnInit() {
    this.service.getLatestStocksFromDbFn().subscribe(
      data => console.log(data),
      error => console.log(error),
      () => console.log("Completed")
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

  lineChartDataPopulated() {
    if (this.lineChartData.length > 0) {
      return true;
    }
    return false;
  }

  getHistoricalData() {
    this.service.getHistoricalData("MSFT").subscribe(
      res => {
        let historicalResultData: any = res;

        let historicalDataArray = historicalResultData.HistoricalData
        console.log(historicalDataArray)

        let newData = {
          data: [],
          label: "MSFT"
        }

        // historicalDataArray.forEach(element => {
        //   console.log(element);
        //   this.lineChartLabels.push(element[0])
        //   newData.data.push(element[1])
        // });

        for (let i = 0; i < historicalDataArray.length; i = i + 10) {
          this.lineChartLabels.push(historicalDataArray[i][0]);
          newData.data.push(historicalDataArray[i][1])
        }

        this.lineChartData.push(newData);

      },
      err => {
        console.log(err);
      }
    )
  }

}
