import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Daedalus } from './daedalus';

describe('Daedalus', () => {
  let component: Daedalus;
  let fixture: ComponentFixture<Daedalus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Daedalus],
    }).compileComponents();

    fixture = TestBed.createComponent(Daedalus);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
