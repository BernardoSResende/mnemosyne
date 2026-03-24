import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Elysium } from './elysium';

describe('Elysium', () => {
  let component: Elysium;
  let fixture: ComponentFixture<Elysium>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Elysium],
    }).compileComponents();

    fixture = TestBed.createComponent(Elysium);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
