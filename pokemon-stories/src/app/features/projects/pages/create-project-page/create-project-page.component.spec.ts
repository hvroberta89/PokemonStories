import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import {
  PROJECT_READER,
  PROJECT_REPOSITORY,
} from '../../../../application/project/tokens/project.tokens';
import { ID_GENERATOR } from '../../../../application/project/tokens/id-generator.token';
import { InMemoryProjectRepository } from '../../../../infrastructure/project/repositories/in-memory-project.repository';
import { FixedIdGenerator } from '../../../../infrastructure/shared/identifiers/fixed-id.generator';
import { CreateProjectPageComponent } from './create-project-page.component';

describe('CreateProjectPageComponent', () => {
  beforeEach(async () => {
    const repository = new InMemoryProjectRepository();

    await TestBed.configureTestingModule({
      imports: [CreateProjectPageComponent],
      providers: [
        provideRouter([]),
        {
          provide: PROJECT_REPOSITORY,
          useValue: repository,
        },
        {
          provide: PROJECT_READER,
          useValue: repository,
        },
        {
          provide: ID_GENERATOR,
          useValue: new FixedIdGenerator('project-1'),
        },
      ],
    }).compileComponents();
  });

  it('should keep the form short and mark the concept optional', () => {
    const fixture = TestBed.createComponent(CreateProjectPageComponent);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('#project-name')).not.toBeNull();
    expect(element.querySelector('#project-description')).not.toBeNull();
    expect(element.textContent).toContain('Opcionális');
  });

  it('should display a validation message for a missing name', () => {
    const fixture = TestBed.createComponent(CreateProjectPageComponent);
    fixture.detectChanges();

    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    const error = fixture.nativeElement.querySelector('#project-name-error') as HTMLElement;

    expect(error.textContent).toContain('Adj nevet a projektnek.');
  });
});
