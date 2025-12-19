import { Engine } from 'json-rules-engine';
import type {
  Rule,
  FactDefinition,
  Condition,
  ConditionGroup,
  EngineRunResult,
  RuleResult,
  RuleEvent,
} from '../store/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EngineCondition = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EngineConditionGroup = any;

function convertConditionToEngine(condition: Condition): EngineCondition {
  const result: EngineCondition = {
    fact: condition.fact,
    operator: condition.operator,
    value: condition.value,
  };
  if (condition.path) {
    result.path = condition.path;
  }
  if (condition.params) {
    result.params = condition.params;
  }
  return result;
}

function convertConditionGroupToEngine(
  group: ConditionGroup
): EngineConditionGroup {
  const convertedConditions = group.conditions.map((c) => {
    if ('conditions' in c) {
      return convertConditionGroupToEngine(c as ConditionGroup);
    }
    return convertConditionToEngine(c as Condition);
  });

  if (group.type === 'all') {
    return { all: convertedConditions };
  } else if (group.type === 'any') {
    return { any: convertedConditions };
  } else {
    // 'not' - only use first condition
    return { not: convertedConditions[0] };
  }
}

function convertRuleToEngine(rule: Rule) {
  return {
    name: rule.id,
    priority: rule.priority,
    conditions: convertConditionGroupToEngine(rule.conditions),
    event: {
      type: rule.event.type,
      params: {
        ...rule.event.params,
        ruleName: rule.name,
        ruleId: rule.id,
      },
    },
  };
}

export async function runEngine(
  rules: Rule[],
  facts: FactDefinition[],
  factValues: Record<string, unknown>
): Promise<EngineRunResult> {
  const startTime = performance.now();
  const engine = new Engine();

  // Add enabled rules
  const enabledRules = rules.filter((r) => r.enabled);
  for (const rule of enabledRules) {
    try {
      engine.addRule(convertRuleToEngine(rule));
    } catch (error) {
      console.error(`Failed to add rule ${rule.name}:`, error);
    }
  }

  // Prepare facts with defaults
  const allFacts: Record<string, unknown> = {};
  for (const fact of facts) {
    allFacts[fact.name] =
      factValues[fact.name] ??
      fact.defaultValue ??
      getDefaultForType(fact.type);
  }

  try {
    const { events, results: engineResults } = await engine.run(allFacts);
    const endTime = performance.now();

    // Map results back to our format
    const results: RuleResult[] = enabledRules.map((rule) => {
      const engineResult = engineResults.find((r) => r.name === rule.id);
      return {
        ruleId: rule.id,
        ruleName: rule.name,
        success: engineResult?.result ?? false,
        conditions: [], // Engine doesn't provide detailed condition results easily
      };
    });

    return {
      events: events as RuleEvent[],
      results,
      timestamp: new Date(),
      executionTime: endTime - startTime,
    };
  } catch (error) {
    console.error('Engine run failed:', error);
    throw error;
  }
}

function getDefaultForType(type: string): unknown {
  switch (type) {
    case 'number':
      return 0;
    case 'boolean':
      return false;
    case 'array':
      return [];
    case 'object':
      return {};
    default:
      return '';
  }
}

export function validateRuleConditions(
  rule: Rule,
  facts: FactDefinition[]
): string[] {
  const errors: string[] = [];
  const factNames = new Set(facts.map((f) => f.name));

  const validateGroup = (group: ConditionGroup) => {
    for (const condition of group.conditions) {
      if ('conditions' in condition) {
        validateGroup(condition as ConditionGroup);
      } else {
        const c = condition as Condition;
        if (!factNames.has(c.fact)) {
          errors.push(`Condition references unknown fact: ${c.fact}`);
        }
      }
    }
  };

  validateGroup(rule.conditions);
  return errors;
}
