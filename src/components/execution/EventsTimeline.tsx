import { Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import type { RuleEvent } from '../../store/types';

interface EventsTimelineProps {
  events: RuleEvent[];
}

export function EventsTimeline({ events }: EventsTimelineProps) {
  if (events.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        No events triggered
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {events.map((event, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-start gap-3 rounded-md border bg-green-50/50 dark:bg-green-950/20 p-3"
        >
          <Zap className="h-5 w-5 text-green-600 mt-0.5" />
          <div className="flex-1 min-w-0">
            <div className="font-medium text-green-700 dark:text-green-400">
              {event.type}
            </div>
            {event.params && Object.keys(event.params).length > 0 && (
              <pre className="mt-2 text-xs bg-white/50 dark:bg-black/20 rounded p-2 overflow-auto">
                {JSON.stringify(event.params, null, 2)}
              </pre>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
