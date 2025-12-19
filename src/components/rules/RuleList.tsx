import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { RuleCard } from './RuleCard';
import type { Rule } from '../../store/types';

interface RuleListProps {
  rules: Rule[];
  onUpdateRule: (id: string, rule: Partial<Rule>) => void;
  onDeleteRule: (id: string) => void;
  onDuplicateRule: (id: string) => void;
  onReorderRules: (startIndex: number, endIndex: number) => void;
}

interface SortableRuleProps {
  rule: Rule;
  onUpdate: (rule: Rule) => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

function SortableRule({
  rule,
  onUpdate,
  onDelete,
  onDuplicate,
}: SortableRuleProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: rule.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <RuleCard
        rule={rule}
        onChange={onUpdate}
        onDelete={onDelete}
        onDuplicate={onDuplicate}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}

export function RuleList({
  rules,
  onUpdateRule,
  onDeleteRule,
  onDuplicateRule,
  onReorderRules,
}: RuleListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = rules.findIndex((r) => r.id === active.id);
      const newIndex = rules.findIndex((r) => r.id === over.id);
      onReorderRules(oldIndex, newIndex);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={rules.map((r) => r.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3">
          {rules.map((rule) => (
            <SortableRule
              key={rule.id}
              rule={rule}
              onUpdate={(updated) => onUpdateRule(rule.id, updated)}
              onDelete={() => onDeleteRule(rule.id)}
              onDuplicate={() => onDuplicateRule(rule.id)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
