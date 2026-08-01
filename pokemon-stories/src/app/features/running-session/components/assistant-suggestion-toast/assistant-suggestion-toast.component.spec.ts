import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistantSuggestionToastComponent } from './assistant-suggestion-toast.component';

describe('AssistantSuggestionToastComponent', () => {
  let component: AssistantSuggestionToastComponent;
  let fixture: ComponentFixture<AssistantSuggestionToastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssistantSuggestionToastComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AssistantSuggestionToastComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
