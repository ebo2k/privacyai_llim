"use client";

import { createContext, useContext, useState, ReactNode } from 'react';




// Define the shape of your product data
export interface ProductData {
  id: string;
  name: string;
  image: string;
  desc: string;
  requirements: {
    evidence: string;
    requirement: string;
    analysis: string;
    risk: string;
    riskanalysis: string;
  }[];
}



// Define the shape of your context
interface ProductContextType {
  selectedProduct: ProductData | null;
  setSelectedProduct: (product: ProductData | null | ((prevProduct: ProductData | null) => ProductData | null)) => void;
}

// Create the ProductContext


const ProductContext = createContext<ProductContextType>({
  selectedProduct: null,
  setSelectedProduct: () => {},
});

// Create a custom hook to access the ProductContext
export const useProductContext = () => useContext(ProductContext);

// Create the ProductProvider component to wrap your application
interface ProductProviderProps {
  children: ReactNode;
}

export const ProductProvider: React.FC<ProductProviderProps> = ({ children }) => {
  const [selectedProduct, setSelectedProduct] = useState<ProductData | null>(null);

  return (
    <ProductContext.Provider value={{ selectedProduct, setSelectedProduct }}>
      {children}
    </ProductContext.Provider>
  );
};
