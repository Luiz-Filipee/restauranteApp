import { Funcionario } from "./funcionario.model";
import { MenuItem } from "./menu-item.model";
import { Mesa } from "./mesa.model";

export interface PedidoResponse{
    id: number,
    funcionario: Funcionario;
    status: string;
    mesa: Mesa;
    precoTotal: number;
    itens: MenuItem[];
}