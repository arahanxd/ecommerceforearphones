// Product Data
const products = [
    {
        id: 1,
        name: "Sony WH-1000XM4",
        description: "Premium noise-cancelling wireless headphones",
        price: 24999,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop"
    },
    {
        id: 2,
        name: "AirPods Pro",
        description: "Active noise cancellation with spatial audio",
        price: 17999,
        image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=500&h=500&fit=crop"
    },
    {
        id: 3,
        name: "Bose QuietComfort 45",
        description: "Comfortable noise-cancelling headphones",
        price: 22999,
        image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&h=500&fit=crop"
    },
    {
        id: 4,
        name: "Sennheiser Momentum 3",
        description: "Premium sound quality with smart features",
        price: 27999,
        image: "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&h=500&fit=crop"
    },
    {
        id: 5,
        name: "JBL Free X",
        description: "True wireless earbuds with long battery",
        price: 6999,
        image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&h=500&fit=crop"
    },
    {
        id: 6,
        name: "Beats Studio Buds",
        description: "True wireless noise cancelling earbuds",
        price: 10499,
        image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&h=500&fit=crop"
    },
    {
        id: 7,
        name: "Samsung Galaxy Buds Pro",
        description: "Intelligent active noise cancellation",
        price: 13999,
        image: "https://images.unsplash.com/photo-1599669454699-248893623440?w=500&h=500&fit=crop"
    },
    {
        id: 8,
        name: "Jabra Elite 85t",
        description: "Advanced noise cancellation technology",
        price: 15999,
        image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=500&h=500&fit=crop"
    },
];

// Initialize Storage
function initStorage() {
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([]));
    }
    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
    }
    if (!localStorage.getItem('wishlist')) {
        localStorage.setItem('wishlist', JSON.stringify([]));
    }
    if (!localStorage.getItem('currentUser')) {
        localStorage.setItem('currentUser', JSON.stringify(null));
    }
}

// User Management
function getUsers() {
    return JSON.parse(localStorage.getItem('users')) || [];
}

function saveUser(user) {
    const users = getUsers();
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
}

function setCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
}

function logout() {
    localStorage.setItem('currentUser', JSON.stringify(null));
    updateUserUI();
    if (window.location.pathname.includes('cart.html') || window.location.pathname.includes('wishlist.html')) {
        window.location.href = 'index.html';
    }
}

// Cart Management
function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function addToCart(productId, quantity = 1) {
    const cart = getCart();
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    return true;
}

function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    if (window.location.pathname.includes('cart.html')) {
        displayCart();
    }
}

function updateCartQuantity(productId, quantity) {
    if (quantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    let cart = getCart();
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = quantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        if (window.location.pathname.includes('cart.html')) {
            displayCart();
        }
    }
}

function getCartTotal() {
    const cart = getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Wishlist Management
function getWishlist() {
    return JSON.parse(localStorage.getItem('wishlist')) || [];
}

function addToWishlist(productId) {
    const wishlist = getWishlist();
    const product = products.find(p => p.id === productId);
    
    if (!product) return false;
    
    if (wishlist.find(item => item.id === productId)) {
        return false; // Already in wishlist
    }
    
    wishlist.push({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image
    });
    
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistCount();
    return true;
}

function removeFromWishlist(productId) {
    let wishlist = getWishlist();
    wishlist = wishlist.filter(item => item.id !== productId);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistCount();
    if (window.location.pathname.includes('wishlist.html')) {
        displayWishlist();
    }
}

function isInWishlist(productId) {
    const wishlist = getWishlist();
    return wishlist.some(item => item.id === productId);
}

// Update UI Counts
function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = count;
    });
}

function updateWishlistCount() {
    const wishlist = getWishlist();
    const count = wishlist.length;
    document.querySelectorAll('.wishlist-count').forEach(el => {
        el.textContent = count;
    });
}

function updateUserUI() {
    const currentUser = getCurrentUser();
    const userNameElements = document.querySelectorAll('#user-name');
    const logoutButtons = document.querySelectorAll('#logout-btn');
    const loginLinks = document.querySelectorAll('#login-link');
    
    if (currentUser) {
        userNameElements.forEach(el => {
            el.textContent = `Hello, ${currentUser.name}`;
            el.style.display = 'inline';
        });
        logoutButtons.forEach(btn => {
            btn.style.display = 'inline-block';
        });
        loginLinks.forEach(link => {
            link.style.display = 'none';
        });
    } else {
        userNameElements.forEach(el => {
            el.style.display = 'none';
        });
        logoutButtons.forEach(btn => {
            btn.style.display = 'none';
        });
        loginLinks.forEach(link => {
            link.style.display = 'inline-block';
        });
    }
}

