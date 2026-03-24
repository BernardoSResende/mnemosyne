import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Talos } from './talos';

describe('Talos', () => {
  let component: Talos;
  let fixture: ComponentFixture<Talos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Talos],
    }).compileComponents();

    fixture = TestBed.createComponent(Talos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
