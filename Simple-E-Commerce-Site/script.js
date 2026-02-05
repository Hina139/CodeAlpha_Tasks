
let cart = JSON.parse(localStorage.getItem('modeva_cart')) || [];


document.addEventListener('DOMContentLoaded', () => {
    updateCartUI(); 
    checkLoginStatus();

    const topToggleBtn = document.getElementById('topToggle');
    if (topToggleBtn) {
        topToggleBtn.onclick = toggleAuthForms;
    }


    if (document.getElementById('all-products')) {
        loadProducts(); 
    }
    if (document.getElementById('formal-grid') || document.getElementById('acc-grid')) {
        loadSaleProducts(); 
    }
});


function toggleAuthForms() {
    const signupForm = document.getElementById('signup-form');
    const loginForm = document.getElementById('login-form');
    const topToggleBtn = document.getElementById('topToggle');

    if (loginForm.classList.contains('hidden')) {
        loginForm.classList.remove('hidden');
        signupForm.classList.add('hidden');
        if(topToggleBtn) topToggleBtn.innerText = 'Create Account';
    } else {
        loginForm.classList.add('hidden');
        signupForm.classList.remove('hidden');
        if(topToggleBtn) topToggleBtn.innerText = 'Login';
    }
}

// User Register karne ke liye (Ab MongoDB mein save hoga)
async function registerUser() {
    const username = document.getElementById('s-user').value;
    const email = document.getElementById('s-email').value;
    const password = document.getElementById('s-pass').value;

    if (!username || !email || !password) {
        alert("Please fill all fields!");
        return;
    }

    try {
        const res = await fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });
        const data = await res.json();

        if (res.ok) {
            alert("Account Created Successfully! Now Login.");
            toggleAuthForms();
        } else {
            alert(data.message || "Registration failed.");
        }
    } catch (err) {
        alert("Server connection failed!");
    }
}

// Login User (Database se check karega)
async function loginUser() {
    const email = document.getElementById('l-email').value;
    const password = document.getElementById('l-pass').value;

    if (!email || !password) {
        alert("Please fill all fields!");
        return;
    }

    try {
        const res = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();

        if (res.ok) {
         
            const userToLogin = {
                username: data.user.username,
                email: data.user.email
            };
            localStorage.setItem('loggedInUser', JSON.stringify(userToLogin));
            
            alert("Login Successful!");
            window.location.href = "index.html"; 
        } else {
            alert(data.message || "Invalid Email or Password!");
        }
    } catch (err) {
        alert("Server connection failed!");
    }
}

function checkLoginStatus() {
    const loggedInUser = localStorage.getItem('loggedInUser');
    const homeScreen = document.getElementById('home-screen');
    const authScreen = document.getElementById('auth-screen');

    if (loggedInUser && homeScreen) {
        homeScreen.classList.remove('hidden');
        if (authScreen) authScreen.classList.add('hidden');
    }
}

// --- 3. UNIVERSAL CART LOGIC ---

function addToCart(name, price) {
    cart.push({ name, price });
    localStorage.setItem('modeva_cart', JSON.stringify(cart));
    updateCartUI();
    const sidebar = document.getElementById('cart-sidebar');
    if(sidebar) sidebar.classList.add('active');
}

function updateCartUI() {
    const list = document.getElementById('cart-items-display');
    const countBadge = document.getElementById('cart-count');
    const totalEl = document.getElementById('cart-total-price') || document.getElementById('cart-total');

    if (!list) return;

    list.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price;
        list.innerHTML += `
            <div class="cart-item-row" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; border-bottom:1px solid #eee; padding-bottom:10px;">
                <div>
                    <p style="margin:0; font-weight:600; font-size:13px;">${item.name}</p>
                    <small style="color: #b35a38;">PKR ${item.price.toLocaleString()}</small>
                </div>
                <i class="fa-solid fa-trash" style="cursor:pointer; color:#ccc; font-size:12px;" onclick="removeFromCart(${index})"></i>
            </div>`;
    });

    if (cart.length === 0) {
        list.innerHTML = '<p style="text-align:center; color:#999; margin-top:30px;">Your bag is empty.</p>';
    }

    if (countBadge) countBadge.innerText = cart.length;
    if (totalEl) totalEl.innerText = "PKR " + total.toLocaleString();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('modeva_cart', JSON.stringify(cart));
    updateCartUI();
}

function toggleCartSidebar() {
    const sidebar = document.getElementById('cart-sidebar');
    if(sidebar) sidebar.classList.toggle('active');
}

function goToCheckout() {
    if(cart.length > 0) {
        window.location.href = "index6.html";
    } else {
        alert("Your bag is empty!");
    }
}

// --- 4. DATA FETCHING ---

async function loadProducts() {
    const container = document.getElementById('all-products');
    if (!container) return;
    try {
        const res = await fetch('http://localhost:3000/api/products');
        const products = await res.json();
        
        container.innerHTML = products.map(item => `
            <div class="prod-item filter-${item.filterClass}" 
                 onclick="window.location.href='details.html?id=${item._id}'" 
                 style="cursor:pointer;">
                <div class="prod-img"><img src="${item.image}" alt="${item.name}" style="width:100%;"></div>
                <div style="padding:15px; text-align:center;">
                    <p style="font-size:10px; color:#b35a38; letter-spacing:1px; margin-bottom:5px;">${item.category.toUpperCase()}</p>
                    <h3 style="font-size:15px; margin-bottom:10px;">${item.name}</h3>
                    <p style="font-weight:600;">PKR ${item.price.toLocaleString()}</p>
                    <button class="add-to-cart-btn" onclick="event.stopPropagation(); addToCart('${item.name}', ${item.price})">
                        Add to Cart
                    </button>
                </div>
            </div>
        `).join('');
    } catch (e) { 
        container.innerHTML = "<p>Connection error...</p>";
    }
}

async function loadSaleProducts() {
    try {
        const res = await fetch('http://localhost:3000/api/products');
        const products = await res.json();
        const saleItems = products.filter(p => p.oldPrice);
        
        const formalGrid = document.getElementById('formal-grid');
        const accGrid = document.getElementById('acc-grid');

        if(formalGrid) formalGrid.innerHTML = '';
        if(accGrid) accGrid.innerHTML = '';

        saleItems.forEach(p => {
            const html = `
                <div class="card" onclick="window.location.href='details.html?id=${p._id}'" style="cursor:pointer;">
                    <div class="img-wrap"><img src="${p.image}" style="width:100%;"></div>
                    <div class="info">
                        <span style="font-size:10px; color:#b35a38;">${p.category}</span>
                        <h3>${p.name}</h3>
                        <div class="price-box">
                            <span style="text-decoration:line-through; color:#aaa; margin-right:10px; font-size:13px;">PKR ${p.oldPrice.toLocaleString()}</span>
                            <span style="font-weight:600;">PKR ${p.price.toLocaleString()}</span>
                        </div>
                        <button class="btn-add" onclick="event.stopPropagation(); addToCart('${p.name}', ${p.price})">Add to Bag</button>
                    </div>
                </div>`;
                
            if (p.filterClass === 'formal' && formalGrid) formalGrid.innerHTML += html;
            else if (p.filterClass === 'acc' && accGrid) accGrid.innerHTML += html;
        });
    } catch (e) { console.error("Sale Page Error:", e); }
}

function filterCategory(cat) {
    const items = document.querySelectorAll('.prod-item, .card');
    items.forEach(item => {
        if(cat === 'all' || item.classList.contains('filter-' + cat)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}