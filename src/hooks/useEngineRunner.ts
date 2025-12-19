import { useState, useCallback } from 'react';
import { runEngine } from '../lib/engine';
import { useEngineStore } from '../store/engineStore';
import type { EngineRunResult } from '../store/types';

export function useEngineRunner() {
  const facts = useEngineStore((state) => state.facts);
  const rules = useEngineStore((state) => state.rules);
  const setLastRunResult = useEngineStore((state) => state.setLastRunResult);

  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(
    async (
      factValues: Record<string, unknown>
    ): Promise<EngineRunResult | null> => {
      setIsRunning(true);
      setError(null);

      try {
        const result = await runEngine(rules, facts, factValues);
        setLastRunResult(result);
        return result;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to run engine';
        setError(message);
        return null;
      } finally {
        setIsRunning(false);
      }
    },
    [facts, rules, setLastRunResult]
  );

  const getDefaultFactValues = useCallback((): Record<string, unknown> => {
    const values: Record<string, unknown> = {};
    for (const fact of facts) {
      values[fact.name] = fact.defaultValue ?? getDefaultForType(fact.type);
    }
    return values;
  }, [facts]);

  return {
    run,
    isRunning,
    error,
    getDefaultFactValues,
  };
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
