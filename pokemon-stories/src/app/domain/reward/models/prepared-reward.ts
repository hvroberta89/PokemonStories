import type { AdventurePlanId } from '../../adventure/value-objects/adventure-plan-id';
import type { AdventureSceneId } from '../../adventure/value-objects/adventure-scene-id';
import type { ProjectId } from '../../project/value-objects/project-id';
import type { RewardPhysicalStatus, RewardType } from './reward-grant';

export interface PreparedRewardProps {
  readonly id: string;
  readonly projectId: ProjectId;
  readonly adventureId: AdventurePlanId;
  readonly sceneId?: AdventureSceneId;
  readonly type: RewardType;
  readonly label: string;
  readonly amount: number;
  readonly physicalStatus: Extract<RewardPhysicalStatus, 'queued' | 'skipped'>;
}

export class PreparedReward {
  private constructor(public readonly value: PreparedRewardProps) { Object.freeze(this); }

  static create(props: PreparedRewardProps): PreparedReward {
    const label = props.label.trim();
    if (!props.id || !label || label.length > 120) throw new Error('Invalid prepared reward label.');
    if (!Number.isInteger(props.amount) || props.amount < 1 || props.amount > 99) {
      throw new Error('Invalid prepared reward amount.');
    }
    return new PreparedReward({ ...props, label });
  }
}
