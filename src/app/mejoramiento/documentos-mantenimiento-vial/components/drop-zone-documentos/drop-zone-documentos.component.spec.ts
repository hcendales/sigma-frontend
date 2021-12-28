import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropZoneDocumentosComponent } from './drop-zone-documentos.component';

describe('DropZoneDocumentosComponent', () => {
  let component: DropZoneDocumentosComponent;
  let fixture: ComponentFixture<DropZoneDocumentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DropZoneDocumentosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DropZoneDocumentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
