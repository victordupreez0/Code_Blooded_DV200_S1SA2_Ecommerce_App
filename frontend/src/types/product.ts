// TypeScript interface for representing a product object in the frontend application.
// This interface ensures type safety and consistency when working with product data
// fetched from or sent to the backend API.

export interface Product {
  _id: string;                // Unique identifier for the product (MongoDB ObjectId as a string)
  name: string;               // Name/title of the product
  description: string;        // Detailed description of the product
  price: number;              // Price of the product (in the application's currency)
  imageUrl: string;           // URL to the product's image (should match backend field)
  category?: string;          // Optional: Category of the product (e.g., 'Vehicle', 'Property', etc.)
  rating?: number;            // Optional: Average user rating for the product (if available)
  status?: 'pending' | 'approved' | 'denied'; // Optional: Moderation status of the product
  approved?: boolean;         // Optional: Indicates if the product is approved for listing
  flagged?: boolean;          // Optional: Indicates if the product has been flagged for review
  flagReasons?: string[];     // Optional: Array of reasons why the product was flagged
}
