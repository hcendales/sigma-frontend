import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { SecurityService } from '../security/services/security.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @ViewChild('sidenav') sidenav: any;
  setBackdrop:boolean;

  appMenu:any;
  
  constructor(public securityService:SecurityService, public router:Router) {
    this.setBackdrop = false;
    this.appMenu = securityService.userMenus;
    this.onWindowResize();
  }

  ngOnInit(): void {

  }

  toggleSidenav(){
    this.sidenav.toggle();
  }

  @HostListener('window:resize',['$event'])
  public onWindowResize(event?:any): void {
    this.setBackdrop = window.innerWidth < 700;
  }

  logOut(){
    this.securityService.logout();
    this.router.navigate(['login']);
  }

  clickMenu(){
    console.log('LLegoo');
  }

}
