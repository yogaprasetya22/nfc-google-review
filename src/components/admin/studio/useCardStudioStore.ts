import { create } from 'zustand';
import type {
  CanvasElement,
  TemplateType,
  CardPreset,
  CardSide,
  CanvaDockTab,
  DimensionInfo,
  CustomTemplate
} from './types';
import { DIMENSIONS_MAP } from './types';
import {
  STARTER_TEMPLATES,
  DEFAULT_BLANK_ELEMENTS,
  loadExternalStarterTemplates
} from './starterTemplates';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { deleteGDriveFile, extractGDriveFileId } from '@/lib/gdrive';

interface HistoryState {
  past: CanvasElement[][];
  present: CanvasElement[];
  future: CanvasElement[][];
}

interface CardStudioState {
  // Navigation & Sisi Kartu
  activeSide: CardSide;
  activeDockTab: CanvaDockTab;
  isDockOpen: boolean;

  // Preset Kartu & Dimensi
  cardPreset: CardPreset;
  dimensions: DimensionInfo;
  wallMarginPx: number;

  // Canvas Settings
  zoomScale: number;
  snapEnabled: boolean;
  showGuides: boolean;
  canvasBgColor: string;
  activeGuides: {
    vCenter?: boolean;
    hCenter?: boolean;
    snapWallLeft?: boolean;
    snapWallRight?: boolean;
    alignWithOtherY?: number;
    symmetricSnapPx?: number;
  };

  // State Template & Background
  activeTemplateFront: TemplateType;
  activeTemplateBack: TemplateType;
  bgImageFront: string | null;
  bgImageBack: string | null;
  bgScaleMode: 'cover' | 'contain' | 'stretch';

  // State Elemen & Undo/Redo
  frontHistory: HistoryState;
  backHistory: HistoryState;
  selectedElementId: string | null;

  // State Penyimpanan
  isSaving: boolean;

  // Actions
  initializeStudio: (tag: any) => void;
  setActiveSide: (side: CardSide) => void;
  setActiveDockTab: (tab: CanvaDockTab) => void;
  setIsDockOpen: (open: boolean) => void;
  setCardPreset: (preset: CardPreset) => void;
  setWallMarginPx: (px: number) => void;
  setZoomScale: (scale: number | ((prev: number) => number)) => void;
  setSnapEnabled: (enabled: boolean | ((prev: boolean) => boolean)) => void;
  setShowGuides: (show: boolean | ((prev: boolean) => boolean)) => void;
  setActiveGuides: (guides: any) => void;
  setSelectedElementId: (id: string | null) => void;

  // Element Actions
  getCurrentElements: () => CanvasElement[];
  updateCurrentElements: (newElements: CanvasElement[]) => void;
  updateLiveElementsOnly: (updater: (prev: CanvasElement[]) => CanvasElement[]) => void;
  updateSelectedElement: (updates: Partial<CanvasElement>) => void;
  addNewElement: (
    type: CanvasElement['type'],
    label: string,
    customContent?: string,
    options?: Partial<CanvasElement>
  ) => void;
  deleteSelectedElement: () => void;
  duplicateSelectedElement: () => void;
  reorderElements: (newElements: CanvasElement[]) => void;
  moveLayer: (elemId: string, direction: 'up' | 'down' | 'front' | 'back') => void;

  // Template Actions
  applyTemplate: (tmpl: TemplateType, businessName?: string | null) => void;
  resetCurrentLayout: (businessName?: string | null) => void;

  // Background Actions
  setBgImage: (side: CardSide, url: string | null) => void;

  // History Actions (Undo/Redo)
  canUndo: () => boolean;
  canRedo: () => boolean;
  undo: () => void;
  redo: () => void;

  // Database Persistence
  saveToDatabase: (tag: any, onTagUpdated?: (updated: any) => void) => Promise<boolean>;

  // Custom Templates from DB
  customTemplates: CustomTemplate[];
  fetchCustomTemplates: () => Promise<void>;
  publishCustomTemplate: (title: string) => Promise<boolean>;
  applyCustomTemplate: (template: CustomTemplate, businessName?: string | null) => void;
  deleteCustomTemplate: (templateId: string) => Promise<boolean>;
}

