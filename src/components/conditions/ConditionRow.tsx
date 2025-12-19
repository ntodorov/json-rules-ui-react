import { X } from 'lucide-react';
import { Button, Select, Input } from '../common';
import { OperatorSelect } from './OperatorSelect';
import { ValueInput } from './ValueInput';
import { useFacts } from '../../hooks/useFacts';
import type { Condition } from '../../store/types';

interface ConditionRowProps {
  condition: Condition;
  onChange: (condition: Condition) => void;
  onRemove: () => void;
}

export function ConditionRow({
  condition,
  onChange,
  onRemove,
}: ConditionRowProps) {
  const { facts, getFactByName } = useFacts();
  const selectedFact = getFactByName(condition.fact);

  const factOptions = facts.map((f) => ({
    value: f.name,
    label: f.name,
  }));

  const handleFactChange = (factName: string) => {
    const fact = getFactByName(factName);
    // Reset operator and value when fact changes
    onChange({
      ...condition,
      fact: factName,
      operator: fact?.type === 'number' ? 'equal' : 'equal',
      value: fact?.type === 'number' ? 0 : '',
    });
  };

  const showPathInput =
    selectedFact?.type === 'object' || selectedFact?.type === 'array';

  return (
    <div className="flex items-start gap-2 rounded-md border bg-background p-3">
      <div className="grid flex-1 gap-2 sm:grid-cols-3">
        <Select
          value={condition.fact}
          onChange={(e) => handleFactChange(e.target.value)}
          options={factOptions}
          placeholder="Select fact"
        />

        <OperatorSelect
          factName={condition.fact}
          value={condition.operator}
          onChange={(operator) => onChange({ ...condition, operator })}
        />

        <ValueInput
          factName={condition.fact}
          operator={condition.operator}
          value={condition.value}
          onChange={(value) => onChange({ ...condition, value })}
        />

        {showPathInput && (
          <div className="sm:col-span-3">
            <Input
              value={condition.path || ''}
              onChange={(e) =>
                onChange({ ...condition, path: e.target.value || undefined })
              }
              placeholder="JSON path (e.g., $.property.nested)"
              className="text-sm"
            />
          </div>
        )}
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={onRemove}
        className="h-9 w-9 text-muted-foreground hover:text-destructive"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
