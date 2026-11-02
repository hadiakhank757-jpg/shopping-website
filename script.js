let cartItems = [];

function toggleMobileMenu() {
  const navLinks = document.getElementById("navLinks");
  navLinks.classList.toggle("mobile-active");
}

function updateQty(id, change) {
  const qtyEl = document.getElementById(`qty-${id}`);
  let currentQty = parseInt(qtyEl.innerText);
  currentQty += change;
  if (currentQty < 1) currentQty = 1;
  qtyEl.innerText = currentQty;
}

function addToCart(title, price, qtyId, modalSelector) {
  const qty = parseInt(document.getElementById(qtyId).innerText);
  
  const existingItem = cartItems.find(item => item.title === title);
  if (existingItem) {
    existingItem.qty += qty;
  } else {
    cartItems.push({ title, price, qty });
  }

  const modalEl = document.querySelector(modalSelector);
  const modalInstance = bootstrap.Modal.getInstance(modalEl);
  if (modalInstance) modalInstance.hide();

  document.getElementById(qtyId).innerText = "1";
  renderCart();

  Swal.fire({
    icon: 'success',
    title: 'Added To Bag!',
    text: `${title} has been added to your shopping bag.`,
    confirmButtonColor: '#D4AF37',
    timer: 1600
  });
}

function renderCart() {
  const cartBody = document.getElementById("cartBody");
  const cartCount = document.getElementById("cart-count");
  const cartTotal = document.getElementById("cartTotal");

  let totalItemsCount = 0;
  let subtotalAmount = 0;

  if (cartItems.length === 0) {
    cartBody.innerHTML = `
      <div class="empty-cart-state text-center py-5">
        <i class="fa-solid fa-bag-shopping fa-3x mb-3 text-muted"></i>
        <p class="text-muted">Your shopping bag is currently empty.</p>
      </div>`;
  } else {
    let htmlContent = '';
    cartItems.forEach((item, index) => {
      totalItemsCount += item.qty;
      const itemTotal = item.price * item.qty;
      subtotalAmount += itemTotal;

      htmlContent += `
        <div class="cart-item d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom border-secondary">
          <div>
            <h6 class="mb-1 text-white">${item.title}</h6>
            <span class="text-gold">Rs. ${item.price.toLocaleString()} × ${item.qty} = <strong>Rs. ${itemTotal.toLocaleString()}</strong></span>
          </div>
          <button class="btn btn-sm text-danger" onclick="removeCartItem(${index})">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>`;
    });
    cartBody.innerHTML = htmlContent;
  }

  cartCount.innerText = totalItemsCount;
  cartTotal.innerText = `Rs. ${subtotalAmount.toLocaleString()}`;
}

function removeCartItem(index) {
  cartItems.splice(index, 1);
  renderCart();
}

function handleCheckout() {
  if (cartItems.length === 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Bag Empty',
      text: 'Please add items to your bag before checking out!',
      confirmButtonColor: '#D4AF37'
    });
    return;
  }

  Swal.fire({
    icon: 'success',
    title: 'Order Placed Successfully!',
    text: 'Thank you for shopping with AURA Store.',
    confirmButtonColor: '#D4AF37'
  });

  cartItems = [];
  renderCart();
  document.getElementById("cartSidebar").classList.remove("open");
  document.getElementById("cartOverlay").classList.remove("open");
}

function filterCategory(categoryName) {
  const cards = document.querySelectorAll('.product-card-item');
  cards.forEach(card => {
    const cardCat = card.getAttribute('data-category');
    if (categoryName === 'all' || cardCat === categoryName) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const openCart = document.getElementById("openCartDrawer");
  const closeCart = document.getElementById("closeCartDrawer");
  const cartSidebar = document.getElementById("cartSidebar");
  const cartOverlay = document.getElementById("cartOverlay");

  openCart.addEventListener("click", () => {
    cartSidebar.classList.add("open");
    cartOverlay.classList.add("open");
  });

  closeCart.addEventListener("click", () => {
    cartSidebar.classList.remove("open");
    cartOverlay.classList.remove("open");
  });

  cartOverlay.addEventListener("click", () => {
    cartSidebar.classList.remove("open");
    cartOverlay.classList.remove("open");
  });

  const catFilterSelect = document.getElementById("categoryFilter");
  if (catFilterSelect) {
    catFilterSelect.addEventListener("change", (e) => {
      filterCategory(e.target.value);
    });
  }

  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("keyup", function () {
      const query = this.value.toLowerCase().trim();
      const cards = document.querySelectorAll('.product-card-item');

      cards.forEach(card => {
        const titleText = card.querySelector('h5').innerText.toLowerCase();
        if (titleText.includes(query)) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }
});