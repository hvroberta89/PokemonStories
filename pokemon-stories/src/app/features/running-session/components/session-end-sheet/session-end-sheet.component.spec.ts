import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionEndSheetComponent } from './session-end-sheet.component';

describe('SessionEndSheetComponent', () => {
  let component: SessionEndSheetComponent;
  let fixture: ComponentFixture<SessionEndSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionEndSheetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SessionEndSheetComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
