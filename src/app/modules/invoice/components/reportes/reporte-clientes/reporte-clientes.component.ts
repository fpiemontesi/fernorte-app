import { Component } from '@angular/core';
import { ClientReportDTO } from '../../../models/client-report-dto';
import { ReportesService } from '../../../services/reportes.service';

@Component({
  selector: 'fn-reporte-clientes',
  templateUrl: './reporte-clientes.component.html',
  styleUrls: ['./reporte-clientes.component.css']
})
export class ReporteClientesComponent {

  clients:ClientReportDTO[] = [];

  constructor(private reportService:ReportesService){
    reportService.obtenerMontoTotalPorCliente().subscribe((result) => 
      this.clients = result
    )
  }
}
