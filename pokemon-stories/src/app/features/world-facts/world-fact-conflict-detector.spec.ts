import { projectId } from '../../domain/project/value-objects/project-id';
import { WorldFact } from '../../domain/world/models/world-fact';
import { findPotentialWorldFactConflict } from './world-fact-conflict-detector';

describe('findPotentialWorldFactConflict', () => {
  const activeLocationFact = WorldFact.create({
    id: 'fact-1',
    projectId: projectId('project-1'),
    category: 'location',
    text: 'Az Öreg Híd a folyó felett átjárható.',
  });

  it('finds an active fact with the same meaningful words', () => {
    const conflict = findPotentialWorldFactConflict(
      [activeLocationFact],
      'Az Öreg Híd a folyó felett újra átjárható.',
      'location',
    );

    expect(conflict).toBe(activeLocationFact);
  });

  it('does not flag facts from another category', () => {
    const conflict = findPotentialWorldFactConflict(
      [activeLocationFact],
      'Az Öreg Híd a folyó felett újra átjárható.',
      'story-state',
    );

    expect(conflict).toBeUndefined();
  });
});
