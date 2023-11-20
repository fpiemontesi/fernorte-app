import { Component } from '@angular/core';
import { ReportesService } from '../../../services/reportes.service';
import {  ChartType } from 'chart.js';
import  {Chart } from 'chart.js/auto';
import { Detalle } from '../../../models/Detalles';

@Component({
  selector: 'fn-filtro-fecha',
  templateUrl: './filtro-fecha.component.html',
  styleUrls: ['./filtro-fecha.component.css']
})
export class FiltroFechaComponent {
  mes!: number;
  anio: number = 2023;
  tipo_venta!: number;

  formData = {
    mes: this.mes,
    anio: this.anio,
    tipo_venta: this.tipo_venta
  }

  chart: any;
  chartInstance!: Chart;

  constructor(private reportesService: ReportesService) {
    
  }

  
  // onSubmit() {
  //   if (!this.formData.anio) {
  //     console.error('El año es obligatorio para generar el gráfico.');
  //     return;
  //   }

 
  //   this.reporteEstadoVenta();
  // //  this.reporteTopProductos();

  // }   
    
  // reporteEstadoVenta() {
  //   this.reportesService.getReportes(this.formData.anio, this.formData.mes, this.formData.tipo_venta).subscribe(
  //     (reportes) => {
  //       const chartData = {
  //         labels: ['Pendiente', 'Entregado'], 
  //         datasets: [
  //           {
  //             label: 'Estado de ventas',
  //             data: [reportes.pendiente, reportes.entregado], 
  //             backgroundColor: [ 'red', 'green' ] 
  //           }
  //         ]
  //       };
  
  //       const canvas = document.getElementById('estado-venta') as HTMLCanvasElement;
  //       const ctx = canvas.getContext('2d');
  //       if (ctx) {
  //         if (this.chartInstance) {
  //           this.chartInstance.destroy(); 
  //         }
          
  //         this.chartInstance = new Chart(ctx, {
  //           type: 'bar',
  //           data: chartData,
  //           options: {
  //             scales: {
  //               y: {
  //                 beginAtZero: true 
  //               }
  //             }
  //           }
  //         });
  //       } else {
  //         console.error('Failed to get the 2D rendering context for the canvas');
  //       }
  //     },
  //     (error) => {
  //       console.error(error);
  //     }
  //   );
  // }
  
    
  // reporteTopProductos(){
  //     this.reportesService.getReportes(this.formData.anio, this.formData.mes, this.formData.tipo_venta).subscribe(
  //       (reportes) => {
  //         const chartData: { labels: string[], datasets: any[] } = {
  //           labels: [],
  //           datasets: [
  //             {
  //               label: 'Productos más vendidos',
  //               data: [],
  //               backgroundColor: []
  //             }
  //           ]
  //         };
      
  //         reportes.productos.forEach((productos: any) => {
  //           chartData.labels.push(productos.descripcion);
  //           chartData.datasets[0].data.push(productos.cantidad);
  //           chartData.datasets[0].backgroundColor.push(this.generateRandomColor(5));
  //         });
      
  //         const canvas = document.getElementById('top-productos') as HTMLCanvasElement;
  //         const ctx = canvas.getContext('2d');
  //         if (ctx) {
  //           if (this.chartInstance) {
  //             this.chartInstance.destroy();
  //           }
            
  //           this.chartInstance = new Chart(ctx, {
  //             type: 'pie' as ChartType,
  //             data: chartData,
  //             options: {
  //             }
  //           });
  //         } else {
  //           console.error('Failed to get the 2D rendering context for the canvas');
  //         }
  //       },
  //       (error) => {
  //         console.error(error);
  //       }
  //     );
      
  //   }
    

  //  generateRandomColor(count: number): string[] {
  //   const colors: string[] = [];

  //   const color = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)},${count})`;
  //   colors.push(color);

  //   return colors;
  // }


  onSubmit() {
    if (!this.formData.anio) {
      console.error('El año es obligatorio para generar el gráfico.');
      return;
    }
  
    this.getReportesAndGenerateCharts();
  }
  
