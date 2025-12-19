import { useState } from 'react';
import { Plus, ScrollText } from 'lucide-react';
import { Button, Card, CardHeader, CardTitle, CardContent } from '../common';
import { RuleList } from './RuleList';
import { RuleForm } from './RuleForm';
import { useRules } from '../../hooks/useRules';
import type { Rule } from '../../store/types';
import toast from 'react-hot-toast';

export function RulesPanel() {
  const {
    rules,
    addRule,
    updateRule,
    deleteRule,
    duplicateRule,
    reorderRules,
  } = useRules();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleAddRule = (rule: Omit<Rule, 'id'>) => {
    addRule(rule);
    toast.success(`Rule "${rule.name}" added`);
  };

  const handleDeleteRule = (id: string) => {
    const rule = rules.find((r) => r.id === id);
    deleteRule(id);
    toast.success(`Rule "${rule?.name}" deleted`);
  };

  const handleDuplicateRule = (id: string) => {
    duplicateRule(id);
    toast.success('Rule duplicated');
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ScrollText className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg">Rules</CardTitle>
            <span className="text-sm text-muted-foreground">
              ({rules.length})
            </span>
          </div>
          <Button onClick={() => setIsFormOpen(true)} size="sm">
            <Plus className="mr-1 h-4 w-4" />
            Add Rule
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {rules.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <ScrollText className="h-12 w-12 text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground">No rules defined yet</p>
            <p className="text-sm text-muted-foreground">
              Create rules to evaluate conditions against your facts
            </p>
          </div>
        ) : (
          <RuleList
            rules={rules}
            onUpdateRule={updateRule}
            onDeleteRule={handleDeleteRule}
            onDuplicateRule={handleDuplicateRule}
            onReorderRules={reorderRules}
          />
        )}
      </CardContent>

      <RuleForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleAddRule}
      />
    </Card>
  );
}
