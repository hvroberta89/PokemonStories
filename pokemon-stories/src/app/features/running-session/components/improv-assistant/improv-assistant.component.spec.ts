import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';

import {
  ImprovAssistantComponent,
} from './improv-assistant.component';
import {
  ImprovAssistantViewModel,
} from './improv-assistant.model';

describe('ImprovAssistantComponent', () => {
  let fixture:
    ComponentFixture<ImprovAssistantComponent>;

  const assistant:
    ImprovAssistantViewModel = {
      title: 'Mi történjen most?',
      description:
        'Kérj gyors segítséget a történet folytatásához.',
      options: [
        {
          action: 'unexpected-direction',
          title: 'Más irányba mentek',
          description: 'Adj három új lehetőséget.',
          icon: '🧭',
        },
        {
          action: 'quick-npc',
          title: 'Új szereplő kell',
          description: 'Generálj egy gyors NPC-t.',
          icon: '🎭',
        },
      ],
    };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImprovAssistantComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      ImprovAssistantComponent,
    );

    fixture.componentRef.setInput(
      'assistant',
      assistant,
    );

    fixture.detectChanges();
  });

  it('renders the assistant options', () => {
    const element =
      fixture.nativeElement as HTMLElement;

    expect(element.textContent).toContain(
      'Mi történjen most?',
    );

    expect(element.textContent).toContain(
      'Más irányba mentek',
    );

    expect(element.textContent).toContain(
      'Új szereplő kell',
    );
  });

  it('emits the selected action', () => {
    const emitSpy = vi.spyOn(
      fixture.componentInstance.actionSelected,
      'emit',
    );

    const button =
      fixture.nativeElement.querySelector(
        '.assistant-option',
      ) as HTMLButtonElement;

    button.click();

    expect(emitSpy).toHaveBeenCalledWith(
      'unexpected-direction',
    );
  });
});