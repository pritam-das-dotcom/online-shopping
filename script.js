let allProducts = []; // store all products

// Fetch products from Fake Store API
async function fetchProducts() {
  try {
    let response = await fetch("https://fakestoreapi.com/products");
    allProducts = await response.json();
    displayProducts(allProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

// Search function
function searchProducts() {
  const query = document.getElementById("searchBar").value.toLowerCase();
  const filtered = allProducts.filter(p => 
    p.title.toLowerCase().includes(query) || 
    p.category.toLowerCase().includes(query)
  );
  displayProducts(filtered);
}


// Load product details in details.html
function loadProductDetails(id) {
  const product = products.find(p => p.id == id);
  if (!product) return;

  document.getElementById("productDetails").innerHTML = `
    <h2>${product.title}</h2>
    <img src="${product.image}" alt="${product.title}" width="200">
    <p>${product.description}</p>
    <p><strong>Price:</strong> ₹${product.price}</p>
    <button onclick="addToCart(${product.id})">🛒 Add to Cart</button>
  `;
}


// Display products on Home Page
function displayProducts(products) {
  if (document.getElementById("productList")) {
    const productList = document.getElementById("productList");
    productList.innerHTML = "";
    products.forEach(product => {
      let card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <img src="${product.image}" alt="${product.title}">
        <h3>${product.title.substring(0, 25)}...</h3>
        <p>₹${(product.price * 80).toFixed(0)}</p>
        <div class="card-buttons">
          <button class="details-btn">View Details</button>
          <button class="cart-btn">Add to Cart</button>
        </div>
      `;

      // View Details button
      card.querySelector(".details-btn").onclick = () => {
        localStorage.setItem("selectedGift", JSON.stringify(product));
        window.location.href = "details.html";
      };

      // Add to Cart button
      card.querySelector(".cart-btn").onclick = () => {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart.push(product);
        localStorage.setItem("cart", JSON.stringify(cart));
        alert("Added to cart!");
        updateCartCount();
      };

      productList.appendChild(card);
    });
  }
}


// Show product details on Details Page
function displayDetails() {
  if (document.getElementById("productDetails")) {
    const product = JSON.parse(localStorage.getItem("selectedGift"));
    if (product) {
      document.getElementById("productDetails").innerHTML = `
        <div class="details-layout">
          <div class="details-img">
            <img src="${product.image}" alt="${product.title}">
          </div>
          <div class="details-info">
            <h2>${product.title}</h2>
            <p><strong>Category:</strong> ${product.category}</p>
            <p class="price">₹${(product.price * 80).toFixed(0)}</p>
            <p>${product.description}</p>

            <!-- Buttons at bottom side by side -->
            <div class="details-buttons">
              <button class="cart-btn" onclick="addToCartFromDetails()">🛒 Add to Cart</button>
              <button class="back-btn" onclick="window.location.href='index.html'">⬅ Back to Home</button>
            </div>
          </div>
        </div>
      `;
    } else {
      document.getElementById("productDetails").innerHTML = `
        <p>No product found. <a href="index.html">Go back to Home</a></p>
      `;
    }
  }
}



// Show details
function showDetails(product) {
  document.getElementById("productList").style.display = "none"; // hide home cards
  const details = document.getElementById("giftDetails");
  details.style.display = "block";

  document.getElementById("giftContent").innerHTML = `
    <h2>${product.title}</h2>
    <img src="${product.image}" alt="${product.title}">
    <p>${product.description}</p>
    <p><strong>Price:</strong> ₹${product.price}</p>
    <button onclick="addToCart(${product.id})">🛒 Add to Cart</button>
  `;
}

// Back to home
function backToHome() {
  document.getElementById("giftDetails").style.display = "none"; // hide details
  document.getElementById("productList").style.display = "flex"; // show products again
}


// Add to cart from details page
function addToCartFromDetails() {
  const product = JSON.parse(localStorage.getItem("selectedGift"));
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Added to cart!");
  updateCartCount();
}

displayDetails();


// Update cart count in navbar
function updateCartCount() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let countElement = document.getElementById("cartCount");
  if (countElement) countElement.textContent = cart.length;
}

// Run on every page load
updateCartCount();


// Contact Form
if (document.getElementById("contactForm")) {
  document.getElementById("contactForm").addEventListener("submit", e => {
    e.preventDefault();
    alert("Message sent! We will contact you soon.");
  });
}


// Show Cart Items
function displayCart() {
  if (document.getElementById("cartItems")) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartItems = document.getElementById("cartItems");
    cartItems.innerHTML = "";

    if (cart.length === 0) {
      cartItems.innerHTML = "<p>Your cart is empty.</p>";
      return;
    }

    cart.forEach((item, index) => {
      let div = document.createElement("div");
      div.className = "cart-item";
      div.innerHTML = `
        <img src="${item.image}" alt="${item.title}" width="80">
        <div class="cart-info">
          <h4>${item.title}</h4>
          <p>₹${(item.price * 80).toFixed(0)}</p>
          <button class="remove-btn" onclick="removeFromCart(${index})">❌ Remove</button>
        </div>
      `;
      cartItems.appendChild(div);
    });
  }
}

// Remove item from cart
function removeFromCart(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();
  updateCartCount();
}

// Run cart display if on cart page
displayCart();


// Load data depending on page
if (document.getElementById("productList")) fetchProducts();
if (document.getElementById("giftDetails")) displayDetails();
