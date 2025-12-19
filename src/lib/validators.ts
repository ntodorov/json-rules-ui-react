import { z } from 'zod';
import type { FactType, OperatorType } from '../store/types';

export const factTypeSchema = z.enum([
  'string',
  'number',
  'boolean',
  'array',
  'object',
]);

export const factDefinitionSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .min(1, 'Fact name is required')
    .regex(
      /^[a-zA-Z][a-zA-Z0-9_]*$/,
      'Fact name must start with a letter and contain only letters, numbers, and underscores'
    ),
  type: factTypeSchema,
  defaultValue: z.unknown().optional(),
  description: z.string().optional(),
});

export const operatorTypeSchema = z.enum([
  'equal',
  'notEqual',
  'lessThan',
  'lessThanInclusive',
  'greaterThan',
  'greaterThanInclusive',
  'in',
  'notIn',
  'contains',
  'doesNotContain',
]);

export const conditionSchema: z.ZodType<{
  id: string;
  fact: string;
  operator: OperatorType;
  value: unknown;
  path?: string;
  params?: Record<string, unknown>;
}> = z.object({
  id: z.string(),
  fact: z.string().min(1, 'Fact is required'),
  operator: operatorTypeSchema,
  value: z.unknown(),
  path: z.string().optional(),
  params: z.record(z.string(), z.unknown()).optional(),
});

export const conditionGroupSchema: z.ZodType<{
  id: string;
  type: 'all' | 'any' | 'not';
  conditions: unknown[];
}> = z.object({
  id: z.string(),
  type: z.enum(['all', 'any', 'not']),
  conditions: z.array(z.any()),
});

export const ruleEventSchema = z.object({
  type: z.string().min(1, 'Event type is required'),
  params: z.record(z.string(), z.unknown()).optional(),
});

export const ruleSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Rule name is required'),
  description: z.string().optional(),
  priority: z.number().int().min(0).default(1),
  conditions: conditionGroupSchema,
  event: ruleEventSchema,
  enabled: z.boolean().default(true),
});

export type FactDefinitionInput = z.infer<typeof factDefinitionSchema>;
export type RuleInput = z.infer<typeof ruleSchema>;

export function validateFactName(
  name: string,
  existingNames: string[],
  currentId?: string
): string | null {
  if (!name) return 'Fact name is required';
  if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(name)) {
    return 'Fact name must start with a letter and contain only letters, numbers, and underscores';
  }
  const isDuplicate = existingNames.some(
    (n) => n.toLowerCase() === name.toLowerCase() && n !== currentId
  );
  if (isDuplicate) return 'A fact with this name already exists';
  return null;
}

export function parseValueForType(value: string, type: FactType): unknown {
  switch (type) {
    case 'number':
      const num = parseFloat(value);
      return isNaN(num) ? 0 : num;
    case 'boolean':
      return value.toLowerCase() === 'true';
    case 'array':
    case 'object':
      try {
        return JSON.parse(value);
      } catch {
        return type === 'array' ? [] : {};
      }
    default:
      return value;
  }
}

export function formatValueForDisplay(value: unknown, type: FactType): string {
  if (value === undefined || value === null) return '';
  if (type === 'array' || type === 'object') {
    return JSON.stringify(value, null, 2);
  }
  return String(value);
}
