import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import toast from 'react-hot-toast';

function Cart() {
  const { items, removeFromCart, total } = useCart();
  const navigate = useNavigate();

  const handleRemove = (productId) => {
    removeFromCart(productId);
    toast.success('Item removed from cart');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
          <button
            onClick={() => navigate('/store')}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.product.id}
              className="flex items-center p-4 bg-white rounded-lg shadow"
            >
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{item.product.name}</h3>
                <p className="text-gray-600">${item.product.price.toFixed(2)} × {item.quantity}</p>
              </div>
              <button
                onClick={() => handleRemove(item.product.id)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}

          <div className="bg-white rounded-lg shadow p-4 mt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-2xl font-bold">${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between space-x-4">
              <button
                onClick={() => navigate('/store')}
                className="flex-1 px-6 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Continue Shopping
              </button>
              <button
                onClick={() => navigate('/checkout')}
                className="flex-1 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;