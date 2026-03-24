import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Odyssey } from './odyssey';

describe('Odyssey', () => {
  let component: Odyssey;
  let fixture: ComponentFixture<Odyssey>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Odyssey],
    }).compileComponents();

    fixture = TestBed.createComponent(Odyssey);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
