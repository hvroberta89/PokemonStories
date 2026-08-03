import { inject, Injectable } from '@angular/core';

import type { RewardGrantRepository } from '../../../application/reward/ports/reward-grant-repository';
import { RewardGrant } from '../../../domain/reward/models/reward-grant';
import type {
  RewardDeliveryStatus,
  RewardPhysicalStatus,
  RewardType,
} from '../../../domain/reward/models/reward-grant';
import type { ProjectId } from '../../../domain/project/value-objects/project-id';
import { SUPABASE_CLIENT } from '../../supabase/supabase-client.token';

interface RewardGrantRow {
  readonly id: string;
  readonly project_id: string;
  readonly session_id: string;
  readonly adventure_id: string;
  readonly prepared_reward_id: string | null;
  readonly recipient_id: string | null;
  readonly recipient_name: string;
  readonly reward_type: string;
  readonly label: string;
  readonly amount: number;
  readonly physical_status: string;
  readonly delivery_status: string;
}

@Injectable()
export class SupabaseRewardGrantRepository implements RewardGrantRepository {
  private static readonly columns =
    'id, project_id, session_id, adventure_id, prepared_reward_id, recipient_id, recipient_name, reward_type, label, amount, physical_status, delivery_status';
  private readonly supabase = inject(SUPABASE_CLIENT);

  async saveAll(grants: readonly RewardGrant[]): Promise<void> {
    if (grants.length === 0) return;
    const { error } = await this.supabase.from('reward_grants').upsert(
      grants.map((grant) => {
        const value = grant.value;
        return {
          id: value.id,
          project_id: value.projectId,
          session_id: value.sessionId,
          adventure_id: value.adventureId,
          prepared_reward_id: value.preparedRewardId ?? null,
          recipient_id: value.recipientId ?? null,
          recipient_name: value.recipientName,
          reward_type: value.type,
          label: value.label,
          amount: value.amount,
          narrative_status: 'unlocked',
          physical_status: value.physicalStatus,
          delivery_status: value.deliveryStatus,
          updated_at: new Date().toISOString(),
        };
      }),
    );
    if (error) throw new Error(`Could not save reward grants: ${error.message}`);
  }

  async findByProject(projectId: ProjectId): Promise<readonly RewardGrant[]> {
    const { data, error } = await this.supabase
      .from('reward_grants')
      .select(SupabaseRewardGrantRepository.columns)
      .eq('project_id', projectId)
      .eq('narrative_status', 'unlocked')
      .order('created_at', { ascending: false })
      .returns<RewardGrantRow[]>();
    if (error) throw new Error(`Could not load reward grants: ${error.message}`);
    return (data ?? []).map((row) => this.restore(row, projectId));
  }

  async findById(projectId: ProjectId, rewardId: string): Promise<RewardGrant | undefined> {
    const { data, error } = await this.supabase
      .from('reward_grants')
      .select(SupabaseRewardGrantRepository.columns)
      .eq('project_id', projectId)
      .eq('id', rewardId)
      .eq('narrative_status', 'unlocked')
      .maybeSingle<RewardGrantRow>();
    if (error) throw new Error(`Could not load reward grant: ${error.message}`);
    return data ? this.restore(data, projectId) : undefined;
  }

  private restore(row: RewardGrantRow, projectId: ProjectId): RewardGrant {
    return RewardGrant.create({
        id: row.id,
        projectId,
        sessionId: row.session_id,
        adventureId: row.adventure_id,
        preparedRewardId: row.prepared_reward_id ?? undefined,
        recipientId: row.recipient_id ?? undefined,
        recipientName: row.recipient_name,
        type: row.reward_type as RewardType,
        label: row.label,
        amount: row.amount,
        physicalStatus: row.physical_status as RewardPhysicalStatus,
        deliveryStatus: row.delivery_status as RewardDeliveryStatus,
      });
  }
}
