import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionSummaryComponent } from './session-summary.component';

describe('SessionSummaryComponent', () => {
  let component: SessionSummaryComponent;
  let fixture: ComponentFixture<SessionSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionSummaryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SessionSummaryComponent);
    fixture.componentRef.setInput('summary', {
      sessionId: 'session',
      adventureTitle: 'Adventure',
      locationName: 'Forest',
      startedAtLabel: '10:00',
      completedAtLabel: '11:00',
      durationLabel: '1 hour',
      eventCount: 0,
      queuedRewardCount: 0,
      givenRewardCount: 0,
      events: [],
      queuedRewards: [],
      givenRewards: [],
    });
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('requires an explicit action to complete the review', () => {
    const completed = vi.fn();
    component.reviewCompleted.subscribe(completed);
    fixture.detectChanges();

    (fixture.nativeElement as HTMLElement)
      .querySelector<HTMLButtonElement>('.session-summary__button--primary')
      ?.click();

    expect(completed).toHaveBeenCalledOnce();
  });
});
