import { Select } from '../common';
import type { FactType } from '../../store/types';

interface FactTypeSelectorProps {
  value: FactType;
  onChange: (value: FactType) => void;
  disabled?: boolean;
}

const FACT_TYPE_OPTIONS: { value: FactType; label: string }[] = [
  { value: 'string', label: 'String' },
  { value: 'number', label: 'Number' },
  { value: 'boolean', label: 'Boolean' },
  { value: 'array', label: 'Array' },
  { value: 'object', label: 'Object' },
];

export function FactTypeSelector({
  value,
  onChange,
  disabled,
}: FactTypeSelectorProps) {
  return (
    <Select
      value={value}
      onChange={(e) => onChange(e.target.value as FactType)}
      options={FACT_TYPE_OPTIONS}
      disabled={disabled}
    />
  );
}
