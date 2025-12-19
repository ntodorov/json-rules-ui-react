import * as React from 'react';
import { cn } from '../../lib/utils';

interface JsonViewerProps {
  data: unknown;
  className?: string;
  collapsed?: boolean;
}

export function JsonViewer({
  data,
  className,
  collapsed = false,
}: JsonViewerProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(collapsed);

  const formatJson = (obj: unknown): string => {
    try {
      return JSON.stringify(obj, null, 2);
    } catch {
      return String(obj);
    }
  };

  const json = formatJson(data);
  const lineCount = json.split('\n').length;

  return (
    <div className={cn('relative', className)}>
      {lineCount > 5 && (
        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute right-2 top-2 text-xs text-muted-foreground hover:text-foreground"
        >
          {isCollapsed ? 'Expand' : 'Collapse'}
        </button>
      )}
      <pre
        className={cn(
          'overflow-auto rounded-md bg-muted p-4 text-sm',
          isCollapsed && lineCount > 5 && 'max-h-24'
        )}
      >
        <code>{json}</code>
      </pre>
    </div>
  );
}
