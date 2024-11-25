import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createProduct, updateProduct } from '../services/products';
import { Product } from '../types';
import ImageUpload from './ImageUpload';
import toast from 'react-hot-toast';

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().min(0.01, 'Price must be greater than 0'),
  category: z.enum(['Product', 'Service'], { required_error: 'Category is required' }),
  subcategory: z.string().min(1, 'Subcategory is required'),
  stock: z.number().int().min(0, 'Stock cannot be negative'),
  stripeProductId: z.string().optional(),
  stripePriceId: z.string().optional()
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductEditorProps {
  product: Product | null;
  onSave: () => void;
  onCancel: () => void;
}

const SUBCATEGORIES = {
  Product: ['Care Packages', 'Books', 'Medical Supplies', 'Safety Equipment'],
  Service: ['Consultations', 'Planning', 'Support Groups', 'Training']
} as const;

export default function ProductEditor({ product, onSave, onCancel }: ProductEditorProps) {
  const [images, setImages] = useState<string[]>(product?.images || []);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || '',
      description: product?.description || '',
      price: product?.price || 0,
      category: (product?.category as 'Product' | 'Service') || 'Product',
      subcategory: product?.subcategory || '',
      stock: product?.stock || 0,
      stripeProductId: product?.stripeProductId || '',
      stripePriceId: product?.stripePriceId || ''
    }
  });

  const category = watch('category');
  const currentSubcategories = SUBCATEGORIES[category];

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category as 'Product' | 'Service',
        subcategory: product.subcategory,
        stock: product.stock,
        stripeProductId: product.stripeProductId,
        stripePriceId: product.stripePriceId
      });
      setImages(product.images);
    }
  }, [product, reset]);

  const onSubmit = async (data: ProductFormData) => {
    if (images.length === 0) {
      toast.error('At least one image is required');
      return;
    }

    // Set high stock for services
    if (data.category === 'Service') {
      data.stock = 999;
    }

    setLoading(true);
    try {
      const productData = {
        ...data,
        images,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (product) {
        await updateProduct(product.id, productData);
        toast.success('Item updated successfully');
      } else {
        await createProduct(productData);
        toast.success('Item created successfully');
      }
      onSave();
    } catch (error) {
      console.error('Error saving item:', error);
      toast.error('Failed to save item');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (url: string) => {
    setImages([...images, url]);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">
          {product ? 'Edit Item' : 'Add New Item'}
        </h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              {...register('name')}
              className="brand-input"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              {...register('description')}
              rows={3}
              className="brand-input"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              step="0.01"
              {...register('price', { valueAsNumber: true })}
              className="brand-input"
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select {...register('category')} className="brand-input">
              <option value="Product">Product</option>
              <option value="Service">Service</option>
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Subcategory</label>
            <select {...register('subcategory')} className="brand-input">
              <option value="">Select a subcategory</option>
              {currentSubcategories.map((sub) => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
            {errors.subcategory && (
              <p className="mt-1 text-sm text-red-600">{errors.subcategory.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Stock</label>
            <input
              type="number"
              {...register('stock', { valueAsNumber: true })}
              className="brand-input"
              disabled={category === 'Service'}
            />
            {errors.stock && (
              <p className="mt-1 text-sm text-red-600">{errors.stock.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
            <div className="space-y-4">
              <ImageUpload onImageUploaded={handleImageUpload} />
              <div className="grid grid-cols-3 gap-4">
                {images.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      alt={`Product ${index + 1}`}
                      className="w-full h-24 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="brand-button"
              disabled={loading}
            >
              {loading ? 'Saving...' : (product ? 'Update Item' : 'Create Item')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}