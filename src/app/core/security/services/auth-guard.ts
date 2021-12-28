import { Injectable } from '@angular/core';
import { Router, CanActivate, CanActivateChild, CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { SecurityService } from './security.service';

@Injectable({
  providedIn: 'root'
})
/*
Guarda que verifica que el usuario tenga autorización para acceder a la url especifica
*/
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {

  constructor(private securityService:SecurityService, private router:Router){

  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const path: string = route.pathFromRoot.map(v => v.url.map(segment => segment.toString()).join('/')).join('/');
    return this.authCheck(path);
  }
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const navigation = this.router.getCurrentNavigation();
      let path = navigation?navigation.extractedUrl.toString():'';
      return this.authCheck(path,true);
  }

  private async authCheck(path:string,isModule?:boolean){
    //verifica si el usuario está logueado
    if(!this.securityService.isLoggedIn()){
      this.router.navigate(['login'],{queryParams: { retUrl: path}});
      return false;
    }
    //verifica si tiene acceso a la url
    if(!(await this.securityService.validUrl(path))){
      this.router.navigate([isModule?'not-found':'not-authorized']);
      return false;
    }
    return true;
  }
}
