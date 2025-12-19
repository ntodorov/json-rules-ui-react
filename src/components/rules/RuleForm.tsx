import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Button, Input, Label, Textarea, Modal } from '../common';
import type { Rule, ConditionGroup } from '../../store/types';

interface RuleFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rule: Omit<Rule, 'id'>) => void;
  initialData?: Rule;
}

export function RuleForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: RuleFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState(1);
  const [eventType, setEventType] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description || '');
      setPriority(initialData.priority);
      setEventType(initialData.event.type);
    } else {
      setName('');
      setDescription('');
      setPriority(1);
      setEventType('');
    }
    setError(null);
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Rule name is required');
      return;
    }

    if (!eventType.trim()) {
      setError('Event type is required');
      return;
    }

    const conditions: ConditionGroup = initialData?.conditions || {
      id: uuidv4(),
      type: 'all',
      conditions: [],
    };

    onSubmit({
      name: name.trim(),
      description: description.trim() || undefined,
      priority,
      conditions,
      event: {
        type: eventType.trim(),
        params: initialData?.event.params,
      },
      enabled: initialData?.enabled ?? true,
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Rule' : 'Add New Rule'}
      description="Create a rule with conditions and an event"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="rule-name">Name *</Label>
          <Input
            id="rule-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Senior Discount"
            autoFocus
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="rule-description">Description</Label>
          <Textarea
            id="rule-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what this rule does..."
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="rule-priority">Priority</Label>
          <Input
            id="rule-priority"
            type="number"
            min="0"
            value={priority}
            onChange={(e) => setPriority(parseInt(e.target.value) || 1)}
          />
          <p className="text-xs text-muted-foreground">
            Higher priority rules run first (default: 1)
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="rule-event-type">Event Type *</Label>
          <Input
            id="rule-event-type"
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            placeholder="e.g., apply-discount"
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{initialData ? 'Update' : 'Add'} Rule</Button>
        </div>
      </form>
    </Modal>
  );
}
