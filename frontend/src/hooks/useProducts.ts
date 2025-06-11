// Custom React hook for fetching and managing the list of products from the backend API.
// Handles loading, error, and product state, and provides a simple interface for components to consume product data.

import { useEffect, useState } from 'react';
import { Product } from '../types/product';

export function useProducts() {
  // State for the list of products
  const [products, setProducts] = useState<Product[]>([]);
  // State for loading indicator
  const [loading, setLoading] = useState(true);
  // State for error messages
  const [error, setError] = useState<string | null>(null);

  // Fetch products from the backend API when the hook is first used (on mount)
  useEffect(() => {
    async function fetchProducts() {
      try {
        // Make a GET request to the backend API for products
        const res = await fetch('http://localhost:3000/products');
        if (!res.ok) throw new Error('Failed to fetch products'); // Handle HTTP errors
        const data = await res.json(); // Parse JSON response
        setProducts(data); // Update products state
      } catch (err: any) {
        setError(err.message || 'Unknown error'); // Set error state if fetch fails
      } finally {
        setLoading(false); // Always stop loading, even if error
      }
    }
    fetchProducts(); // Call fetch on mount
  }, []);

  // Return products, loading, and error state to consumers of the hook
  return { products, loading, error };
}
