export interface ShapePathDefinition {
  type: 'path' | 'polygon' | 'circle' | 'rect';
  viewBox: string;
  points?: string;
  d?: string;
  extraSvg?: string;
}

export const SHAPE_DEFINITIONS: Record<string, ShapePathDefinition> = {
  // ----------------------------------------------------
  // BENTUK DASAR (Basic Shapes)
  // ----------------------------------------------------
  triangle: {
    type: 'polygon',
    viewBox: '0 0 100 100',
    points: '50,5 95,95 5,95'
  },
  diamond: {
    type: 'polygon',
    viewBox: '0 0 100 100',
    points: '50,5 95,50 50,95 5,50'
  },
  trapezoid: {
    type: 'polygon',
    viewBox: '0 0 100 100',
    points: '20,10 80,10 95,90 5,90'
  },
  parallelogram: {
    type: 'polygon',
    viewBox: '0 0 100 100',
    points: '25,10 95,10 75,90 5,90'
  },
  shield: {
    type: 'path',
    viewBox: '0 0 100 100',
    d: 'M50,5 L90,20 C90,65 50,95 50,95 C50,95 10,65 10,20 Z'
  },
  heart: {
    type: 'path',
    viewBox: '0 0 100 100',
    d: 'M50,88 C50,88 10,60 10,32 C10,18 22,8 35,8 C43,8 47,13 50,18 C53,13 57,8 65,8 C78,8 90,18 90,32 C90,60 50,88 50,88 Z'
  },

  // ----------------------------------------------------
  // POLIGON (Polygons)
  // ----------------------------------------------------
  pentagon: {
    type: 'polygon',
    viewBox: '0 0 100 100',
    points: '50,5 97,39 79,95 21,95 3,39'
  },
  hexagon: {
    type: 'polygon',
    viewBox: '0 0 100 100',
    points: '50,3 95,25 95,75 50,97 5,75 5,25'
  },
  heptagon: {
    type: 'polygon',
    viewBox: '0 0 100 100',
    points: '50,4 89,23 99,66 72,97 28,97 1,66 11,23'
  },
  octagon: {
    type: 'polygon',
    viewBox: '0 0 100 100',
    points: '30,5 70,5 95,30 95,70 70,95 30,95 5,70 5,30'
  },

  // ----------------------------------------------------
  // BINTANG & BURST (Stars & Bursts)
  // ----------------------------------------------------
  star: {
    type: 'polygon',
    viewBox: '0 0 100 100',
    points: '50,5 64,36 98,36 70,57 81,91 50,70 19,91 30,57 2,36 36,36'
  },
  star_4: {
    type: 'polygon',
    viewBox: '0 0 100 100',
    points: '50,5 62,38 95,50 62,62 50,95 38,62 5,50 38,38'
  },
  star_6: {
    type: 'polygon',
    viewBox: '0 0 100 100',
    points: '50,5 62,28 88,20 75,45 95,65 68,68 50,95 32,68 5,65 25,45 12,20 38,28'
  },
  star_8: {
    type: 'polygon',
    viewBox: '0 0 100 100',
    points: '50,5 60,30 85,15 70,40 95,50 70,60 85,85 60,70 50,95 40,70 15,85 30,60 5,50 30,40 15,15 40,30'
  },
  star_burst: {
    type: 'polygon',
    viewBox: '0 0 100 100',
    points: '50,2 57,20 72,9 73,28 90,23 83,40 99,44 87,57 99,69 83,72 89,90 71,83 69,99 54,87 46,99 41,83 23,90 29,72 13,69 25,57 13,44 29,40 22,23 39,28 40,9 55,20'
  },

  // ----------------------------------------------------
  // PANAH (Arrows)
  // ----------------------------------------------------
  arrow: {
    type: 'path',
    viewBox: '0 0 100 60',
    d: 'M0,20 L60,20 L60,0 L100,30 L60,60 L60,40 L0,40 Z'
  },
  arrow_left: {
    type: 'path',
    viewBox: '0 0 100 60',
    d: 'M100,20 L40,20 L40,0 L0,30 L40,60 L40,40 L100,40 Z'
  },
  arrow_up: {
    type: 'path',
    viewBox: '0 0 60 100',
    d: 'M20,100 L20,40 L0,40 L30,0 L60,40 L40,40 L40,100 Z'
  },
  arrow_down: {
    type: 'path',
    viewBox: '0 0 60 100',
    d: 'M20,0 L20,60 L0,60 L30,100 L60,60 L40,60 L40,0 Z'
  },
  arrow_double_horizontal: {
    type: 'path',
    viewBox: '0 0 100 60',
    d: 'M30,0 L0,30 L30,60 L30,40 L70,40 L70,60 L100,30 L70,0 L70,20 L30,20 Z'
  },

  // ----------------------------------------------------
  // DIAGRAM ALIR / FLOWCHART (Flowchart Shapes)
  // ----------------------------------------------------
  flow_cylinder: {
    type: 'path',
    viewBox: '0 0 100 100',
    d: 'M10,25 C10,12 30,5 50,5 C70,5 90,12 90,25 L90,75 C90,88 70,95 50,95 C30,95 10,88 10,75 Z'
  },
  flow_document: {
    type: 'path',
    viewBox: '0 0 100 100',
    d: 'M10,10 L90,10 L90,75 C70,65 50,95 10,80 Z'
  },
  flow_data: {
    type: 'polygon',
    viewBox: '0 0 100 100',
    points: '20,15 95,15 80,85 5,85'
  },
  flow_decision: {
    type: 'polygon',
    viewBox: '0 0 100 100',
    points: '50,5 95,50 50,95 5,50'
  },
  bookmark_banner: {
    type: 'polygon',
    viewBox: '0 0 100 100',
    points: '0,0 100,0 100,100 50,80 0,100'
  },
  flow_display: {
    type: 'path',
    viewBox: '0 0 100 100',
    d: 'M25,5 L80,5 C95,5 100,25 100,50 C100,75 95,95 80,95 L25,95 L0,50 Z'
  },

  // ----------------------------------------------------
  // BALON PERCAKAPAN & AWAN (Callouts & Clouds)
  // ----------------------------------------------------
  chat_bubble: {
    type: 'path',
    viewBox: '0 0 100 80',
    d: 'M10,10 Q10,0 20,0 L80,0 Q90,0 90,10 L90,50 Q90,60 80,60 L35,60 L15,78 L18,60 L10,60 Q0,60 0,50 L0,10 Q0,0 10,0 Z'
  },
  chat_square: {
    type: 'path',
    viewBox: '0 0 100 80',
    d: 'M5,5 L95,5 L95,55 L40,55 L20,75 L22,55 L5,55 Z'
  },
  cloud: {
    type: 'path',
    viewBox: '0 0 100 70',
    d: 'M25,60 L78,60 C88,60 95,52 95,43 C95,34 89,28 80,27 C78,16 68,8 55,8 C44,8 35,14 31,23 C28,21 24,20 20,20 C10,20 2,28 2,38 C2,49 11,58 23,60 Z'
  },

  // ----------------------------------------------------
  // DESAIN GEOMETRIS KREATIF (Layouting, Backgrounds & Ribbons)
  // ----------------------------------------------------
  corner_arc: {
    type: 'path',
    viewBox: '0 0 100 100',
    d: 'M0,0 L100,0 C100,55.23 55.23,100 0,100 Z'
  },
  blob_organic: {
    type: 'path',
    viewBox: '0 0 100 100',
    d: 'M78,22 C92,36 94,62 82,78 C70,94 44,98 26,88 C8,78 -2,54 6,34 C14,14 42,-2 62,6 C70,10 74,16 78,22 Z'
  },
  wave_ribbon: {
    type: 'path',
    viewBox: '0 0 100 50',
    d: 'M0,15 C25,35 75,-5 100,15 L100,50 L0,50 Z'
  },
  badge_ribbon: {
    type: 'path',
    viewBox: '0 0 100 100',
    d: 'M15,10 L85,10 L85,85 L50,65 L15,85 Z'
  }
};