const createInitialHistory = (elements: CanvasElement[]): HistoryState => ({
  past: [],
  present: elements,
  future: []
});

export const useCardStudioStore = create<CardStudioState>((set, get) => ({
  activeSide: 'front',
  activeDockTab: 'templates',
  isDockOpen: true,

  cardPreset: 'square',
  dimensions: DIMENSIONS_MAP.square,
  wallMarginPx: 45,

  zoomScale: 1,
  snapEnabled: true,
  showGuides: true,
  canvasBgColor: '#ffffff',
  activeGuides: {},

  activeTemplateFront: 'google_black_curve',
  activeTemplateBack: 'google_back_qr_focus',
  bgImageFront: null,
  bgImageBack: null,
  bgScaleMode: 'cover',

  frontHistory: createInitialHistory(DEFAULT_BLANK_ELEMENTS),
  backHistory: createInitialHistory(DEFAULT_BLANK_ELEMENTS),
  selectedElementId: null,
  isSaving: false,
  customTemplates: [],

  initializeStudio: (tag: any) => {
    get().fetchCustomTemplates();
    const saved = tag?.hub_config?.card_design;
    const frontKey = `studio_elements_front_${tag?.id}`;
    const backKey = `studio_elements_back_${tag?.id}`;

    let frontElems = saved?.front?.elements;
    if (!frontElems || !Array.isArray(frontElems) || frontElems.length === 0) {
      try {
        const local = localStorage.getItem(frontKey);
        if (local) frontElems = JSON.parse(local);
      } catch (e) {
        // safe
      }
    }
    if (!frontElems || frontElems.length === 0) {
      frontElems = DEFAULT_BLANK_ELEMENTS;
    }

    let backElems = saved?.back?.elements;
    if (!backElems || !Array.isArray(backElems) || backElems.length === 0) {
      try {
        const local = localStorage.getItem(backKey);
        if (local) backElems = JSON.parse(local);
      } catch (e) {
        // safe
      }
    }
    if (!backElems || backElems.length === 0) {
      backElems = DEFAULT_BLANK_ELEMENTS;
    }

    const preset: CardPreset = (saved?.preset as CardPreset) || 'card_v';

    set({
      cardPreset: preset,
      dimensions: DIMENSIONS_MAP[preset] || DIMENSIONS_MAP.card_v,
      activeTemplateFront: (saved?.front?.template as TemplateType) || 'google_multicolor_pop',
      activeTemplateBack: (saved?.back?.template as TemplateType) || 'google_back_qr_focus',
      bgImageFront: saved?.front?.bgImage || null,
      bgImageBack: saved?.back?.bgImage || null,
      frontHistory: createInitialHistory(frontElems),
      backHistory: createInitialHistory(backElems),
      selectedElementId: null
    });
  },

  setActiveSide: (side) => set({ activeSide: side, selectedElementId: null }),
  setActiveDockTab: (tab) => set({ activeDockTab: tab, isDockOpen: true }),
  setIsDockOpen: (open) => set({ isDockOpen: open }),

  setCardPreset: (preset) =>
    set({ cardPreset: preset, dimensions: DIMENSIONS_MAP[preset] }),
  setWallMarginPx: (px) => set({ wallMarginPx: px }),
  setZoomScale: (updater) =>
    set((state) => ({
      zoomScale: typeof updater === 'function' ? updater(state.zoomScale) : updater
    })),
  setSnapEnabled: (updater) =>
    set((state) => ({
      snapEnabled: typeof updater === 'function' ? updater(state.snapEnabled) : updater
    })),
  setShowGuides: (updater) =>
    set((state) => ({
      showGuides: typeof updater === 'function' ? updater(state.showGuides) : updater
    })),
  setActiveGuides: (guides) => set({ activeGuides: guides }),
  setSelectedElementId: (id) => set({ selectedElementId: id }),

  getCurrentElements: () => {
    const { activeSide, frontHistory, backHistory } = get();
    return activeSide === 'front' ? frontHistory.present : backHistory.present;
  },

  updateCurrentElements: (newElements) => {
    const { activeSide, frontHistory, backHistory } = get();
    if (activeSide === 'front') {
      set({
        frontHistory: {
          past: [...frontHistory.past.slice(-25), frontHistory.present],
          present: newElements,
          future: []
        }
      });
    } else {
      set({
        backHistory: {
          past: [...backHistory.past.slice(-25), backHistory.present],
          present: newElements,
          future: []
        }
      });
    }
  },

  updateLiveElementsOnly: (updater) => {
    const { activeSide, frontHistory, backHistory } = get();
    if (activeSide === 'front') {
      set({
        frontHistory: {
          ...frontHistory,
          present: updater(frontHistory.present)
        }
      });
    } else {
      set({
        backHistory: {
          ...backHistory,
          present: updater(backHistory.present)
        }
      });
    }
  },

  updateSelectedElement: (updates) => {
    const { selectedElementId, getCurrentElements, updateCurrentElements } = get();
    if (!selectedElementId) return;
    const current = getCurrentElements();
    const updated = current.map((el) => (el.id === selectedElementId ? { ...el, ...updates } : el));
    updateCurrentElements(updated);
  },

  addNewElement: (type, label, customContent, options) => {
    const { activeSide, getCurrentElements, updateCurrentElements } = get();
    const newId = `${type}_${Date.now()}`;
    let newElem: CanvasElement;

    if (type === 'stars_5') {
      newElem = {
        id: newId,
        type: 'stars_5',
        label: '5 Bintang Emas',
        x: 50,
        y: 50,
        width: 150,
        height: 30,
        visible: true,
        ...options
      };
    } else if (type === 'logo_google') {
      newElem = {
        id: newId,
        type: 'logo_google',
        label: 'Badge Logo Google G',
        x: 50,
        y: 50,
        width: 65,
        height: 65,
        visible: true,
        ...options
      };
    } else if (type === 'google_badge_pill') {
      newElem = {
        id: newId,
        type: 'google_badge_pill',
        label: 'Tombol Pill Review',
        x: 50,
        y: 50,
        width: 200,
        height: 36,
        visible: true,
        content: customContent || 'Review us on Google',
        fontSize: 13,
        textColor: '#ffffff',
        ...options
      };
    } else if (type === 'shape') {
      newElem = {
        id: newId,
        type: 'shape',
        label: label || 'Bentuk Shape',
        x: 50,
        y: 50,
        width: options?.width || 80,
        height: options?.height || 80,
        visible: true,
        shapeType: options?.shapeType || 'circle',
        fillColor: options?.fillColor || '#0f172a',
        strokeColor: options?.strokeColor || 'transparent',
        borderWidth: options?.borderWidth || 0,
        borderRadius: options?.borderRadius || 0,
        content: customContent,
        ...options
      };
    } else if (type === 'icon_badge') {
      newElem = {
        id: newId,
        type: 'icon_badge',
        label: label || 'Icon Badge',
        x: options?.x ?? 50,
        y: options?.y ?? 50,
        width: options?.width || 56,
        height: options?.height || 56,
        visible: true,
        iconName: options?.iconName || 'smartphone',
        iconColor: options?.iconColor || '#4285F4',
        badgeBgColor: options?.badgeBgColor || '#eff6ff',
        badgeShape: options?.badgeShape || 'circle',
        ...options
      };
    } else if (type === 'image') {
      newElem = {
        id: newId,
        type: 'image',
        label: label || 'Gambar Unggahan',
        x: options?.x ?? 50,
        y: options?.y ?? 50,
        width: options?.width || 140,
        height: options?.height || 140,
        visible: true,
        imageUrl: options?.imageUrl || '',
        ...options
      };
    } else {
      newElem = {
        id: newId,
        type: 'text',
        label: label || 'Teks Baru',
        x: 50,
        y: 50,
        width: options?.width || 250,
        height: options?.height || 30,
        visible: true,
        content: customContent !== undefined ? customContent : 'Teks Baru Anda',
        fontSize: options?.fontSize || 16,
        textColor: options?.textColor || '#0f172a',
        fontWeight: options?.fontWeight || 'bold',
        textAlign: options?.textAlign || 'center',
        ...options
      };
    }

    const current = getCurrentElements();
    updateCurrentElements([...current, newElem]);
    set({ selectedElementId: newId });
    toast.success(`Elemen "${label}" ditambahkan ke sisi ${activeSide === 'front' ? 'depan' : 'belakang'}!`);
  },

  deleteSelectedElement: () => {
    const { selectedElementId, getCurrentElements, updateCurrentElements } = get();
    if (!selectedElementId) return;
    if (selectedElementId === 'qr' || selectedElementId === 'nfc') {
      toast.error('Komponen utama NFC & QR Code tidak dapat dihapus.');
      return;
    }
    const current = getCurrentElements();
    const target = current.find((el) => el.id === selectedElementId);
    if (target?.locked) {
      toast.error('Buka kunci objek terlebih dahulu sebelum menghapus.');
      return;
    }
    // Hapus juga dari Google Drive jika elemen berupa gambar yang tersimpan di GDrive
    if (target?.type === 'image' && target.imageUrl) {
      const gdriveFileId = extractGDriveFileId(target.imageUrl);
      if (gdriveFileId) {
        deleteGDriveFile(gdriveFileId).catch((err) => {
          console.warn('Gagal menghapus file dari Google Drive:', err);
        });
      }
    }

    updateCurrentElements(current.filter((el) => el.id !== selectedElementId));
    set({ selectedElementId: null });
    toast.success('Objek berhasil dihapus!');
  },

  duplicateSelectedElement: () => {
    const { selectedElementId, getCurrentElements, updateCurrentElements } = get();
    if (!selectedElementId) return;
    const current = getCurrentElements();
    const source = current.find((el) => el.id === selectedElementId);
    if (!source) return;

    const newId = `${source.type}_${Date.now()}`;
    const clone: CanvasElement = {
      ...source,
      id: newId,
      label: `${source.label} (Salinan)`,
      x: Math.min(92, source.x + 3),
      y: Math.min(92, source.y + 3),
      locked: false
    };

    updateCurrentElements([...current, clone]);
    set({ selectedElementId: newId });
    toast.success(`Objek "${source.label}" berhasil diduplikasi!`);
  },

  reorderElements: (newElements) => {
    get().updateCurrentElements(newElements);
  },

  moveLayer: (elemId, direction) => {
    const { getCurrentElements, updateCurrentElements } = get();
    const current = [...getCurrentElements()];
    const index = current.findIndex((el) => el.id === elemId);
    if (index === -1) return;

    const [item] = current.splice(index, 1);

    if (direction === 'up') {
      // In rendering: higher index = rendered later = on top (forward)
      const nextIndex = Math.min(current.length, index + 1);
      current.splice(nextIndex, 0, item);
      toast.success(`Lapisan "${item.label}" dinaikkan satu tingkat`);
    } else if (direction === 'down') {
      // lower index = rendered earlier = below (backward)
      const nextIndex = Math.max(0, index - 1);
      current.splice(nextIndex, 0, item);
      toast.success(`Lapisan "${item.label}" diturunkan satu tingkat`);
    } else if (direction === 'front') {
      // Paling depan = paling akhir di array
      current.push(item);
      toast.success(`Lapisan "${item.label}" dipindah ke paling depan`);
    } else if (direction === 'back') {
      // Paling belakang = index 0 di array
      current.unshift(item);
      toast.success(`Lapisan "${item.label}" dipindah ke paling belakang`);
    }

    updateCurrentElements(current);
  },

  applyTemplate: (tmpl, businessName) => {
    const { activeSide, updateCurrentElements, customTemplates, setCardPreset } = get();
    // 1. Cari template dari STARTER_TEMPLATES atau customTemplates
    const matched =
      STARTER_TEMPLATES.find((t) => t.id === tmpl) ||
      customTemplates.find((t) => t.id === tmpl);

    let newElements: CanvasElement[] = [];

    if (matched) {
      if (matched.preset) {
        setCardPreset(matched.preset);
      }
      newElements = matched.elements.map((el) => {
        if (el.type === 'text' && el.content && businessName) {
          return {
            ...el,
            content: el.content
              .replace(/\{\{business_name\}\}/gi, businessName)
              .replace(/YOUR BUSINESS LOGO/gi, businessName.toUpperCase())
          };
        }
        return el;
      });
      toast.success(`Template "${matched.title}" dimuat!`);
    } else {
      newElements = DEFAULT_BLANK_ELEMENTS;
      toast.info('Template dimuat ke kanvas!');
    }

    if (activeSide === 'front') {
      set({ activeTemplateFront: tmpl });
    } else {
      set({ activeTemplateBack: tmpl });
    }
    updateCurrentElements(newElements);
  },

  resetCurrentLayout: (businessName) => {
    const { activeSide } = get();
    const fresh = DEFAULT_BLANK_ELEMENTS;
    if (activeSide === 'front') {
      set({
        frontHistory: createInitialHistory(fresh),
        selectedElementId: null
      });
    } else {
      set({
        backHistory: createInitialHistory(fresh),
        selectedElementId: null
      });
    }
    toast.info(`Layout sisi ${activeSide === 'front' ? 'depan' : 'belakang'} berhasil direset.`);
  },

  setBgImage: (side, url) => {
    if (side === 'front') set({ bgImageFront: url });
    else set({ bgImageBack: url });
  },

  canUndo: () => {
    const { activeSide, frontHistory, backHistory } = get();
    return activeSide === 'front' ? frontHistory.past.length > 0 : backHistory.past.length > 0;
  },

  canRedo: () => {
    const { activeSide, frontHistory, backHistory } = get();
    return activeSide === 'front' ? frontHistory.future.length > 0 : backHistory.future.length > 0;
  },

  undo: () => {
    const { activeSide, frontHistory, backHistory } = get();
    if (activeSide === 'front') {
      if (frontHistory.past.length === 0) return;
      const previous = frontHistory.past[frontHistory.past.length - 1];
      const newPast = frontHistory.past.slice(0, frontHistory.past.length - 1);
      set({
        frontHistory: {
          past: newPast,
          present: previous,
          future: [frontHistory.present, ...frontHistory.future]
        }
      });
    } else {
      if (backHistory.past.length === 0) return;
      const previous = backHistory.past[backHistory.past.length - 1];
      const newPast = backHistory.past.slice(0, backHistory.past.length - 1);
      set({
        backHistory: {
          past: newPast,
          present: previous,
          future: [backHistory.present, ...backHistory.future]
        }
      });
    }
  },

  redo: () => {
    const { activeSide, frontHistory, backHistory } = get();
    if (activeSide === 'front') {
      if (frontHistory.future.length === 0) return;
      const next = frontHistory.future[0];
      const newFuture = frontHistory.future.slice(1);
      set({
        frontHistory: {
          past: [...frontHistory.past, frontHistory.present],
          present: next,
          future: newFuture
        }
      });
    } else {
      if (backHistory.future.length === 0) return;
      const next = backHistory.future[0];
      const newFuture = backHistory.future.slice(1);
      set({
        backHistory: {
          past: [...backHistory.past, backHistory.present],
          present: next,
          future: newFuture
        }
      });
    }
  },

  saveToDatabase: async (tag, onTagUpdated) => {
    const {
      activeTemplateFront,
      activeTemplateBack,
      frontHistory,
      backHistory,
      bgImageFront,
      bgImageBack,
      cardPreset
    } = get();

    set({ isSaving: true });
    try {
      const updatedCardDesign = {
        preset: cardPreset,
        front: {
          template: activeTemplateFront,
          elements: frontHistory.present,
          bgImage: bgImageFront
        },
        back: {
          template: activeTemplateBack,
          elements: backHistory.present,
          bgImage: bgImageBack
        },
        updated_at: new Date().toISOString()
      };

      const updatedHubConfig = {
        ...(tag.hub_config || {}),
        card_design: updatedCardDesign
      };

      const { error } = await supabase
        .from('nfc_tags')
        .update({ hub_config: updatedHubConfig })
        .eq('id', tag.id);

      if (error) throw error;

      if (tag.hub_config) {
        tag.hub_config.card_design = updatedCardDesign;
      } else {
        tag.hub_config = updatedHubConfig;
      }

      onTagUpdated?.({
        ...tag,
        hub_config: updatedHubConfig
      });

      toast.success('Desain kartu NFC berhasil disimpan ke Database!');
      return true;
    } catch (err: any) {
      console.error('Error saving card design to DB:', err);
      toast.error(`Gagal menyimpan ke database: ${err?.message || 'Terjadi kesalahan'}`);
      return false;
    } finally {
      set({ isSaving: false });
    }
  },

  fetchCustomTemplates: async () => {
    try {
      // 1. Ambil template standar dari file JSON eksternal
      const externalTemplates = await loadExternalStarterTemplates();

      // 2. Ambil template kreasi pengguna dari Supabase studio_templates
      let userTemplates: CustomTemplate[] = [];
      const { data, error } = await supabase
        .from('studio_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        userTemplates = data;
        localStorage.setItem('studio_custom_templates', JSON.stringify(data));
      } else {
        const local = localStorage.getItem('studio_custom_templates');
        if (local) {
          try {
            userTemplates = JSON.parse(local);
          } catch (e) {
            // safe
          }
        }
      }

      // Gabungkan user templates dan external starter templates
      const combined = [...userTemplates];
      for (const ext of externalTemplates) {
        if (!combined.some((t) => t.id === ext.id)) {
          combined.push(ext);
        }
      }

      set({ customTemplates: combined });
    } catch (err) {
      console.warn('Error fetching studio templates:', err);
    }
  },

  publishCustomTemplate: async (title: string) => {
    const { cardPreset, activeSide, frontHistory, backHistory, customTemplates } = get();
    const currentElements = activeSide === 'front' ? frontHistory.present : backHistory.present;

    const newTemplate: CustomTemplate = {
      id: `tmpl_${Date.now()}`,
      title: title.trim() || 'Template Desain Baru',
      preset: cardPreset,
      elements: currentElements,
      created_at: new Date().toISOString()
    };

    try {
      // 1. Save to Supabase table studio_templates
      const { error } = await supabase
        .from('studio_templates')
        .insert([
          {
            id: newTemplate.id,
            title: newTemplate.title,
            preset: newTemplate.preset,
            elements: newTemplate.elements,
            created_at: newTemplate.created_at
          }
        ]);

      if (error) {
        console.warn('Supabase studio_templates table error, saving to local state:', error);
      }

      // 2. Always update local state & localStorage for immediate availability
      const updatedList = [newTemplate, ...customTemplates];
      set({ customTemplates: updatedList });
      localStorage.setItem('studio_custom_templates', JSON.stringify(updatedList));

      toast.success(`Template "${newTemplate.title}" berhasil dipublikasikan ke katalog!`);
      return true;
    } catch (err: any) {
      const updatedList = [newTemplate, ...customTemplates];
      set({ customTemplates: updatedList });
      localStorage.setItem('studio_custom_templates', JSON.stringify(updatedList));
      toast.success(`Template "${newTemplate.title}" berhasil dipublikasikan!`);
      return true;
    }
  },

  applyCustomTemplate: (template: CustomTemplate, businessName?: string | null) => {
    const { setCardPreset, updateCurrentElements } = get();
    if (template.preset) {
      setCardPreset(template.preset);
    }

    // Injeksi nama bisnis jika ada elemen teks placeholder
    const hydratedElements = template.elements.map((el) => {
      if (el.type === 'text' && el.content && businessName) {
        return {
          ...el,
          content: el.content
            .replace(/\{\{business_name\}\}/gi, businessName)
            .replace(/YOUR BUSINESS LOGO/gi, businessName.toUpperCase())
        };
      }
      return el;
    });

    updateCurrentElements(hydratedElements);
    toast.success(`Template "${template.title}" diterapkan ke kanvas!`);
  },

  deleteCustomTemplate: async (templateId: string) => {
    const { customTemplates } = get();
    try {
      await supabase.from('studio_templates').delete().eq('id', templateId);
    } catch (e) {
      // safe
    }
    const updated = customTemplates.filter((t) => t.id !== templateId);
    set({ customTemplates: updated });
    localStorage.setItem('studio_custom_templates', JSON.stringify(updated));
    toast.success('Template kustom dihapus dari katalog!');
    return true;
  }
}));
