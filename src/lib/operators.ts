import type { FactType, OperatorType } from '../store/types';

export interface OperatorDefinition {
  value: OperatorType;
  label: string;
  description: string;
  supportedTypes: FactType[];
}

export const OPERATORS: OperatorDefinition[] = [
  {
    value: 'equal',
    label: 'Equal',
    description: 'Checks if values are equal',
    supportedTypes: ['string', 'number', 'boolean', 'object'],
  },
  {
    value: 'notEqual',
    label: 'Not Equal',
    description: 'Checks if values are not equal',
    supportedTypes: ['string', 'number', 'boolean', 'object'],
  },
  {
    value: 'lessThan',
    label: 'Less Than',
    description: 'Checks if value is less than',
    supportedTypes: ['number'],
  },
  {
    value: 'lessThanInclusive',
    label: 'Less Than or Equal',
    description: 'Checks if value is less than or equal',
    supportedTypes: ['number'],
  },
  {
    value: 'greaterThan',
    label: 'Greater Than',
    description: 'Checks if value is greater than',
    supportedTypes: ['number'],
  },
  {
    value: 'greaterThanInclusive',
    label: 'Greater Than or Equal',
    description: 'Checks if value is greater than or equal',
    supportedTypes: ['number'],
  },
  {
    value: 'in',
    label: 'In',
    description: 'Checks if value is in array',
    supportedTypes: ['string', 'number'],
  },
  {
    value: 'notIn',
    label: 'Not In',
    description: 'Checks if value is not in array',
    supportedTypes: ['string', 'number'],
  },
  {
    value: 'contains',
    label: 'Contains',
    description: 'Checks if array contains value',
    supportedTypes: ['array'],
  },
  {
    value: 'doesNotContain',
    label: 'Does Not Contain',
    description: 'Checks if array does not contain value',
    supportedTypes: ['array'],
  },
];

export function getOperatorsForType(factType: FactType): OperatorDefinition[] {
  return OPERATORS.filter((op) => op.supportedTypes.includes(factType));
}

export function getOperatorLabel(operator: OperatorType): string {
  const op = OPERATORS.find((o) => o.value === operator);
  return op?.label || operator;
}
