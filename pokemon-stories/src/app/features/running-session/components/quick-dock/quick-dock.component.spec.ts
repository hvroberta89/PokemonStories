import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';

import {
  QuickDockComponent,
} from './quick-dock.component';
import {
  QuickDockViewModel,
} from './quick-dock.model';

describe('QuickDockComponent', () => {
  let fixture:
    ComponentFixture<QuickDockComponent>;

  const dock: QuickDockViewModel = {
    quickActionLabel: 'Gyors művelet',
    items: [
      {
        action: 'notes',
        label: 'Jegyzetek',
        icon: '📘',
        badge: 2,
      },
      {
        action: 'assistant',
        label: 'AI segítő',
        icon: '✦',
        active: true,
      },
    ],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuickDockComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      QuickDockComponent,
    );

    fixture.componentRef.setInput(
      'dock',
      dock,
    );

    fixture.detectChanges();
  });

  it('renders the dock items', () => {
    const element =
      fixture.nativeElement as HTMLElement;

    expect(element.textContent).toContain(
      'Jegyzetek',
    );

    expect(element.textContent).toContain(
      'AI segítő',
    );

    expect(element.textContent).toContain('2');
  });

  it('emits the selected action', () => {
    const emitSpy = vi.spyOn(
      fixture.componentInstance.actionSelected,
      'emit',
    );

    const button =
      fixture.nativeElement.querySelector(
        '[data-action="notes"]',
      ) as HTMLButtonElement;

    button.click();

    expect(emitSpy).toHaveBeenCalledWith(
      'notes',
    );
  });
});