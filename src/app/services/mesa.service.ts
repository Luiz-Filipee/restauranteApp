import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Mesa } from '../models/mesa.model';

@Injectable({
  providedIn: 'root'
})
export class MesaService {

  private apiUrl = 'http://localhost:8080/api/mesa';

  constructor(private http: HttpClient) { }

  getMesa(): Observable<Mesa[]>{
    return this.http.get<Mesa[]>(this.apiUrl);
  }

  criaMesa(menuItem: Mesa): Observable<Mesa>{
    return this.http.post<Mesa>(this.apiUrl, menuItem);
  }

  updateMesa(id: number, mesa: Mesa): Observable<Mesa> {
    return this.http.put<Mesa>(`${this.apiUrl}/${id}`, mesa);
  }

  deletaMesa(id: number): Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
