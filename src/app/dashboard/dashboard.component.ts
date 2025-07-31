import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DashboardService } from '../services/dashboard.service';
import { ProductoPorMesDTO, VentasPorVendedorDTO, VentasPorMesDTO } from '../dto/dashboard/showDashboards.dto';

declare var google: any;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  meses: { id: number, nombre: string }[] = [
    { id: 1, nombre: 'Enero' }, { id: 2, nombre: 'Febrero' }, { id: 3, nombre: 'Marzo' },
    { id: 4, nombre: 'Abril' }, { id: 5, nombre: 'Mayo' }, { id: 6, nombre: 'Junio' },
    { id: 7, nombre: 'Julio' }, { id: 8, nombre: 'Agosto' }, { id: 9, nombre: 'Septiembre' },
    { id: 10, nombre: 'Octubre' }, { id: 11, nombre: 'Noviembre' }, { id: 12, nombre: 'Diciembre' }
  ];
  anios: number[] = [2022, 2023, 2024, 2025];
  selectedMes: number = new Date().getMonth() + 1;
  selectedAnio: number = new Date().getFullYear();

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.selectedMes = this.getCurrentMonthId();
    this.selectedAnio = new Date().getFullYear();
  }

  ngAfterViewInit(): void {
    google.charts.load('current', { packages: ['corechart', 'bar'] });
    google.charts.setOnLoadCallback(() => this.loadDashboardData());
  }

  getCurrentMonthId(): number {
    const today = new Date();
    return today.getMonth() + 1;
  }

  onFilterChange(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loadProductosPorMes();
    this.loadVentasPorVendedor();
    this.loadVentasPorAnio();
  }

  loadProductosPorMes(): void {
    this.dashboardService.getProductosPorMes(this.selectedMes, this.selectedAnio).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.drawPieChart(res.data);
        } else {
          this.drawNoDataChart('productosChart', 'No hay datos para productos vendidos en este período.');
        }
      },
      error: (err) => {
        this.drawNoDataChart('productosChart', 'Error al cargar datos de productos: ' + (err.error?.message || err.message));
      }
    });
  }

  loadVentasPorVendedor(): void {
    this.dashboardService.getVentasPorVendedor(this.selectedMes, this.selectedAnio).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.drawBarChart(res.data);
        } else {
          this.drawNoDataChart('vendedoresChart', 'No hay datos de ventas por vendedor para este período.');
        }
      },
      error: (err) => {
        this.drawNoDataChart('vendedoresChart', 'Error al cargar datos de vendedores: ' + (err.error?.message || err.message));
      }
    });
  }

  loadVentasPorAnio(): void {
    this.dashboardService.getVentasPorMes(this.selectedAnio).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.drawLineChart(res.data);
        } else {
          this.drawNoDataChart('ventasAnualesChart', 'No hay datos de ventas anuales para este año.');
        }
      },
      error: (err) => {
        this.drawNoDataChart('ventasAnualesChart', 'Error al cargar datos de ventas anuales: ' + (err.error?.message || err.message));
      }
    });
  }

  drawPieChart(data: ProductoPorMesDTO[]): void {
    if (!google.charts || !google.visualization) return;

    if (data.length === 0) {
      this.drawNoDataChart('productosChart', 'No hay datos para productos vendidos en este período.');
      return;
    }

    const chartData = new google.visualization.DataTable();
    chartData.addColumn('string', 'Producto');
    chartData.addColumn('number', 'Total Vendido ($)');
    data.forEach(item => {
      chartData.addRow([item.producto, item.cantidadVendida]);
    });

    const options = {
      title: 'Ventas por Producto',
      pieHole: 0.4,
      is3D: true,
      colors: ['#3366CC', '#DC3912', '#FF9900', '#109618', '#990099', '#0099C6', '#DD4477', '#66AA00', '#B82E2E', '#316395'],
      titleTextStyle: { fontSize: 16 },
      tooltip: {
        trigger: 'focus',
        isHtml: true,
        textStyle: { fontSize: 13 },
        showColorCode: true
      },
      chartArea: { left: 10, top: 40, width: '90%', height: '85%' }
    };

    const chart = new google.visualization.PieChart(document.getElementById('productosChart'));
    chart.draw(chartData, options);
  }

  drawBarChart(data: VentasPorVendedorDTO[]): void {
    if (!google.charts || !google.visualization) return;

    if (data.length === 0) {
      this.drawNoDataChart('vendedoresChart', 'No hay datos de ventas por vendedor para este período.');
      return;
    }

    const chartData = new google.visualization.DataTable();
    chartData.addColumn('string', 'Vendedor');
    chartData.addColumn('number', 'Total Ventas ($)');
    chartData.addColumn({ type: 'string', role: 'style' });

    const colors = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#E7E9ED',
      '#FFCDDD', '#99CCEE', '#FFFFCC', '#AAEEFF', '#FFBB66', '#DDAAEE', '#CCEEDD'
    ];
    let colorIndex = 0;

    data.forEach(item => {
      chartData.addRow([item.vendedor, item.totalVentas, colors[colorIndex % colors.length]]);
      colorIndex++;
    });

    const options = {
      title: 'Mejores Vendedores',
      hAxis: {
        title: 'Total Ventas ($)',
        minValue: 0
      },
      vAxis: {
        title: 'Vendedor'
      },
      chartArea: { width: '80%', height: '70%', left: '15%' },
      legend: 'none',
      titleTextStyle: { fontSize: 16 },
      bar: { groupWidth: '80%' }
    };

    const chart = new google.visualization.ColumnChart(document.getElementById('vendedoresChart'));
    chart.draw(chartData, options);
  }

  drawLineChart(data: VentasPorMesDTO[]): void {
    if (!google.charts || !google.visualization) return;

    const fullYearMonthsOrder = this.meses.map(m => m.nombre);
    const monthlySalesMap = new Map<string, number>();
    data.forEach(item => monthlySalesMap.set(item.mes.toLowerCase(), item.totalVentas));

    const chartData = new google.visualization.DataTable();
    chartData.addColumn('string', 'Mes');
    chartData.addColumn('number', 'Total Ventas ($)');

    fullYearMonthsOrder.forEach(monthName => {
      chartData.addRow([monthName, monthlySalesMap.get(monthName.toLowerCase()) || 0]);
    });

    const options = {
      title: 'Ventas del Año',
      curveType: 'function',
      legend: { position: 'none' },
      hAxis: {
        title: 'Mes',
        slantedText: true,
        slantedTextAngle: 45
      },
      vAxis: {
        title: 'Total Ventas ($)',
        minValue: 0,
        format: '$#,###.##'
      },
      titleTextStyle: { fontSize: 16 },
      colors: ['#007bff'],
      pointSize: 5,
      animation: {
        startup: true,
        duration: 1000,
        easing: 'out'
      }
    };

    const chart = new google.visualization.LineChart(document.getElementById('ventasAnualesChart'));
    chart.draw(chartData, options);
  }

  drawNoDataChart(elementId: string, message: string): void {
    if (!google.charts || !google.visualization) return;

    const dataTable = new google.visualization.DataTable();
    dataTable.addColumn('string', 'Etiqueta');
    dataTable.addColumn('number', 'Valor');
    dataTable.addRow(['', 1]);

    const options = {
      title: message,
      pieHole: 0.4,
      chartArea: { width: '80%', height: '80%' },
      legend: { position: 'none' },
      tooltip: { trigger: 'none' },
      titleTextStyle: { fontSize: 16, color: '#888' },
      colors: ['#e0e0e0']
    };

    let chart: any;
    if (elementId === 'productosChart') {
      chart = new google.visualization.PieChart(document.getElementById(elementId));
    } else if (elementId === 'vendedoresChart') {
      chart = new google.visualization.ColumnChart(document.getElementById(elementId));
    } else if (elementId === 'ventasAnualesChart') {
      chart = new google.visualization.LineChart(document.getElementById(elementId));
    }

    if (chart) {
      chart.draw(dataTable, options);
    }
  }
}
