"use client";

import { motion } from 'framer-motion';
import { Card } from './card';

// Loading Spinner Component
export function LoadingSpinner({ size = 'md', color = 'blue' }: { 
  size?: 'sm' | 'md' | 'lg'; 
  color?: 'blue' | 'green' | 'purple' | 'gray';
}) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const colorClasses = {
    blue: 'border-blue-600',
    green: 'border-green-600',
    purple: 'border-purple-600',
    gray: 'border-gray-600'
  };

  return (
    <div className={`inline-block ${sizeClasses[size]} border-2 border-gray-300 ${colorClasses[color]} border-t-current rounded-full animate-spin`} />
  );
}

// Loading Dots Component
export function LoadingDots({ size = 'md', color = 'blue' }: { 
  size?: 'sm' | 'md' | 'lg'; 
  color?: 'blue' | 'green' | 'purple' | 'gray';
}) {
  const sizeClasses = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-3 h-3'
  };

  const colorClasses = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    purple: 'bg-purple-600',
    gray: 'bg-gray-600'
  };

  return (
    <div className="flex space-x-1">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-bounce`}
          style={{ animationDelay: `${index * 0.1}s` }}
        />
      ))}
    </div>
  );
}

// Skeleton Loading Component
export function Skeleton({ 
  className = '', 
  width = 'w-full', 
  height = 'h-4' 
}: { 
  className?: string; 
  width?: string; 
  height?: string;
}) {
  return (
    <div className={`${width} ${height} bg-gray-200 rounded animate-pulse ${className}`} />
  );
}

// Card Skeleton Component
export function CardSkeleton({ 
  lines = 3, 
  showImage = false 
}: { 
  lines?: number; 
  showImage?: boolean;
}) {
  return (
    <Card className="p-6">
      {showImage && (
        <div className="flex items-center space-x-4 mb-4">
          <Skeleton className="w-12 h-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="w-3/4" />
            <Skeleton className="w-1/2" />
          </div>
        </div>
      )}
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, index) => (
          <Skeleton 
            key={index} 
            className={index === 0 ? 'w-3/4' : index === lines - 1 ? 'w-1/2' : 'w-full'} 
          />
        ))}
      </div>
    </Card>
  );
}

// Table Skeleton Component
export function TableSkeleton({ 
  rows = 5, 
  columns = 4 
}: { 
  rows?: number; 
  columns?: number;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200">
      <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: columns }).map((_, index) => (
            <Skeleton key={index} className="h-4" />
          ))}
        </div>
      </div>
      <div className="divide-y divide-gray-200">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="px-6 py-4">
            <div className="grid grid-cols-4 gap-4">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <Skeleton 
                  key={colIndex} 
                  className={colIndex === 0 ? 'w-3/4' : 'w-full'} 
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Chart Skeleton Component
export function ChartSkeleton({ 
  type = 'bar', 
  height = 'h-64' 
}: { 
  type?: 'bar' | 'line' | 'pie'; 
  height?: string;
}) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="w-48 h-6" />
        <Skeleton className="w-24 h-8" />
      </div>
      <div className={`${height} bg-gray-50 rounded-lg flex items-end justify-center space-x-2 p-4`}>
        {Array.from({ length: 8 }).map((_, index) => (
          <motion.div
            key={index}
            className="bg-gray-200 rounded-t"
            style={{ 
              width: '8%', 
              height: `${Math.random() * 60 + 20}%` 
            }}
            animate={{ 
              opacity: [0.5, 1, 0.5],
              scale: [0.95, 1, 0.95]
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              delay: index * 0.1 
            }}
          />
        ))}
      </div>
    </Card>
  );
}

// Page Loading Component
export function PageLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <LoadingSpinner size="lg" color="blue" />
        <p className="mt-4 text-gray-600 text-body">Loading...</p>
      </div>
    </div>
  );
}

// Content Loading Component
export function ContentLoading({ 
  type = 'cards', 
  count = 3 
}: { 
  type?: 'cards' | 'table' | 'chart'; 
  count?: number;
}) {
  return (
    <div className="space-y-6">
      {type === 'cards' && (
        <div className="grid-responsive">
          {Array.from({ length: count }).map((_, index) => (
            <CardSkeleton key={index} lines={4} />
          ))}
        </div>
      )}
      
      {type === 'table' && (
        <TableSkeleton rows={6} columns={4} />
      )}
      
      {type === 'chart' && (
        <ChartSkeleton type="bar" />
      )}
    </div>
  );
}

// Button Loading Component
export function ButtonLoading({ 
  variant = 'primary', 
  size = 'md' 
}: { 
  variant?: 'primary' | 'secondary' | 'outline'; 
  size?: 'sm' | 'md' | 'lg';
}) {
  const variantClasses = {
    primary: 'bg-blue-600 text-white',
    secondary: 'bg-gray-600 text-white',
    outline: 'border border-gray-300 text-gray-700'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button 
      disabled 
      className={`inline-flex items-center space-x-2 rounded-lg font-medium ${variantClasses[variant]} ${sizeClasses[size]} opacity-75 cursor-not-allowed`}
    >
      <LoadingSpinner size="sm" color="white" />
      <span>Loading...</span>
    </button>
  );
}

// Search Loading Component
export function SearchLoading() {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <LoadingSpinner size="sm" color="gray" />
        </div>
        <input
          type="text"
          disabled
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 text-gray-500 placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Searching..."
        />
      </div>
    </div>
  );
}

// Data Loading Component
export function DataLoading({ 
  message = 'Loading data...' 
}: { 
  message?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <LoadingSpinner size="lg" color="blue" />
      <p className="mt-4 text-gray-600 text-body">{message}</p>
      <div className="mt-2 flex space-x-1">
        <LoadingDots size="md" color="blue" />
      </div>
    </div>
  );
}

// Shimmer Loading Component
export function ShimmerLoading({ 
  className = '' 
}: { 
  className?: string;
}) {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-size-200 animate-shimmer rounded" />
    </div>
  );
} 