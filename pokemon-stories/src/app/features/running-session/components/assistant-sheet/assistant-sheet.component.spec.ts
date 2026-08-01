import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistantSheetComponent } from './assistant-sheet.component';

describe('AssistantSheetComponent', () => {
  let component: AssistantSheetComponent;
  let fixture: ComponentFixture<AssistantSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssistantSheetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AssistantSheetComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
