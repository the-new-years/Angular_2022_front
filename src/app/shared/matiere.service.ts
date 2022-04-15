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

  uri = "http://localhost:8010/api/matiere";
  //uri = "https://mbdsangularback.herokuapp.com/api/matiere"
  //uri = "https://backmadagascar2021.herokuapp.com/api/assignments"

  allMatiere(matiere:any):Observable<any> {
    return this.http.get(this.uri, matiere);
  }
}
