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
    status: 'livre',
    pedido: [] 
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
    });
    this.menuItemService.getItemMenu().subscribe((data: MenuItem[]) => {
      this.itensMenu = data;
    });
    this.clienteService.getClientesAll().subscribe((data: Cliente[]) => {
      this.clientes = data;
      console.log(data);
    });
    this.mesaService.mesasFiltradas$.subscribe((mesasFiltradas) => {
      this.mesas = mesasFiltradas; 
    });
    this.funcionarioService.getFuncionariosAll().subscribe((data: Funcionario[]) => {
      this.funcionarios = data;
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
      status: mesa.status,
      pedido: mesa.pedido || [] 
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
    // console.log(mesa);
  }

  deletarMesa(mesa: Mesa, event: MouseEvent): void{
    event.stopPropagation();
    const confimacao = confirm(`Tem certeza que deseja deletar a mesa "${mesa.nome}"?`);
    if(confimacao){
      this.mesaService.deletaMesa(mesa.id).subscribe({
        next: (response) => {
          console.log(`Mesa deletada ${mesa}`);
          this.mesas = this.mesas.filter(m => m.id !== mesa.id);
        },
        error: (err) => {
          console.error('Erro ao deletar mesa:', err);
          alert('Erro ao deletar mesa, esta associado a outros registros');
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
      id: 0, nome: '', 
      status: 'disponivel', 
      cliente: { id: 0, nome: '', telefone: '' }, 
      pedido: []
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

    this.mesaService.criaMesa(this.mesaSelecionada).subscribe({
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


