import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Autenticacao } from '../models/autenticacao.model';

@Injectable({
  providedIn: 'root'
})
export class AuthserviceService {
  private apiUrl = `http://localhost:8080/api/autenticacao`;

  constructor(private http: HttpClient ) {}

  listar(): Observable<Autenticacao[]>{
    return this.http.get<Autenticacao[]>(this.apiUrl);
  }

  login(username: string, password: string): Observable<any>{
    return this.http.post(`${this.apiUrl}/login`, {username, password});
  }

  cadastro(username: string, password: string): Observable<any>{
    return this.http.post(`${this.apiUrl}`, {username, password});
  }

  logout(){
    console.log('Usuário deslogado com sucesso.');
  }
}
