import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableDocumentosComponent } from './table-documentos.component';

describe('TableDocumentosComponent', () => {
  let component: TableDocumentosComponent;
  let fixture: ComponentFixture<TableDocumentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableDocumentosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableDocumentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
