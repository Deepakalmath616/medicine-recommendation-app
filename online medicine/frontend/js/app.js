// Global variables
let currentUser = null;
let authToken = localStorage.getItem('authToken');
let medicines = [];

// API Base URL
const API_BASE = '';

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();
    setupEventListeners();
    requestNotificationPermission();
});

function setupEventListeners() {
    // Add login/register functionality to existing buttons
    const getStartedBtn = document.querySelector('a[href="#features"]');
    const startFreeBtn = document.querySelector('a[href="#signup"]');
    
    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (authToken) {
                showDashboard();
            } else {
                showAuthModal();
            }
        });
    }
    
    if (startFreeBtn) {
        startFreeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showAuthModal();
        });
    }
}

function showAuthModal() {
    const modal = document.createElement('div');
    modal.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 1000; display: flex; align-items: center; justify-content: center;">
            <div style="background: white; padding: 40px; border-radius: 20px; max-width: 400px; width: 90%; color: #333;">
                <h2 style="text-align: center; margin-bottom: 30px; color: #3b82f6;">Join MediRemind</h2>
                
                <div id="authTabs" style="display: flex; margin-bottom: 30px;">
                    <button onclick="showLogin()" id="loginTab" style="flex: 1; padding: 10px; border: none; background: #3b82f6; color: white; border-radius: 5px 0 0 5px;">Login</button>
                    <button onclick="showRegister()" id="registerTab" style="flex: 1; padding: 10px; border: none; background: #e5e7eb; color: #333; border-radius: 0 5px 5px 0;">Register</button>
                </div>
                
                <div id="loginForm">
                    <input type="email" id="loginEmail" placeholder="Email" style="width: 100%; padding: 12px; margin-bottom: 15px; border: 2px solid #e5e7eb; border-radius: 8px;">
                    <input type="password" id="loginPassword" placeholder="Password" style="width: 100%; padding: 12px; margin-bottom: 20px; border: 2px solid #e5e7eb; border-radius: 8px;">
                    <button onclick="handleLogin()" style="width: 100%; padding: 15px; background: #3b82f6; color: white; border: none; border-radius: 8px; font-size: 16px;">Login</button>
                </div>
                
                <div id="registerForm" style="display: none;">
                    <input type="text" id="registerName" placeholder="Full Name" style="width: 100%; padding: 12px; margin-bottom: 15px; border: 2px solid #e5e7eb; border-radius: 8px;">
                    <input type="email" id="registerEmail" placeholder="Email" style="width: 100%; padding: 12px; margin-bottom: 15px; border: 2px solid #e5e7eb; border-radius: 8px;">
                    <input type="tel" id="registerPhone" placeholder="Phone (optional)" style="width: 100%; padding: 12px; margin-bottom: 15px; border: 2px solid #e5e7eb; border-radius: 8px;">
                    <input type="password" id="registerPassword" placeholder="Password" style="width: 100%; padding: 12px; margin-bottom: 20px; border: 2px solid #e5e7eb; border-radius: 8px;">
                    <button onclick="handleRegister()" style="width: 100%; padding: 15px; background: #3b82f6; color: white; border: none; border-radius: 8px; font-size: 16px;">Create Account</button>
                </div>
                
                <button onclick="closeAuthModal()" style="position: absolute; top: 15px; right: 20px; background: none; border: none; font-size: 24px; color: #666; cursor: pointer;">&times;</button>
            </div>
        </div>
    `;
    modal.id = 'authModal';
    document.body.appendChild(modal);
}

function showLogin() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('loginTab').style.background = '#3b82f6';
    document.getElementById('loginTab').style.color = 'white';
    document.getElementById('registerTab').style.background = '#e5e7eb';
    document.getElementById('registerTab').style.color = '#333';
}

function showRegister() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
    document.getElementById('registerTab').style.background = '#3b82f6';
    document.getElementById('registerTab').style.color = 'white';
    document.getElementById('loginTab').style.background = '#e5e7eb';
    document.getElementById('loginTab').style.color = '#333';
}

function closeAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) modal.remove();
}

async function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            authToken = data.token;
            currentUser = data.user;
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            closeAuthModal();
            showDashboard();
            showNotification(data.message, 'success');
        } else {
            showNotification(data.message, 'error');
        }
    } catch (error) {
        showNotification('Network error. Please try again.', 'error');
    }
}

async function handleRegister() {
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const phone = document.getElementById('registerPhone').value;
    const password = document.getElementById('registerPassword').value;
    
    if (!name || !email || !password) {
        showNotification('Please fill in required fields', 'error');
        return;
    }
    
    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, phone, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            authToken = data.token;
            currentUser = data.user;
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            closeAuthModal();
            showDashboard();
            showNotification(data.message, 'success');
        } else {
            showNotification(data.message, 'error');
        }
    } catch (error) {
        showNotification('Network error. Please try again.', 'error');
    }
}

function showDashboard() {
    document.body.innerHTML = `
        <div style="min-height: 100vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px;">
            <div style="max-width: 1200px; margin: 0 auto;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px;">
                    <h1>🏥 MediRemind Dashboard</h1>
                    <div>
                        <span style="margin-right: 20px;">Welcome, ${currentUser.name}!</span>
                        <button onclick="logout()" style="padding: 10px 20px; background: rgba(255,255,255,0.2); color: white; border: none; border-radius: 8px; cursor: pointer;">Logout</button>
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px;">
                    <div style="background: rgba(255,255,255,0.1); padding: 30px; border-radius: 20px; backdrop-filter: blur(10px);">
                        <h3 style="margin-bottom: 20px;">Add New Medicine</h3>
                        <input type="text" id="medicineName" placeholder="Medicine Name" style="width: 100%; padding: 12px; margin-bottom: 15px; border: none; border-radius: 8px;">
                        <input type="text" id="medicineDosage" placeholder="Dosage (e.g., 1 tablet)" style="width: 100%; padding: 12px; margin-bottom: 15px; border: none; border-radius: 8px;">
                        <input type="time" id="medicineTime" style="width: 100%; padding: 12px; margin-bottom: 15px; border: none; border-radius: 8px;">
                        <textarea id="medicineInstructions" placeholder="Instructions (optional)" style="width: 100%; padding: 12px; margin-bottom: 15px; border: none; border-radius: 8px; resize: vertical; min-height: 60px;"></textarea>
                        <button onclick="addMedicine()" style="width: 100%; padding: 15px; background: #3b82f6; color: white; border: none; border-radius: 8px; font-size: 16px; cursor: pointer;">Add Medicine</button>
                    </div>
                    
                    <div style="background: rgba(255,255,255,0.1); padding: 30px; border-radius: 20px; backdrop-filter: blur(10px);">
                        <h3 style="margin-bottom: 20px;">Your Medicines</h3>
                        <div id="medicinesList"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    loadMedicines();
}

