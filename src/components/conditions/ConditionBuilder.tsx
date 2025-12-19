import { ConditionGroup } from './ConditionGroup';
import type { ConditionGroup as ConditionGroupType } from '../../store/types';

interface ConditionBuilderProps {
  conditions: ConditionGroupType;
  onChange: (conditions: ConditionGroupType) => void;
}

export function ConditionBuilder({
  conditions,
  onChange,
}: ConditionBuilderProps) {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-muted-foreground">Conditions</h4>
      <ConditionGroup group={conditions} onChange={onChange} />
    </div>
  );
}
