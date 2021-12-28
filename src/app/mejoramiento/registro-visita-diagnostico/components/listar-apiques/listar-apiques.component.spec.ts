import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarApiquesComponent } from './listar-apiques.component';

describe('ListarApiquesComponent', () => {
  let component: ListarApiquesComponent;
  let fixture: ComponentFixture<ListarApiquesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListarApiquesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarApiquesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
