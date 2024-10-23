import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pedido } from '../models/pedido.model';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private apiUrl = 'http://localhost:8080/api/pedidos'

  constructor(private http: HttpClient) { }

  getAllPedidos(): Observable<Pedido[]>{
    return this.http.get<Pedido[]>(this.apiUrl);
  }

  realizarPedido(pedido: Pedido): Observable<Pedido>{
    return this.http.post<Pedido>(this.apiUrl, pedido);
  }
}
