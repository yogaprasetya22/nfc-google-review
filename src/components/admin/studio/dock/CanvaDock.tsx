import React from 'react';
import {
  LayoutTemplate,
  Shapes,
  Type,
  Upload,
  Layers
} from 'lucide-react';
import type { CanvaDockTab } from '../types';

interface CanvaDockProps {
  activeTab: CanvaDockTab;
  onSelectTab: (tab: CanvaDockTab) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
}

export function CanvaDock({ activeTab, onSelectTab, isOpen, onToggleOpen }: CanvaDockProps) {
  const tabs: { id: CanvaDockTab; label: string; icon: React.ReactNode }[] = [
    { id: 'templates', label: 'Template', icon: <LayoutTemplate className="h-5 w-5" /> },
    { id: 'elements', label: 'Elemen', icon: <Shapes className="h-5 w-5" /> },
    { id: 'text', label: 'Teks', icon: <Type className="h-5 w-5" /> },
    { id: 'uploads', label: 'Unggahan', icon: <Upload className="h-5 w-5" /> },
    { id: 'layers', label: 'Lapisan', icon: <Layers className="h-5 w-5" /> }
  ];

  return (
    <aside className="w-[72px] bg-slate-900 border-r border-slate-800 flex flex-col items-center py-3 select-none shrink-0 z-20">
      <div className="flex flex-col gap-2 w-full px-1.5">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id && isOpen;
          return (
            <button
              key={tab.id}
              onClick={() => {
                if (activeTab === tab.id && isOpen) {
                  onToggleOpen();
                } else {
                  onSelectTab(tab.id);
                }
              }}
              className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-xl text-[10px] font-semibold transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/50'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <div className="mb-1">{tab.icon}</div>
              <span className="leading-tight tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
