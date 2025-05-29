export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string; // match backend
  category?: string;
  rating?: number;
}