// Display Products
function displayProducts() {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;
    
    productsGrid.innerHTML = products.map(product => {
        const inWishlist = isInWishlist(product.id);
        return `
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/500x500/667eea/ffffff?text=${encodeURIComponent(product.name)}'">
                    <div class="product-actions">
                        <button class="action-btn wishlist-btn ${inWishlist ? 'active' : ''}" 
                                onclick="toggleWishlist(${product.id})" 
                                title="Add to Wishlist">
                            <i class="fas fa-heart"></i>
                        </button>
                    </div>
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-footer">
                        <span class="product-price">₹${product.price.toLocaleString('en-IN')}</span>
                        <button class="add-to-cart-btn" onclick="handleAddToCart(${product.id})">
                            <i class="fas fa-shopping-cart"></i> Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Display Cart
function displayCart() {
    const cartItems = document.getElementById('cart-items');
    const emptyCart = document.getElementById('empty-cart');
    const cartContent = document.getElementById('cart-content');
    const cart = getCart();
    
    if (!cartItems) return;
    
    if (cart.length === 0) {
        if (emptyCart) emptyCart.style.display = 'block';
        if (cartContent) cartContent.style.display = 'none';
        return;
    }
    
    if (emptyCart) emptyCart.style.display = 'none';
    if (cartContent) cartContent.style.display = 'grid';
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/500x500/667eea/ffffff?text=${encodeURIComponent(item.name)}'">
            </div>
            <div class="cart-item-info">
                <h3 class="cart-item-name">${item.name}</h3>
                <p class="cart-item-price">₹${item.price.toLocaleString('en-IN')}</p>
                <div class="cart-item-controls">
                    <div class="quantity-control">
                        <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})">-</button>
                        <span class="quantity-value">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    </div>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">
                        <i class="fas fa-trash"></i> Remove
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    updateCartSummary();
}

function updateCartSummary() {
    const subtotal = getCartTotal();
    const shipping = subtotal > 0 ? 100 : 0;
    const total = subtotal + shipping;
    
    const subtotalEl = document.getElementById('subtotal');
    const shippingEl = document.getElementById('shipping');
    const totalEl = document.getElementById('total');
    
    if (subtotalEl) subtotalEl.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
    if (shippingEl) shippingEl.textContent = `₹${shipping.toLocaleString('en-IN')}`;
    if (totalEl) totalEl.textContent = `₹${total.toLocaleString('en-IN')}`;
}

// 6. function updateCartSummary() {
//     const subtotal = getCartTotal();
//     const shipping = subtotal > 0 ? 100 : 0;

//     let discount = 0;
//     if (subtotal > 1000) {
//         discount = subtotal * 0.10; // 10% discount
//     }

//     const total = subtotal + shipping - discount;

//     document.getElementById('subtotal').textContent = `₹${subtotal.toLocaleString('en-IN')}`;
//     document.getElementById('shipping').textContent = `₹${shipping}`;
//     document.getElementById('total').textContent = `₹${total.toLocaleString('en-IN')}`;
// }

// Display Wishlist
function displayWishlist() {
    const wishlistItems = document.getElementById('wishlist-items');
    const emptyWishlist = document.getElementById('empty-wishlist');
    const wishlistContent = document.getElementById('wishlist-content');
    const wishlist = getWishlist();
    
    if (!wishlistItems) return;
    
    if (wishlist.length === 0) {
        if (emptyWishlist) emptyWishlist.style.display = 'block';
        if (wishlistContent) wishlistContent.style.display = 'none';
        return;
    }
    
    if (emptyWishlist) emptyWishlist.style.display = 'none';
    if (wishlistContent) wishlistContent.style.display = 'block';
    
    wishlistItems.innerHTML = wishlist.map(item => `
        <div class="product-card wishlist-item">
            <div class="product-image">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/500x500/667eea/ffffff?text=${encodeURIComponent(item.name)}'">
                <div class="product-actions">
                    <button class="action-btn wishlist-btn active" 
                            onclick="removeFromWishlist(${item.id})" 
                            title="Remove from Wishlist">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
            </div>
            <div class="product-info">
                <h3 class="product-name">${item.name}</h3>
                <p class="product-description">${item.description}</p>
                <div class="product-footer">
                    <span class="product-price">₹${item.price.toLocaleString('en-IN')}</span>
                    <button class="add-to-cart-btn" onclick="handleAddToCart(${item.id})">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Event Handlers
function handleAddToCart(productId) {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        alert('Please login to add items to cart');
        window.location.href = 'login.html';
        return;
    }
    
    if (addToCart(productId)) {
        // Visual feedback
        const btn = event.target.closest('.add-to-cart-btn');
        if (btn) {
            btn.classList.add('added');
            btn.innerHTML = '<i class="fas fa-check"></i> Added!';
            setTimeout(() => {
                btn.classList.remove('added');
                btn.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
            }, 2000);
        }
    }
}

function toggleWishlist(productId) {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        alert('Please login to add items to wishlist');
        window.location.href = 'login.html';
        return;
    }
    
    if (isInWishlist(productId)) {
        removeFromWishlist(productId);
        if (!window.location.pathname.includes('wishlist.html')) {
            displayProducts();
        }
    } else {
        if (addToWishlist(productId)) {
            if (!window.location.pathname.includes('wishlist.html')) {
                displayProducts();
            }
        }
    }
}

// Authentication Handlers
function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const errorDiv = document.getElementById('login-error');
    
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        setCurrentUser(user);
        updateUserUI();
        errorDiv.classList.remove('show');
        window.location.href = 'index.html';
    } else {
        errorDiv.textContent = 'Invalid email or password';
        errorDiv.classList.add('show');
    }
}

