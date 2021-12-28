import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaAforosComponent } from './lista-aforos.component';

describe('ListaAforosComponent', () => {
  let component: ListaAforosComponent;
  let fixture: ComponentFixture<ListaAforosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaAforosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaAforosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
