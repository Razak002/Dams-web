export interface CartItem {
  /** Composite key: `${productId}-${size}-${colour}` */
  key: string;
  productId: string;
  slug: string;
  name: string;
  subtitle: string;
  price: number;
  size: number; // EU Size
  ukSize: number;
  colour: string;
  colourHex: string;
  image: string;
  quantity: number;
  maxStock: number;
}
