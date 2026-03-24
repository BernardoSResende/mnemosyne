import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Kairos } from './kairos';

describe('Kairos', () => {
  let component: Kairos;
  let fixture: ComponentFixture<Kairos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Kairos],
    }).compileComponents();

    fixture = TestBed.createComponent(Kairos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
