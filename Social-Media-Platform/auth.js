const BASE_URL = "http://localhost:5000/api/auth";

function openModal(id) { document.getElementById(id).style.display = "flex"; }
function closeModal(id) { document.getElementById(id).style.display = "none"; }
function switchModal(id) { closeModal('loginModal'); closeModal('signupModal'); openModal(id); }

function togglePassword(inputId, icon) {
    const input = document.getElementById(inputId);
    input.type = input.type === "password" ? "text" : "password";
    icon.classList.toggle("fa-eye");
    icon.classList.toggle("fa-eye-slash");
}

// --- SIGNUP FORM ---
document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('signupUser').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPass').value;

    try {
        const response = await fetch(`${BASE_URL}/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });
        const data = await response.json();
        if (response.status === 201) {
            localStorage.setItem('user', JSON.stringify(data.user)); // Name 'user' rakha hai dashboard se match karne ke liye
            window.location.href = "dashboard.html";
        } else {
            alert(data.msg);
        }
    } catch (error) {
        alert("Server Error!");
    }
});

// --- LOGIN FORM ---
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPass').value;

    try {
        const response = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('user', JSON.stringify(data.user));
            window.location.href = "dashboard.html";
        } else {
            alert(data.msg);
        }
    } catch (error) {
        alert("Login failed!");
    }
});