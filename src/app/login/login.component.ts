import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth.service';
import { DataService } from '../shared/data.service';
import { Login } from './login.model';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  login:Login[];
  signin = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });
  register = new FormGroup({
    nameRegister:new FormControl(''),
    emailRegister: new FormControl(''),
    passwordRegister: new FormControl(''),
    roleRegister: new FormControl(''),
  });
  champs ='';

  constructor(private router:Router, private authService:AuthService, private dataService:DataService ) { }

  ngOnInit(): void {}

  onSubmit() {
    if(this.signin.valid){
      let nouvelAuthentification = new Login();
      nouvelAuthentification.email = this.signin.value.email;
      nouvelAuthentification.password = this.signin.value.password;
      this.authService.authentification(nouvelAuthentification)
        .subscribe(
          reponse => {
          console.log(reponse);
          this.authService.setRole(reponse.role);
          this.authService.setName(reponse.name);
          this.dataService.userInfo.next({
            nomUser: reponse.name,
            roleUser: reponse.role
          });
          this.router.navigate(["/home"]);
        },error => {
          this.champs = "Username or password is incorrect";
      });
    }
    if(this.register.valid){
      let newUser = new Login();
      newUser.name = this.register.value.nameRegister;
      newUser.email = this.register.value.emailRegister;
      newUser.password = this.register.value.passwordRegister;
      newUser.role = this.register.value.roleRegister;
      this.authService.register(newUser)
        .subscribe(reponse => {
          console.log(reponse);
          alert("Succes,veuillez vous connecter");
          this.register.reset();
        });
    }
  }
/*
  onLogout(){
    this.authService.logout(Response)
    .then((res) => {
      this.router.navigate('/login');
    }, (error) => {
      console.log('Logout error', error);
    });
  }
*/
}
