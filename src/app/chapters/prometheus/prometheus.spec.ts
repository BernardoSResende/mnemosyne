import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Prometheus } from './prometheus';

describe('Prometheus', () => {
  let component: Prometheus;
  let fixture: ComponentFixture<Prometheus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Prometheus],
    }).compileComponents();

    fixture = TestBed.createComponent(Prometheus);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
