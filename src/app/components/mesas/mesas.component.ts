import { Component, OnInit } from '@angular/core';
import { Mesa } from '../../models/mesa.model';
import { MesaService } from '../../services/mesa.service';
import { MenuItemService } from '../../services/menu-item.service';
import { MenuItem } from '../../models/menu-item.model';
import { PedidoService } from '../../services/pedido.service';
import { Pedido } from '../../models/pedido.model';
import { Funcionario } from '../../models/funcionario.model';
import { FuncionarioService } from '../../services/funcionario.service';
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-mesas',
  templateUrl: './mesas.component.html',
  styleUrl: './mesas.component.css'
})
export class MesasComponent implements OnInit{
  mesas: Mesa[] = [];
  exibirFormulario: boolean = false;
  mesaSelecionada: Mesa = {
    id: 0, 
    cliente: { id: 0, nome: '', telefone: '' }, 
    nome: '',
    status: 'livre',
    pedido: [] 
};
  itensPedidoSelecionados: MenuItem[] = [];
  itensMenu: MenuItem[] = [];
  funcionarioSelecionado: string = '';

  constructor(
    private mesaService: MesaService, 
    private menuItemService: MenuItemService,
    private pedidoService: PedidoService,
    private funcionarioService: FuncionarioService,
    private clienteService: ClienteService
  ) { }

  ngOnInit(): void {
    this.mesaService.getMesa().subscribe((data: Mesa[]) => {
      this.mesas = data;
    });
    this.menuItemService.getItemMenu().subscribe((data: MenuItem[]) => {
      this.itensMenu = data;
    })
  }

  abrirFormularioPedido(mesa: Mesa): void{
    this.mesaSelecionada = {
      id: mesa.id, 
      cliente: { id: 0, nome: '', telefone: '' }, 
      nome: mesa.nome, 
      status: mesa.status,
      pedido: mesa.pedido || [] 
    };
    this.exibirFormulario = true;
  }

  buscarClientePorNome(nome: string): void{
    this.clienteService.buscarClientePorNome(nome).subscribe(cliente => {
      if(cliente){
        this.mesaSelecionada.cliente = cliente;
      }else{
        alert('Cliente nao encontrado');
      }
    }, error => {
      console.error('Erro ao buscar cliente', error);
    });
  }

  fecharFormulario(){
    this.mesaSelecionada = {
      id: 0, 
      cliente: { id: 0, nome: '', telefone: '' }, 
      nome: '', 
      status: '', 
      pedido: [] 
    };
    this.exibirFormulario = false;
    this.itensPedidoSelecionados = [];
  }
  reservarMesa(mesa: Mesa, event: Event): void{
    event.stopPropagation();
    this.mesaSelecionada.cliente = { id: 0, nome: '', telefone: '' }; 
    alert(`Mesa ${mesa.nome} reservada!`);
    mesa.status = 'ocupada';
  }

  salvarPedido(): void{
    if (this.mesaSelecionada && this.itensPedidoSelecionados.length > 0 && this.funcionarioSelecionado) {
      
      this.funcionarioService.buscarFuncionarioPorNome(this.funcionarioSelecionado).subscribe(funcionario => {
        if (funcionario) {
          const pedido: Pedido = {
            id: 0,
            mesa: this.mesaSelecionada,
            itens: this.itensPedidoSelecionados,
            funcionario: funcionario, 
            status: 'pendente',
            precoTotal: this.itensPedidoSelecionados.reduce((acc, item) => acc + item.valor, 0) // Calcular o preço total
          };

          this.pedidoService.realizarPedido(pedido).subscribe(response => {
            console.log('Pedido salvo com sucesso', response);
            this.fecharFormulario();
          }, error => {
            console.error('Erro ao salvar o pedido', error);
          });
        } else {
          alert('Funcionário não encontrado. O pedido não pode ser salvo.');
        }
      }, error => {
        console.error('Erro ao buscar funcionário', error);
      });
    } else {
      alert('Preencha todos os campos antes de salvar o pedido.');
    }
  }
}


