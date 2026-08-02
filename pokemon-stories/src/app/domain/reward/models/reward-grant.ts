import type { ProjectId } from '../../project/value-objects/project-id';

export type RewardType =
  | 'pokemon'
  | 'item'
  | 'badge'
  | 'outfit'
  | 'achievement'
  | 'quest-item'
  | 'card'
  | 'sticker'
  | 'narrative'
  | 'custom';

export type RewardPhysicalStatus = 'not-requested' | 'queued' | 'printed' | 'skipped';
export type RewardDeliveryStatus = 'pending' | 'given';

export interface RewardGrantProps {
  readonly id: string;
  readonly projectId: ProjectId;
  readonly sessionId: string;
  readonly adventureId: string;
  readonly recipientId?: string;
  readonly recipientName: string;
  readonly type: RewardType;
  readonly label: string;
  readonly amount: number;
  readonly physicalStatus: RewardPhysicalStatus;
  readonly deliveryStatus: RewardDeliveryStatus;
}

export class RewardGrant {
  private constructor(private readonly props: RewardGrantProps) {
    Object.freeze(this);
  }

  static create(props: RewardGrantProps): RewardGrant {
    if (!props.id || !props.sessionId || !props.label.trim()) {
      throw new Error('A Reward Grant kötelező adatai hiányoznak.');
    }
    if (!Number.isInteger(props.amount) || props.amount < 1) {
      throw new Error('A Reward Grant mennyisége csak pozitív egész szám lehet.');
    }
    return new RewardGrant({ ...props, label: props.label.trim() });
  }

  get value(): RewardGrantProps {
    return this.props;
  }

  assignTo(recipientId: string | undefined, recipientName: string): RewardGrant {
    if (!recipientName.trim()) throw new Error('A jutalom címzettjének neve kötelező.');
    return RewardGrant.create({ ...this.props, recipientId, recipientName: recipientName.trim() });
  }

  updatePhysicalStatus(physicalStatus: RewardPhysicalStatus): RewardGrant {
    return RewardGrant.create({ ...this.props, physicalStatus });
  }

  markAsGiven(): RewardGrant {
    return RewardGrant.create({
      ...this.props,
      physicalStatus: this.props.physicalStatus === 'queued' ? 'printed' : this.props.physicalStatus,
      deliveryStatus: 'given',
    });
  }
}
