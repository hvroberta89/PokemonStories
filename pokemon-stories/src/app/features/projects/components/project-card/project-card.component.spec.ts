import { ComponentFixture, TestBed } from '@angular/core/testing';

import { projectId } from '../../../../domain/project/value-objects/project-id';
import { ProjectCardComponent } from './project-card.component';

describe('ProjectCardComponent', () => {
  let fixture: ComponentFixture<ProjectCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectCardComponent);
    fixture.componentRef.setInput('project', {
      id: projectId('project-1'),
      name: 'Kanto kalandok',
      description: 'Közös történetek az egész családnak.',
      status: 'active',
    });
    fixture.detectChanges();
  });

  it('should render the project summary', () => {
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('h2')?.textContent).toContain('Kanto kalandok');
    expect(element.textContent).toContain('Közös történetek az egész családnak.');
    expect(element.textContent).toContain('Aktív');
  });

  it('should expose an accessible open action', () => {
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;

    expect(button.getAttribute('aria-label')).toBe('Kanto kalandok megnyitása');
  });
});
