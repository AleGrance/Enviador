import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnviadorComercialComponent } from './enviador-comercial.component';

describe('EnviadorComercialComponent', () => {
  let component: EnviadorComercialComponent;
  let fixture: ComponentFixture<EnviadorComercialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnviadorComercialComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnviadorComercialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
