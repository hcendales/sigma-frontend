import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapaUmvComponent } from './mapa-umv.component';

describe('MapaUmvComponent', () => {
  let component: MapaUmvComponent;
  let fixture: ComponentFixture<MapaUmvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapaUmvComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapaUmvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
