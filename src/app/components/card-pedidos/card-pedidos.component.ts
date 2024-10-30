import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Pedido } from '../../models/pedido.model';
import { PedidoResponse } from '../../models/pedidoResponse.model';
import { PedidoService } from '../../services/pedido.service';

@Component({
  selector: 'app-card-pedidos',
  templateUrl: './card-pedidos.component.html',
  styleUrl: './card-pedidos.component.css'
})
export class CardPedidosComponent {
  @Input() pedidos: Pedido[] = [];
  @Input() mostrar: boolean = false;
  @Output() fecharModalEvent = new EventEmitter<void>();

  constructor(private pedidoService: PedidoService){}

  fecharModal(): void {
    this.fecharModalEvent.emit();
  }

  marcarComoPronto(pedidoId: number): void{
    if(pedidoId !== undefined){
      this.pedidoService.marcarComoPronto(pedidoId).subscribe(response => {
        const pedidoAtualizado = this.pedidos.find(p => p.id === pedidoId);
        if (pedidoAtualizado) {
          pedidoAtualizado.status = 'Pronto'; 
          console.log(pedidoId);
        }
      }, error => {
        console.error('Erro ao marcar pedido como pronto:', error);
      });
    }else{
      console.error('ID do pedido esta undefined');
    }
  }

  deletarPedido(pedidoId: number): void{
      this.pedidoService.deletarPedido(pedidoId).subscribe(response => {
        this.pedidos = this.pedidos.filter(p => p.id !== pedidoId);
      }, error => {
        console.error('Erro ao deletar pedido:', error);
        alert('Impossivel deletar pedido, pois esta associado a uma mesa existente.');
  });
  }
}
