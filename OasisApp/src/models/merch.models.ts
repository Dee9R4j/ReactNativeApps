/**
 * Merch domain models
 */
export interface Merch {
  id: number;
  name: string;
  price: number;
  description: string;
  image_url: string;
  sizes: string[];
  colors: string[];
  in_stock: boolean;
}
