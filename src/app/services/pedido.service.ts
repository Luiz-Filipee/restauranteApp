import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pedido } from '../models/pedido.model';
import { PedidoResponse } from '../models/pedidoResponse.model';
import { environment } from '../../environments/environmento';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private apiUrl = `${environment.apiUrl}/pedidos`;

  constructor(private http: HttpClient) { }

  getAllPedidos(): Observable<PedidoResponse[]>{
    return this.http.get<PedidoResponse[]>(this.apiUrl);
  }

  realizarPedido(pedido: Pedido): Observable<Pedido>{
    return this.http.post<Pedido>(this.apiUrl, pedido);
  }

  marcarComoPronto(pedidoId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${pedidoId}/pronto`, {});
}

  deletarPedido(pedidoId: number): Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/${pedidoId}`);
  }
}
