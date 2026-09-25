import type { ElementRenderer } from './types';
import { renderShape } from './renderers/shapeRenderer';
import { renderTemplateBackground } from './renderers/templateBgRenderer';
import {
  renderText,
  renderQrCode,
  renderNfcTarget,
  renderLogoGoogle,
  renderStars5,
  renderGoogleBadgePill,
  renderImage,
  renderIconBadge
} from './renderers/itemRenderers';

export const elementRendererRegistry: Record<string, ElementRenderer> = {
  template_bg: renderTemplateBackground,
  shape: renderShape,
  text: renderText,
  qrcode: renderQrCode,
  nfc_target: renderNfcTarget,
  logo_google: renderLogoGoogle,
  stars_5: renderStars5,
  google_badge_pill: renderGoogleBadgePill,
  image: renderImage,
  icon_badge: renderIconBadge
};
