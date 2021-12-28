import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabSeccionesComponent } from './tab-secciones.component';

describe('TabSeccionesComponent', () => {
  let component: TabSeccionesComponent;
  let fixture: ComponentFixture<TabSeccionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabSeccionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabSeccionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
