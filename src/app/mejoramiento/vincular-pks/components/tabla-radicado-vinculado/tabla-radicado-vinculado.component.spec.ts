import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaRadicadoVinculadoComponent } from './tabla-radicado-vinculado.component';

describe('TablaRadicadoVinculadoComponent', () => {
  let component: TablaRadicadoVinculadoComponent;
  let fixture: ComponentFixture<TablaRadicadoVinculadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TablaRadicadoVinculadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaRadicadoVinculadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
