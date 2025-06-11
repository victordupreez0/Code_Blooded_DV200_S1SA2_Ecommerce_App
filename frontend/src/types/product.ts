export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string; // match backend
  category?: string;
  rating?: number;
  status?: 'pending' | 'approved' | 'denied';
  approved?: boolean;
  flagged?: boolean;
  flagReasons?: string[];
}
