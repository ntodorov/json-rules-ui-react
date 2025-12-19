import { Plus, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Badge, Select } from '../common';
import { ConditionRow } from './ConditionRow';
import type {
  Condition,
  ConditionGroup as ConditionGroupType,
} from '../../store/types';
import { isConditionGroup } from '../../store/types';

interface ConditionGroupProps {
  group: ConditionGroupType;
  onChange: (group: ConditionGroupType) => void;
  onRemove?: () => void;
  depth?: number;
}

const GROUP_COLORS = {
  all: 'border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20',
  any: 'border-l-green-500 bg-green-50/50 dark:bg-green-950/20',
  not: 'border-l-red-500 bg-red-50/50 dark:bg-red-950/20',
};

const GROUP_LABELS = {
  all: 'ALL of the following',
  any: 'ANY of the following',
  not: 'NOT (negate)',
};

export function ConditionGroup({
  group,
  onChange,
  onRemove,
  depth = 0,
}: ConditionGroupProps) {
  const addCondition = () => {
    const newCondition: Condition = {
      id: uuidv4(),
      fact: '',
      operator: 'equal',
      value: '',
    };
    onChange({
      ...group,
      conditions: [...group.conditions, newCondition],
    });
  };

  const addGroup = () => {
    const newGroup: ConditionGroupType = {
      id: uuidv4(),
      type: 'all',
      conditions: [],
    };
    onChange({
      ...group,
      conditions: [...group.conditions, newGroup],
    });
  };

  const updateCondition = (
    index: number,
    updated: Condition | ConditionGroupType
  ) => {
    const newConditions = [...group.conditions];
    newConditions[index] = updated;
    onChange({ ...group, conditions: newConditions });
  };

  const removeCondition = (index: number) => {
    const newConditions = group.conditions.filter((_, i) => i !== index);
    onChange({ ...group, conditions: newConditions });
  };

  const changeGroupType = (type: 'all' | 'any' | 'not') => {
    onChange({ ...group, type });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`rounded-md border-l-4 p-4 ${GROUP_COLORS[group.type]}`}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Select
            value={group.type}
            onChange={(e) =>
              changeGroupType(e.target.value as 'all' | 'any' | 'not')
            }
            options={[
              { value: 'all', label: 'ALL (AND)' },
              { value: 'any', label: 'ANY (OR)' },
              { value: 'not', label: 'NOT' },
            ]}
            className="w-32"
          />
          <span className="text-sm text-muted-foreground">
            {GROUP_LABELS[group.type]}
          </span>
          <Badge variant="outline" className="text-xs">
            {group.conditions.length} condition
            {group.conditions.length !== 1 ? 's' : ''}
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" onClick={addCondition}>
            <Plus className="mr-1 h-3 w-3" />
            Condition
          </Button>
          {depth < 3 && (
            <Button variant="outline" size="sm" onClick={addGroup}>
              <Plus className="mr-1 h-3 w-3" />
              Group
            </Button>
          )}
          {onRemove && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onRemove}
              className="h-8 w-8 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {group.conditions.map((condition, index) => (
            <motion.div
              key={condition.id}
              layout
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {isConditionGroup(condition) ? (
                <ConditionGroup
                  group={condition}
                  onChange={(updated) => updateCondition(index, updated)}
                  onRemove={() => removeCondition(index)}
                  depth={depth + 1}
                />
              ) : (
                <ConditionRow
                  condition={condition}
                  onChange={(updated) => updateCondition(index, updated)}
                  onRemove={() => removeCondition(index)}
                />
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {group.conditions.length === 0 && (
          <div className="rounded-md border-2 border-dashed p-4 text-center text-sm text-muted-foreground">
            No conditions yet. Add a condition or group to get started.
          </div>
        )}
      </div>
    </motion.div>
  );
}
