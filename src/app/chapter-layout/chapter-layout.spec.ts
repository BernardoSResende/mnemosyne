import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChapterLayout } from './chapter-layout';

describe('ChapterLayout', () => {
  let component: ChapterLayout;
  let fixture: ComponentFixture<ChapterLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChapterLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(ChapterLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