function handleSignup(event) {
    event.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    const errorDiv = document.getElementById('signup-error');
    const successDiv = document.getElementById('signup-success');
    
    // Validation
    if (password !== confirmPassword) {
        errorDiv.textContent = 'Passwords do not match';
        errorDiv.classList.add('show');
        successDiv.classList.remove('show');
        return;
    }
    
    if (password.length < 6) {
        errorDiv.textContent = 'Password must be at least 6 characters';
        errorDiv.classList.add('show');
        successDiv.classList.remove('show');
        return;
    }
    
    const users = getUsers();
    if (users.find(u => u.email === email)) {
        errorDiv.textContent = 'Email already registered';
        errorDiv.classList.add('show');
        successDiv.classList.remove('show');
        return;
    }
    
    const newUser = {
        id: Date.now(),
        name: name,
        email: email,
        password: password
    };
    
    saveUser(newUser);
    setCurrentUser(newUser);
    updateUserUI();
    
    errorDiv.classList.remove('show');
    successDiv.textContent = 'Account created successfully! Redirecting...';
    successDiv.classList.add('show');
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

function handleCheckout() {
    const cart = getCart();
    if (cart.length === 0) {
        alert('Your cart is empty');
        return;
    }
    
    alert('Thank you for your purchase! This is a demo site, so no actual order was placed.');
    localStorage.setItem('cart', JSON.stringify([]));
    updateCartCount();
    displayCart();
}

function saveFeedback() {
    const email = document.getElementById("email").value;
    const mobile = document.getElementById("mobile").value;
    const message = document.getElementById("message").value;

    let feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];

    feedbacks.push({ email, mobile, message });

    localStorage.setItem("feedbacks", JSON.stringify(feedbacks));

    document.getElementById("thankYouMsg").innerText =
        "Feedback saved successfully!";
}

function toggleOffers()
{
    const section = document.getElementById("offersSection");
    section.style.display =
        section.style.display === "none" ? "block" : "none";
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initStorage();
    updateCartCount();
    updateWishlistCount();
    updateUserUI();
    
    // Setup logout buttons
    document.querySelectorAll('#logout-btn').forEach(btn => {
        btn.addEventListener('click', logout);
    });
    
    // Setup forms
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
    
    // Setup checkout button
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', handleCheckout);
    }
    
    // Display appropriate content based on page
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/')) {
        displayProducts();
    } else if (window.location.pathname.includes('cart.html')) {
        displayCart();
    } else if (window.location.pathname.includes('wishlist.html')) {
        displayWishlist();
    }
});

// Make functions globally available
window.handleAddToCart = handleAddToCart;
window.toggleWishlist = toggleWishlist;
window.removeFromCart = removeFromCart;
window.removeFromWishlist = removeFromWishlist;
window.updateCartQuantity = updateCartQuantity;

