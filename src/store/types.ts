// Fact Types
export type FactType = 'string' | 'number' | 'boolean' | 'array' | 'object';

export interface FactDefinition {
  id: string;
  name: string;
  type: FactType;
  defaultValue?: unknown;
  description?: string;
}

// Operator Types
export type OperatorType =
  | 'equal'
  | 'notEqual'
  | 'lessThan'
  | 'lessThanInclusive'
  | 'greaterThan'
  | 'greaterThanInclusive'
  | 'in'
  | 'notIn'
  | 'contains'
  | 'doesNotContain';

// Condition Types
export interface Condition {
  id: string;
  fact: string;
  operator: OperatorType;
  value: unknown;
  path?: string;
  params?: Record<string, unknown>;
}

export interface ConditionGroup {
  id: string;
  type: 'all' | 'any' | 'not';
  conditions: (Condition | ConditionGroup)[];
}

export function isConditionGroup(
  item: Condition | ConditionGroup
): item is ConditionGroup {
  return 'type' in item && 'conditions' in item;
}

// Event Types
export interface RuleEvent {
  type: string;
  params?: Record<string, unknown>;
}

// Rule Types
export interface Rule {
  id: string;
  name: string;
  description?: string;
  priority: number;
  conditions: ConditionGroup;
  event: RuleEvent;
  enabled: boolean;
}

// Engine Results
export interface RuleResult {
  ruleId: string;
  ruleName: string;
  success: boolean;
  conditions: ConditionEvaluation[];
}

export interface ConditionEvaluation {
  fact: string;
  operator: string;
  value: unknown;
  factValue: unknown;
  result: boolean;
}

export interface EngineRunResult {
  events: RuleEvent[];
  results: RuleResult[];
  timestamp: Date;
  executionTime: number;
}

// Store State
export interface EngineState {
  facts: FactDefinition[];
  rules: Rule[];
  lastRunResult?: EngineRunResult;

  // Actions
  addFact: (fact: Omit<FactDefinition, 'id'>) => void;
  updateFact: (id: string, fact: Partial<FactDefinition>) => void;
  deleteFact: (id: string) => void;

  addRule: (rule: Omit<Rule, 'id'>) => void;
  updateRule: (id: string, rule: Partial<Rule>) => void;
  deleteRule: (id: string) => void;
  duplicateRule: (id: string) => void;
  reorderRules: (startIndex: number, endIndex: number) => void;

  setLastRunResult: (result: EngineRunResult) => void;
  clearLastRunResult: () => void;

  importData: (data: { facts: FactDefinition[]; rules: Rule[] }) => void;
  exportData: () => { facts: FactDefinition[]; rules: Rule[] };

  loadFromStorage: () => void;
  saveToStorage: () => void;
  reset: () => void;
}
