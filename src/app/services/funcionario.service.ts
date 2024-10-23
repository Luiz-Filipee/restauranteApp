import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Funcionario } from '../models/funcionario.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FuncionarioService {
  private apiUrl = 'http://localhost:8080/api/funcionario'; // URL da API para funcionários

  constructor(private http: HttpClient) {}

  // Método para buscar funcionário pelo nome
  buscarFuncionarioPorNome(nome: string): Observable<Funcionario | null> {
    return this.http.get<Funcionario>(`${this.apiUrl}/${nome}`);
  }
}
