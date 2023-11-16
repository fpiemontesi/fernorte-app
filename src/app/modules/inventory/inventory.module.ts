import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { ReceiptListComponent } from './components/receipts/lista-remitos/lista-remitos.component';
import { ReceiptDetailsModalComponent } from './components/receipts/receipt-details-modal/receipt-details-modal.component';
import { RegistrarRemitoComponent } from './components/remito/registrar-remito/registrar-remito.component';
import { RegistrarLotesComponent } from './components/registrar-lotes/registrar-lotes.component';
import { FormsModule } from '@angular/forms';
import { ToastsComponent } from './components/toast/toasts.component';
import { NgbToast } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [HomeComponent, RegistrarLotesComponent, RegistrarRemitoComponent, ToastsComponent
                ,ReceiptListComponent ,ReceiptDetailsModalComponent],
  providers: [],
  imports: [
    CommonModule,
    FormsModule,
    NgbToast
  ],
  exports: [HomeComponent],
})
export class InventaryModule {}
