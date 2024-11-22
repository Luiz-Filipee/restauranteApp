import { Component, OnInit } from '@angular/core';
import { AuthserviceService } from '../../services/authservice.service';
import { Autenticacao } from '../../models/autenticacao.model';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  autenticacaoUser: Autenticacao = { id: 0, username:'', password:''};
  errorMessage: string = '';
  exibirFormulario: boolean = true;
  usuarios: Autenticacao[] = [];

  constructor(private authService: AuthserviceService, private router: Router) {}

  ngOnInit(): void {
      this.authService.listar().subscribe((data) => {
        this.usuarios = data;
        console.log(data);
      });
  }

  onLogin(){
    console.log(this.autenticacaoUser);
    this.authService.login(this.autenticacaoUser.username, this.autenticacaoUser.password).subscribe(
      (response) => {
        console.log(response);
        this.router.navigate(['home']);
      },
      (error) => {
        console.log(error);
        this.errorMessage = 'Falha na autenticação. Verifique suas credenciais.';
      }
    )
  }

  onCadastro(){
    this.authService.cadastro(this.autenticacaoUser.username, this.autenticacaoUser.password).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        this.errorMessage = 'Falha no cadastro. Verifique suas credenciais.';
      }
    )
  }

  // fecharFormulario(){
  //   this.exibirFormulario = false;
  //   this.autenticacaoUser = { id: 0, username:'', password:''};
  // }
}
