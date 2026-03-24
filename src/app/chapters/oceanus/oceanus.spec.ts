import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Oceanus } from './oceanus';

describe('Oceanus', () => {
  let component: Oceanus;
  let fixture: ComponentFixture<Oceanus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Oceanus],
    }).compileComponents();

    fixture = TestBed.createComponent(Oceanus);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
