import { useEngineStore } from '../store/engineStore';

export function useEngine() {
  const facts = useEngineStore((state) => state.facts);
  const rules = useEngineStore((state) => state.rules);
  const lastRunResult = useEngineStore((state) => state.lastRunResult);
  const setLastRunResult = useEngineStore((state) => state.setLastRunResult);
  const clearLastRunResult = useEngineStore(
    (state) => state.clearLastRunResult
  );
  const importData = useEngineStore((state) => state.importData);
  const exportData = useEngineStore((state) => state.exportData);
  const loadFromStorage = useEngineStore((state) => state.loadFromStorage);
  const saveToStorage = useEngineStore((state) => state.saveToStorage);

  return {
    facts,
    rules,
    lastRunResult,
    setLastRunResult,
    clearLastRunResult,
    importData,
    exportData,
    loadFromStorage,
    saveToStorage,
  };
}
