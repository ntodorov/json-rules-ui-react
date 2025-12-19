import { Pencil, Trash2 } from 'lucide-react';
import { Card, Button, Badge, Tooltip } from '../common';
import type { FactDefinition } from '../../store/types';
import { formatValueForDisplay } from '../../lib/validators';

interface FactCardProps {
  fact: FactDefinition;
  onEdit: () => void;
  onDelete: () => void;
  isUsedInRules?: boolean;
}

const TYPE_COLORS: Record<string, string> = {
  string: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  number: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  boolean:
    'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  array:
    'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  object: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
};

export function FactCard({
  fact,
  onEdit,
  onDelete,
  isUsedInRules,
}: FactCardProps) {
  const defaultDisplay =
    fact.defaultValue !== undefined
      ? formatValueForDisplay(fact.defaultValue, fact.type)
      : null;

  return (
    <Card className="group relative overflow-hidden transition-shadow hover:shadow-md">
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-mono font-semibold text-sm truncate">
              {fact.name}
            </h3>
            <div className="mt-1 flex items-center gap-2">
              <Badge className={TYPE_COLORS[fact.type]}>{fact.type}</Badge>
              {isUsedInRules && (
                <Badge variant="secondary" className="text-xs">
                  In use
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Tooltip content="Edit">
              <Button
                variant="ghost"
                size="icon"
                onClick={onEdit}
                className="h-8 w-8"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </Tooltip>
            <Tooltip content={isUsedInRules ? 'Used in rules' : 'Delete'}>
              <Button
                variant="ghost"
                size="icon"
                onClick={onDelete}
                className="h-8 w-8 text-destructive hover:text-destructive"
                disabled={isUsedInRules}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </Tooltip>
          </div>
        </div>

        {fact.description && (
          <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
            {fact.description}
          </p>
        )}

        {defaultDisplay && (
          <div className="mt-2 text-xs">
            <span className="text-muted-foreground">Default: </span>
            <code className="rounded bg-muted px-1 py-0.5 font-mono">
              {defaultDisplay.length > 30
                ? `${defaultDisplay.slice(0, 30)}...`
                : defaultDisplay}
            </code>
          </div>
        )}
      </div>
    </Card>
  );
}
