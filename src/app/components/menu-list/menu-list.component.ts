import { Component, OnInit } from '@angular/core';
import { MenuItem } from '../../models/menu-item.model';
import { MenuItemService } from '../../services/menu-item.service';

@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.css']
})
export class MenuListComponent implements OnInit {
  menuItem: MenuItem[] = [];

   constructor(
    private menuItemService: MenuItemService
   ){}

   ngOnInit(): void {
    console.log('inicializado');
       this.menuItemService.getItemMenu().subscribe((data: MenuItem[]) => {
        this.menuItem = data;
       })
   }
}
