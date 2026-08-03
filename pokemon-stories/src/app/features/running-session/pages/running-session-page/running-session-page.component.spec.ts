import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RunningSessionPageComponent } from './running-session-page.component';
import { ADVENTURE_PLAN_REPOSITORY } from '../../../../application/adventure/tokens/adventure-plan.tokens';
import { SESSION_ASSISTANT } from '../../../../application/assistant/tokens/session-assistant.token';
import { LOCATION_REPOSITORY } from '../../../../application/location/tokens/location.tokens';
import { NPC_REPOSITORY } from '../../../../application/npc/tokens/npc.tokens';
import { ID_GENERATOR } from '../../../../application/project/tokens/id-generator.token';
import { PROJECT_READER } from '../../../../application/project/tokens/project.tokens';
import { WORLD_FACT_REPOSITORY } from '../../../../application/world/tokens/world-fact.tokens';
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
        { provide: PROJECT_READER, useValue: { findById: async () => null } },
        { provide: WORLD_FACT_REPOSITORY, useValue: {} },
        { provide: NPC_REPOSITORY, useValue: {} },
        { provide: LOCATION_REPOSITORY, useValue: {} },
        { provide: ID_GENERATOR, useValue: { generate: () => 'test-id' } },
        {
          provide: SESSION_ASSISTANT,
          useValue: { generate: async () => [], generateStory: async () => '' },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RunningSessionPageComponent);
    fixture.detectChanges();
  });

  it('renders a neutral state until a Session is started', () => {
    const element = fixture.nativeElement as HTMLElement;

    expect(element.textContent).toContain('Nincs aktív jelenet');
    expect(element.textContent).not.toContain('Az eltűnt Napviráglevél');
  });
});
