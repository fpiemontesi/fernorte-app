import { Component } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order';
import { Detail } from '../../models/Detail';
import { InvoiceService } from '../../services/invoice.service';
import { Client } from '../../models/Clients/Client';
import { CustomerService } from '../../services/customer.service';
import { formatDate } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { DiscountDTO } from '../../models/DiscountDTO';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RegistrarPagoComponent } from '../registrar-pago/registrar-pago.component';
import { tap } from 'rxjs';
import { SharedDataInvoiceService } from '../../services/shared-data-invoice.service';
import { DiscountRequest, Invoice, OrderDetail, Product } from '../../models/Invoice';
registerLocaleData(localeEs);

@Component({
  selector: 'fn-registrar-factura',
  templateUrl: './registrar-factura.component.html',
  styleUrls: ['./registrar-factura.component.css'],
})
export class RegistrarFacturaComponent {
  openModal() {
    const modalRef = this.modalService.open(RegistrarPagoComponent, {
      size: 'lg',
    });
    modalRef.componentInstance.invoiceTotal = this.orderSelected.total;
  }
  orderSelected: Order = new Order();
  client: Client[] = [];
  id: number = 0;
  fechaHoy: Date = new Date();
  invoice: Invoice = new Invoice();
  tipoFactura: string = 'A'

  constructor(
    private orderService: OrderService,
    private invoiceservice: InvoiceService,
    private customerserv: CustomerService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private sharedDataInvoice: SharedDataInvoiceService
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.orderSelected = this.orderService.getOrderSelected();

    this.customerserv
      .obtenerClienteByNroDoc(this.orderSelected.doc_cliente)
      .subscribe((data) => {
        this.client = data;
        console.log(this.client);
      });
    this.calcularDescuentos();

  }
  realizarPago() { }

  calcularDescuentos() {
    //HICE UNOS CALCULOS PORQUE EL TOTAL ESTA MAL
    let totalDescuento = 0
    this.orderSelected.total = parseFloat(
      (
        ((this.orderSelected.detalles[0].precio_unitario * this.orderSelected.detalles[0].cantidad) +
          (this.orderSelected.detalles[1].precio_unitario * this.orderSelected.detalles[1].cantidad))
      ).toFixed(2)
    );

    console.log(this.orderSelected.total)

    for (const disc of this.orderSelected.descuentos) {
      disc.discounted = (disc.porcentaje / 100) * this.orderSelected.total;
      totalDescuento += disc.discounted
    }

    console.log(totalDescuento)
    this.orderSelected.total = this.orderSelected.total - totalDescuento

    console.log(this.orderSelected.total)
  }



  obtenerInvoiceData() {
    this.invoice.orderId = this.orderSelected.id
    this.invoice.clientId = 87654321    //this.orderSelected.idCliente
    this.invoice.type = this.tipoFactura
    this.invoice.status = 'PENDING'
    this.invoice.iva = 0.21
    this.invoice.reservationId = this.orderSelected.id_reserva

    let listDiscount: DiscountRequest[] = []
    //CREO LA LISTA DE DESCUENTOS
    for (let discount of this.orderSelected.descuentos) {
      let discountRequest: DiscountRequest = new DiscountRequest();
      discountRequest.percentage = discount.porcentaje
      discountRequest.description = discount.descripcion
      listDiscount.push(discountRequest)
    }
    this.invoice.discountRequestList = listDiscount;

    //CREO LA LISTA DE DETALLES
    let listDetail: OrderDetail[] = []
    for (let detail of this.orderSelected.detalles) {
      let producto: Product = new Product();
      let detalleOrden: OrderDetail = new OrderDetail();

      //CREO EL PRODUCTO
      producto.product_id = detail.cod_prod
      producto.name = detail.descripcion
      producto.price = detail.precio_unitario

      //CREO EL DETALLE
      detalleOrden.product = producto
      detalleOrden.amount = detail.cantidad
      detalleOrden.measurementUnit = ''
      listDetail.push(detalleOrden)
    }

    this.invoice.details = listDetail

    this.sharedDataInvoice.setInvoiceData(this.invoice)
  }
}
