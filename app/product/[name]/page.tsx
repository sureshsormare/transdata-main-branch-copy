import { Suspense } from 'react';
import ProductDetailClient from './ProductDetailClient';

interface ProductPageProps {
  params: {
    name: string;
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const productName = decodeURIComponent(params.name);
  
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading product details...</span>
      </div>
    }>
      <ProductDetailClient productName={productName} />
    </Suspense>
  );
} 