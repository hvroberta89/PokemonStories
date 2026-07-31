import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickNoteComponent } from './quick-note.component';

describe('QuickNoteComponent', () => {
  let component: QuickNoteComponent;
  let fixture: ComponentFixture<QuickNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuickNoteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(QuickNoteComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
