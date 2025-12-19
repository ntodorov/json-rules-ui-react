import { useState, useEffect } from 'react';
import { Button, Input, Label, Textarea, Modal } from '../common';
import { FactTypeSelector } from './FactTypeSelector';
import type { FactDefinition, FactType } from '../../store/types';
import { parseValueForType, formatValueForDisplay } from '../../lib/validators';

interface FactFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (fact: Omit<FactDefinition, 'id'>) => void;
  initialData?: FactDefinition;
  existingNames: string[];
}

export function FactForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  existingNames,
}: FactFormProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<FactType>('string');
  const [defaultValue, setDefaultValue] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setType(initialData.type);
      setDefaultValue(
        formatValueForDisplay(initialData.defaultValue, initialData.type)
      );
      setDescription(initialData.description || '');
    } else {
      setName('');
      setType('string');
      setDefaultValue('');
      setDescription('');
    }
    setError(null);
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!name.trim()) {
      setError('Fact name is required');
      return;
    }

    if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(name)) {
      setError(
        'Fact name must start with a letter and contain only letters, numbers, and underscores'
      );
      return;
    }

    const isDuplicate = existingNames.some(
      (n) => n.toLowerCase() === name.toLowerCase() && n !== initialData?.name
    );
    if (isDuplicate) {
      setError('A fact with this name already exists');
      return;
    }

    const parsedValue = defaultValue.trim()
      ? parseValueForType(defaultValue, type)
      : undefined;

    onSubmit({
      name: name.trim(),
      type,
      defaultValue: parsedValue,
      description: description.trim() || undefined,
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Fact' : 'Add New Fact'}
      description="Define a fact that can be used in rule conditions"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., userAge"
            autoFocus
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Type *</Label>
          <FactTypeSelector value={type} onChange={setType} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="defaultValue">Default Value</Label>
          {type === 'array' || type === 'object' ? (
            <Textarea
              id="defaultValue"
              value={defaultValue}
              onChange={(e) => setDefaultValue(e.target.value)}
              placeholder={
                type === 'array' ? '["item1", "item2"]' : '{"key": "value"}'
              }
              rows={3}
            />
          ) : type === 'boolean' ? (
            <select
              id="defaultValue"
              value={defaultValue}
              onChange={(e) => setDefaultValue(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
            >
              <option value="">No default</option>
              <option value="true">true</option>
              <option value="false">false</option>
            </select>
          ) : (
            <Input
              id="defaultValue"
              type={type === 'number' ? 'number' : 'text'}
              value={defaultValue}
              onChange={(e) => setDefaultValue(e.target.value)}
              placeholder={type === 'number' ? '0' : 'default value'}
            />
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what this fact represents..."
            rows={2}
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{initialData ? 'Update' : 'Add'} Fact</Button>
        </div>
      </form>
    </Modal>
  );
}
