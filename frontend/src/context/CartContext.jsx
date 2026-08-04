import React, { createContext, useContext, useReducer } from "react";

export const CartContext = createContext();

const initialState = {
  items: [],
};

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find((item) => item.id === action.payload.id);

      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: (item.quantity || 1) + 1 }
              : item
          ),
        };
      }

      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
      };
    }
    case "REMOVE_ITEM": {
      const existingItem = state.items.find((item) => item.id === action.payload.id);

      if (!existingItem) {
        return state;
      }

      if ((existingItem.quantity || 1) === 1) {
        return {
          ...state,
          items: state.items.filter((item) => item.id !== action.payload.id),
        };
      }

      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: (item.quantity || 1) - 1 }
            : item
        ),
      };
    }
    case "CLEAR_CART":
      return initialState;
    case "UPDATE_ITEM": {
      const existingItem = state.items.find((item) => item.id === action.payload.id);

      if (!existingItem) {
        return state;
      }

      const quantity = action.payload.quantity;
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => item.id !== action.payload.id),
        };
      }

      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity }
            : item
        ),
      };
    }
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addToCart = (item) => dispatch({ type: "ADD_ITEM", payload: item });
  const removeFromCart = (item) => dispatch({ type: "REMOVE_ITEM", payload: item });
  const updateCartItem = (id, quantity) => dispatch({ type: "UPDATE_ITEM", payload: { id, quantity } });
  const clearCart = () => dispatch({ type: "CLEAR_CART" });

  return (
    <CartContext.Provider
      value={{
        cart: state.items,
        cartItems: state.items,
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
