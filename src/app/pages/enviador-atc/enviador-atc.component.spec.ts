import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnviadorAtcComponent } from './enviador-atc.component';

describe('EnviadorAtcComponent', () => {
  let component: EnviadorAtcComponent;
  let fixture: ComponentFixture<EnviadorAtcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnviadorAtcComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnviadorAtcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
