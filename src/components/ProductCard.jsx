import React from 'react';

function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
      <p className="text-gray-600 mb-4">{product.description}</p>
      <div className="flex justify-between items-center">
        <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => alert(`Added ${product.name} to cart!`)}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductCard;