import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaDisenioComponent } from './consulta-disenio.component';

describe('ConsultaDisenioComponent', () => {
  let component: ConsultaDisenioComponent;
  let fixture: ComponentFixture<ConsultaDisenioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaDisenioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaDisenioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
