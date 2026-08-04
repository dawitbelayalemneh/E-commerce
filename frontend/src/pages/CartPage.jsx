import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const { cartItems = [], removeFromCart, updateCartItem, clearCart } = useCart();

  const formatPrice = (price) => {
    const value = typeof price === 'string' ? parseFloat(price) : price;
    return Number.isFinite(value) ? value.toFixed(2) : '0.00';
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (Number(item.product_price) || 0) * (item.quantity || 1),
    0,
  );

  const handleQuantityChange = async (itemId, quantity) => {
    if (quantity < 1) return;
    await updateCartItem(itemId, quantity).catch((error) => {
      console.error(error);
    });
  };

  return (
    <div className="min-h-[calc(100vh-72px)] bg-slate-50 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Shopping cart</p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Your cart</h1>
          </div>
          <p className="text-sm text-slate-600">
            {cartItems.length} item{cartItems.length === 1 ? '' : 's'} in cart
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="rounded-[32px] border border-slate-200 bg-white p-10 text-center shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">Your cart is empty</h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Add products to your cart and they will appear here.
            </p>
            <Link
              to="/"
              className="mt-8 inline-flex rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Continue shopping
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1.8fr_0.9fr]">
            <section className="space-y-4">
              {cartItems.map((item) => (
                <article key={item.id} className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
                  <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-3">
                      <h2 className="text-xl font-semibold text-slate-900">{item.product_name}</h2>
                      <p className="text-sm text-slate-500">${formatPrice(item.product_price)} each</p>
                      <p className="text-sm font-medium text-slate-700">
                        Total: ${formatPrice((Number(item.product_price) || 0) * (item.quantity || 1))}
                      </p>
                    </div>

                    <div className="flex flex-col items-start gap-4 sm:items-end">
                      <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-2 py-1">
                        <button
                          type="button"
                          className="h-9 w-9 rounded-full text-lg font-semibold text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:text-slate-400"
                          onClick={() => handleQuantityChange(item.id, (item.quantity || 1) - 1)}
                          disabled={(item.quantity || 1) <= 1}
                        >
                          −
                        </button>
                        <span className="mx-4 min-w-[2rem] text-center text-sm font-medium text-slate-900">{item.quantity || 1}</span>
                        <button
                          type="button"
                          className="h-9 w-9 rounded-full text-lg font-semibold text-slate-700 transition hover:bg-slate-200"
                          onClick={() => handleQuantityChange(item.id, (item.quantity || 1) + 1)}
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={async () => {
                          await removeFromCart(item.id).catch((error) => {
                            console.error(error);
                          });
                        }}
                        className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </section>

            <aside className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="space-y-5">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Order summary</h2>
                  <p className="mt-2 text-sm text-slate-500">Review your items and update quantities before checkout.</p>
                </div>

                <div className="rounded-3xl bg-slate-50 p-5">
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-900">${subtotal.toFixed(2)}</span>
                  </div>
                  <p className="mt-3 text-xs leading-5 text-slate-500">
                    Shipping and taxes will be calculated at checkout.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={clearCart}
                  className="w-full rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
                >
                  Clear cart
                </button>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
