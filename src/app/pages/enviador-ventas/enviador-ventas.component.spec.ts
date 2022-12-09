import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnviadorVentasComponent } from './enviador-ventas.component';

describe('EnviadorVentasComponent', () => {
  let component: EnviadorVentasComponent;
  let fixture: ComponentFixture<EnviadorVentasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnviadorVentasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnviadorVentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
