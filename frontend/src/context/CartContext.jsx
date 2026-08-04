import React, { createContext, useContext, useEffect, useReducer } from "react";

export const CartContext = createContext();

const BASE_URL = import.meta.env.VITE_DJANGO_BASE_URL || "http://127.0.0.1:8000";

const initialState = {
  items: [],
};

function cartReducer(state, action) {
  switch (action.type) {
    case "SET_CART":
      return {
        ...state,
        items: action.payload || [],
      };
    case "CLEAR_CART":
      return initialState;
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const setCart = (cartData) => {
    dispatch({ type: "SET_CART", payload: cartData?.items || [] });
  };

  const fetchCart = async () => {
    const response = await fetch(`${BASE_URL}/api/cart/`);
    if (!response.ok) {
      throw new Error("Unable to load cart");
    }
    const data = await response.json();
    setCart(data);
    return data;
  };

  const addToCart = async (productOrId) => {
    const productId = typeof productOrId === 'object' ? productOrId.id : productOrId;
    const response = await fetch(`${BASE_URL}/api/cart/add/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ product_id: productId }),
    });

    if (!response.ok) {
      throw new Error('Unable to add item to cart');
    }

    const data = await response.json();
    setCart(data.cart || data);
    return data;
  };

  const removeFromCart = async (itemId) => {
    const response = await fetch(`${BASE_URL}/api/cart/remove/${itemId}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Unable to remove item from cart');
    }

    const data = await response.json();
    setCart(data.cart || data);
    return data;
  };

  const updateCartItem = async (id, quantity) => {
    const response = await fetch(`${BASE_URL}/api/cart/update/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ item_id: id, quantity }),
    });

    if (!response.ok) {
      throw new Error('Unable to update cart item');
    }

    const data = await response.json();
    setCart(data.cart || data);
    return data;
  };

  const clearCart = async () => {
    const response = await fetch(`${BASE_URL}/api/cart/clear/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Unable to clear cart');
    }

    const data = await response.json();
    setCart(data.cart || data);
    return data;
  };

  useEffect(() => {
    fetchCart().catch((error) => {
      console.error(error);
    });
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart: state.items,
        cartItems: state.items,
        fetchCart,
        addToCart,
        addItem: addToCart,
        removeFromCart,
        removeItem: removeFromCart,
        updateCartItem,
        updateItem: updateCartItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
