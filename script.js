    // Product data
    const products = [
      { id: 1, name: "Apple", price: 50, category: "fruits", store: "FreshMart", inStock: true, image: "images/apple.jpg" },
      { id: 2, name: "Banana", price: 30, category: "fruits", store: "FreshMart", inStock: true, image: "images/banana.jpg" },
      { id: 3, name: "Mango", price: 80, category: "fruits", store: "FreshMart", inStock: false, image: "images/mango.jpg" },
      { id: 4, name: "Orange", price: 60, category: "fruits", store: "FruitHaven", inStock: true, image: "images/orange.jpg" },
      { id: 5, name: "Pineapple", price: 120, category: "fruits", store: "FruitHaven", inStock: true, image: "images/pineapple.jpg" },
      { id: 6, name: "Carrot", price: 40, category: "vegetables", store: "VeggieStop", inStock: true, image: "images/carrot.jpg" },
      { id: 7, name: "Potato", price: 25, category: "vegetables", store: "VeggieStop", inStock: true, image: "images/potato.jpg" },
      { id: 8, name: "Tomato", price: 35, category: "vegetables", store: "VeggieStop", inStock: false, image: "images/tomato.jpg" },
      { id: 9, name: "Cauliflower", price: 70, category: "vegetables", store: "GreenFarm", inStock: true, image: "images/cauliflower.jpg" },
      { id: 10, name: "Spinach", price: 20, category: "vegetables", store: "GreenFarm", inStock: true, image: "images/spinach.jpg" },
      { id: 11, name: "Milk (1L)", price: 100, category: "dairy", store: "DairyHub", inStock: false, image: "images/milk.jpg" },
      { id: 12, name: "Yogurt (500g)", price: 80, category: "dairy", store: "DairyHub", inStock: true, image: "images/yogurt.jpg" },
      { id: 13, name: "Cheese (200g)", price: 150, category: "dairy", store: "DairyHub", inStock: true, image: "images/cheese.jpg" },
      { id: 14, name: "Butter (100g)", price: 90, category: "dairy", store: "MilkMart", inStock: true, image: "images/butter.jpg" },
      { id: 15, name: "Paneer (250g)", price: 120, category: "dairy", store: "MilkMart", inStock: false, image: "images/paneer.jpg" },
  ];
  
      let cart = [];
      let isLoggedIn = false;
      let users = { "user": "pass123" }; // Mock user database
  
      // Show specific section
      function showSection(sectionId) {
        document.querySelectorAll("section").forEach(section => {
          section.style.display = "none";
        });
        document.getElementById(sectionId).style.display = "block";
        if (sectionId === "home") {
          document.getElementById("home-categories").style.display = "block";
        }
        if (sectionId === "products") renderProducts();
        if (sectionId === "cart") updateCart();
        if (sectionId === "checkout" && !isLoggedIn) {
          alert("Please log in to proceed to checkout.");
          showLogin();
          showSection("cart");
        }
      }
  
      function renderProducts() {
        const grid = document.getElementById("product-grid");
        grid.innerHTML = "";
        products.forEach(product => {
            const card = document.createElement("div");
            card.className = "product-card";
            card.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>NRS ${product.price.toFixed(2)}</p>
                <p>${product.store}</p>
                <p style="color: ${product.inStock ? 'green' : 'red'}">
                    ${product.inStock ? "In Stock" : "Out of Stock"}
                </p>
                <button onclick="addToCart(${product.id})" ${!product.inStock ? 'disabled' : ''}>Add to Cart</button>
            `;
            grid.appendChild(card);
        });
    }
  
      // Add to cart with notification
      function addToCart(productId) {
        const product = products.find(p => p.id === productId);
        const existing = cart.find(item => item.id === productId);
        if (existing) existing.quantity += 1;
        else cart.push({ ...product, quantity: 1 });
        updateCart();
        showNotification(`${product.name} added to cart!`);
      }
  
      // Show notification
      function showNotification(message) {
        const notification = document.getElementById("notification");
        notification.textContent = message;
        notification.style.display = "block";
        setTimeout(() => {
          notification.style.display = "none";
        }, 2000); // Hide after 2 seconds
      }
  
      // Update cart display
      function updateCart() {
        const cartItems = document.getElementById("cart-items");
        cartItems.innerHTML = "";
        if (cart.length === 0) {
          cartItems.innerHTML = "<p>Your cart is empty.</p>";
        } else {
          cart.forEach(item => {
            const div = document.createElement("div");
            div.className = "cart-item";
            div.innerHTML = `
              <span>${item.name} - NRS ${item.price}</span>
              <div class="quantity-controls">
                <button onclick="decreaseQuantity(${item.id})">-</button>
                <input type="number" min="1" value="${item.quantity}" onchange="updateQuantity(${item.id}, this.value)">
                <button onclick="increaseQuantity(${item.id})">+</button>
              </div>
              <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
            `;
            cartItems.appendChild(div);
          });
        }
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        document.getElementById("cart-total").textContent = `Total: NRS ${total.toFixed(2)}`;
      }
  
      // Increase quantity
      function increaseQuantity(productId) {
        const item = cart.find(i => i.id === productId);
        item.quantity += 1;
        updateCart();
      }
  
      // Decrease quantity
      function decreaseQuantity(productId) {
        const item = cart.find(i => i.id === productId);
        if (item.quantity > 1) item.quantity -= 1;
        else removeFromCart(productId);
        updateCart();
      }
  
      // Update quantity manually
      function updateQuantity(productId, quantity) {
        const item = cart.find(i => i.id === productId);
        if (quantity < 1) removeFromCart(productId);
        else item.quantity = parseInt(quantity);
        updateCart();
      }
  
      // Remove from cart
      function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        updateCart();
      }
  
      function filterProducts() {
        const category = document.querySelector(".filters select:nth-child(1)").value;
        const filteredProducts = category ? products.filter(p => p.category === category) : products;
        const grid = document.getElementById("product-grid");
        grid.innerHTML = "";
        filteredProducts.forEach(product => {
            const card = document.createElement("div");
            card.className = "product-card";
            card.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>NRS ${product.price.toFixed(2)}</p>
                <p>${product.store}</p>
                <p style="color: ${product.inStock ? 'green' : 'red'}">
                    ${product.inStock ? "In Stock" : "Out of Stock"}
                </p>
                <button onclick="addToCart(${product.id})" ${!product.inStock ? 'disabled' : ''}>Add to Cart</button>
            `;
            grid.appendChild(card);
        });
    }
  
      // Sort products
      function sortProducts() {
        const sortValue = document.querySelector(".filters select:nth-child(2)").value;
        products.sort((a, b) => sortValue === "price-low" ? a.price - b.price : b.price - a.price);
        renderProducts();
      }
  
      // Show login modal
      function showLogin() {
        document.getElementById("login-modal").style.display = "flex";
        document.getElementById("register-modal").style.display = "none";
      }
  
      // Show register modal
      function showRegister() {
        document.getElementById("register-modal").style.display = "flex";
        document.getElementById("login-modal").style.display = "none";
      }
  
      // Login function
      function login() {
        const username = document.getElementById("login-username").value;
        const password = document.getElementById("login-password").value;
        if (users[username] && users[username] === password) {
          isLoggedIn = true;
          document.getElementById("login-modal").style.display = "none";
          document.getElementById("login-link").style.display = "none";
          document.getElementById("logout-link").style.display = "inline";
          alert("Login successful!");
          showSection("products");
        } else {
          alert("Invalid username or password.");
        }
      }
  
      // Register function
      function register() {
        const username = document.getElementById("register-username").value;
        const password = document.getElementById("register-password").value;
        const confirmPassword = document.getElementById("register-confirm-password").value;
  
        if (!username || !password || !confirmPassword) {
          alert("Please fill in all fields.");
          return;
        }
        if (password !== confirmPassword) {
          alert("Passwords do not match.");
          return;
        }
        if (users[username]) {
          alert("Username already exists.");
          return;
        }
  
        users[username] = password;
        document.getElementById("register-modal").style.display = "none";
        alert("Registration successful! Please log in.");
        showLogin();
      }
  
      // Logout function
      function logout() {
        isLoggedIn = false;
        cart = [];
        updateCart();
        document.getElementById("login-link").style.display = "inline";
        document.getElementById("logout-link").style.display = "none";
        showSection("home");
        alert("Logged out successfully!");
      }
  
      // Handle checkout form submission
      document.getElementById("checkout-form").addEventListener("submit", (e) => {
        e.preventDefault();
        if (!isLoggedIn) {
          alert("Please log in to complete your order.");
          showLogin();
          return;
        }
        const paymentMethod = document.getElementById("payment-method").value;
        if (!paymentMethod) {
          alert("Please select a payment method.");
          return;
        }
        let message = `Order confirmed! Payment via ${paymentMethod}. Thank you for shopping with LocalCart.`;
        if (paymentMethod === "e-sewa" || paymentMethod === "khalti") {
          message += " (Mock payment processed)";
        } else if (paymentMethod === "cash-on-delivery") {
          message += " Please have NRS " + cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2) + " ready.";
        }
        alert(message);
        cart = [];
        updateCart();
        showSection("home");
      });
  
      // Initial load
      showSection("home");