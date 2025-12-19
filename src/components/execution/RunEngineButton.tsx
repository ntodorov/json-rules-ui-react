import { Play } from 'lucide-react';
import { Button } from '../common';

interface RunEngineButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isRunning?: boolean;
}

export function RunEngineButton({
  onClick,
  disabled,
  isRunning,
}: RunEngineButtonProps) {
  return (
    <Button onClick={onClick} disabled={disabled || isRunning}>
      <Play className="mr-2 h-4 w-4" />
      {isRunning ? 'Running...' : 'Run Engine'}
    </Button>
  );
}