  getReportesAndGenerateCharts() {
    this.reportesService.getReportes(this.formData.anio, this.formData.mes, this.formData.tipo_venta).subscribe(
      (reportes) => {
        // this.generarReporteTopProductos(reportes);
        //  this.generarReporteEstadoVenta(reportes);
        // this.generarReporteVentasPorMeses(reportes);
        // this.generarReporteTipoVentas(reportes);
      },
      (error) => {
        console.error(error);
      }
    );
  }
  
  generarReporteTipoVentas(reportes : any) {
    const chartData = {
      labels: ['Venta Mayorista', 'Venta Minorista'], 
      datasets: [
        {
          label: 'Cantidad de ventas Minoristas y Mayoristas',
          data: [reportes.mayorista, reportes.minorista], 
          backgroundColor: this.generateRandomColor(2)
        }
      ]
    };
  
    const canvas = document.getElementById('may-min') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      if (this.chartInstance) {
        this.chartInstance.destroy(); 
      }
      
      this.chartInstance = new Chart(ctx, {
        type: 'bar',
            data: chartData,
            options: {
              scales: {
                y: {
                  beginAtZero: true 
                }
              }
            }
      });
    } else {
      console.error('Error al generar los reportes de ventas del mes anterior y del mes actual.');  }
  }
  generarReporteVentasPorMeses(reportes : any) {
    const chartData = {
      labels: ['Mes Anterior', 'Mes Actual'], 
      datasets: [
        {
          label: 'Venta del Mes Anterior y del Mes Actual',
          data: [reportes.total_mes_anterior, reportes.total_ventas], 
          backgroundColor: this.generateRandomColor(2)
        }
      ]
    };
  
    const canvas = document.getElementById('ant-actual') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      if (this.chartInstance) {
        this.chartInstance.destroy(); 
      }
      
      this.chartInstance = new Chart(ctx, {
        type: 'bar',
            data: chartData,
            options: {
              scales: {
                y: {
                  beginAtZero: true 
                }
              }
            }
      });
    } else {
      console.error('Error al generar los reportes de ventas del mes anterior y del mes actual.');  }
  }
  
  generarReporteEstadoVenta(reportes : any) {
    const chartData = {
      labels: ['Pendiente', 'Entregado'], 
      datasets: [
        {
          label: 'Estado de ventas',
          data: [reportes.pendiente, reportes.entregado], 
          backgroundColor: [ 'red', 'green' ] 
        }
      ]
    };
  
    const canvas = document.getElementById('estado-venta') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      if (this.chartInstance) {
        this.chartInstance.destroy(); 
      }
      
      this.chartInstance = new Chart(ctx, {
        type: 'pie' as ChartType,
        data: chartData,
        options: {}
      });
    } else {
      console.error('Error al generar los reportes de top productos vendidos.');  }
  }
  
  generarReporteTopProductos(reportes : any) {
    const chartData: { labels: string[], datasets: any[] } = {
      labels: [],
      datasets: [
        {
          label: 'Productos más vendidos',
          data: [],
          backgroundColor: []
        }
      ]
    };
  
    reportes.productos.forEach((productos: any) => {
      chartData.labels.push(productos.descripcion);
      chartData.datasets[0].data.push(productos.cantidad);
      chartData.datasets[0].backgroundColor.push(this.generateRandomColor(5));
    });
  
    const canvas = document.getElementById('top-productos') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      if (this.chartInstance) {
        this.chartInstance.destroy();
      }
      
      this.chartInstance = new Chart(ctx, {
        type: 'pie' as ChartType,
        data: chartData,
        options: {}
      });
    } else {
      console.error('Error al generar los reportes de estado de venta.');
    }
  }
     generateRandomColor(count: number): string[] {
      const colors: string[] = [];
  
      const color = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)},${count})`;
      colors.push(color);
  
      return colors;
    }
  
  
  }
