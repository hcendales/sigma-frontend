import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaFiltrosComponent } from './tabla-filtros.component';

describe('TablaFiltrosComponent', () => {
  let component: TablaFiltrosComponent;
  let fixture: ComponentFixture<TablaFiltrosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TablaFiltrosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaFiltrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
