import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistantPromptComponent } from './assistant-prompt.component';

describe('AssistantPromptComponent', () => {
  let component: AssistantPromptComponent;
  let fixture: ComponentFixture<AssistantPromptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssistantPromptComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AssistantPromptComponent);
    fixture.componentRef.setInput('prompt', {
      type: 'event', eyebrow: 'Assistant', title: 'Create event', description: 'Description',
      placeholder: 'Context', icon: 'quick-event-dice', submitLabel: 'Create',
    });
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
