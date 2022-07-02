import React, { useReducer } from 'react';
import CartContext from './cart-context';

const defaultCartState = {
  items: [],
  totalAmount: 0,
};

////////////////////////////////////////////////////////////////////////////////
// state is the last state snapshot of the state managed by the reducer
// - action is dispatched by you, and you then have to return a new state snapshot
function cartReducer(state, action) {
  ////////////////////////////////////////
  // When cartReducer is called by dispatchCartAction in CartProvider below
  // - We get the item that should be added
  // - Check if that item is already in the cart -> if so update existing item
  // - If not then add new item
  if (action.type === 'ADD') {
    // Checks if an item is already in the cart
    // Returns the index number of the item if it exists
    // Updates the total amount of items in the cart
    const updatedTotalAmount = state.totalAmount + action.item.price * action.item.amount;

    const existingCartItemIndex = state.items.findIndex(item => item.id === action.item.id);

    const existingCartItem = state.items[existingCartItemIndex];
    let updatedItems;

    // Either adds new items or updates existing item amounts
    if (existingCartItem) {
      const updatedItem = {
        ...existingCartItem,
        amount: existingCartItem.amount + action.item.amount,
      };
      // Picks old item in index and updates it with the new item
      updatedItems = [...state.items];
      updatedItems[existingCartItemIndex] = updatedItem;
    } else {
      // doesn't edit existing array, but adds new item and returns a new array
      // - Important because we want to return a new State array
      updatedItems = state.items.concat(action.item);
    }

    return {
      items: updatedItems,
      totalAmount: updatedTotalAmount,
    };
  }

  if (action.type === 'REMOVE') {
    const existingCartItemIndex = state.items.findIndex(item => item.id === action.id);
    const existingItem = state.items[existingCartItemIndex];
    const updatedTotalAmount = state.totalAmount - existingItem.price;
    let updatedItems;
    // If there is only 1, then we want to remove it from the cart
    if (existingItem.amount === 1) {
      // Returns a new array filtered from conditions as true/false
      // Pass function in filter() that's executed on each item in array
      // - only keeps items that are true
      updatedItems = state.items.filter(item => item.id !== action.id);
    } else {
      const updatedItem = { ...existingItem, amount: existingItem.amount - 1 };
      updatedItems = [...state.items];
      updatedItems[existingCartItemIndex] = updatedItem;
    }
    return {
      items: updatedItems,
      totalAmount: updatedTotalAmount,
    };
  }

  if (action.type === 'CLEAR') {
    return defaultCartState;
  }

  return defaultCartState;
}

////////////////////////////////////////////////////////////////////////////////
// Calling add item in MealItemForm.js
export default function CartProvider(props) {
  // State snapshot & Function that allows you to dispatch an action to the reducer
  const [cartState, dispatchCartAction] = useReducer(cartReducer, defaultCartState);
  // Add item to cart handler
  const addItemToCartHandler = item => {
    // action is typically an object which as some property that allows you to
    // identify that action inside of the reducer function
    dispatchCartAction({
      type: 'ADD',
      item: item,
    });
  };

  // Remove item to cart handler
  const removeItemToCartHandler = id => {
    dispatchCartAction({
      type: 'REMOVE',
      id: id,
    });
  };

  const clearCartHandler = () => {
    dispatchCartAction({ type: 'CLEAR' });
  };

  const cartContext = {
    items: cartState.items,
    totalAmount: cartState.totalAmount,
    addItem: addItemToCartHandler,
    removeItem: removeItemToCartHandler,
    clearCart: clearCartHandler,
  };

  return <CartContext.Provider value={cartContext}>{props.children}</CartContext.Provider>;
}
