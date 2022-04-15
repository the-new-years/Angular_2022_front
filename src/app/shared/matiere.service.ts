import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoggingService } from './logging.service';
import { AuthService} from './auth.service';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class MatiereService {

  constructor(private loggingService:LoggingService, private http:HttpClient,private authService:AuthService) { }

  uri = "https://angular-backend-kanga-ahibo.herokuapp.com/api/matiere";
 

  allMatiere(matiere:any):Observable<any> {
    return this.http.get(this.uri, matiere);
  }
}
