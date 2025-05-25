import React, { useState } from 'react';
import { Printer, Settings, Layers, Play } from 'lucide-react';
import { useEditorStore } from '../store';

export default function PrinterPanel() {
  const [printerIP, setPrinterIP] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [connected, setConnected] = useState(false);
  const [slicingProgress, setSlicingProgress] = useState(0);
  const { objects } = useEditorStore();

  const handleConnect = async () => {
    try {
      // Implement WebSocket connection to Bambu Lab printer
      setConnected(true);
    } catch (error) {
      console.error('Failed to connect:', error);
    }
  };

  const handleSlice = async () => {
    // Simulate slicing progress
    for (let i = 0; i <= 100; i += 10) {
      setSlicingProgress(i);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  const handlePrint = async () => {
    if (!connected) return;
    // Implement print command sending
  };

  return (
    <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-4 w-64">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Printer className="w-5 h-5" />
        Bambu Lab Printer
      </h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Printer IP</label>
          <input
            type="text"
            value={printerIP}
            onChange={(e) => setPrinterIP(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="192.168.1.100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Access Code</label>
          <input
            type="password"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="000000"
          />
        </div>

        <button
          onClick={handleConnect}
          className={`w-full py-2 px-4 rounded-lg transition-all ${
            connected
              ? 'bg-green-500 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {connected ? 'Connected' : 'Connect'}
        </button>

        <div className="flex gap-2 mt-4">
          <button
            onClick={handleSlice}
            disabled={!connected}
            className="flex-1 py-2 px-4 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Layers className="w-4 h-4" />
            Slice
          </button>
          <button
            onClick={handlePrint}
            disabled={!connected || slicingProgress < 100}
            className="flex-1 py-2 px-4 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4" />
            Print
          </button>
        </div>

        {slicingProgress > 0 && slicingProgress < 100 && (
          <div className="mt-4">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-500"
                style={{ width: `${slicingProgress}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-1 text-center">
              Slicing: {slicingProgress}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
}