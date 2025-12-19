import { useEngineStore } from '../store/engineStore';
import type { FactDefinition } from '../store/types';

export function useFacts() {
  const facts = useEngineStore((state) => state.facts);
  const addFact = useEngineStore((state) => state.addFact);
  const updateFact = useEngineStore((state) => state.updateFact);
  const deleteFact = useEngineStore((state) => state.deleteFact);

  const getFactByName = (name: string): FactDefinition | undefined => {
    return facts.find((f) => f.name === name);
  };

  const getFactById = (id: string): FactDefinition | undefined => {
    return facts.find((f) => f.id === id);
  };

  const isFactNameUnique = (name: string, excludeId?: string): boolean => {
    return !facts.some(
      (f) => f.name.toLowerCase() === name.toLowerCase() && f.id !== excludeId
    );
  };

  return {
    facts,
    addFact,
    updateFact,
    deleteFact,
    getFactByName,
    getFactById,
    isFactNameUnique,
  };
}
