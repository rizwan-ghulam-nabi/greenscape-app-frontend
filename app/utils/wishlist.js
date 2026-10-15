// app/utils/wishlist.js
const WISHLIST_KEY = 'greenscape_wishlist';

export function getWishlistIds() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function setWishlistIds(ids) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(ids));
    window.dispatchEvent(new Event('wishlistUpdated'));
  } catch {}
}

export function addToWishlist(productId) {
  const ids = getWishlistIds();
  if (ids.includes(productId)) return false;
  setWishlistIds([...ids, productId]);
  return true;
}

export function removeFromWishlist(productId) {
  const ids = getWishlistIds();
  setWishlistIds(ids.filter((id) => id !== productId));
}

export function isInWishlist(productId) {
  return getWishlistIds().includes(productId);
}

export function getWishlistCount() {
  return getWishlistIds().length;
}