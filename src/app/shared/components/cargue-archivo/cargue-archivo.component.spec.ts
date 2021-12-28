import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargueArchivoComponent } from './cargue-archivo.component';

describe('CargueArchivoComponent', () => {
  let component: CargueArchivoComponent;
  let fixture: ComponentFixture<CargueArchivoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CargueArchivoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CargueArchivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
