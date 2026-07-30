import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';

import { GoalCardComponent } from './goal-card.component';
import { GoalCardViewModel } from './goal-card.model';

describe('GoalCardComponent', () => {
  let fixture: ComponentFixture<GoalCardComponent>;

  const goal: GoalCardViewModel = {
    title: 'Találjátok meg a Napviráglevelet',
    description:
      'Kövessétek az aranyszínű nyomokat a Virágmezőn.',
    status: 'active',
    progressLabel: '1 nyom megtalálva',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoalCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GoalCardComponent);
    fixture.componentRef.setInput('goal', goal);
    fixture.detectChanges();
  });

  it('renders the active goal', () => {
    const element = fixture.nativeElement as HTMLElement;

    expect(element.textContent).toContain(
      'Találjátok meg a Napviráglevelet',
    );

    expect(element.textContent).toContain(
      '1 nyom megtalálva',
    );
  });
});