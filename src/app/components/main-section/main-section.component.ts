import { Component } from '@angular/core';
import { Pedido } from '../../models/pedido.model';
import { PedidoService } from '../../services/pedido.service';

@Component({
  selector: 'app-main-section',
  templateUrl: './main-section.component.html',
  styleUrl: './main-section.component.css'
})
export class MainSectionComponent {
  pedidos: Pedido[] = [];
  mostrarPedidos: boolean = false;

  constructor(private pedidoService: PedidoService){}

  abrirPedidosFeitos(): void {
    this.pedidoService.getAllPedidos().subscribe((data: Pedido[]) => {
      this.pedidos = data;
      // console.log(data);
      this.mostrarPedidos = true;
    })
  }
}
 