async function addMedicine() {
    const name = document.getElementById('medicineName').value;
    const dosage = document.getElementById('medicineDosage').value;
    const time = document.getElementById('medicineTime').value;
    const instructions = document.getElementById('medicineInstructions').value;
    
    if (!name || !dosage || !time) {
        showNotification('Please fill in required fields', 'error');
        return;
    }
    
    try {
        const response = await fetch('/api/medicines', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                name,
                dosage,
                times: [time],
                instructions
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            document.getElementById('medicineName').value = '';
            document.getElementById('medicineDosage').value = '';
            document.getElementById('medicineTime').value = '';
            document.getElementById('medicineInstructions').value = '';
            
            loadMedicines();
            showNotification(data.message, 'success');
        } else {
            showNotification(data.message, 'error');
        }
    } catch (error) {
        showNotification('Network error. Please try again.', 'error');
    }
}

async function loadMedicines() {
    try {
        const response = await fetch('/api/medicines', {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        if (response.ok) {
            medicines = await response.json();
            displayMedicines();
        }
    } catch (error) {
        console.error('Error loading medicines:', error);
    }
}

function displayMedicines() {
    const container = document.getElementById('medicinesList');
    
    if (medicines.length === 0) {
        container.innerHTML = '<p style="opacity: 0.7;">No medicines added yet.</p>';
        return;
    }
    
    container.innerHTML = medicines.map(medicine => `
        <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 15px; margin-bottom: 15px;">
            <div style="display: flex; justify-content: space-between; align-items: start;">
                <div>
                    <h4 style="margin: 0 0 5px 0;">${medicine.name}</h4>
                    <p style="margin: 0 0 5px 0; opacity: 0.8;">${medicine.dosage}</p>
                    <p style="margin: 0 0 5px 0; opacity: 0.8;">⏰ ${medicine.times.join(', ')}</p>
                    ${medicine.instructions ? `<p style="margin: 0; opacity: 0.7; font-size: 14px;">${medicine.instructions}</p>` : ''}
                </div>
                <button onclick="deleteMedicine('${medicine._id}')" style="background: #ef4444; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer;">Delete</button>
            </div>
        </div>
    `).join('');
}

async function deleteMedicine(id) {
    if (!confirm('Are you sure you want to delete this medicine?')) return;
    
    try {
        const response = await fetch(`/api/medicines/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            loadMedicines();
            showNotification(data.message, 'success');
        } else {
            showNotification(data.message, 'error');
        }
    } catch (error) {
        showNotification('Network error. Please try again.', 'error');
    }
}

function logout() {
    authToken = null;
    currentUser = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    location.reload();
}

function checkAuthStatus() {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('currentUser');
    
    if (token && user) {
        authToken = token;
        currentUser = JSON.parse(user);
    }
}

function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        z-index: 3000;
        font-weight: 500;
        ${type === 'success' ? 'background: #10b981;' : type === 'error' ? 'background: #ef4444;' : 'background: #3b82f6;'}
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 4000);
}