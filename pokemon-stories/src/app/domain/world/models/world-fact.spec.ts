import { projectId } from '../../project/value-objects/project-id';
import { WorldFact } from './world-fact';

describe('WorldFact', () => {
  it('creates an active canonical fact with normalized text', () => {
    const fact = WorldFact.create({
      id: 'fact-1',
      projectId: projectId('project-1'),
      text: '  Az Öreg Híd megjavult.  ',
      category: 'location',
    });

    expect(fact.value).toMatchObject({
      text: 'Az Öreg Híd megjavult.',
      category: 'location',
      status: 'active',
    });
  });

  it('rejects empty and overly long facts', () => {
    expect(() =>
      WorldFact.create({
        id: 'fact-1',
        projectId: projectId('project-1'),
        text: ' ',
        category: 'general',
      }),
    ).toThrow();
    expect(() =>
      WorldFact.create({
        id: 'fact-1',
        projectId: projectId('project-1'),
        text: 'x'.repeat(401),
        category: 'general',
      }),
    ).toThrow();
  });

  it('archives a fact without rewriting its established text', () => {
    const fact = WorldFact.create({
      id: 'fact-1',
      projectId: projectId('project-1'),
      text: 'A laboratórium biztonságos.',
      category: 'location',
    });

    const archived = fact.archive();

    expect(archived.value.text).toBe('A laboratórium biztonságos.');
    expect(archived.value.status).toBe('archived');
  });
});
