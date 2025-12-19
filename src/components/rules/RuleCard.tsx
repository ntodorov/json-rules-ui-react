import { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Copy,
  Trash2,
  GripVertical,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Card, Badge, Switch, Input, Textarea, Label } from '../common';
import { ConditionBuilder } from '../conditions';
import { EventEditor } from '../events';
import type { Rule } from '../../store/types';

interface RuleCardProps {
  rule: Rule;
  onChange: (rule: Rule) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  dragHandleProps?: object;
}

export function RuleCard({
  rule,
  onChange,
  onDelete,
  onDuplicate,
  dragHandleProps,
}: RuleCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleEnabled = () => {
    onChange({ ...rule, enabled: !rule.enabled });
  };

  const conditionCount = countConditions(rule.conditions);

  return (
    <Card className={`transition-shadow ${rule.enabled ? '' : 'opacity-60'}`}>
      <div
        className="flex cursor-pointer items-center gap-3 p-4"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {dragHandleProps && (
          <div
            {...dragHandleProps}
            className="cursor-grab"
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </div>
        )}

        <button className="text-muted-foreground hover:text-foreground">
          {isExpanded ? (
            <ChevronDown className="h-5 w-5" />
          ) : (
            <ChevronRight className="h-5 w-5" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium truncate">{rule.name}</h3>
            <Badge variant="outline" className="text-xs">
              {conditionCount} condition{conditionCount !== 1 ? 's' : ''}
            </Badge>
          </div>
          {rule.description && (
            <p className="text-sm text-muted-foreground truncate">
              {rule.description}
            </p>
          )}
        </div>

        <div
          className="flex items-center gap-3"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Priority:</span>
            <Badge variant="secondary">{rule.priority}</Badge>
          </div>

          <Switch checked={rule.enabled} onCheckedChange={toggleEnabled} />

          <Button
            variant="ghost"
            size="icon"
            onClick={onDuplicate}
            className="h-8 w-8"
          >
            <Copy className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="h-8 w-8 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t px-4 py-4 space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor={`rule-name-${rule.id}`}>Rule Name</Label>
                  <Input
                    id={`rule-name-${rule.id}`}
                    value={rule.name}
                    onChange={(e) =>
                      onChange({ ...rule, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`rule-priority-${rule.id}`}>Priority</Label>
                  <Input
                    id={`rule-priority-${rule.id}`}
                    type="number"
                    min="0"
                    value={rule.priority}
                    onChange={(e) =>
                      onChange({
                        ...rule,
                        priority: parseInt(e.target.value) || 1,
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`rule-description-${rule.id}`}>
                  Description
                </Label>
                <Textarea
                  id={`rule-description-${rule.id}`}
                  value={rule.description || ''}
                  onChange={(e) =>
                    onChange({
                      ...rule,
                      description: e.target.value || undefined,
                    })
                  }
                  placeholder="Describe what this rule does..."
                  rows={2}
                />
              </div>

              <ConditionBuilder
                conditions={rule.conditions}
                onChange={(conditions) => onChange({ ...rule, conditions })}
              />

              <EventEditor
                event={rule.event}
                onChange={(event) => onChange({ ...rule, event })}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

function countConditions(group: Rule['conditions']): number {
  let count = 0;
  for (const c of group.conditions) {
    if ('conditions' in c) {
      count += countConditions(c);
    } else {
      count++;
    }
  }
  return count;
}
