import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogVerVisitaDisenioComponent } from './dialog-ver-visita-disenio.component';

describe('DialogVerVisitaDisenioComponent', () => {
  let component: DialogVerVisitaDisenioComponent;
  let fixture: ComponentFixture<DialogVerVisitaDisenioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogVerVisitaDisenioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogVerVisitaDisenioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
