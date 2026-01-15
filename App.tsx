
import React, { useState } from 'react';
import { ToolId } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Compressor from './tools/Compressor';
import Upscaler from './tools/Upscaler';
import Converter from './tools/Converter';
import Resizer from './tools/Resizer';

const App: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ToolId>('dashboard');

  const renderTool = () => {
    switch (activeTool) {
      case 'dashboard':
        return <Dashboard onSelectTool={setActiveTool} />;
      case 'compressor':
        return <Compressor />;
      case 'upscaler':
        return <Upscaler />;
      case 'converter':
        return <Converter />;
      case 'resizer':
        return <Resizer />;
      default:
        return <Dashboard onSelectTool={setActiveTool} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans">
      {/* Navigation Sidebar */}
      <Sidebar activeTool={activeTool} onSelectTool={setActiveTool} />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {renderTool()}
        </div>
      </main>
    </div>
  );
};

export default App;
