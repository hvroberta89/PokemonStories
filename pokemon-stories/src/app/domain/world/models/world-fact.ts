import type { ProjectId } from '../../project/value-objects/project-id';

export type WorldFactCategory =
  'general' | 'character' | 'npc' | 'location' | 'relationship' | 'story-state' | 'custom';

export type WorldFactStatus = 'active' | 'superseded' | 'archived';

export interface WorldFactProps {
  readonly id: string;
  readonly projectId: ProjectId;
  readonly text: string;
  readonly category: WorldFactCategory;
  readonly status: WorldFactStatus;
}

export class WorldFact {
  private constructor(public readonly value: WorldFactProps) {
    Object.freeze(this);
  }

  static create(
    props: Omit<WorldFactProps, 'status'> & { readonly status?: WorldFactStatus },
  ): WorldFact {
    const text = props.text.trim();
    if (!props.id || !text || text.length > 400) {
      throw new Error('A Világtény szövege 1 és 400 karakter között lehet.');
    }
    return new WorldFact({ ...props, text, status: props.status ?? 'active' });
  }

  archive(): WorldFact {
    return WorldFact.create({ ...this.value, status: 'archived' });
  }

  supersede(): WorldFact {
    return WorldFact.create({ ...this.value, status: 'superseded' });
  }
}
