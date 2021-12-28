import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebMapaUmvComponent } from './web-mapa-umv.component';

describe('WebMapaUmvComponent', () => {
  let component: WebMapaUmvComponent;
  let fixture: ComponentFixture<WebMapaUmvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebMapaUmvComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WebMapaUmvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
