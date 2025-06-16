import React from 'react';
import Viewport from './components/Viewport';
import Toolbar from './components/Toolbar';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <div className="w-screen h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl float-animation" />
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl float-animation" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl float-animation" style={{ animationDelay: '2s' }} />
      </div>
      
      <Viewport />
      <Toolbar />
      <Sidebar />
    </div>
  );
}

export default App;