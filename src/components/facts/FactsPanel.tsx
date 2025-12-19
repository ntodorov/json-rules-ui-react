import { useState } from 'react';
import { Plus, Database } from 'lucide-react';
import { Button, Card, CardHeader, CardTitle, CardContent } from '../common';
import { FactCard } from './FactCard';
import { FactForm } from './FactForm';
import { useFacts } from '../../hooks/useFacts';
import { useRules } from '../../hooks/useRules';
import type { FactDefinition } from '../../store/types';
import toast from 'react-hot-toast';

export function FactsPanel() {
  const { facts, addFact, updateFact, deleteFact } = useFacts();
  const { rules } = useRules();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingFact, setEditingFact] = useState<FactDefinition | undefined>();

  const getFactsUsedInRules = (): Set<string> => {
    const usedFacts = new Set<string>();

    const checkConditions = (
      conditions: { conditions: unknown[] } | unknown
    ) => {
      if (!conditions || typeof conditions !== 'object') return;

      if ('conditions' in (conditions as Record<string, unknown>)) {
        const group = conditions as { conditions: unknown[] };
        for (const c of group.conditions) {
          checkConditions(c);
        }
      } else if ('fact' in (conditions as Record<string, unknown>)) {
        usedFacts.add((conditions as { fact: string }).fact);
      }
    };

    for (const rule of rules) {
      checkConditions(rule.conditions);
    }

    return usedFacts;
  };

  const usedFacts = getFactsUsedInRules();

  const handleAddFact = (fact: Omit<FactDefinition, 'id'>) => {
    addFact(fact);
    toast.success(`Fact "${fact.name}" added`);
  };

  const handleUpdateFact = (fact: Omit<FactDefinition, 'id'>) => {
    if (editingFact) {
      updateFact(editingFact.id, fact);
      toast.success(`Fact "${fact.name}" updated`);
    }
  };

  const handleDeleteFact = (fact: FactDefinition) => {
    if (usedFacts.has(fact.name)) {
      toast.error('Cannot delete fact that is used in rules');
      return;
    }
    deleteFact(fact.id);
    toast.success(`Fact "${fact.name}" deleted`);
  };

  const openEditForm = (fact: FactDefinition) => {
    setEditingFact(fact);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingFact(undefined);
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg">Facts Definition</CardTitle>
            <span className="text-sm text-muted-foreground">
              ({facts.length})
            </span>
          </div>
          <Button onClick={() => setIsFormOpen(true)} size="sm">
            <Plus className="mr-1 h-4 w-4" />
            Add Fact
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {facts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Database className="h-12 w-12 text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground">No facts defined yet</p>
            <p className="text-sm text-muted-foreground">
              Add facts that will be used in your rule conditions
            </p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {facts.map((fact) => (
              <FactCard
                key={fact.id}
                fact={fact}
                onEdit={() => openEditForm(fact)}
                onDelete={() => handleDeleteFact(fact)}
                isUsedInRules={usedFacts.has(fact.name)}
              />
            ))}
          </div>
        )}
      </CardContent>

      <FactForm
        isOpen={isFormOpen}
        onClose={closeForm}
        onSubmit={editingFact ? handleUpdateFact : handleAddFact}
        initialData={editingFact}
        existingNames={facts.map((f) => f.name)}
      />
    </Card>
  );
}
