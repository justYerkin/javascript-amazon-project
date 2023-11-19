export let cart = JSON.parse(localStorage.getItem('cart'));

if(!cart) {
  cart = [];
}

function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(productId, quantity) {
  
  let matchingItem;
    
  cart.forEach((cartItem) => {
    if(productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  if(matchingItem) {
    matchingItem.quantity += quantity;
  } else {
    cart.push({
      productId,
      quantity,
      deliveryOptionId: '1'
    });
  }

  saveToStorage();

}

export function removeFromCart(productId) {

  let newCart = [];

  cart.forEach((cartItem) => {

    if(cartItem.productId !== productId) {

      newCart.push(cartItem);

    }

  });

  cart = newCart;

  saveToStorage();

}

export function calculateCartQuantity() {

  let cartQuantity = 0;

  cart.forEach((cartItem) => {

    cartQuantity += cartItem.quantity;

  });

  return cartQuantity;

}

export function updateQuantity(productId, quantity) {
  
  let matchingItem;
    
  cart.forEach((cartItem) => {
    if(productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  matchingItem.quantity = quantity;

  saveToStorage();

}

export function updateDeliveryOption(productId, deliveryOptionId) {

  let matchingItem;
    
  cart.forEach((cartItem) => {
    if(productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  matchingItem.deliveryOptionId = deliveryOptionId;

  saveToStorage();

}