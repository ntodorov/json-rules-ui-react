import { Input, Label } from '../common';
import { EventParamsEditor } from './EventParamsEditor';
import type { RuleEvent } from '../../store/types';

interface EventEditorProps {
  event: RuleEvent;
  onChange: (event: RuleEvent) => void;
}

export function EventEditor({ event, onChange }: EventEditorProps) {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-muted-foreground">Event</h4>

      <div className="space-y-2">
        <Label htmlFor="event-type">Event Type *</Label>
        <Input
          id="event-type"
          value={event.type}
          onChange={(e) => onChange({ ...event, type: e.target.value })}
          placeholder="e.g., apply-discount, send-notification"
        />
      </div>

      <EventParamsEditor
        params={event.params || {}}
        onChange={(params) =>
          onChange({
            ...event,
            params: Object.keys(params).length > 0 ? params : undefined,
          })
        }
      />
    </div>
  );
}
