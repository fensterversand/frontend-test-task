import { apiClient } from './client';
import type { ProductDTO, ProductCategory } from '../models/dto/ProductDTO.ts';

export const productsApi = {
  async getProducts(limit: number): Promise<ProductDTO[]> {
    const response = await apiClient.get<ProductDTO[]>('/products', {
      params: {
        limit,
      },
    });
    return response.data;
  },

  async getProductById(id: number): Promise<ProductDTO> {
    const response = await apiClient.get<ProductDTO>(`/products/${id}`);
    return response.data;
  },

  async createProduct(product: Partial<ProductDTO>): Promise<Partial<ProductDTO>> {
    const response = await apiClient.post<ProductDTO>('/products', product);
    return response.data;
  },

  async updateProduct(id: number, product: Partial<ProductDTO>): Promise<ProductDTO> {
    const response = await apiClient.put<ProductDTO>(`/products/${id}`, product);
    return response.data;
  },

  async deleteProduct(id: number): Promise<void> {
    await apiClient.delete(`/products/${id}`);
  },

  async getProductsByCategory(category: ProductCategory): Promise<ProductDTO[]> {
    const response = await apiClient.get<ProductDTO[]>(`/products/category/${category}`);
    return response.data;
  },
};
