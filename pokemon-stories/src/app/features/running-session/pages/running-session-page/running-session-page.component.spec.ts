import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RunningSessionPageComponent } from './running-session-page.component';

describe('RunningSessionPageComponent', () => {
  let fixture: ComponentFixture<RunningSessionPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RunningSessionPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RunningSessionPageComponent);
    fixture.detectChanges();
  });

  it('renders the running adventure and current scene', () => {
    const element = fixture.nativeElement as HTMLElement;

    expect(element.textContent).toContain(
      'Az eltűnt Napviráglevél',
    );
    expect(element.textContent).toContain('Virágmező');
  });
});
