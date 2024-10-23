import { Cliente } from "./cliente.model";
import { Pedido } from "./pedido.model";

export interface Mesa{
id: number;
  cliente: Cliente; 
  nome: string;
  status: string; 
  pedido?: Pedido[];
}