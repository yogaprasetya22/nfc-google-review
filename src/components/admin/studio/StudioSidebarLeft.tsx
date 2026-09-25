import React from 'react';
import { CanvaDock } from './dock/CanvaDock';
import { DrawerTemplates } from './dock/DrawerTemplates';
import { DrawerElements } from './dock/DrawerElements';
import { DrawerText } from './dock/DrawerText';
import { DrawerUploads } from './dock/DrawerUploads';
import { DrawerLayers } from './dock/DrawerLayers';
import type { CanvaDockTab, CanvasElement, TemplateType, CardSide } from './types';
import type { NfcTagEntity } from '@/types/nfc';
import { ChevronLeft } from 'lucide-react';

interface StudioSidebarLeftProps {
  activeTab: CanvaDockTab;
  onSelectTab: (tab: CanvaDockTab) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
  activeTemplate: TemplateType;
  onApplyTemplate: (tmpl: TemplateType) => void;
  elements: CanvasElement[];
  selectedElementId: string | null;
  onSelectElement: (id: string) => void;
  onToggleElementVisible: (id: string) => void;
  onToggleElementLock?: (id: string) => void;
  onMoveLayer?: (id: string, direction: 'up' | 'down' | 'front' | 'back') => void;
  onAddNewElement: (
    type: CanvasElement['type'],
    label: string,
    customContent?: string,
    options?: Partial<CanvasElement>
  ) => void;
  bgImage: string | null;
  onUploadBackground: (e: React.ChangeEvent<HTMLInputElement> | File) => void;
  onUploadImageFile?: (file: File) => void;
  onRemoveBackground: () => void;
  getElementWallDistances: (el: CanvasElement) => { leftEdge: number; rightEdge: number };
  tag?: NfcTagEntity;
  activeSide?: CardSide;
  customTemplates?: any[];
  onApplyCustomTemplate?: (template: any) => void;
  onDeleteCustomTemplate?: (templateId: string) => void;
}

function StudioSidebarLeftComponent({
  activeTab,
  onSelectTab,
  isOpen,
  onToggleOpen,
  activeTemplate,
  onApplyTemplate,
  elements,
  selectedElementId,
  onSelectElement,
  onToggleElementVisible,
  onToggleElementLock,
  onMoveLayer,
  onAddNewElement,
  bgImage,
  onUploadBackground,
  onUploadImageFile,
  onRemoveBackground,
  getElementWallDistances,
  tag,
  customTemplates,
  onApplyCustomTemplate,
  onDeleteCustomTemplate
}: StudioSidebarLeftProps) {
  return (
    <div className="flex h-full shrink-0 z-20">
      {/* Tier 1: 72px Vertical Canva Dock Icons */}
      <CanvaDock
        activeTab={activeTab}
        onSelectTab={onSelectTab}
        isOpen={isOpen}
        onToggleOpen={onToggleOpen}
      />

      {/* Tier 2: Drawer Content Panel (Collapsible) */}
      {isOpen && (
        <aside className="w-80 bg-white border-r border-slate-200 flex flex-col h-full overflow-hidden shadow-sm animate-in slide-in-from-left-4 duration-200 relative">
          {/* Header Close Toggle */}
          <div className="h-10 border-b border-slate-100 flex items-center justify-between px-3 shrink-0 bg-slate-50/70">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              {activeTab === 'templates' && 'Katalog Template'}
              {activeTab === 'elements' && 'Elemen & Bentuk'}
              {activeTab === 'text' && 'Teks Desain'}
              {activeTab === 'uploads' && 'Unggah Gambar'}
              {activeTab === 'layers' && 'Susunan Lapisan'}
            </span>
            <button
              onClick={onToggleOpen}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition"
              title="Tutup Panel"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          </div>

          {/* Drawer Body Scrollable */}
          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === 'templates' && (
              <DrawerTemplates
                activeTemplate={activeTemplate}
                onApplyTemplate={onApplyTemplate}
                customTemplates={customTemplates}
                onApplyCustomTemplate={onApplyCustomTemplate}
                onDeleteCustomTemplate={onDeleteCustomTemplate}
              />
            )}

            {activeTab === 'elements' && (
              <DrawerElements
                onAddNewElement={onAddNewElement}
                tag={tag}
              />
            )}

            {activeTab === 'text' && (
              <DrawerText onAddNewElement={onAddNewElement} />
            )}

            {activeTab === 'uploads' && (
              <DrawerUploads
                bgImage={bgImage}
                onUploadBackground={onUploadBackground}
                onRemoveBackground={onRemoveBackground}
                onAddNewElement={onAddNewElement}
                onUploadImageFile={onUploadImageFile}
              />
            )}

            {activeTab === 'layers' && (
              <DrawerLayers
                elements={elements}
                selectedElementId={selectedElementId}
                onSelectElement={onSelectElement}
                onToggleElementVisible={onToggleElementVisible}
                onToggleElementLock={onToggleElementLock}
                onMoveLayer={onMoveLayer}
                getElementWallDistances={getElementWallDistances}
              />
            )}
          </div>
        </aside>
      )}
    </div>
  );
}

export const StudioSidebarLeft = React.memo(StudioSidebarLeftComponent, (prev, next) => {
  if (prev.activeTab !== next.activeTab) return false;
  if (prev.isOpen !== next.isOpen) return false;
  if (prev.selectedElementId !== next.selectedElementId) return false;
  if (prev.activeSide !== next.activeSide) return false;
  if (prev.activeTemplate !== next.activeTemplate) return false;
  if (prev.bgImage !== next.bgImage) return false;
  if (prev.customTemplates !== next.customTemplates) return false;
  if (prev.elements.length !== next.elements.length) return false;
  // If active tab is not layers, don't re-render for coordinate/size changes
  if (next.activeTab !== 'layers') return true;
  return prev.elements === next.elements;
});
