export type ProductCategory = "men's clothing" | "women's clothing" | 'electronics' | 'jewelery';

export interface ProductRating {
  rate: number;
  count: number;
}

export interface ProductDTO {
  id: number;
  title: string;
  price: number;
  description: string;
  category: ProductCategory;
  image: string;
  rating: ProductRating;
}
