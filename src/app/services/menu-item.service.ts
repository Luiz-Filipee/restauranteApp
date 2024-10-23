import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MenuItem } from '../models/menu-item.model';

@Injectable({
  providedIn: 'root'
})
export class MenuItemService {
  private apiUrl = 'http://localhost:8080/api/menu';

  constructor(private http: HttpClient) { }

  getItemMenu(): Observable<MenuItem[]>{
    return this.http.get<MenuItem[]>(this.apiUrl);
  }

  criaItemMenu(menuItem: MenuItem): Observable<MenuItem>{
    return this.http.post<MenuItem>(this.apiUrl, menuItem);
  }
}
