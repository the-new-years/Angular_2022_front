import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { Login } from '../login/login.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  admin = false;
  prof = false;
  etudiant = false;
  role = '';
  name = '';

  constructor(private http:HttpClient) { }

  uri = "https://angular-backend-kanga-ahibo.herokuapp.com/api/auth";
  

  authentification(login:any):Observable<any> {
    console.log("Authentification...")
    return this.http.post(this.uri+'/login', login);
  }
  register(login:any):Observable<any> {
    console.log("Enregistrement en cours...")
    return this.http.post(this.uri+'/register', login);
  }
  logout(login:any):Observable<any> {
    console.log("deconnexion en cours...")
    return this.http.post(this.uri+'/logout', login);
  }

  // exemple d'utilisation :
  // isAdmin.then(admin => { console.log("administrateur : " + admin);})
  isAdmin() {
    return new Promise((resolve, reject) => {
      resolve(this.admin);
    });
  }
  isProf(){
    return new Promise((resolve, reject) => {
      resolve(this.prof);
    });
  }
  isEtudiant(){
    return new Promise((resolve, reject) => {
      resolve(this.etudiant);
    });
  }
  roleUtilisateur(){
    return new Promise((resolve, reject) => {
      resolve(this.role);
      
    });
  }
  setRole(newRole:any){
    if(newRole=='Admin'){
      this.admin=newRole;
    }
    if(newRole=='Etudiant'){
      this.etudiant=newRole;
    }
    if(newRole=='Prof'){
      this.prof=newRole;
    }
    this.role=newRole;
  }
  setName(name){
    this.name =name;
  }
  getUserInfo(){
    let user = new Login();
    user.name = this.name;
    user.role = this.role;
    return user;
  }

}
