import React, { useRef, useEffect, useCallback } from 'react';
import type { NfcTagEntity } from '@/types/nfc';
import QRCode from 'qrcode';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

// Modular Subcomponents & State
import { useCardStudioStore } from './studio/useCardStudioStore';
import { StudioHeader } from './studio/StudioHeader';
import { StudioSidebarLeft } from './studio/StudioSidebarLeft';
import { StudioArtboard } from './studio/StudioArtboard';
import { StudioSidebarRight } from './studio/StudioSidebarRight';
import { renderSideToCanvas } from './studio/exportCanvas';
import { ExportPreviewModal } from './studio/ExportPreviewModal';
import type { CanvasElement, CardSide } from './studio/types';
import { uploadToGoogleDrive } from '@/lib/gdrive';

interface TagDesignStudioProps {
  tag: NfcTagEntity;
  onClose: () => void;
  onTagUpdated?: (updatedTag: NfcTagEntity) => void;
}

export function TagDesignStudio({ tag, onClose, onTagUpdated }: TagDesignStudioProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tagLink = `${window.location.origin}/t/${tag.id}`;
  const [qrDataUrl, setQrDataUrl] = React.useState<string>('');

  // Zustand Store Slices
  const store = useCardStudioStore();

  // Inisialisasi data tag saat pertama kali mount
  useEffect(() => {
    store.initializeStudio(tag);
  }, [tag.id]);

  // Generate QR Code data URL
  useEffect(() => {
    QRCode.toDataURL(tagLink, {
      width: 400,
      margin: 1,
      color: { dark: '#000000', light: '#ffffff' }
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('QR code gen error:', err));
  }, [tagLink]);

  // Pointer drag info ref
  const dragInfoRef = useRef<{
    elemId: string;
    startX: number;
    startY: number;
    initialX: number;
    initialY: number;
  } | null>(null);

  // Corner & edge resize info ref (8-direction handles Canva-style)
  const resizeInfoRef = useRef<{
    elemId: string;
    handle: 'tl' | 'tr' | 'bl' | 'br' | 't' | 'b' | 'l' | 'r';
    startX: number;
    startY: number;
    initialWidth: number;
    initialHeight: number;
    initialX: number;
    initialY: number;
    aspectRatio: number;
  } | null>(null);

  // Rotation info ref
  const rotateInfoRef = useRef<{
    elemId: string;
    centerX: number;
    centerY: number;
    initialRotation: number;
    startAngle: number;
  } | null>(null);

  const [isDragging, setIsDragging] = React.useState(false);
  const [isResizing, setIsResizing] = React.useState(false);
  const [isRotating, setIsRotating] = React.useState(false);
  const rafRef = useRef<number>(0);

  // Helper konversi persentase margin dinding
  const calcLeftCenterPct = (elemWidth: number, marginPx: number, canvasWidth: number) => {
    return ((marginPx + elemWidth / 2) / canvasWidth) * 100;
  };

  const calcRightCenterPct = (elemWidth: number, marginPx: number, canvasWidth: number) => {
    return ((canvasWidth - marginPx - elemWidth / 2) / canvasWidth) * 100;
  };

  const getElementWallDistances = useCallback(
    (el: CanvasElement) => {
      const posX = (el.x / 100) * store.dimensions.width;
      const posY = (el.y / 100) * store.dimensions.height;
      const leftEdge = Math.round(posX - el.width / 2);
      const rightEdge = Math.round(store.dimensions.width - (posX + el.width / 2));
      const topEdge = Math.round(posY - el.height / 2);
      const bottomEdge = Math.round(store.dimensions.height - (posY + el.height / 2));
      return { leftEdge, rightEdge, topEdge, bottomEdge };
    },
    [store.dimensions]
  );

  // Kunci jarak presisi ke dinding
  const applyPreciseWallMargins = (marginPx: number) => {
    store.setWallMarginPx(marginPx);
    const current = store.getCurrentElements();
    const updated = current.map((el) => {
      const dist = getElementWallDistances(el);
      const isCloserToLeft = dist.leftEdge <= dist.rightEdge;
      const targetPct = isCloserToLeft
        ? calcLeftCenterPct(el.width, marginPx, store.dimensions.width)
        : calcRightCenterPct(el.width, marginPx, store.dimensions.width);

      return {
        ...el,
        x: Math.round(targetPct * 100) / 100
      };
    });
    store.updateCurrentElements(updated);
    toast.success(`Objek dikunci presisi ${marginPx}px dari dinding tepi!`);
  };

  // Keyboard Shortcuts: Ctrl+Z (Undo) & Ctrl+Y (Redo)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          if (store.canRedo()) {
            e.preventDefault();
            store.redo();
          }
        } else {
          if (store.canUndo()) {
            e.preventDefault();
            store.undo();
          }
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        if (store.canRedo()) {
          e.preventDefault();
          store.redo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
        // Ctrl + D: Duplicate selected element
        if (store.selectedElementId) {
          e.preventDefault();
          store.duplicateSelectedElement();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'l') {
        // Ctrl + L: Toggle Lock / Unlock
        if (store.selectedElementId) {
          e.preventDefault();
          const target = store.getCurrentElements().find((el) => el.id === store.selectedElementId);
          if (target) {
            const nextLocked = !target.locked;
            store.updateSelectedElement({ locked: nextLocked });
            toast.success(nextLocked ? 'Objek dikunci!' : 'Kunci objek dibuka!');
          }
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === ']') {
        // Ctrl + ]: Bring forward (naikkan layer)
        if (store.selectedElementId) {
          e.preventDefault();
          store.moveLayer(store.selectedElementId, 'up');
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === '[') {
        // Ctrl + [: Send backward (turunkan layer)
        if (store.selectedElementId) {
          e.preventDefault();
          store.moveLayer(store.selectedElementId, 'down');
        }
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        // Delete / Backspace: Hapus objek terpilih
        if (store.selectedElementId) {
          e.preventDefault();
          store.deleteSelectedElement();
        }
      } else if (e.key === 'Escape') {
        // Escape: Deselect objek aktif
        if (store.selectedElementId) {
          e.preventDefault();
          store.setSelectedElementId(null);
        }
      } else if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        // Arrow Keys: Nudge posisi objek (1px default, 10px jika tahan Shift)
        if (store.selectedElementId) {
          const target = store.getCurrentElements().find((el) => el.id === store.selectedElementId);
          if (target && !target.locked) {
            e.preventDefault();
            const stepPx = e.shiftKey ? 10 : 1;
            const deltaPctX = (stepPx / store.dimensions.width) * 100;
            const deltaPctY = (stepPx / store.dimensions.height) * 100;

            let newX = target.x;
            let newY = target.y;

            if (e.key === 'ArrowUp') newY = Math.max(5, target.y - deltaPctY);
            if (e.key === 'ArrowDown') newY = Math.min(95, target.y + deltaPctY);
            if (e.key === 'ArrowLeft') newX = Math.max(5, target.x - deltaPctX);
            if (e.key === 'ArrowRight') newX = Math.min(95, target.x + deltaPctX);

            store.updateCurrentElements(
              store.getCurrentElements().map((el) =>
                el.id === store.selectedElementId
                  ? { ...el, x: Math.round(newX * 100) / 100, y: Math.round(newY * 100) / 100 }
                  : el
              )
            );
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [store]);

  // Pointer Handlers untuk Drag Artboard
  const handlePointerDown = (e: React.PointerEvent, elemId: string) => {
    e.stopPropagation();
    store.setSelectedElementId(elemId);

    const targetEl = store.getCurrentElements().find((item) => item.id === elemId);
    if (!targetEl) return;

    // Jika objek dalam kondisi terkunci (locked), hanya select dan jangan izinkan drag
    if (targetEl.locked) return;

    setIsDragging(true);
    dragInfoRef.current = {
      elemId,
      startX: e.clientX,
      startY: e.clientY,
      initialX: targetEl.x,
      initialY: targetEl.y
    };

    try {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } catch (err) {
      // safe
    }
  };

  // Handle Resize Corner & Edge Start (8 directions Canva-style)
  const handleResizeStart = (
    e: React.PointerEvent,
    elemId: string,
    handle: 'tl' | 'tr' | 'bl' | 'br' | 't' | 'b' | 'l' | 'r'
  ) => {
    e.stopPropagation();
    store.setSelectedElementId(elemId);
    const targetEl = store.getCurrentElements().find((item) => item.id === elemId);
    if (!targetEl) return;

    setIsResizing(true);
    resizeInfoRef.current = {
      elemId,
      handle,
      startX: e.clientX,
      startY: e.clientY,
      initialWidth: targetEl.width,
      initialHeight: targetEl.height,
      initialX: targetEl.x,
      initialY: targetEl.y,
      aspectRatio: targetEl.width / Math.max(1, targetEl.height)
    };

    try {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } catch (err) {
      // safe
    }
  };

  // Handle Rotate Start
  const handleRotateStart = (e: React.PointerEvent, elemId: string) => {
    e.stopPropagation();
    store.setSelectedElementId(elemId);
    const targetEl = store.getCurrentElements().find((item) => item.id === elemId);
    if (!targetEl || !containerRef.current) return;

    setIsRotating(true);
    const rect = containerRef.current.getBoundingClientRect();
    const elemCenterX = rect.left + ((targetEl.x / 100) * store.dimensions.width) * store.zoomScale;
    const elemCenterY = rect.top + ((targetEl.y / 100) * store.dimensions.height) * store.zoomScale;

    const rad = Math.atan2(e.clientY - elemCenterY, e.clientX - elemCenterX);
    const startAngle = (rad * 180) / Math.PI;

    rotateInfoRef.current = {
      elemId,
      centerX: elemCenterX,
      centerY: elemCenterY,
      initialRotation: targetEl.rotation || 0,
      startAngle
    };

    try {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } catch (err) {
      // safe
    }
  };

  const pendingMoveRef = useRef<{ clientX: number; clientY: number; shiftKey: boolean } | null>(null);

  const handlePointerMove = (e: React.PointerEvent) => {
    // True RAF Throttle: simpan koordinat pointer terbaru, jadwalkan 1 update per frame layar (60-120 FPS konstan)
    pendingMoveRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      shiftKey: e.shiftKey
    };

    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0;
        if (pendingMoveRef.current) {
          handlePointerMoveInner(
            pendingMoveRef.current.clientX,
            pendingMoveRef.current.clientY,
            pendingMoveRef.current.shiftKey
          );
        }
      });
    }
  };

  const handlePointerMoveInner = (clientX: number, clientY: number, shiftKey: boolean) => {
    // 1. Resizing Corner & Edges (8 Directions) — opposite side stays fixed
    if (isResizing && resizeInfoRef.current) {
      const { elemId, handle, startX, startY, initialWidth, initialHeight, initialX, initialY, aspectRatio } = resizeInfoRef.current;
      const curElem = store.getCurrentElements().find((item) => item.id === elemId);
      if (!curElem) return;

      const deltaX = (clientX - startX) / store.zoomScale;
      const deltaY = (clientY - startY) / store.zoomScale;

      let newWidth = initialWidth;
      let newHeight = initialHeight;

      // Edge handles: grow from one side, shift center so opposite edge stays fixed
      const affectsRight = handle === 'r' || handle === 'tr' || handle === 'br';
      const affectsLeft = handle === 'l' || handle === 'tl' || handle === 'bl';
      const affectsBottom = handle === 'b' || handle === 'br' || handle === 'bl';
      const affectsTop = handle === 't' || handle === 'tl' || handle === 'tr';

      if (affectsRight) {
        newWidth = initialWidth + deltaX;
      } else if (affectsLeft) {
        newWidth = initialWidth - deltaX;
      }

      if (affectsBottom) {
        newHeight = initialHeight + deltaY;
      } else if (affectsTop) {
        newHeight = initialHeight - deltaY;
      }

      const isSquareObject =
        curElem.type === 'qrcode' ||
        (curElem.type === 'shape' &&
          (curElem.shapeType === 'circle' || curElem.shapeType === 'google_ring'));

      const isCorner = ['tl', 'tr', 'bl', 'br'].includes(handle);

      if (isSquareObject) {
        const side = Math.max(10, Math.round(Math.max(newWidth, newHeight)));
        newWidth = side;
        newHeight = side;
      } else if (isCorner && (shiftKey || curElem.type === 'stars_5')) {
        const scaleChange = Math.max(newWidth / initialWidth, newHeight / initialHeight);
        newWidth = Math.max(10, Math.round(initialWidth * scaleChange));
        newHeight = Math.max(10, Math.round(newWidth / (aspectRatio || 1)));
      } else {
        newWidth = Math.max(10, Math.round(newWidth));
        newHeight = Math.max(10, Math.round(newHeight));
      }

      // Hitung pergeseran posisi pusat langsung dari delta ukuran aktual agar sisi berlawanan 100% diam
      const deltaW = newWidth - initialWidth;
      const deltaH = newHeight - initialHeight;

      let dxPct = 0;
      let dyPct = 0;

      if (affectsRight) {
        dxPct = (deltaW / 2 / store.dimensions.width) * 100;
      } else if (affectsLeft) {
        dxPct = -(deltaW / 2 / store.dimensions.width) * 100;
      }

      if (affectsBottom) {
        dyPct = (deltaH / 2 / store.dimensions.height) * 100;
      } else if (affectsTop) {
        dyPct = -(deltaH / 2 / store.dimensions.height) * 100;
      }

      const finalX = Math.round((initialX + dxPct) * 100) / 100;
      const finalY = Math.round((initialY + dyPct) * 100) / 100;

      store.updateLiveElementsOnly((prev) =>
        prev.map((item) =>
          item.id === elemId ? { ...item, width: newWidth, height: newHeight, x: finalX, y: finalY } : item
        )
      );
      return;
    }

    // 2. Rotating Handle
    if (isRotating && rotateInfoRef.current) {
      const { elemId, centerX, centerY, initialRotation, startAngle } = rotateInfoRef.current;
      const currentRad = Math.atan2(clientY - centerY, clientX - centerX);
      const currentAngle = (currentRad * 180) / Math.PI;
      const angleDiff = currentAngle - startAngle;

      let newRotation = Math.round(initialRotation + angleDiff);
      newRotation = ((newRotation % 360) + 360) % 360;

      const snapAngles = [0, 45, 90, 135, 180, 225, 270, 315, 360];
      for (const snap of snapAngles) {
        if (Math.abs(newRotation - snap) <= 3) {
          newRotation = snap === 360 ? 0 : snap;
          break;
        }
      }

      store.updateLiveElementsOnly((prev) =>
        prev.map((item) =>
          item.id === elemId ? { ...item, rotation: newRotation } : item
        )
      );
      return;
    }

    // 3. Dragging Element Position
    if (!isDragging || !dragInfoRef.current) return;
    const { elemId, startX, startY, initialX, initialY } = dragInfoRef.current;

    const deltaX = (clientX - startX) / store.zoomScale;
    const deltaY = (clientY - startY) / store.zoomScale;

    const deltaPctX = (deltaX / store.dimensions.width) * 100;
    const deltaPctY = (deltaY / store.dimensions.height) * 100;

    let targetX = Math.max(5, Math.min(95, initialX + deltaPctX));
    let targetY = Math.max(5, Math.min(95, initialY + deltaPctY));

    const curElem = store.getCurrentElements().find((el) => el.id === elemId);
    const guides: any = {};

    if (store.snapEnabled && curElem) {
      // ponytail: threshold 3% agar snap center terasa (was 1.6% — terlalu kecil)
      const snapThresholdPct = 3;
      if (Math.abs(targetX - 50) < snapThresholdPct) {
        targetX = 50;
        guides.vCenter = true;
      }
      if (Math.abs(targetY - 50) < snapThresholdPct) {
        targetY = 50;
        guides.hCenter = true;
      }

      const curLeftEdge = Math.round((targetX / 100) * store.dimensions.width - curElem.width / 2);
      const curRightEdge = Math.round(store.dimensions.width - ((targetX / 100) * store.dimensions.width + curElem.width / 2));
      const snapThresholdPx = 8;

      if (Math.abs(curLeftEdge - curRightEdge) <= snapThresholdPx) {
        targetX = 50;
        guides.symmetricSnapPx = Math.round((store.dimensions.width - curElem.width) / 2);
      }
    }

    store.setActiveGuides(guides);
    store.updateLiveElementsOnly((prev) =>
      prev.map((item) =>
        item.id === elemId
          ? {
              ...item,
              x: Math.round(targetX * 100) / 100,
              y: Math.round(targetY * 100) / 100
            }
          : item
      )
    );
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
    if (pendingMoveRef.current) {
      handlePointerMoveInner(
        pendingMoveRef.current.clientX,
        pendingMoveRef.current.clientY,
        pendingMoveRef.current.shiftKey
      );
      pendingMoveRef.current = null;
    }
    if (isResizing) {
      setIsResizing(false);
      resizeInfoRef.current = null;
      store.updateCurrentElements(store.getCurrentElements());
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch (err) {
        // safe
      }
    }

    if (isRotating) {
      setIsRotating(false);
      rotateInfoRef.current = null;
      store.updateCurrentElements(store.getCurrentElements());
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch (err) {
        // safe
      }
    }

    if (isDragging) {
      setIsDragging(false);
      dragInfoRef.current = null;
      store.setActiveGuides({});
      store.updateCurrentElements(store.getCurrentElements());
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch (err) {
        // safe
      }
    }
  };

  // Helper: Unggah file gambar ke Supabase Storage bucket 'nfc' & dapatkan publicUrl + dimensi asli proporsional
  const processAndUploadImage = async (
    file: File,
    onSuccess: (publicUrl: string, width: number, height: number) => void
  ) => {
    if (!file.type.startsWith('image/')) {
      toast.error('File harus berupa format gambar (PNG, JPG, SVG, WebP).');
      return;
    }

    const toastId = toast.loading('Mengunggah gambar ke storage...');

    // 1. Baca dataURL & dimensi natural gambar
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const img = new Image();
      img.onload = async () => {
        const natW = img.naturalWidth || 200;
        const natH = img.naturalHeight || 200;

        // Skala proporsional agar pas di canvas (maksimal 240px lebar/tinggi awal)
        const maxInitial = 240;
        let w = natW;
        let h = natH;
        if (w > maxInitial || h > maxInitial) {
          if (w >= h) {
            h = Math.round((h / w) * maxInitial);
            w = maxInitial;
          } else {
            w = Math.round((w / h) * maxInitial);
            h = maxInitial;
          }
        }

        // 2. Upload 100% ke Google Drive
        let finalUrl = dataUrl;
        try {
          const gdriveRes = await uploadToGoogleDrive(file);
          if (gdriveRes.directUrl) {
            finalUrl = gdriveRes.directUrl;
          }
        } catch (err: any) {
          console.warn('Google Drive upload error, fallback to data URL:', err?.message || err);
        }

        toast.success(`Gambar "${file.name}" berhasil diunggah ke Google Drive!`, { id: toastId });
        onSuccess(finalUrl, w, h);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  // Upload Logo / Gambar Baru ke Kanvas
  const handleUploadImageElement = (file: File) => {
    processAndUploadImage(file, (url, w, h) => {
      store.addNewElement('image', file.name.replace(/\.[^/.]+$/, '') || 'Gambar', undefined, {
        imageUrl: url,
        width: w,
        height: h,
        x: 50,
        y: 50
      });
    });
  };

  // Upload Background as Canvas Object (Mendukung Event input file maupun direct File dari drag & drop)
  const handleUploadBackground = (input: React.ChangeEvent<HTMLInputElement> | File) => {
    const file = input instanceof File ? input : input.target.files?.[0];
    if (!file) return;
    processAndUploadImage(file, (url) => {
      const newId = `image_bg_${Date.now()}`;
      const bgElement: CanvasElement = {
        id: newId,
        type: 'image',
        label: `Background (${file.name.replace(/\.[^/.]+$/, '') || 'Gambar'})`,
        x: 50,
        y: 50,
        width: store.dimensions.width,
        height: store.dimensions.height,
        visible: true,
        locked: false,
        imageUrl: url
      };

      const current = store.getCurrentElements();
      // Taruh di lapisan paling dasar (bottom of layers) & bersihkan bg lama jika ada
      const updated = [bgElement, ...current.filter((el) => el.id !== 'bg' && el.type !== 'template_bg')];
      store.updateCurrentElements(updated);
      store.setSelectedElementId(newId);
      store.setBgImage(store.activeSide, null);
      toast.success('Background berhasil dipasang sebagai objek kanvas!');
    });
  };

  // Direct Drag & Drop image files onto canvas artboard
  const handleDropImageOnCanvas = (file: File, isBgMode: boolean, clientX: number, clientY: number) => {
    processAndUploadImage(file, (url, w, h) => {
      if (isBgMode) {
        const newId = `image_bg_${Date.now()}`;
        const bgElement: CanvasElement = {
          id: newId,
          type: 'image',
          label: `Background (${file.name.replace(/\.[^/.]+$/, '') || 'Gambar'})`,
          x: 50,
          y: 50,
          width: store.dimensions.width,
          height: store.dimensions.height,
          visible: true,
          locked: false,
          imageUrl: url
        };
        const current = store.getCurrentElements();
        const updated = [bgElement, ...current.filter((el) => el.id !== 'bg' && el.type !== 'template_bg')];
        store.updateCurrentElements(updated);
        store.setSelectedElementId(newId);
        store.setBgImage(store.activeSide, null);
        toast.success('Background berhasil dipasang sebagai objek kanvas!');
      } else {
        let xPct = 50;
        let yPct = 50;
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          const localX = (clientX - rect.left) / store.zoomScale;
          const localY = (clientY - rect.top) / store.zoomScale;
          xPct = Math.max(10, Math.min(90, Math.round((localX / store.dimensions.width) * 100)));
          yPct = Math.max(10, Math.min(90, Math.round((localY / store.dimensions.height) * 100)));
        }

        store.addNewElement('image', file.name.replace(/\.[^/.]+$/, '') || 'Gambar Drop', undefined, {
          imageUrl: url,
          width: w,
          height: h,
          x: xPct,
          y: yPct
        });
      }
    });
  };

  // Export PNG Actions
  const handleExportPNG = async (sideToExport: CardSide = store.activeSide) => {
    const isFront = sideToExport === 'front';
    const targetElems = isFront ? store.frontHistory.present : store.backHistory.present;
    const targetTmpl = isFront ? store.activeTemplateFront : store.activeTemplateBack;
    const targetBg = isFront ? store.bgImageFront : store.bgImageBack;

    const pngData = await renderSideToCanvas(
      store.dimensions,
      targetElems,
      targetTmpl,
      targetBg,
      qrDataUrl
    );
    if (!pngData) return;

    const link = document.createElement('a');
    link.download = `NFC-Card-${tag.id}-${sideToExport}-${store.cardPreset}.png`;
    link.href = pngData;
    link.click();
    toast.success(`Desain Sisi ${isFront ? 'Depan' : 'Belakang'} Ultra HD 4K siap cetak berhasil didownload!`);
  };

  const handleExportBothSides = async () => {
    const frontPng = await renderSideToCanvas(
      store.dimensions,
      store.frontHistory.present,
      store.activeTemplateFront,
      store.bgImageFront,
      qrDataUrl
    );
    const backPng = await renderSideToCanvas(
      store.dimensions,
      store.backHistory.present,
      store.activeTemplateBack,
      store.bgImageBack,
      qrDataUrl
    );

    if (frontPng) {
      const linkFront = document.createElement('a');
      linkFront.download = `NFC-Card-${tag.id}-front-${store.cardPreset}.png`;
      linkFront.href = frontPng;
      linkFront.click();
    }

    setTimeout(() => {
      if (backPng) {
        const linkBack = document.createElement('a');
        linkBack.download = `NFC-Card-${tag.id}-back-${store.cardPreset}.png`;
        linkBack.href = backPng;
        linkBack.click();
      }
      toast.success('Kedua sisi kartu (Depan & Belakang) Ultra HD 4K berhasil didownload!');
    }, 400);
  };

  // State Modal Preview Cetak Gambar
  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);
  const [previewFrontImg, setPreviewFrontImg] = React.useState<string>('');
  const [previewBackImg, setPreviewBackImg] = React.useState<string>('');

  const handleOpenExportPreview = async () => {
    const toastId = toast.loading('Merender pratinjau gambar 4K...');
    try {
      const frontPng = await renderSideToCanvas(
        store.dimensions,
        store.frontHistory.present,
        store.activeTemplateFront,
        store.bgImageFront,
        qrDataUrl
      );
      const backPng = await renderSideToCanvas(
        store.dimensions,
        store.backHistory.present,
        store.activeTemplateBack,
        store.bgImageBack,
        qrDataUrl
      );
      setPreviewFrontImg(frontPng || '');
      setPreviewBackImg(backPng || '');
      setIsPreviewOpen(true);
      toast.dismiss(toastId);
    } catch (err: any) {
      toast.error('Gagal membuat pratinjau cetak: ' + (err?.message || err), { id: toastId });
    }
  };

  const currentElements = store.getCurrentElements();
  const selectedElement = currentElements.find((el) => el.id === store.selectedElementId);
  const selectedDistances = selectedElement ? getElementWallDistances(selectedElement) : null;
  const currentBgImage = store.activeSide === 'front' ? store.bgImageFront : store.bgImageBack;
  const currentTemplate = store.activeSide === 'front' ? store.activeTemplateFront : store.activeTemplateBack;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex flex-col font-sans select-none animate-in fade-in duration-200">
      {/* 1. Header Toolbar */}
      <StudioHeader
        tag={tag}
        cardPreset={store.cardPreset}
        setCardPreset={store.setCardPreset}
        wallMarginPx={store.wallMarginPx}
        onApplyPreciseWallMargins={applyPreciseWallMargins}
        onResetLayout={() => store.resetCurrentLayout(tag.business_name)}
        onExportPNG={handleExportPNG}
        onExportBothSides={handleExportBothSides}
        onOpenExportPreview={handleOpenExportPreview}
        onClose={onClose}
        canUndo={store.canUndo()}
        canRedo={store.canRedo()}
        onUndo={store.undo}
        onRedo={store.redo}
        activeSide={store.activeSide}
        setActiveSide={store.setActiveSide}
        onSaveToDatabase={() => store.saveToDatabase(tag, onTagUpdated)}
        isSaving={store.isSaving}
        onPublishAsTemplate={store.publishCustomTemplate}
      />

      {/* 2. Workspace Body: 2-Tier Canva Dock + Artboard + Right Inspector */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Canva 2-Tier Dock Navigation */}
        <StudioSidebarLeft
          activeTab={store.activeDockTab}
          onSelectTab={store.setActiveDockTab}
          isOpen={store.isDockOpen}
          onToggleOpen={() => store.setIsDockOpen(!store.isDockOpen)}
          activeTemplate={currentTemplate}
          onApplyTemplate={(tmpl) => store.applyTemplate(tmpl, tag.business_name)}
          customTemplates={store.customTemplates}
          onApplyCustomTemplate={(tmpl) => store.applyCustomTemplate(tmpl, tag.business_name)}
          onDeleteCustomTemplate={store.deleteCustomTemplate}
          elements={currentElements}
          selectedElementId={store.selectedElementId}
          onSelectElement={store.setSelectedElementId}
          onToggleElementVisible={(id) => {
            const updated = currentElements.map((el) =>
              el.id === id ? { ...el, visible: !el.visible } : el
            );
            store.updateCurrentElements(updated);
          }}
          onToggleElementLock={(id) => {
            const current = currentElements.find((el) => el.id === id);
            if (current) {
              const nextLocked = !current.locked;
              store.updateLiveElementsOnly((prev) =>
                prev.map((item) => (item.id === id ? { ...item, locked: nextLocked } : item))
              );
              store.updateCurrentElements(store.getCurrentElements());
              toast.success(nextLocked ? 'Lapisan dikunci!' : 'Kunci lapisan dibuka!');
            }
          }}
          onMoveLayer={store.moveLayer}
          onAddNewElement={store.addNewElement}
          bgImage={currentBgImage}
          onUploadBackground={handleUploadBackground}
          onUploadImageFile={handleUploadImageElement}
          onRemoveBackground={() => store.setBgImage(store.activeSide, null)}
          getElementWallDistances={getElementWallDistances}
          tag={tag}
          activeSide={store.activeSide}
        />

        {/* Center: Canva-like Artboard with Dynamic Guides */}
        <StudioArtboard
          containerRef={containerRef}
          currentDimensions={store.dimensions}
          zoomScale={store.zoomScale}
          setZoomScale={store.setZoomScale}
          snapEnabled={store.snapEnabled}
          setSnapEnabled={store.setSnapEnabled}
          showGuides={store.showGuides}
          setShowGuides={store.setShowGuides}
          canvasBgColor={store.canvasBgColor}
          activeTemplate={currentTemplate}
          bgImage={currentBgImage}
          bgScaleMode={store.bgScaleMode}
          activeGuides={store.activeGuides}
          selectedElement={selectedElement}
          selectedDistances={selectedDistances}
          elements={currentElements}
          selectedElementId={store.selectedElementId}
          qrDataUrl={qrDataUrl}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onResizeStart={handleResizeStart}
          onRotateStart={handleRotateStart}
          onToggleLock={(id) => {
            const current = store.getCurrentElements().find((el) => el.id === id);
            if (current) {
              const nextLocked = !current.locked;
              store.updateSelectedElement({ locked: nextLocked });
              toast.success(nextLocked ? 'Objek dikunci di canvas!' : 'Kunci objek dibuka!');
            }
          }}
          onDeleteElement={(id) => {
            store.setSelectedElementId(id);
            store.deleteSelectedElement();
          }}
          onDuplicateElement={(id) => {
            store.setSelectedElementId(id);
            store.duplicateSelectedElement();
          }}
          onUpdateElementContent={(id, content) => {
            store.updateLiveElementsOnly((prev) =>
              prev.map((item) => (item.id === id ? { ...item, content } : item))
            );
          }}
          getElementWallDistances={getElementWallDistances}
          onDeselect={() => store.setSelectedElementId(null)}
          activeSide={store.activeSide}
          onDropImageOnCanvas={handleDropImageOnCanvas}
        />

        {/* Right Sidebar: Object Properties Inspector */}
        <StudioSidebarRight
          selectedElement={selectedElement}
          selectedDistances={selectedDistances}
          currentDimensions={store.dimensions}
          onUpdateSelectedElement={store.updateSelectedElement}
          onDeleteSelectedElement={store.deleteSelectedElement}
          onMoveLayer={store.moveLayer}
          calcLeftCenterPct={calcLeftCenterPct}
          calcRightCenterPct={calcRightCenterPct}
          isInteracting={isDragging || isResizing || isRotating}
        />
      </div>

      {/* Modal Pratinjau Gambar Hasil Cetak Sebelum Download */}
      <ExportPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        tagId={tag.id}
        cardPreset={store.cardPreset}
        frontImgUrl={previewFrontImg}
        backImgUrl={previewBackImg}
        activeSide={store.activeSide}
        dimensions={store.dimensions}
        onConfirmDownload={(side) => {
          if (side === 'both') {
            handleExportBothSides();
          } else {
            handleExportPNG(side || store.activeSide);
          }
        }}
      />
    </div>
  );
}
