import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaGestionPendienteComponent } from './tabla-gestion-pendiente.component';

describe('TablaGestionPendienteComponent', () => {
  let component: TablaGestionPendienteComponent;
  let fixture: ComponentFixture<TablaGestionPendienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TablaGestionPendienteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaGestionPendienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
