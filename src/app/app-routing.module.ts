import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { LineChartComponent } from './line-chart/line-chart.component';
import { StockTableComponent } from './stock-table/stock-table.component';
import { PortfolioComponent } from './portfolio/portfolio.component';


const routes: Routes = [
  {path: 'portfolio', component: PortfolioComponent},
  {path: 'stock-table', component: StockTableComponent},
  {path: 'bar-chart', component: BarChartComponent},
  {path: 'line-chart', component: LineChartComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
