import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Mesa } from '../models/mesa.model';

@Injectable({
  providedIn: 'root'
})
export class MesaService {

  private apiUrl = 'http://localhost:8080/api/mesa';
  private mesasFiltradasSource = new BehaviorSubject<Mesa[]>([]);
  mesasFiltradas$ = this.mesasFiltradasSource.asObservable();

  constructor(private http: HttpClient) { }

  getMesa(): Observable<Mesa[]>{
    return this.http.get<Mesa[]>(this.apiUrl);
  }

  criaMesa(mesa: Mesa): Observable<Mesa>{
    return this.http.post<Mesa>(this.apiUrl, mesa);
  }

  updateMesa(id: number, mesa: Mesa): Observable<Mesa> {
    return this.http.put<Mesa>(`${this.apiUrl}/${id}`, mesa);
  }

  deletaMesa(id: number): Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  buscaMesaPeloNomeDoResponsavel(nomeCliente: string): Observable<Mesa[]>{
    return this.http.get<Mesa[]>(`${this.apiUrl}/${nomeCliente}`);
  }

  setMesasFiltradas(mesas: Mesa[]) {
    this.mesasFiltradasSource.next(mesas);
  }
}
