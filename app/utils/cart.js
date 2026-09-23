// app/utils/cart.js

// ===== 1. Get current cart items =====
export const getCart = () => {
  if (typeof window !== 'undefined') {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  }
  return [];
};

// ===== 2. Add a product to the cart =====
export const addToCart = (product, quantity = 1) => {
  const cart = getCart();
  
  // Check if the product is already in the cart
  const existingItem = cart.find((item) => item.id === product.id);

  if (existingItem) {
    // If exists, just increase the quantity
    existingItem.quantity += quantity;
  } else {
    // If not, add it with the quantity
    cart.push({ ...product, quantity });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  
  // ✅ Dispatch events to update header/cart page
  window.dispatchEvent(new Event('cartUpdated'));
  window.dispatchEvent(new Event('botAddToCart'));
  
  return cart;
};

// ===== 3. Remove an item from the cart =====
export const removeFromCart = (id) => {
  let cart = getCart();
  cart = cart.filter((item) => item.id !== id);
  localStorage.setItem('cart', JSON.stringify(cart));
  
  // ✅ Dispatch events to update header/cart page
  window.dispatchEvent(new Event('cartUpdated'));
  window.dispatchEvent(new Event('botAddToCart'));
  
  return cart;
};

// ===== 4. Clear the cart =====
export const clearCart = () => {
  localStorage.removeItem('cart');
  
  // ✅ Dispatch events to update header/cart page
  window.dispatchEvent(new Event('cartUpdated'));
  window.dispatchEvent(new Event('botAddToCart'));
  
  return [];
};

// ===== 5. Update cart item quantity =====
export const updateCartQuantity = (id, quantity) => {
  let cart = getCart();
  
  const item = cart.find((item) => item.id === id);
  if (item) {
    if (quantity <= 0) {
      cart = cart.filter((item) => item.id !== id);
    } else {
      item.quantity = quantity;
    }
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  
  // ✅ Dispatch events to update header/cart page
  window.dispatchEvent(new Event('cartUpdated'));
  window.dispatchEvent(new Event('botAddToCart'));
  
  return cart;
};

// ===== 6. Get total cart count (for badge) =====
export const getCartCount = () => {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + item.quantity, 0);
};

// ===== 7. Get total cart price =====
export const getCartTotal = () => {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
};

// ===== 8. Check if product is in cart =====
export const isInCart = (id) => {
  const cart = getCart();
  return cart.some((item) => item.id === id);
};

// ===== 9. Bot Search Products =====
export const botSearchProducts = (query) => {
  // ✅ Dispatch event for bot search
  window.dispatchEvent(new CustomEvent('botSearchProducts', { 
    detail: { query } 
  }));
  
  return true;
};

// ===== 10. Bot Add Product to Cart with message =====
export const botAddToCart = (product, quantity = 1) => {
  const cart = addToCart(product, quantity);
  
  // ✅ Dispatch bot-specific event
  window.dispatchEvent(new CustomEvent('botAddToCart', { 
    detail: { 
      product, 
      quantity, 
      message: `✅ Added ${quantity} x ${product.name} to cart` 
    } 
  }));
  
  return cart;
};

// ===== 11. Bot Remove Product from Cart =====
export const botRemoveFromCart = (id) => {
  const cart = removeFromCart(id);
  
  // ✅ Dispatch bot-specific event
  window.dispatchEvent(new CustomEvent('botRemoveFromCart', { 
    detail: { 
      id, 
      message: `🗑️ Removed product from cart` 
    } 
  }));
  
  return cart;
};