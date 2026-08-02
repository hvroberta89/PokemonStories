import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RunningSessionPageComponent } from './running-session-page.component';
import { ADVENTURE_PLAN_REPOSITORY } from '../../../../application/adventure/tokens/adventure-plan.tokens';
import { InMemoryAdventurePlanRepository } from '../../../../infrastructure/adventure/repositories/in-memory-adventure-plan.repository';

describe('RunningSessionPageComponent', () => {
  let fixture: ComponentFixture<RunningSessionPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RunningSessionPageComponent],
      providers: [
        {
          provide: ADVENTURE_PLAN_REPOSITORY,
          useValue: new InMemoryAdventurePlanRepository(),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RunningSessionPageComponent);
    fixture.detectChanges();
  });

  it('renders the running adventure and current scene', () => {
    const element = fixture.nativeElement as HTMLElement;

    expect(element.textContent).toContain('Az eltűnt Napviráglevél');
    expect(element.textContent).toContain('Virágmező');
  });
});
