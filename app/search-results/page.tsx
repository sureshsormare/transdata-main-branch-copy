"use client";

import { Suspense } from "react";
import SupplierCustomerSummary from "./quicksummary/SupplierCustomerSummary";

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SupplierCustomerSummary />
    </Suspense>
  );
}
