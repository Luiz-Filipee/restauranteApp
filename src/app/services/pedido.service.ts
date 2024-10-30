import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pedido } from '../models/pedido.model';
import { PedidoResponse } from '../models/pedidoResponse.model';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private apiUrl = 'http://localhost:8080/api/pedidos'

  constructor(private http: HttpClient) { }

  getAllPedidos(): Observable<PedidoResponse[]>{
    return this.http.get<PedidoResponse[]>(this.apiUrl);
  }

  realizarPedido(pedido: Pedido): Observable<Pedido>{
    return this.http.post<Pedido>(this.apiUrl, pedido);
  }

  marcarComoPronto(pedidoId: number): Observable<void>{
    return this.http.put<void>(`${this.apiUrl}/${pedidoId}/pronto`, {});
  }

  deletarPedido(pedidoId: number): Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/${pedidoId}`);
  }
}
