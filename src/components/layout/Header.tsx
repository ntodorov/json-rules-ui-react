import { useState } from 'react';
import { Play, Download, Upload, Moon, Sun, Settings } from 'lucide-react';
import { Button, Tooltip } from '../common';
import { useEngine } from '../../hooks/useEngine';
import toast from 'react-hot-toast';

interface HeaderProps {
  onRunClick: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export function Header({
  onRunClick,
  isDarkMode,
  onToggleDarkMode,
}: HeaderProps) {
  const { rules, facts, exportData, importData } = useEngine();
  const [isImporting, setIsImporting] = useState(false);

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rules-engine-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Configuration exported');
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setIsImporting(true);
      try {
        const text = await file.text();
        const data = JSON.parse(text);

        if (!Array.isArray(data.facts) || !Array.isArray(data.rules)) {
          throw new Error('Invalid file format');
        }

        importData(data);
        toast.success('Configuration imported');
      } catch (error) {
        toast.error('Failed to import: Invalid file format');
      } finally {
        setIsImporting(false);
      }
    };
    input.click();
  };

  const hasRulesAndFacts = rules.length > 0 && facts.length > 0;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Settings className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">JSON Rules Engine Editor</h1>
        </div>

        <div className="flex items-center gap-2">
          <Tooltip content="Import configuration">
            <Button
              variant="outline"
              size="icon"
              onClick={handleImport}
              disabled={isImporting}
            >
              <Upload className="h-4 w-4" />
            </Button>
          </Tooltip>

          <Tooltip content="Export configuration">
            <Button variant="outline" size="icon" onClick={handleExport}>
              <Download className="h-4 w-4" />
            </Button>
          </Tooltip>

          <Tooltip content={isDarkMode ? 'Light mode' : 'Dark mode'}>
            <Button variant="outline" size="icon" onClick={onToggleDarkMode}>
              {isDarkMode ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          </Tooltip>

          <Button onClick={onRunClick} disabled={!hasRulesAndFacts}>
            <Play className="mr-2 h-4 w-4" />
            Run Engine
          </Button>
        </div>
      </div>
    </header>
  );
}
