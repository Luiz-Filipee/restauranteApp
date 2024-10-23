import { Component, Input } from '@angular/core';
import { Pedido } from '../../models/pedido.model';

@Component({
  selector: 'app-card-pedidos',
  templateUrl: './card-pedidos.component.html',
  styleUrl: './card-pedidos.component.css'
})
export class CardPedidosComponent {
  @Input() pedidos: Pedido[] = [];
  @Input() mostrar: boolean = false;

  fecharModal(): void {
    this.mostrar = false; 
  }
}
