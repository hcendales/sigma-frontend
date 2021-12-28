import { Component, OnInit, Input, ViewChild,Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss']
})
export class MenuItemComponent implements OnInit {
  @Input()
  items: any[] = [];

  @Output() clickMenu = new EventEmitter<any>();

  @ViewChild('childMenu', {static: true})
  public childMenu:any = null;

  constructor() {
    
  }

  ngOnInit(): void {
  }

  clickMenuEvt(){
   
    this.clickMenu.emit();
    
  }

  clickMenuChildEvt(){
    
    this.clickMenu.emit();
    
  }

}
