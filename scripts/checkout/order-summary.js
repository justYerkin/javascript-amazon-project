import {cart, removeFromCart, calculateCartQuantity, updateQuantity, updateDeliveryOption} from '../../data/cart.js';
import {products, getProduct} from '../../data/products.js';
import {formatCurrency} from '../utils/money.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import {deliveryOptions, getDeliveryOption, calculateDeliveryDate} from '../../data/delivery-options.js';
import {renderPaymentSummary} from './payment-summary.js';
import {renderCheckoutHeader} from './checkoutHeader.js';

export function renderOrderSummary() {

  renderCheckoutHeader();

  let cartSummaryHTML = '';

  cart.forEach((cartItem) => {

    const productId = cartItem.productId;

    const matchingProduct = getProduct(productId);

    const deliveryOptionId = cartItem.deliveryOptionId;

    const deliveryOption = getDeliveryOption(deliveryOptionId);

    const dateString = calculateDeliveryDate(deliveryOption);

    cartSummaryHTML += `
      <div class="js-cart-item-container-${matchingProduct.id} cart-item-container">
        <div class="delivery-date">
          Delivery date: ${dateString}
        </div>

        <div class="cart-item-details-grid">
          <img class="product-image"
            src="${matchingProduct.image}">

          <div class="cart-item-details">
            <div class="product-name">
              ${matchingProduct.name}
            </div>
            <div class="product-price">
              $${formatCurrency(matchingProduct.priceCents)}
            </div>
            <div class="product-quantity">
              <span>
                Quantity: <span class="js-quantity-label quantity-label">${cartItem.quantity}</span>
              </span>
              <span class="js-update-quantity-link update-quantity-link link-primary" data-product-id="${matchingProduct.id}">
                Update
              </span>
              <input class="js-quantity-input quantity-input" data-product-id="${matchingProduct.id}">
              <span class="js-save-quantity-link save-quantity-link link-primary" data-product-id="${matchingProduct.id}">Save</span>
              <span class="js-delete-quantity-link delete-quantity-link link-primary" data-product-id="${matchingProduct.id}">
                Delete
              </span>
            </div>
          </div>

          <div class="delivery-options">
            <div class="delivery-options-title">
              Choose a delivery option:
            </div>
            ${deliveryOptionsHTML(matchingProduct, cartItem)}
          </div>
        </div>
      </div>
    `;

  });

  function deliveryOptionsHTML(matchingProduct, cartItem) {

    let html = ``;

    deliveryOptions.forEach((deliveryOption) => {

      const dateString = calculateDeliveryDate(deliveryOption);
      
      const deliveryPrice = deliveryOption.priceCents === 0 ? 'FREE' : `$${formatCurrency(deliveryOption.priceCents)} -`;

      const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

      html += `
        <div class="js-delivery-option delivery-option" data-product-id="${matchingProduct.id}" data-delivery-option-id="${deliveryOption.id}">
          <input type="radio"
            ${isChecked ? 'checked' : ''}
            class="delivery-option-input"
            name="delivery-option-${matchingProduct.id}">
          <div>
            <div class="delivery-option-date">
              ${dateString}
            </div>
            <div class="delivery-option-price">
              ${deliveryPrice} Shipping
            </div>
          </div>
        </div>
      `;

    });

    return html;

  }

  document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;

  document.querySelectorAll('.js-delete-quantity-link').forEach((linkElement) => {

    linkElement.addEventListener('click', () => {

      const productId = linkElement.dataset.productId;

      removeFromCart(productId);

      renderCheckoutHeader();
      renderOrderSummary();
      renderPaymentSummary();

    });

  });

  document.querySelectorAll('.js-update-quantity-link').forEach((linkElement) => {

    linkElement.addEventListener('click', () => {

      const productId = linkElement.dataset.productId;

      document.querySelector(`.js-cart-item-container-${productId}`).classList.add('is-editing-quantity');

    });

  });

  function updateQuantityHTML(productId, newQuantity) {

    if(newQuantity > 0 && newQuantity < 1000) {

      updateQuantity(productId, newQuantity);

      document.querySelector('.js-quantity-label').innerHTML = newQuantity;

      renderCheckoutHeader();

    } else if(newQuantity === 0) {

      removeFromCart(productId);

      document.querySelector(`.js-cart-item-container-${productId}`).remove();

      renderCheckoutHeader();

    } else {

      alert('The inputted quantity is not valid.');

    }

  };

  document.querySelectorAll('.js-save-quantity-link').forEach((linkElement) => {

    linkElement.addEventListener('click', () => {

      const productId = linkElement.dataset.productId;

      document.querySelector(`.js-cart-item-container-${productId}`).classList.remove('is-editing-quantity');

      const newQuantity = Number(document.querySelector(`.js-quantity-input`).value);

      updateQuantityHTML(productId, newQuantity);

      renderPaymentSummary();

    });

  });

  document.querySelectorAll('.js-quantity-input').forEach((inputElement) => {

    inputElement.addEventListener('keydown', (event) => {

      if(event.key === 'Enter') {
    
        const productId = inputElement.dataset.productId;
    
        document.querySelector(`.js-cart-item-container-${productId}`).classList.remove('is-editing-quantity');
    
        const newQuantity = Number(document.querySelector(`.js-quantity-input`).value);
    
        updateQuantityHTML(productId, newQuantity);

        renderPaymentSummary();
    
      }
    
    });

  });

  document.querySelectorAll('.js-delivery-option').forEach((selectorElement) => {
    selectorElement.addEventListener('click', () => {
      const {productId, deliveryOptionId} = selectorElement.dataset;
      updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary();
      renderPaymentSummary();
    });
  });

}