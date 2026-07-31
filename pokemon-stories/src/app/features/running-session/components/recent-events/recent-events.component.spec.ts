import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';

import {
  RecentEventsComponent,
} from './recent-events.component';
import {
  RecentEventsViewModel,
} from './recent-events.model';

describe('RecentEventsComponent', () => {
  let fixture:
    ComponentFixture<RecentEventsComponent>;

  const recentEvents: RecentEventsViewModel = {
    title: 'Legutóbbi események',
    newEventsLabel: '2 új esemény',
    detailsLabel:
      'Legutóbbi események megnyitása',
    events: [
      {
        id: 'first-event',
        type: 'encounter',
        title: 'Találkoztatok egy Pokémonnal.',
        timeLabel: '3 perce',
        icon: '◓',
      },
      {
        id: 'second-event',
        type: 'conversation',
        title: 'Beszélgettetek Elm professzorral.',
        timeLabel: '8 perce',
        icon: '💬',
      },
    ],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecentEventsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      RecentEventsComponent,
    );

    fixture.componentRef.setInput(
      'recentEvents',
      recentEvents,
    );

    fixture.detectChanges();
  });

  it('renders the recent events', () => {
    const element =
      fixture.nativeElement as HTMLElement;

    expect(element.textContent).toContain(
      'Legutóbbi események',
    );

    expect(element.textContent).toContain(
      'Találkoztatok egy Pokémonnal.',
    );

    expect(element.textContent).toContain(
      '2 új esemény',
    );
  });

  it('emits the selected event id', () => {
    const emitSpy = vi.spyOn(
      fixture.componentInstance.eventSelected,
      'emit',
    );

    const button =
      fixture.nativeElement.querySelector(
        '.recent-event',
      ) as HTMLButtonElement;

    button.click();

    expect(emitSpy).toHaveBeenCalledWith(
      'first-event',
    );
  });

  it('emits the details event', () => {
    const emitSpy = vi.spyOn(
      fixture.componentInstance.detailsSelected,
      'emit',
    );

    const button =
      fixture.nativeElement.querySelector(
        '.recent-events__details',
      ) as HTMLButtonElement;

    button.click();

    expect(emitSpy).toHaveBeenCalled();
  });
});