import { useEngineStore } from '../store/engineStore';
import type { Rule } from '../store/types';

export function useRules() {
  const rules = useEngineStore((state) => state.rules);
  const addRule = useEngineStore((state) => state.addRule);
  const updateRule = useEngineStore((state) => state.updateRule);
  const deleteRule = useEngineStore((state) => state.deleteRule);
  const duplicateRule = useEngineStore((state) => state.duplicateRule);
  const reorderRules = useEngineStore((state) => state.reorderRules);

  const getRuleById = (id: string): Rule | undefined => {
    return rules.find((r) => r.id === id);
  };

  const getEnabledRules = (): Rule[] => {
    return rules.filter((r) => r.enabled);
  };

  const getRulesByPriority = (): Rule[] => {
    return [...rules].sort((a, b) => b.priority - a.priority);
  };

  const toggleRuleEnabled = (id: string) => {
    const rule = getRuleById(id);
    if (rule) {
      updateRule(id, { enabled: !rule.enabled });
    }
  };

  return {
    rules,
    addRule,
    updateRule,
    deleteRule,
    duplicateRule,
    reorderRules,
    getRuleById,
    getEnabledRules,
    getRulesByPriority,
    toggleRuleEnabled,
  };
}
