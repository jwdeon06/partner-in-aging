import React, { useState, useEffect } from 'react';
import { getAllProducts } from '../services/products';
import toast from 'react-hot-toast';

function Store() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const fetchedProducts = await getAllProducts();
      setProducts(fetchedProducts);
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  // Separate products and services
  const productItems = products.filter(item => item.category === 'Product');
  const serviceItems = products.filter(item => item.category === 'Service');

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Products Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Products</h2>
        {productItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products available.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {productItems.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {product.images[0] && (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold">{product.name}</h3>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                      {product.subcategory}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-blue-600">
                      ${product.price.toFixed(2)}
                    </span>
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      onClick={() => toast.error('Cart functionality is disabled')}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Services Section */}
      <section>
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Services</h2>
        {serviceItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No services available.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {serviceItems.map((service) => (
              <div key={service.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {service.images[0] && (
                  <img
                    src={service.images[0]}
                    alt={service.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold">{service.name}</h3>
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 text-sm rounded">
                      {service.subcategory}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-purple-600">
                      ${service.price.toFixed(2)}
                    </span>
                    <button
                      className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                      onClick={() => toast.error('Cart functionality is disabled')}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Store;