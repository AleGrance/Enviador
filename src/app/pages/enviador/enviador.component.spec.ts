import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnviadorComponent } from './enviador.component';

describe('EnviadorComponent', () => {
  let component: EnviadorComponent;
  let fixture: ComponentFixture<EnviadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnviadorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnviadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
