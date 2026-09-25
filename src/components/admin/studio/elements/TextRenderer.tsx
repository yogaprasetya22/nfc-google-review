import React, { useEffect, useRef } from 'react';
import type { CanvasElement } from '../types';

interface TextRendererProps {
  element: CanvasElement;
  isEditing?: boolean;
  onUpdateContent?: (content: string) => void;
  onFinishEditing?: () => void;
}

export function TextRenderer({
  element: el,
  isEditing = false,
  onUpdateContent,
  onFinishEditing
}: TextRendererProps) {
  const weight =
    el.fontWeight === 'black' ? 900 : el.fontWeight === 'normal' ? 400 : 700;
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  if (isEditing) {
    return (
      <textarea
        ref={inputRef}
        value={el.content || ''}
        onChange={(e) => onUpdateContent?.(e.target.value)}
        onBlur={onFinishEditing}
        onKeyDown={(e) => {
          e.stopPropagation();
          if (e.key === 'Escape') {
            e.preventDefault();
            onFinishEditing?.();
          }
        }}
        style={{
          fontFamily: el.fontFamily ? `"${el.fontFamily}", sans-serif` : undefined,
          fontSize: `${el.fontSize || 14}px`,
          color: el.textColor || '#0f172a',
          fontWeight: weight,
          fontStyle: el.fontStyle || 'normal',
          textAlign: el.textAlign || 'center',
          textDecoration: el.textDecoration || 'none'
        }}
        className="tracking-tight px-1 py-0.5 leading-tight w-full h-full bg-transparent border border-blue-500 rounded outline-none resize-none shadow-sm z-50 cursor-text overflow-hidden"
        rows={1}
      />
    );
  }

  return (
    <div
      style={{
        fontFamily: el.fontFamily ? `"${el.fontFamily}", sans-serif` : undefined,
        fontSize: `${el.fontSize || 14}px`,
        color: el.textColor || '#0f172a',
        fontWeight: weight,
        fontStyle: el.fontStyle || 'normal',
        textAlign: el.textAlign || 'center',
        textDecoration: el.textDecoration || 'none'
      }}
      className="tracking-tight px-1 py-0.5 leading-tight select-none pointer-events-none break-words w-full"
    >
      {el.content}
    </div>
  );
}
