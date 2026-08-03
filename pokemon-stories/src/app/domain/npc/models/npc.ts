import type { ProjectId } from '../../project/value-objects/project-id';
import type { NpcId } from '../value-objects/npc-id';

export type NpcStatus = 'active' | 'archived';

export interface NpcProps {
  readonly id: NpcId;
  readonly projectId: ProjectId;
  readonly name: string;
  readonly role: string;
  readonly description?: string;
  readonly status: NpcStatus;
}

export class Npc {
  private constructor(public readonly value: NpcProps) {
    Object.freeze(this);
  }

  static create(props: Omit<NpcProps, 'status'> & { readonly status?: NpcStatus }): Npc {
    const name = props.name.trim();
    const role = props.role.trim();
    const description = props.description?.trim() || undefined;
    if (!name || name.length > 100) {
      throw new Error('Az NPC neve 1 és 100 karakter között lehet.');
    }
    if (!role || role.length > 160) {
      throw new Error('Az NPC szerepe 1 és 160 karakter között lehet.');
    }
    if (description && description.length > 500) {
      throw new Error('Az NPC leírása legfeljebb 500 karakter lehet.');
    }
    return new Npc({ ...props, name, role, description, status: props.status ?? 'active' });
  }

  archive(): Npc {
    return Npc.create({ ...this.value, status: 'archived' });
  }
}
