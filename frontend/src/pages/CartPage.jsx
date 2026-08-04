import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const CartPage = () => {
  const { cartItems = [], addToCart, removeFromCart, updateCartItem, clearCart } = useContext(CartContext);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);

  const handleQuantityChange = (itemId, quantity) => {
    if (quantity < 1) return;
    if (typeof updateCartItem === 'function') {
      updateCartItem(itemId, quantity);
      return;
    }

    const item = cartItems.find((cartItem) => cartItem.id === itemId);
    if (!item) return;
    if (typeof addToCart === 'function') {
      addToCart({ ...item, quantity });
    }
  };

  return (
    <div className="page-wrapper cart-page">
      {cartItems.length === 0 ? (
        <div className="empty-state card card--centered">
          <h2>Your cart is empty</h2>
        </div>
      ) : (
        <div>
          <section className="cart-items">
            {cartItems.map((item) => (
              <article key={item.id} className="cart-item card">
                <div className="cart-item__content">
                  <div className="cart-item__row">
                    <h2 className="cart-item__title">{item.name}</h2>
                    <div className="quantity-controls">
                      <button
                        type="button"
                        className="quantity-button"
                        onClick={() => handleQuantityChange(item.id, (item.quantity || 1) - 1)}
                        disabled={(item.quantity || 1) <= 1}
                      >
                        −
                      </button>
                      <span className="quantity-value">{item.quantity || 1}</span>
                      <button
                        type="button"
                        className="quantity-button"
                        onClick={() => handleQuantityChange(item.id, (item.quantity || 1) + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="cart-item__actions">
                    <button type="button" className="button button--ghost" onClick={() => removeFromCart(item.id)}>
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </section>

          <div className="cart-subtotal card">
            <strong>Subtotal: ${subtotal.toFixed(2)}</strong>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
