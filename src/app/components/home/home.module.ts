import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { MenuListComponent } from '../menu-list/menu-list.component';
import { HomeComponent } from './home.component';
import { MainSectionComponent } from '../main-section/main-section.component';
import { MesasComponent } from '../mesas/mesas.component';
import { FormsModule } from '@angular/forms';  // Import FormsModule
import { CardPedidosComponent } from '../card-pedidos/card-pedidos.component';



@NgModule({
  declarations: [
    HomeComponent, 
    MainSectionComponent,
    MesasComponent,
    MenuListComponent,
    CardPedidosComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule  
  ],
  providers: [
    provideClientHydration()
  ],
  exports: [
    HomeComponent
  ]
})
export class HomeModule { }
