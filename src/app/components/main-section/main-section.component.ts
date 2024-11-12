import { Component } from '@angular/core';
import { Pedido } from '../../models/pedido.model';
import { PedidoService } from '../../services/pedido.service';
import { PedidoResponse } from '../../models/pedidoResponse.model';
import { MesaService } from '../../services/mesa.service';
import { Mesa } from '../../models/mesa.model';
import { empty } from 'rxjs';

@Component({
  selector: 'app-main-section',
  templateUrl: './main-section.component.html',
  styleUrl: './main-section.component.css'
})
export class MainSectionComponent{
  pedidos: Pedido[] = [];
  mostrarPedidos: boolean = false;
  mesas: Mesa[] = [];
  mesasFiltradas: Mesa[] = [];

  constructor(private pedidoService: PedidoService,
    private mesaService: MesaService
  ){}

  abrirPedidosFeitos(): void {
    this.pedidoService.getAllPedidos().subscribe((data: Pedido[]) => {
      this.pedidos = data;
      // console.log(data);
      this.mostrarPedidos = true;
    })
  }

  pesquisaMesa(event: KeyboardEvent){
    const textoPesquisa = (event.target as HTMLInputElement).value;

    if(textoPesquisa.trim() === ""){
      this.mesaService.getMesa().subscribe(mesas => {
        this.mesaService.setMesasFiltradas(mesas);
      });
    }else{
      // console.log(textoPesquisa);
      this.mesaService.buscaMesaPeloNomeDoResponsavel(textoPesquisa).subscribe(mesas => {
        if(mesas && mesas.length > 0){
          this.mesaService.setMesasFiltradas(mesas);
        }else{
          this.mesaService.setMesasFiltradas([]);
        }
        console.log(this.mesasFiltradas);
      });
    }    
  }

  fecharModal(): void{
    this.mostrarPedidos = false;
  }
}
 