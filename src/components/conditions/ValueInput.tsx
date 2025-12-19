import { useFacts } from '../../hooks/useFacts';
import { Input, Textarea } from '../common';
import type { OperatorType } from '../../store/types';

interface ValueInputProps {
  factName: string;
  operator: OperatorType;
  value: unknown;
  onChange: (value: unknown) => void;
}

export function ValueInput({
  factName,
  operator,
  value,
  onChange,
}: ValueInputProps) {
  const { getFactByName } = useFacts();
  const fact = getFactByName(factName);
  const factType = fact?.type || 'string';

  // For 'in' and 'notIn' operators, always expect an array
  const isArrayInput = operator === 'in' || operator === 'notIn';

  if (isArrayInput) {
    const stringValue = Array.isArray(value)
      ? JSON.stringify(value)
      : typeof value === 'string'
      ? value
      : '[]';

    return (
      <Input
        value={stringValue}
        onChange={(e) => {
          try {
            const parsed = JSON.parse(e.target.value);
            onChange(Array.isArray(parsed) ? parsed : [e.target.value]);
          } catch {
            // Keep as string while typing
            onChange(e.target.value);
          }
        }}
        placeholder='["value1", "value2"]'
        className="font-mono text-sm"
      />
    );
  }

  switch (factType) {
    case 'number':
      return (
        <Input
          type="number"
          value={(value as number) ?? ''}
          onChange={(e) =>
            onChange(e.target.value === '' ? '' : parseFloat(e.target.value))
          }
          placeholder="0"
        />
      );

    case 'boolean':
      return (
        <select
          value={String(value ?? '')}
          onChange={(e) => onChange(e.target.value === 'true')}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
        >
          <option value="true">true</option>
          <option value="false">false</option>
        </select>
      );

    case 'array':
    case 'object':
      const jsonValue =
        typeof value === 'string' ? value : JSON.stringify(value, null, 2);

      return (
        <Textarea
          value={jsonValue}
          onChange={(e) => {
            try {
              onChange(JSON.parse(e.target.value));
            } catch {
              onChange(e.target.value);
            }
          }}
          placeholder={
            factType === 'array' ? '["item1", "item2"]' : '{"key": "value"}'
          }
          rows={2}
          className="font-mono text-sm"
        />
      );

    default:
      return (
        <Input
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="value"
        />
      );
  }
}
