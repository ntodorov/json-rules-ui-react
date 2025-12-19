import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { v4 as uuidv4 } from 'uuid';
import type { EngineState, Rule } from './types';

const STORAGE_KEY = 'json-rules-engine-data';

export const useEngineStore = create<EngineState>()(
  immer((set, get) => ({
    facts: [],
    rules: [],
    lastRunResult: undefined,

    addFact: (fact) =>
      set((state) => {
        state.facts.push({ ...fact, id: uuidv4() });
        get().saveToStorage();
      }),

    updateFact: (id, updates) =>
      set((state) => {
        const index = state.facts.findIndex((f) => f.id === id);
        if (index !== -1) {
          state.facts[index] = { ...state.facts[index], ...updates };
          get().saveToStorage();
        }
      }),

    deleteFact: (id) =>
      set((state) => {
        state.facts = state.facts.filter((f) => f.id !== id);
        get().saveToStorage();
      }),

    addRule: (rule) =>
      set((state) => {
        state.rules.push({ ...rule, id: uuidv4() });
        get().saveToStorage();
      }),

    updateRule: (id, updates) =>
      set((state) => {
        const index = state.rules.findIndex((r) => r.id === id);
        if (index !== -1) {
          state.rules[index] = { ...state.rules[index], ...updates };
          get().saveToStorage();
        }
      }),

    deleteRule: (id) =>
      set((state) => {
        state.rules = state.rules.filter((r) => r.id !== id);
        get().saveToStorage();
      }),

    duplicateRule: (id) =>
      set((state) => {
        const rule = state.rules.find((r) => r.id === id);
        if (rule) {
          const newRule: Rule = {
            ...JSON.parse(JSON.stringify(rule)),
            id: uuidv4(),
            name: `${rule.name} (Copy)`,
          };
          // Regenerate IDs for conditions
          const regenerateIds = (
            conditions: Rule['conditions']
          ): Rule['conditions'] => {
            return {
              ...conditions,
              id: uuidv4(),
              conditions: conditions.conditions.map((c) => {
                if ('conditions' in c) {
                  return regenerateIds(c);
                }
                return { ...c, id: uuidv4() };
              }),
            };
          };
          newRule.conditions = regenerateIds(newRule.conditions);
          state.rules.push(newRule);
          get().saveToStorage();
        }
      }),

    reorderRules: (startIndex, endIndex) =>
      set((state) => {
        const [removed] = state.rules.splice(startIndex, 1);
        state.rules.splice(endIndex, 0, removed);
        get().saveToStorage();
      }),

    setLastRunResult: (result) =>
      set((state) => {
        state.lastRunResult = result;
      }),

    clearLastRunResult: () =>
      set((state) => {
        state.lastRunResult = undefined;
      }),

    importData: (data) =>
      set((state) => {
        state.facts = data.facts;
        state.rules = data.rules;
        get().saveToStorage();
      }),

    exportData: () => {
      const state = get();
      return {
        facts: state.facts,
        rules: state.rules,
      };
    },

    loadFromStorage: () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const data = JSON.parse(stored);
          set((state) => {
            state.facts = data.facts || [];
            state.rules = data.rules || [];
          });
        }
      } catch (error) {
        console.error('Failed to load from storage:', error);
      }
    },

    saveToStorage: () => {
      try {
        const state = get();
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            facts: state.facts,
            rules: state.rules,
          })
        );
      } catch (error) {
        console.error('Failed to save to storage:', error);
      }
    },
  }))
);
