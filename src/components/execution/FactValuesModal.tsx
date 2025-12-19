import { useState, useEffect } from 'react';
import { Play } from 'lucide-react';
import { Button, Input, Textarea, Modal, Label } from '../common';
import { useFacts } from '../../hooks/useFacts';
import { parseValueForType, formatValueForDisplay } from '../../lib/validators';
import type { FactDefinition } from '../../store/types';

interface FactValuesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRun: (values: Record<string, unknown>) => void;
  isRunning: boolean;
}

export function FactValuesModal({
  isOpen,
  onClose,
  onRun,
  isRunning,
}: FactValuesModalProps) {
  const { facts } = useFacts();
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      const initialValues: Record<string, string> = {};
      for (const fact of facts) {
        initialValues[fact.name] = formatValueForDisplay(
          fact.defaultValue,
          fact.type
        );
      }
      setValues(initialValues);
    }
  }, [isOpen, facts]);

  const handleValueChange = (factName: string, value: string) => {
    setValues((prev) => ({ ...prev, [factName]: value }));
  };

  const handleRun = () => {
    const parsedValues: Record<string, unknown> = {};
    for (const fact of facts) {
      parsedValues[fact.name] = parseValueForType(
        values[fact.name] || '',
        fact.type
      );
    }
    onRun(parsedValues);
  };

  const renderInput = (fact: FactDefinition) => {
    const value = values[fact.name] || '';

    switch (fact.type) {
      case 'number':
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) => handleValueChange(fact.name, e.target.value)}
            placeholder="0"
          />
        );

      case 'boolean':
        return (
          <select
            value={value}
            onChange={(e) => handleValueChange(fact.name, e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
          >
            <option value="true">true</option>
            <option value="false">false</option>
          </select>
        );

      case 'array':
      case 'object':
        return (
          <Textarea
            value={value}
            onChange={(e) => handleValueChange(fact.name, e.target.value)}
            placeholder={
              fact.type === 'array' ? '["item1", "item2"]' : '{"key": "value"}'
            }
            rows={3}
            className="font-mono text-sm"
          />
        );

      default:
        return (
          <Input
            value={value}
            onChange={(e) => handleValueChange(fact.name, e.target.value)}
            placeholder="value"
          />
        );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Enter Fact Values"
      description="Provide values for each fact to run the rules engine"
      size="lg"
    >
      <div className="max-h-[60vh] overflow-y-auto space-y-4 pr-2">
        {facts.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            No facts defined. Add facts first before running the engine.
          </div>
        ) : (
          facts.map((fact) => (
            <div key={fact.id} className="space-y-2">
              <Label htmlFor={`fact-${fact.id}`}>
                <span className="font-mono">{fact.name}</span>
                <span className="ml-2 text-xs text-muted-foreground">
                  ({fact.type})
                </span>
              </Label>
              {fact.description && (
                <p className="text-xs text-muted-foreground">
                  {fact.description}
                </p>
              )}
              {renderInput(fact)}
            </div>
          ))
        )}
      </div>

      <div className="flex justify-end gap-2 pt-6 border-t mt-6">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleRun} disabled={facts.length === 0 || isRunning}>
          <Play className="mr-2 h-4 w-4" />
          {isRunning ? 'Running...' : 'Run Engine'}
        </Button>
      </div>
    </Modal>
  );
}
