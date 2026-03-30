import React, { useEffect, useState } from 'react';
import Chronology from './components/Chronology';
import Counter from './components/Counter';
import Settings from './components/Settings';
import Stats from './components/Stats';

export type View = 'epoch' | 'stats' | 'chrono' | 'config';

// Default Epoch: 2000-01-01 01:01:00 UTC
export const ARCHITECT_DEFAULT_EPOCH = 946688460000;

const App: React.FC = () => {
  const [view, setView] = useState<View>('epoch');
  const [activeEpochMs, setActiveEpochMs] = useState<number>(ARCHITECT_DEFAULT_EPOCH);
  const [showGuide, setShowGuide] = useState(false);
  const [noDriftMode, setNoDriftMode] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('architect_custom_epoch');
    const savedNoDriftMode = localStorage.getItem('architect_no_drift_mode');
    if (saved) {
      setActiveEpochMs(parseInt(saved, 10));
    }
    if (savedNoDriftMode) {
      setNoDriftMode(savedNoDriftMode === 'true');
    }
  }, []);

  const handleNoDriftModeChange = (enabled: boolean) => {
    setNoDriftMode(enabled);
    localStorage.setItem('architect_no_drift_mode', enabled.toString());
  };

  const handleUpdateEpoch = (newEpoch: number) => {
    if (noDriftMode) {
      return;
    }
    setActiveEpochMs(newEpoch);
    localStorage.setItem('architect_custom_epoch', newEpoch.toString());
  };

  const handleResetEpoch = () => {
    if (noDriftMode) {
      return;
    }
    setActiveEpochMs(ARCHITECT_DEFAULT_EPOCH);
    localStorage.removeItem('architect_custom_epoch');
  };

  return (
    <main className="min-h-screen w-full flex flex-col bg-black text-white relative font-mono overflow-x-hidden">
      {/* Help / Guide Button */}
      <button
        onClick={() => setShowGuide(true)}
        className="fixed top-4 right-4 z-40 flex items-center space-x-2 px-4 py-2 bg-black/50 backdrop-blur-sm border border-gray-800 hover:border-white/50 text-gray-500 hover:text-white transition-all group"
      >
        <div className="w-1.5 h-1.5 bg-gray-600 group-hover:bg-white rounded-full transition-colors"></div>
        <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Guide</span>
      </button>

      {/* Guide Modal */}
      {showGuide && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div
            className="w-full max-w-lg bg-black border border-gray-800 p-8 md:p-12 relative shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowGuide(false)}
              className="absolute top-4 right-4 p-2 text-gray-600 hover:text-white transition-colors"
            >
              ✕
            </button>

            <div className="space-y-8">
              <div className="space-y-2 border-b border-gray-900 pb-6">
                <h2 className="text-xl font-bold tracking-[0.2em] uppercase text-white">
                  Why this exists
                </h2>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                  A different way to view time
                </p>
              </div>

              <div className="space-y-6 text-sm text-gray-300 leading-relaxed font-sans">
                <p>
                  <strong className="text-white">Most clocks reset. This one adds up.</strong>
                </p>
                <p>
                  Standard calendars loop endlessly (Monday to Sunday, January to December). They create a sense of repetition and often, a fear of running out of time.
                </p>
                <p>
                  This interface does the opposite. It tracks your time as a <strong className="text-white">continuous, growing number</strong> from a specific starting point—like your birthday.
                </p>
                <div className="bg-gray-900/30 p-4 border-l-2 border-gray-700">
                  <p className="text-xs italic text-gray-400">
                    "Time is not something you are running out of. It is something you are building."
                  </p>
                </div>
                <div className="space-y-2 pt-2">
                  <h3 className="text-[10px] uppercase tracking-widest font-bold text-gray-500">How to use</h3>
                  <ul className="list-disc pl-4 space-y-1 text-xs text-gray-400 marker:text-gray-700">
                    <li>Tap <strong className="text-white">CONFIG</strong> at the bottom.</li>
                    <li>Enter your birthday or a significant start date.</li>
                    <li>Watch your life accumulate in real-time.</li>
                  </ul>
                </div>
                <div className="space-y-2 pt-2">
                  <h3 className="text-[10px] uppercase tracking-widest font-bold text-gray-500">No drift mode</h3>
                  <p className="text-xs text-gray-400">
                    Keep this ON to lock your active epoch and prevent accidental timeline drift.
                    Turn it OFF only when you intentionally want to edit your base date.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowGuide(false)}
                className="w-full py-4 border border-gray-800 hover:bg-white hover:text-black hover:border-white transition-all uppercase tracking-[0.3em] text-[10px] font-bold"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="flex-grow flex items-center justify-center p-4 pb-32">
        {view === 'epoch' && <Counter epochMs={activeEpochMs} />}
        {view === 'stats' && <Stats epochMs={activeEpochMs} />}
        {view === 'chrono' && <Chronology epochMs={activeEpochMs} />}
        {view === 'config' && (
          <div className="w-full max-w-2xl space-y-4">
            <div className="border border-gray-800 bg-black/40 p-4 space-y-3">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold">
                    Commit Control
                  </p>
                  <p className="text-xs text-gray-300 mt-1">
                    No Drift Mode keeps your epoch locked.
                  </p>
                </div>
                <button
                  onClick={() => handleNoDriftModeChange(!noDriftMode)}
                  className={`px-3 py-2 text-[10px] uppercase tracking-[0.2em] border transition-colors ${
                    noDriftMode
                      ? 'border-emerald-400 text-emerald-300 hover:bg-emerald-500/10'
                      : 'border-amber-400 text-amber-300 hover:bg-amber-500/10'
                  }`}
                >
                  {noDriftMode ? 'No Drift: On' : 'No Drift: Off'}
                </button>
              </div>
              <p className="text-[11px] text-gray-400">
                {noDriftMode
                  ? 'Epoch edits are locked. Disable No Drift Mode to update or reset.'
                  : 'Epoch edits are unlocked. Make your change, then re-enable No Drift Mode.'}
              </p>
            </div>

            <Settings
              currentEpochMs={activeEpochMs}
              onUpdate={handleUpdateEpoch}
              onReset={handleResetEpoch}
            />
          </div>
        )}
      </div>

      {/* Minimalist Navigation */}
      <nav className="fixed bottom-0 left-0 w-full bg-black/90 backdrop-blur-sm border-t border-gray-900 py-6 z-50">
        <div className="flex justify-center items-center space-x-4 sm:space-x-8 lg:space-x-12 px-4">
          <button
            onClick={() => setView('epoch')}
            className={`text-[10px] sm:text-xs tracking-[0.25em] uppercase transition-all duration-300 ${
              view === 'epoch'
                ? 'text-white font-bold opacity-100'
                : 'text-gray-500 hover:text-gray-300 opacity-60'
            }`}
          >
            Epoch
          </button>

          <div className="w-px h-3 bg-gray-800"></div>

          <button
            onClick={() => setView('chrono')}
            className={`text-[10px] sm:text-xs tracking-[0.25em] uppercase transition-all duration-300 ${
              view === 'chrono'
                ? 'text-white font-bold opacity-100'
                : 'text-gray-500 hover:text-gray-300 opacity-60'
            }`}
          >
            Chrono
          </button>

          <div className="w-px h-3 bg-gray-800"></div>

          <button
            onClick={() => setView('stats')}
            className={`text-[10px] sm:text-xs tracking-[0.25em] uppercase transition-all duration-300 ${
              view === 'stats'
                ? 'text-white font-bold opacity-100'
                : 'text-gray-500 hover:text-gray-300 opacity-60'
            }`}
          >
            Totals
          </button>

          <div className="w-px h-3 bg-gray-800"></div>

          <button
            onClick={() => setView('config')}
            className={`text-[10px] sm:text-xs tracking-[0.25em] uppercase transition-all duration-300 ${
              view === 'config'
                ? 'text-white font-bold opacity-100'
                : 'text-gray-500 hover:text-gray-300 opacity-60'
            }`}
          >
            Config
          </button>
        </div>
      </nav>
    </main>
  );
};

export default App;
