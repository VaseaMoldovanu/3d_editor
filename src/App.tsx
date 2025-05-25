import React from 'react';
import Viewport from './components/Viewport';
import Toolbar from './components/Toolbar';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <div className="w-screen h-screen bg-gradient-to-br from-white to-gray-100 relative">
      <Viewport />
      <Toolbar />
      <Sidebar />
    </div>
  );
}

export default App;