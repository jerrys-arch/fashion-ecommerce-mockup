


document.addEventListener('DOMContentLoaded', () => {
  
  const products = document.querySelectorAll('.product-item');

  products.forEach((product) => {
   
    const stars = product.querySelectorAll('.rating-stars .star');

    
    stars.forEach((star) => {
      star.addEventListener('click', () => {
        const rating = parseInt(star.getAttribute('data-rating')); 
        
        const allStars = product.querySelectorAll('.rating-stars .star');

        
        allStars.forEach(s => s.classList.remove('selected'));

        
        allStars.forEach((s, index) => {
          if (index < rating) {
            s.classList.add('selected');
          }
        });
      });
    });
  });
});
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function updateCartCount() {
  const cartCountElement = document.getElementById('cart-count');
  cartCountElement.textContent = cart.length;
}

function updateCart() {
  const cartCountElement = document.getElementById('cart-count');
  const cartItemsContainer = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');

  cartItemsContainer.innerHTML = '';

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p>Your cart is empty</p>';
    cartTotal.innerText = '0.00';
    cartCountElement.innerText = '0';
    return;
  }

  let total = 0;
  cart.forEach((item, index) => {
    if (typeof item.name === 'undefined' || typeof item.price === 'undefined' || typeof item.quantity === 'undefined') {
      console.error('Invalid item in cart:', item);
      return;
    }

    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');
    cartItem.innerHTML = `
      <span>${item.name} - $${item.price.toFixed(2)}</span>
      <span>Qty: ${item.quantity}</span>
      <button onclick="removeItem(${index})">Remove</button>
    `;
    cartItemsContainer.appendChild(cartItem);

    if (!isNaN(item.price) && !isNaN(item.quantity)) {
      total += item.price * item.quantity;
    } else {
      console.error('Invalid price or quantity:', item);
    }
  });

  cartTotal.innerText = `$${total.toFixed(2)}`;
  cartCountElement.innerText = cart.length;
}

function addItemToCart(name, price) {
  price = parseFloat(price);
  if (isNaN(price)) {
    console.error('Invalid price:', price);
    return;
  }

  const existingItem = cart.find(item => item.name === name);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ name, price, quantity: 1 });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCart();
  showToast(`${name} added to your cart.`);
}

function removeItem(index) {
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCart();
}

function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  toastMessage.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

document.getElementById('clear-cart').addEventListener('click', () => {
  cart = [];
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCart();
});

updateCart();

document.querySelectorAll('.add-to-cart-btn').forEach(button => {
  button.addEventListener('click', function() {
    const name = this.getAttribute('data-name');
    const price = this.getAttribute('data-price');
    addItemToCart(name, price);
  });
});


const searchInput = document.getElementById('search-input');
const productItems = document.querySelectorAll('.product-item');


function filterProducts() {
  const query = searchInput.value.toLowerCase();  
  productItems.forEach(product => {
    const productName = product.querySelector('h3').textContent.toLowerCase();  
    if (productName.includes(query)) {
      product.style.display = 'block'; 
    } else {
      product.style.display = 'none';  
    }
  });
}


searchInput.addEventListener('input', filterProducts);

