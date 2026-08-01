import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentEventsComponent } from './recent-events.component';
import { RecentEventsViewModel } from './recent-events.model';

describe('RecentEventsComponent', () => {
  let fixture: ComponentFixture<RecentEventsComponent>;

  const recentEvents: RecentEventsViewModel = {
    title: 'Recent events',
    newEventsLabel: '2 new events',
    detailsLabel: 'Open recent events',
    events: [
      {
        id: 'first-event',
        type: 'encounter',
        title: 'You encountered a Pokemon.',
        content: 'A wild Pokemon appeared.',
        timeLabel: '3 minutes ago',
        icon: 'encounter-claw',
      },
      {
        id: 'second-event',
        type: 'conversation',
        title: 'You talked to Professor Elm.',
        content: 'He shared a useful clue.',
        timeLabel: '8 minutes ago',
        icon: 'npc-dialogue',
      },
    ],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecentEventsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RecentEventsComponent);
    fixture.componentRef.setInput('recentEvents', recentEvents);
    fixture.detectChanges();
  });

  it('renders the recent events', () => {
    const element = fixture.nativeElement as HTMLElement;

    expect(element.textContent).toContain('Recent events');
    expect(element.textContent).toContain('You encountered a Pokemon.');
    expect(element.textContent).toContain('2 new events');
  });

  it('emits the selected event id', () => {
    const emitSpy = vi.spyOn(fixture.componentInstance.eventSelected, 'emit');
    const button = fixture.nativeElement.querySelector('.recent-event') as HTMLButtonElement;

    button.click();

    expect(emitSpy).toHaveBeenCalledWith('first-event');
  });

  it('emits the details event', () => {
    const emitSpy = vi.spyOn(fixture.componentInstance.detailsSelected, 'emit');
    const button = fixture.nativeElement.querySelector(
      '.recent-events__details',
    ) as HTMLButtonElement;

    button.click();

    expect(emitSpy).toHaveBeenCalled();
  });
});
