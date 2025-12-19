import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Header, MainLayout } from './components/layout';
import { FactsPanel } from './components/facts';
import { RulesPanel } from './components/rules';
import { FactValuesModal, ResultsPanel } from './components/execution';
import { useEngine } from './hooks/useEngine';
import { runEngine } from './lib/engine';
import toast from 'react-hot-toast';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return (
        localStorage.getItem('darkMode') === 'true' ||
        (!localStorage.getItem('darkMode') &&
          window.matchMedia('(prefers-color-scheme: dark)').matches)
      );
    }
    return false;
  });
  const [isRunModalOpen, setIsRunModalOpen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const {
    facts,
    rules,
    lastRunResult,
    setLastRunResult,
    clearLastRunResult,
    loadFromStorage,
  } = useEngine();

  useEffect(() => {
    loadFromStorage();
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', String(isDarkMode));
  }, [isDarkMode]);

  const handleRunEngine = async (factValues: Record<string, unknown>) => {
    setIsRunning(true);
    try {
      const result = await runEngine(rules, facts, factValues);
      setLastRunResult(result);
      setIsRunModalOpen(false);

      if (result.events.length > 0) {
        toast.success(`${result.events.length} event(s) triggered!`);
      } else {
        toast('No events triggered', { icon: 'ℹ️' });
      }
    } catch (error) {
      console.error('Engine run failed:', error);
      toast.error('Failed to run engine');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        onRunClick={() => setIsRunModalOpen(true)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />

      <MainLayout>
        <FactsPanel />
        <RulesPanel />
      </MainLayout>

      <FactValuesModal
        isOpen={isRunModalOpen}
        onClose={() => setIsRunModalOpen(false)}
        onRun={handleRunEngine}
        isRunning={isRunning}
      />

      {lastRunResult && (
        <ResultsPanel result={lastRunResult} onClose={clearLastRunResult} />
      )}

      <Toaster
        position="top-right"
        toastOptions={{
          className: 'text-sm',
          duration: 3000,
        }}
      />
    </div>
  );
}

export default App;
