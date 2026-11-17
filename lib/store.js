'use client';

export function getCart() {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem('adel_cart') || '[]');
  } catch {
    return [];
  }
}

export function saveCart(cart) {
  localStorage.setItem('adel_cart', JSON.stringify(cart));
  window.dispatchEvent(new Event('adel-cart-update'));
}

export function addToCart(product, qty = 1) {
  const cart = getCart();
  const found = cart.find((c) => c.id === product.id);
  if (found) found.qty += qty;
  else cart.push({ id: product.id, name: product.name, price: product.price, emoji: product.emoji, unit: product.unit, qty });
  saveCart(cart);
}

export function cartCount() {
  return getCart().reduce((s, i) => s + i.qty, 0);
}

export function cartTotal() {
  return getCart().reduce((s, i) => s + i.qty * i.price, 0);
}

export function clearCart() {
  saveCart([]);
}

export const peso = (n) =>
  '₱' + Number(n || 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
