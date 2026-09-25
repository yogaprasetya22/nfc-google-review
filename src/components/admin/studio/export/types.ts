import type { CanvasElement, TemplateType } from '../types';

export interface RenderContext {
  ctx: CanvasRenderingContext2D;
  element: CanvasElement;
  left: number;
  top: number;
  W: number;
  H: number;
  imageMap: Record<string, HTMLImageElement>;
}

export type ElementRenderer = (rc: RenderContext) => void;

export type BackgroundRenderer = (
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  bgImg?: HTMLImageElement | null
) => void;
