import { Cliente } from "./cliente.model";

export interface Mesa{
  id: number;
  nome: string;
  status: string; 
  cliente: Cliente; 
}