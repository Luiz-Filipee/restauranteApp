import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cliente } from '../models/cliente.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private apiUrl = 'http://localhost:8080/api/cliente';

  constructor(private http: HttpClient) {}

  buscarClientePorNome(nome: string): Observable<Cliente | null> {
    return this.http.get<Cliente>(`${this.apiUrl}/nome/${nome}`);
  }
}
