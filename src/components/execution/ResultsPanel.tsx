import { CheckCircle2, XCircle, Clock, Download, X } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Badge,
} from '../common';
import { EventsTimeline } from './EventsTimeline';
import type { EngineRunResult } from '../../store/types';

interface ResultsPanelProps {
  result: EngineRunResult;
  onClose: () => void;
}

export function ResultsPanel({ result, onClose }: ResultsPanelProps) {
  const successCount = result.results.filter((r) => r.success).length;
  const failCount = result.results.filter((r) => !r.success).length;

  const exportResults = () => {
    const blob = new Blob([JSON.stringify(result, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rules-result-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed inset-x-4 bottom-4 z-40 md:left-auto md:right-4 md:w-[480px]"
    >
      <Card className="shadow-xl border-2">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">Execution Results</CardTitle>
              <Badge variant="outline" className="text-xs">
                <Clock className="mr-1 h-3 w-3" />
                {result.executionTime.toFixed(2)}ms
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={exportResults}
                className="h-8 w-8"
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="max-h-[60vh] overflow-y-auto">
          <div className="space-y-4">
            {/* Summary */}
            <div className="flex gap-4">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>{successCount} passed</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <XCircle className="h-4 w-4 text-red-600" />
                <span>{failCount} failed</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Badge
                  variant={result.events.length > 0 ? 'success' : 'secondary'}
                >
                  {result.events.length} event
                  {result.events.length !== 1 ? 's' : ''} triggered
                </Badge>
              </div>
            </div>

            {/* Events */}
            {result.events.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Triggered Events</h4>
                <EventsTimeline events={result.events} />
              </div>
            )}

            {/* Rule Results */}
            <div>
              <h4 className="text-sm font-medium mb-2">Rule Results</h4>
              <div className="space-y-2">
                {result.results.map((ruleResult, index) => (
                  <motion.div
                    key={ruleResult.ruleId}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex items-center gap-2 rounded-md border p-2 ${
                      ruleResult.success
                        ? 'bg-green-50/50 dark:bg-green-950/20 border-green-200 dark:border-green-800'
                        : 'bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-800'
                    }`}
                  >
                    {ruleResult.success ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="text-sm font-medium">
                      {ruleResult.ruleName}
                    </span>
                    <Badge
                      variant={ruleResult.success ? 'success' : 'destructive'}
                      className="ml-auto text-xs"
                    >
                      {ruleResult.success ? 'Passed' : 'Failed'}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Timestamp */}
            <div className="text-xs text-muted-foreground text-center pt-2 border-t">
              Executed at {new Date(result.timestamp).toLocaleTimeString()}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
