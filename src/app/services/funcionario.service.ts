import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Funcionario } from '../models/funcionario.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environmento';

@Injectable({
  providedIn: 'root'
})
export class FuncionarioService {
  private apiUrl = `${environment.apiUrl}/funcionarios`;

  constructor(private http: HttpClient) {}

  getFuncionariosAll(): Observable<Funcionario[]>{
    return this.http.get<Funcionario[]>(this.apiUrl);
  }

  // Método para buscar funcionário pelo nome
  buscarFuncionarioPorNome(nome: string): Observable<Funcionario | null> {
    return this.http.get<Funcionario>(`${this.apiUrl}/${nome}`);
  }
}
