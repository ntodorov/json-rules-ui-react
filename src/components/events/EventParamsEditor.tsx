import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button, Input } from '../common';

interface EventParamsEditorProps {
  params: Record<string, unknown>;
  onChange: (params: Record<string, unknown>) => void;
}

export function EventParamsEditor({
  params,
  onChange,
}: EventParamsEditorProps) {
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  const entries = Object.entries(params);

  const addParam = () => {
    if (!newKey.trim()) return;

    let parsedValue: unknown = newValue;
    try {
      parsedValue = JSON.parse(newValue);
    } catch {
      // Keep as string if not valid JSON
    }

    onChange({ ...params, [newKey.trim()]: parsedValue });
    setNewKey('');
    setNewValue('');
  };

  const removeParam = (key: string) => {
    const newParams = { ...params };
    delete newParams[key];
    onChange(newParams);
  };

  const updateParam = (key: string, value: string) => {
    let parsedValue: unknown = value;
    try {
      parsedValue = JSON.parse(value);
    } catch {
      // Keep as string if not valid JSON
    }
    onChange({ ...params, [key]: parsedValue });
  };

  const formatValue = (value: unknown): string => {
    if (typeof value === 'string') return value;
    return JSON.stringify(value);
  };

  return (
    <div className="space-y-3">
      <div className="text-sm font-medium text-muted-foreground">
        Parameters
      </div>

      {entries.length > 0 && (
        <div className="space-y-2">
          {entries.map(([key, value]) => (
            <div key={key} className="flex items-center gap-2">
              <Input value={key} disabled className="w-32 bg-muted" />
              <Input
                value={formatValue(value)}
                onChange={(e) => updateParam(key, e.target.value)}
                className="flex-1"
                placeholder="Value"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeParam(key)}
                className="h-9 w-9 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2">
        <Input
          value={newKey}
          onChange={(e) => setNewKey(e.target.value)}
          placeholder="Key"
          className="w-32"
        />
        <Input
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          placeholder="Value (JSON or string)"
          className="flex-1"
          onKeyDown={(e) => e.key === 'Enter' && addParam()}
        />
        <Button variant="outline" size="icon" onClick={addParam}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {entries.length > 0 && (
        <div className="mt-2">
          <div className="text-xs text-muted-foreground mb-1">Preview:</div>
          <pre className="rounded-md bg-muted p-2 text-xs overflow-auto">
            {JSON.stringify(params, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
