import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistantResultsComponent } from './assistant-results.component';

describe('AssistantResultsComponent', () => {
  let component: AssistantResultsComponent;
  let fixture: ComponentFixture<AssistantResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssistantResultsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AssistantResultsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
