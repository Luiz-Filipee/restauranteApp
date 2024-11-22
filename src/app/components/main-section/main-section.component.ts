import { Component, OnInit } from '@angular/core';
import { Pedido } from '../../models/pedido.model';
import { PedidoService } from '../../services/pedido.service';
import { PedidoResponse } from '../../models/pedidoResponse.model';
import { MesaService } from '../../services/mesa.service';
import { Mesa } from '../../models/mesa.model';
import { empty } from 'rxjs';
import { ClienteService } from '../../services/cliente.service';
import { Cliente } from './../../models/cliente.model';
import { AuthserviceService } from './../../services/authservice.service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-main-section',
  templateUrl: './main-section.component.html',
  styleUrl: './main-section.component.css'
})
export class MainSectionComponent implements OnInit{
  pedidos: Pedido[] = [];
  mostrarPedidos: boolean = false;
  mesas: Mesa[] = [];
  mesasFiltradas: Mesa[] = [];
  exibirFormulario: boolean = false;
  novoCliente: Cliente = { id:0, nome:'', telefone:''};


  constructor(private pedidoService: PedidoService,
    private mesaService: MesaService,
    private clienteService: ClienteService,
    private auth: AuthserviceService,
    private router: Router
  ){}

  onLogout(){
    this.auth.logout();
    this.router.navigate(['']);
  }

  ngOnInit(): void {
      this.mesaService.getMesa().subscribe((mesas) => {
        this.mesas = mesas;
      });
  }

  abrirPedidosFeitos(): void {
    this.pedidoService.getAllPedidos().subscribe((data: Pedido[]) => {
      this.pedidos = data;
      // console.log(data);
      this.mostrarPedidos = true;
    })
  }

  adicionarCliente(){
    this.exibirFormulario = true;
  }

  salvarCliente(){
    if(!this.novoCliente.nome || !this.novoCliente.telefone){
      alert('Preencha todas as informacoes.');
      return;
    }

    this.clienteService.criaCliente(this.novoCliente).subscribe(() => {
      console.log(this.novoCliente);
      this.fecharFormulario();
    });
  }

  fecharFormulario(){
    this.exibirFormulario = false;
    this.novoCliente = { id:0, nome:'', telefone:'' };
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
 