import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree,Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProfGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
     //return false;
    return this.authService.isProf().then((isProf) => {
      if (isProf) {
        return true;
      } else {
        // On renvoie vers la page d'accueil
        alert("GUARD : Vous n'y avez pas accès !)");
        this.router.navigate(['/home']);
        return false;
      }
    });
  }
  
}
