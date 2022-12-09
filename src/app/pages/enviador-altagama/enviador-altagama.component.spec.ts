import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnviadorAltagamaComponent } from './enviador-altagama.component';

describe('EnviadorAltagamaComponent', () => {
  let component: EnviadorAltagamaComponent;
  let fixture: ComponentFixture<EnviadorAltagamaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnviadorAltagamaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnviadorAltagamaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
