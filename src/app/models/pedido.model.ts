import { Funcionario } from "./funcionario.model";
import { MenuItem } from "./menu-item.model";
import { Mesa } from "./mesa.model";

export interface Pedido{
    id: number;
    funcionario: Funcionario;
    itens: MenuItem[];
    mesa: Mesa;
    status: string;
    precoTotal: number;
}