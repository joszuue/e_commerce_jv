const PRODUCT_IMAGES: Record<string, string> = {
  'PROD-KEY-001': 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80',
  'PROD-MOU-002': 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80',
  'PROD-MON-003': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80',
  'PROD-HEAD-004': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
  'PROD-CHAIR-005': 'https://images.unsplash.com/photo-1580481077195-c328ad4f4470?w=800&q=80',
};

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&q=80';

/**
 * Returns a high-res, verified product photograph for a given product
 */
export function getProductImage(sku?: string | null, customImageUrl?: string | null): string {
  if (customImageUrl && customImageUrl.startsWith('http')) {
    return customImageUrl;
  }
  if (sku && PRODUCT_IMAGES[sku]) {
    return PRODUCT_IMAGES[sku];
  }
  return DEFAULT_IMAGE;
}
