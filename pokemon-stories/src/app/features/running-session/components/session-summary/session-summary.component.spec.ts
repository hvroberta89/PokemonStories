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

    expect(completed).toHaveBeenCalledWith('complete-adventure');
  });

  it('copies the deterministic session story without completing the review', async () => {
    fixture.componentRef.setInput('summary', {
      sessionId: 'session',
      adventureTitle: 'Erdei küldetés',
      locationName: 'Tölgyerdő',
      startedAtLabel: '10:00',
      completedAtLabel: '11:00',
      durationLabel: '1 óra',
      eventCount: 1,
      queuedRewardCount: 1,
      givenRewardCount: 0,
      events: [
        {
          id: 'event',
          title: 'Megtalálták a térképet',
          content: 'A csapat felfedezte a régi térképet.',
          timeLabel: '10:20',
          icon: 'timeline-scroll',
        },
      ],
      queuedRewards: [
        {
          id: 'reward',
          recipientName: 'Emma',
          rewardType: 'item',
          rewardLabel: 'Térkép',
          amount: 1,
          icon: 'items-potion',
          status: 'unlocked',
          physicalStatus: 'queued',
        },
      ],
      givenRewards: [],
    });
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
    const completed = vi.fn();
    component.reviewCompleted.subscribe(completed);
    fixture.detectChanges();

    [...(fixture.nativeElement as HTMLElement).querySelectorAll<HTMLButtonElement>('button')]
      .find((button) => button.textContent?.includes('Másolás'))!
      .click();
    await fixture.whenStable();

    expect(writeText).toHaveBeenCalledWith(expect.stringContaining('Megtalálták a térképet'));
    expect(writeText).toHaveBeenCalledWith(expect.stringContaining('Emma megkapta: 1 db Térkép'));
    expect(completed).not.toHaveBeenCalled();
  });

  it('copies the Game Master edited story without changing session review state', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
    const completed = vi.fn();
    component.reviewCompleted.subscribe(completed);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    [...root.querySelectorAll<HTMLButtonElement>('button')]
      .find((button) => button.textContent?.includes('Szerkesztés'))!
      .click();
    fixture.detectChanges();
    const editor = root.querySelector<HTMLTextAreaElement>('textarea')!;
    editor.value = 'A csapat bátran folytatta az utat.';
    editor.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    [...root.querySelectorAll<HTMLButtonElement>('button')]
      .find((button) => button.textContent?.includes('Kész'))!
      .click();
    fixture.detectChanges();
    [...root.querySelectorAll<HTMLButtonElement>('button')]
      .find((button) => button.textContent?.includes('Másolás'))!
      .click();
    await fixture.whenStable();

    expect(writeText).toHaveBeenCalledWith('A csapat bátran folytatta az utat.');
    expect(completed).not.toHaveBeenCalled();
  });

  it('emits the approved story when editing is finished', () => {
    const saved = vi.fn();
    component.storySaved.subscribe(saved);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    [...root.querySelectorAll<HTMLButtonElement>('button')]
      .find((button) => button.textContent?.includes('Szerkesztés'))!
      .click();
    fixture.detectChanges();
    const editor = root.querySelector<HTMLTextAreaElement>('textarea')!;
    editor.value = 'A jóváhagyott kalandtörténet.';
    editor.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    [...root.querySelectorAll<HTMLButtonElement>('button')]
      .find((button) => button.textContent?.includes('Kész'))!
      .click();
    fixture.detectChanges();

    expect(saved).toHaveBeenCalledWith('A jóváhagyott kalandtörténet.');
    expect(root.textContent).toContain('A Session Story elmentve.');
  });

  it('emits a World Fact only after explicit approval', () => {
    const approved = vi.fn();
    component.worldFactApproved.subscribe(approved);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const editor = root.querySelector<HTMLTextAreaElement>(
      '[aria-label="Világfrissítés javaslat"]',
    )!;
    editor.value = 'Az Öreg Híd megjavult.';
    editor.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(approved).not.toHaveBeenCalled();
    [...root.querySelectorAll<HTMLButtonElement>('button')]
      .find((button) => button.textContent?.includes('Világtényként elfogadom'))!
      .click();

    expect(approved).toHaveBeenCalledWith('Az Öreg Híd megjavult.');
  });
});
