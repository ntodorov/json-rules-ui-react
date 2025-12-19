import { useFacts } from '../../hooks/useFacts';
import { Select } from '../common';
import { getOperatorsForType } from '../../lib/operators';
import type { OperatorType } from '../../store/types';

interface OperatorSelectProps {
  factName: string;
  value: OperatorType;
  onChange: (operator: OperatorType) => void;
}

export function OperatorSelect({
  factName,
  value,
  onChange,
}: OperatorSelectProps) {
  const { getFactByName } = useFacts();
  const fact = getFactByName(factName);

  const operators = fact
    ? getOperatorsForType(fact.type)
    : getOperatorsForType('string');

  const options = operators.map((op) => ({
    value: op.value,
    label: op.label,
  }));

  return (
    <Select
      value={value}
      onChange={(e) => onChange(e.target.value as OperatorType)}
      options={options}
    />
  );
}
