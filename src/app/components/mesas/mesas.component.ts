import { Component, OnInit } from '@angular/core';
import { Mesa } from '../../models/mesa.model';
import { MesaService } from '../../services/mesa.service';
import { MenuItemService } from '../../services/menu-item.service';
import { PedidoService } from '../../services/pedido.service';
import { Pedido } from '../../models/pedido.model';
import { Funcionario } from '../../models/funcionario.model';
import { FuncionarioService } from '../../services/funcionario.service';
import { ClienteService } from '../../services/cliente.service';
import { Cliente } from '../../models/cliente.model';
import { MenuItem } from './../../models/menu-item.model';

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
    status: 'livre'
};
  itensPedidoSelecionados: MenuItem[] = [];
  itensMenu: MenuItem[] = [];
  funcionarioSelecionado: string = '';
  formularioTipo: 'pedido' | 'mesa' = 'pedido';
  clientes: Cliente[] = [];
  funcionarios: Funcionario[] = [];
  maxMesas = 3;
  mesasRestantes = this.maxMesas

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
      console.log(data);
    });
    this.menuItemService.getItemMenu().subscribe((data: MenuItem[]) => {
      this.itensMenu = data;
      console.log(data);
    });
    this.clienteService.getClientesAll().subscribe((data: Cliente[]) => {
      this.clientes = data;
      console.log(data);
    });
    this.mesaService.mesasFiltradas$.subscribe((mesasFiltradas) => {
      this.mesas = mesasFiltradas; 
      console.log(mesasFiltradas);

    });
    this.funcionarioService.getFuncionariosAll().subscribe((data: Funcionario[]) => {
      this.funcionarios = data;
      console.log(data);
    });
  }

  atualizarMesas(){
    this.mesaService.getMesa().subscribe(mesas => {
      this.mesas = mesas;
      this.mesasRestantes = this.maxMesas - this.mesas.length; 
    });
  }

  abrirFormularioPedido(mesa: Mesa): void{
    this.mesaSelecionada = {
      id: mesa.id, 
      cliente: { id: 0, nome: '', telefone: '' }, 
      nome: mesa.nome, 
      status: mesa.status
    };
    this.exibirFormulario = true;
    this.formularioTipo = 'pedido';
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
      status: ''
    };
    this.exibirFormulario = false;
    this.itensPedidoSelecionados = [];
  }

  reservarMesa(mesa: Mesa, event: Event): void{
    event.stopPropagation();
    this.mesaSelecionada.cliente = { id: 0, nome: '', telefone: '' }; 
    alert(`Mesa ${mesa.nome} reservada!`);
    mesa.status = 'ocupada';
    // console.log(mesa);
  }

  deletarMesa(mesa: Mesa, event: MouseEvent): void{
    event.stopPropagation();
    const confimacao = confirm(`Tem certeza que deseja deletar a mesa "${mesa.nome}"?`);
    console.log(mesa);
    if(confimacao){
      console.log(`mesa id ${mesa.id}`);
      this.mesaService.deletaMesa(mesa.id).subscribe({
        next: (response) => {
          console.log(`Mesa deletada ${mesa.id}`);
          this.mesas = this.mesas.filter(m => m.id !== mesa.id);
        },
        error: (err) => {
          console.error('Erro ao deletar mesa:', err);
          if (err.error && err.error.error) {
              alert(`Erro ao deletar mesa: ${err.error.error}`);
          } else {
              alert('Erro desconhecido ao deletar a mesa');
          }
        }
      });
    }
  }

  adicionarMesa(): void{
    // console.log('clicou');
    if(this.mesasRestantes <= 0){
      alert('Capacidade máxima de mesas atingida!');
      return;
    }
    this.exibirFormulario = true;
    this.formularioTipo = 'mesa';
    this.mesaSelecionada = { 
      id: 0, 
      nome: '', 
      status: 'disponivel', 
      cliente: { id: 0, nome: '', telefone: '' }, 
    };
  }

  verificarCapacidade(): string {
    return this.mesasRestantes <= 0 ? 'Restaurante Cheio' : `${this.mesasRestantes} mesas restantes`;
  }

  salvarMesa(): void{
    if(!this.mesaSelecionada.cliente || !this.mesaSelecionada.cliente.id){
      alert('Selecione um cliente para associar a mesa.');
      return;
    }

    const mesaData = {
      id: this.mesaSelecionada.id,
      nome: this.mesaSelecionada.nome,
      status: this.mesaSelecionada.status,
      cliente_id: this.mesaSelecionada.cliente.id 
    };
    console.log(mesaData);

    this.mesaService.criaMesa(mesaData).subscribe({
      next: (mesaCriada) => {
        this.mesas.push(mesaCriada);
        this.mesasRestantes = this.maxMesas - this.mesas.length;
        this.fecharFormulario();
        console.log('Mesa criada com sucesso:', mesaCriada);
      },
      error: (err) => {
        console.error('Erro ao criar mesa:', err);
      }
    });
  }

  compareClientes(cliente1: Cliente, cliente2: Cliente): boolean{
    return cliente1 && cliente2 ? cliente1.id === cliente2.id : cliente1 === cliente2;
  }

  salvarPedido(): void{
    console.log('Mesa Selecionada:', this.mesaSelecionada);
    console.log('Itens do Pedido Selecionados:', this.itensPedidoSelecionados);
    console.log('Funcionário Selecionado:', this.funcionarioSelecionado);

    if(!this.mesaSelecionada.id || this.mesaSelecionada.id === 0){
      alert('Mesa nao selecionada. Por favor, selecione uma mesa valida.');
      return;
    }

    if (this.mesaSelecionada && this.itensPedidoSelecionados.length > 0 && this.funcionarioSelecionado) {

      this.funcionarioService.buscarFuncionarioPorNome(this.funcionarioSelecionado).subscribe(funcionario => {
        if (funcionario) {
      
          const pedido: Pedido = {
            id: 0,
            mesa: this.mesaSelecionada,
            itens: this.itensPedidoSelecionados,
            funcionario: funcionario, 
            status: 'pendente',
            precoTotal: this.itensPedidoSelecionados.reduce((acc, item) => acc + item.valor, 0) 
          };
          console.log(pedido);

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

  atualizarItensPedido(event: Event): void {
    const elementoSelecionado = event.target as HTMLSelectElement;
    const opcoesSelect = Array.from(elementoSelecionado.selectedOptions) as HTMLOptionElement[];
  
    opcoesSelect.forEach(opcao => {
      const itemId = Number(opcao.value);
      const item = this.itensMenu.find(menuItem => menuItem.id === itemId);

      if(item && !this.itensPedidoSelecionados.some(elementoSelecionado => elementoSelecionado.id === item.id)){
        this.itensPedidoSelecionados.push(item);
      }
    });

    console.log('Itens selecionados: ', this.itensPedidoSelecionados);
  }
  
}


