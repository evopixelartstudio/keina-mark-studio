"use client";

import React, { use } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProductEditorForm } from "@/components/admin/ProductEditorForm";
import { useStore } from "@/context/StoreContext";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { products } = useStore();
  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <AdminLayout>
        <div className="p-8 text-center text-[#70775E] bg-white border border-[#E8E2D5]">
          Peça não encontrada no catálogo.
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <ProductEditorForm initialProduct={product} />
    </AdminLayout>
  );
}
