export interface Product {
  id: number;
  name: string;
  description: string | null;
  sku: string;
  price: number | string; // Laravel returns string decimals or numbers
  stock: number;
  is_active: boolean | number;
  deleted_at?: string | null;
  created_at?: string;
  updated_at?: string;
  image_url?: string | null; // For display
}

export interface ProductsResponse {
  data: Product[];
  current_page?: number;
  last_page?: number;
  per_page?: number;
  total?: number;
}
