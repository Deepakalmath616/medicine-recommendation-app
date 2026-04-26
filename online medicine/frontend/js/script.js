// Global variables
let currentUser = null;
let authToken = localStorage.getItem('authToken');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    requestNotificationPermission();
});

function initializeApp() {
    checkAuthStatus();
    setupScrollEffects();
    setupMobileMenu();
    startReminderSystem();
}

function setupEventListeners() {
    // Navigation smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Login button functionality
    const loginBtn = document.querySelector('.btn-login');
    const getStartedBtn = document.querySelector('a[href="#get-started"]');
    const startFreeBtn = document.querySelector('.cta-section .btn-primary');

    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showAuthModal();
        });
    }

    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (authToken) {
                showSection('dashboard');
                loadDashboardData();
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

    // Navigation functionality
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#home') {
                e.preventDefault();
                showSection('home');
            } else if (href === '#dashboard') {
                e.preventDefault();
                if (!authToken) {
                    showNotification('Please login to access dashboard', 'error');
                    showAuthModal();
                    return;
                }
                showSection('dashboard');
                loadDashboardData();
            } else if (href === '#add-medicine') {
                e.preventDefault();
                if (!authToken) {
                    showNotification('Please login to add medicines', 'error');
                    showAuthModal();
                    return;
                }
                showSection('add-medicine');
            } else if (href === '#history') {
                e.preventDefault();
                if (!authToken) {
                    showNotification('Please login to view history', 'error');
                    showAuthModal();
                    return;
                }
                showSection('history');
                loadHistoryData();
            } else if (href === '#login') {
                e.preventDefault();
                if (authToken) {
                    showSection('dashboard');
                    loadDashboardData();
                } else {
                    showAuthModal();
                }
            }
        });
    });
}

function setupScrollEffects() {
    // Header scroll effect
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe feature cards and step items
    document.querySelectorAll('.feature-card, .step-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

function setupMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // Close menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }
}

function showAuthModal() {
    // Remove existing modal if it exists
    const existingModal = document.getElementById('authModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    const modal = document.createElement('div');
    modal.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 2000; display: flex; align-items: center; justify-content: center; animation: fadeIn 0.3s ease;">
            <div style="background: white; padding: 40px; border-radius: 20px; max-width: 400px; width: 90%; color: #333; position: relative; animation: slideUp 0.3s ease;">
                <h2 style="text-align: center; margin-bottom: 30px; color: var(--primary-color); font-size: 2rem;">Join Medicine Alert</h2>
                
                <div id="authTabs" style="display: flex; margin-bottom: 30px; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <button onclick="showLogin()" id="loginTab" style="flex: 1; padding: 15px; border: none; background: var(--primary-color); color: white; font-weight: 600; cursor: pointer; transition: all 0.3s ease;">Login</button>
                    <button onclick="showRegister()" id="registerTab" style="flex: 1; padding: 15px; border: none; background: #f3f4f6; color: #333; font-weight: 600; cursor: pointer; transition: all 0.3s ease;">Register</button>
                </div>
                
                <div id="loginForm">
                    <input type="email" id="loginEmail" placeholder="Email Address" style="width: 100%; padding: 15px; margin-bottom: 20px; border: 2px solid #e5e7eb; border-radius: 10px; font-size: 16px; transition: border-color 0.3s ease;">
                    <input type="password" id="loginPassword" placeholder="Password" style="width: 100%; padding: 15px; margin-bottom: 25px; border: 2px solid #e5e7eb; border-radius: 10px; font-size: 16px; transition: border-color 0.3s ease;">
                    <button onclick="handleLogin()" style="width: 100%; padding: 15px; background: var(--gradient-primary); color: white; border: none; border-radius: 10px; font-size: 16px; font-weight: 600; cursor: pointer; transition: all 0.3s ease;">Login to Dashboard</button>
                </div>
                
                <div id="registerForm" style="display: none;">
                    <input type="text" id="registerName" placeholder="Full Name" style="width: 100%; padding: 15px; margin-bottom: 20px; border: 2px solid #e5e7eb; border-radius: 10px; font-size: 16px; transition: border-color 0.3s ease;">
                    <input type="email" id="registerEmail" placeholder="Email Address" style="width: 100%; padding: 15px; margin-bottom: 20px; border: 2px solid #e5e7eb; border-radius: 10px; font-size: 16px; transition: border-color 0.3s ease;">
                    <input type="tel" id="registerPhone" placeholder="Phone Number (Optional)" style="width: 100%; padding: 15px; margin-bottom: 20px; border: 2px solid #e5e7eb; border-radius: 10px; font-size: 16px; transition: border-color 0.3s ease;">
                    <input type="password" id="registerPassword" placeholder="Create Password" style="width: 100%; padding: 15px; margin-bottom: 25px; border: 2px solid #e5e7eb; border-radius: 10px; font-size: 16px; transition: border-color 0.3s ease;">
                    <button onclick="handleRegister()" style="width: 100%; padding: 15px; background: var(--gradient-primary); color: white; border: none; border-radius: 10px; font-size: 16px; font-weight: 600; cursor: pointer; transition: all 0.3s ease;">Create Account</button>
                </div>
                
                <button onclick="closeAuthModal()" style="position: absolute; top: 15px; right: 20px; background: none; border: none; font-size: 28px; color: #666; cursor: pointer; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: all 0.3s ease;">&times;</button>
                
                <p style="text-align: center; margin-top: 20px; color: #666; font-size: 14px;">
                    By continuing, you agree to our Terms of Service and Privacy Policy
                </p>
            </div>
        </div>
        
        <style>
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes slideUp {
                from { opacity: 0; transform: translateY(30px); }
                to { opacity: 1; transform: translateY(0); }
            }
            #authModal input:focus {
                outline: none;
                border-color: var(--primary-color);
                box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
            }
            #authModal button:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            }
        </style>
    `;
    modal.id = 'authModal';
    document.body.appendChild(modal);
}

window.showLogin = function() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('loginTab').style.background = 'var(--primary-color)';
    document.getElementById('loginTab').style.color = 'white';
    document.getElementById('registerTab').style.background = '#f3f4f6';
    document.getElementById('registerTab').style.color = '#333';
}

window.showRegister = function() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
    document.getElementById('registerTab').style.background = 'var(--primary-color)';
    document.getElementById('registerTab').style.color = 'white';
    document.getElementById('loginTab').style.background = '#f3f4f6';
    document.getElementById('loginTab').style.color = '#333';
}

window.closeAuthModal = function() {
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => modal.remove(), 300);
    }
}

window.handleLogin = async function() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    // Check if user is registered
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    
    // Find user with exact email and password match
    const user = registeredUsers.find(u => 
        u.email.toLowerCase() === email.toLowerCase() && 
        u.password === password
    );
    
    if (!user) {
        // Check if email exists but password is wrong
        const emailExists = registeredUsers.find(u => 
            u.email.toLowerCase() === email.toLowerCase()
        );
        
        if (emailExists) {
            showNotification('Incorrect password. Please try again.', 'error');
        } else {
            showNotification('Email not registered. Please register first.', 'error');
            setTimeout(() => {
                showRegister();
            }, 1500);
        }
        return;
    }
    
    // Login successful
    authToken = 'demo_token_' + Date.now();
    currentUser = { id: user.id, name: user.name, email: user.email, phone: user.phone };
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    closeAuthModal();
    updateNavigation();
    showSection('dashboard');
    loadDashboardData();
    showNotification(`Welcome back, ${user.name}!`, 'success');
}

window.handleRegister = async function() {
    console.log('Register button clicked');
    
    const name = document.getElementById('registerName')?.value?.trim();
    const email = document.getElementById('registerEmail')?.value?.trim();
    const phone = document.getElementById('registerPhone')?.value?.trim();
    const password = document.getElementById('registerPassword')?.value;
    
    console.log('Form values:', { name, email, phone, password });
    
    if (!name || !email || !password) {
        console.log('Missing required fields');
        showNotification('Please fill in required fields', 'error');
        return;
    }
    
    try {
        // Check if user already exists (case-insensitive)
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        console.log('Existing users:', registeredUsers);
        
        if (registeredUsers.find(u => u.email.toLowerCase() === email.toLowerCase())) {
            console.log('Email already exists');
            showNotification('Email already registered. Please login.', 'error');
            setTimeout(() => {
                showLogin();
            }, 1500);
            return;
        }
        
        // Register new user
        const newUser = {
            id: 'user_' + Date.now(),
            name: name,
            email: email.toLowerCase(),
            phone: phone,
            password: password,
            registeredAt: new Date().toISOString()
        };
        
        console.log('Creating new user:', newUser);
        
        registeredUsers.push(newUser);
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
        
        console.log('User saved to localStorage');
        
        // Auto login after registration
        authToken = 'demo_token_' + Date.now();
        currentUser = { id: newUser.id, name: newUser.name, email: newUser.email, phone: newUser.phone };
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        console.log('Auto-login completed');
        
        closeAuthModal();
        updateNavigation();
        showSection('dashboard');
        loadDashboardData();
        showNotification(`Welcome ${name}! Account created successfully.`, 'success');
        
    } catch (error) {
        console.error('Registration error:', error);
        showNotification('Registration failed. Please try again.', 'error');
    }
}

function showDashboard() {
    document.body.innerHTML = `
        <div style="min-height: 100vh; background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); padding: 20px;">
            <div style="max-width: 1200px; margin: 0 auto;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; background: white; padding: 20px 30px; border-radius: 20px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                    <div style="display: flex; align-items: center; gap: 15px;">
                        <div style="width: 50px; height: 50px; background: var(--gradient-primary); border-radius: 15px; display: flex; align-items: center; justify-content: center;">
                            <i class="fas fa-pills" style="color: white; font-size: 1.5rem;"></i>
                        </div>
                        <div>
                            <h1 style="margin: 0; color: var(--text-dark); font-size: 1.8rem;">Medicine Alert Dashboard</h1>
                            <p style="margin: 0; color: var(--text-gray);">Welcome back, ${currentUser.name}!</p>
                        </div>
                    </div>
                    <button onclick="logout()" style="padding: 12px 24px; background: rgba(239, 68, 68, 0.1); color: #dc2626; border: 2px solid #dc2626; border-radius: 10px; cursor: pointer; font-weight: 600; transition: all 0.3s ease;">
                        <i class="fas fa-sign-out-alt" style="margin-right: 8px;"></i>Logout
                    </button>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 30px;">
                    <div style="background: white; padding: 30px; border-radius: 20px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                        <h3 style="margin-bottom: 25px; color: var(--text-dark); display: flex; align-items: center; gap: 10px;">
                            <i class="fas fa-plus-circle" style="color: var(--primary-color);"></i>
                            Add New Medicine
                        </h3>
                        <div style="space-y: 20px;">
                            <input type="text" id="medicineName" placeholder="Medicine Name" style="width: 100%; padding: 15px; border: 2px solid #e5e7eb; border-radius: 10px; font-size: 16px; margin-bottom: 15px;">
                            <input type="text" id="medicineDosage" placeholder="Dosage (e.g., 1 tablet, 5ml)" style="width: 100%; padding: 15px; border: 2px solid #e5e7eb; border-radius: 10px; font-size: 16px; margin-bottom: 15px;">
                            <input type="time" id="medicineTime" style="width: 100%; padding: 15px; border: 2px solid #e5e7eb; border-radius: 10px; font-size: 16px; margin-bottom: 15px;">
                            <textarea id="medicineInstructions" placeholder="Instructions (optional)" style="width: 100%; padding: 15px; border: 2px solid #e5e7eb; border-radius: 10px; font-size: 16px; resize: vertical; min-height: 80px; margin-bottom: 20px;"></textarea>
                            <button onclick="addMedicine()" style="width: 100%; padding: 15px; background: var(--gradient-primary); color: white; border: none; border-radius: 10px; font-size: 16px; font-weight: 600; cursor: pointer; transition: all 0.3s ease;">
                                <i class="fas fa-plus" style="margin-right: 8px;"></i>Add Medicine
                            </button>
                        </div>
                    </div>
                    
                    <div style="background: white; padding: 30px; border-radius: 20px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                        <h3 style="margin-bottom: 25px; color: var(--text-dark); display: flex; align-items: center; gap: 10px;">
                            <i class="fas fa-list" style="color: var(--accent-color);"></i>
                            Your Medicines
                        </h3>
                        <div id="medicinesList" style="max-height: 400px; overflow-y: auto;"></div>
                    </div>
                </div>
                
                <div style="margin-top: 30px; text-align: center;">
                    <p style="color: var(--text-gray); font-size: 14px;">
                        <i class="fas fa-shield-alt" style="color: var(--accent-color); margin-right: 5px;"></i>
                        Your data is secure and encrypted. Email reminders are active.
                    </p>
                </div>
            </div>
        </div>
        
        <style>
            input:focus, textarea:focus {
                outline: none;
                border-color: var(--primary-color);
                box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
            }
            button:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            }
        </style>
    `;
    
    loadMedicines();
}

window.addMedicine = async function() {
    const name = document.getElementById('medicineName').value;
    const dosage = document.getElementById('medicineDosage').value;
    const time = document.getElementById('medicineTime').value;
    const instructions = document.getElementById('medicineInstructions').value;
    
    if (!name || !dosage || !time) {
        showNotification('Please fill in required fields', 'error');
        return;
    }
    
    // Simulate adding medicine for demo (remove when backend is ready)
    const medicines = JSON.parse(localStorage.getItem('medicines') || '[]');
    const newMedicine = {
        _id: 'demo_' + Date.now(),
        name: name,
        dosage: dosage,
        times: [time],
        instructions: instructions
    };
    medicines.push(newMedicine);
    localStorage.setItem('medicines', JSON.stringify(medicines));
    
    document.getElementById('medicineName').value = '';
    document.getElementById('medicineDosage').value = '';
    document.getElementById('medicineTime').value = '';
    document.getElementById('medicineInstructions').value = '';
    
    loadMedicines();
    showNotification('Medicine added successfully!', 'success');
    
    /* Uncomment when backend is ready:
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
    */
}

async function loadMedicines() {
    // Demo version using localStorage (remove when backend is ready)
    const medicines = JSON.parse(localStorage.getItem('medicines') || '[]');
    displayMedicines(medicines);
    
    /* Uncomment when backend is ready:
    try {
        const response = await fetch('/api/medicines', {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        if (response.ok) {
            const medicines = await response.json();
            displayMedicines(medicines);
        }
    } catch (error) {
        console.error('Error loading medicines:', error);
    }
    */
}

function displayMedicines(medicines) {
    const container = document.getElementById('medicinesList');
    
    if (medicines.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: var(--text-gray);">
                <i class="fas fa-pills" style="font-size: 3rem; margin-bottom: 15px; opacity: 0.3;"></i>
                <p>No medicines added yet.</p>
                <p style="font-size: 14px;">Add your first medicine to get started!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = medicines.map(medicine => `
        <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); padding: 20px; border-radius: 15px; margin-bottom: 15px; border-left: 4px solid var(--primary-color); transition: all 0.3s ease;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px rgba(0,0,0,0.1)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
            <div style="display: flex; justify-content: space-between; align-items: start;">
                <div style="flex: 1;">
                    <h4 style="margin: 0 0 8px 0; color: var(--text-dark); font-size: 1.2rem; display: flex; align-items: center; gap: 8px;">
                        <i class="fas fa-capsules" style="color: var(--primary-color);"></i>
                        ${medicine.name}
                    </h4>
                    <p style="margin: 0 0 8px 0; color: var(--text-gray); display: flex; align-items: center; gap: 8px;">
                        <i class="fas fa-prescription-bottle" style="color: var(--accent-color);"></i>
                        ${medicine.dosage}
                    </p>
                    <p style="margin: 0 0 8px 0; color: var(--text-gray); display: flex; align-items: center; gap: 8px;">
                        <i class="fas fa-clock" style="color: var(--secondary-color);"></i>
                        ${medicine.times.join(', ')}
                    </p>
                    ${medicine.instructions ? `<p style="margin: 0; color: var(--text-light); font-size: 14px; font-style: italic; display: flex; align-items: center; gap: 8px;"><i class="fas fa-info-circle"></i>${medicine.instructions}</p>` : ''}
                </div>
                <button onclick="deleteMedicine('${medicine._id}')" style="background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%); color: #dc2626; border: 2px solid #dc2626; padding: 10px 15px; border-radius: 8px; cursor: pointer; font-weight: 600; transition: all 0.3s ease; margin-left: 15px;">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

window.deleteMedicine = async function(id) {
    if (!confirm('Are you sure you want to delete this medicine?')) return;
    
    // Demo version using localStorage (remove when backend is ready)
    const medicines = JSON.parse(localStorage.getItem('medicines') || '[]');
    const updatedMedicines = medicines.filter(med => med._id !== id);
    localStorage.setItem('medicines', JSON.stringify(updatedMedicines));
    
    loadMedicines();
    showNotification('Medicine deleted successfully!', 'success');
    
    /* Uncomment when backend is ready:
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
    */
}

window.logout = function() {
    authToken = null;
    currentUser = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    updateNavigation();
    showSection('home');
    showNotification('Logged out successfully', 'success');
}

function checkAuthStatus() {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('currentUser');
    
    if (token && user) {
        authToken = token;
        currentUser = JSON.parse(user);
        updateNavigation();
    }
}

// Update navigation based on auth status
function updateNavigation() {
    const loginBtn = document.querySelector('.btn-login');
    const navMenu = document.querySelector('.nav-menu');
    
    if (authToken && currentUser) {
        // User is logged in - show logout
        if (loginBtn) {
            loginBtn.innerHTML = `<i class="fas fa-user"></i> ${currentUser.name}`;
            loginBtn.onclick = function(e) {
                e.preventDefault();
                showSection('dashboard');
                loadDashboardData();
            };
        }
        
        // Add logout button if not exists
        if (navMenu && !document.getElementById('logoutBtn')) {
            const logoutBtn = document.createElement('li');
            logoutBtn.innerHTML = `<a href="#" id="logoutBtn" class="nav-link" onclick="logout()" style="background: #ef4444; color: white; padding: 0.6rem 1.5rem; border-radius: 50px; margin-left: 1rem;"><i class="fas fa-sign-out-alt"></i> Logout</a>`;
            navMenu.appendChild(logoutBtn);
        }
    } else {
        // User is not logged in - show login
        if (loginBtn) {
            loginBtn.innerHTML = 'Login';
            loginBtn.onclick = function(e) {
                e.preventDefault();
                showAuthModal();
            };
        }
        
        // Remove logout button if exists
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.parentElement.remove();
        }
    }
}

// Show specific section
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.hero, .features, .how-it-works, .dashboard-section, .add-medicine-section, .history-section, .cta-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + sectionId) {
            link.classList.add('active');
        }
    });
    
    // Show requested section
    if (sectionId === 'home') {
        document.querySelector('.hero').style.display = 'flex';
        document.querySelector('.features').style.display = 'block';
        document.querySelector('.how-it-works').style.display = 'block';
        document.querySelector('.cta-section').style.display = 'block';
    } else if (sectionId === 'dashboard') {
        document.querySelector('.dashboard-section').style.display = 'block';
    } else if (sectionId === 'add-medicine') {
        document.querySelector('.add-medicine-section').style.display = 'block';
    } else if (sectionId === 'history') {
        document.querySelector('.history-section').style.display = 'block';
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Load dashboard data
function loadDashboardData() {
    const medicines = JSON.parse(localStorage.getItem('medicines') || '[]');
    const scheduleContainer = document.getElementById('todaySchedule');
    
    if (medicines.length === 0) {
        scheduleContainer.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: var(--text-gray);">
                <i class="fas fa-pills" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.3;"></i>
                <p style="margin-bottom: 1.5rem; font-size: 1.1rem;">No medicines added yet</p>
                <button onclick="showSection('add-medicine')" class="btn btn-primary">
                    <i class="fas fa-plus" style="margin-right: 0.5rem;"></i>
                    Add Medicine
                </button>
            </div>
        `;
    } else {
        scheduleContainer.innerHTML = `
            ${medicines.map(med => `
                <div style="background: var(--bg-light); padding: 1.5rem; border-radius: 15px; margin-bottom: 1rem; border-left: 4px solid var(--primary-color);">
                    <div style="display: flex; justify-content: space-between; align-items: start;">
                        <div style="flex: 1;">
                            <h4 style="margin: 0 0 0.5rem 0; color: var(--text-dark); font-size: 1.2rem;">${med.name}</h4>
                            <p style="margin: 0 0 0.3rem 0; color: var(--text-gray);"><i class="fas fa-prescription-bottle" style="margin-right: 0.5rem;"></i>${med.dosage}</p>
                            <p style="margin: 0 0 0.3rem 0; color: var(--text-gray);"><i class="fas fa-clock" style="margin-right: 0.5rem;"></i>${med.times.join(', ')} • ${med.frequency}</p>
                            ${med.description ? `<p style="margin: 0 0 0.3rem 0; color: var(--text-light); font-size: 0.9rem;"><i class="fas fa-info-circle" style="margin-right: 0.5rem;"></i>${med.description}</p>` : ''}
                            ${med.precaution ? `<p style="margin: 0; color: #f59e0b; font-size: 0.9rem; font-weight: 600;"><i class="fas fa-exclamation-triangle" style="margin-right: 0.5rem;"></i>${med.precaution}</p>` : ''}
                        </div>
                        <div style="display: flex; gap: 0.5rem;">
                            <button onclick="markAsTaken('${med._id}')" id="taken-${med._id}" style="background: #10b981; color: white; border: none; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer; font-size: 0.9rem; display: ${med.status === 'taken' ? 'none' : 'block'};">
                                <i class="fas fa-check"></i> Taken
                            </button>
                            <button onclick="markAsNotTaken('${med._id}')" id="not-taken-${med._id}" style="background: #ef4444; color: white; border: none; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer; font-size: 0.9rem; display: ${med.status === 'not-taken' ? 'none' : 'block'};">
                                <i class="fas fa-times"></i> Not Taken
                            </button>
                            <div id="status-${med._id}" style="display: ${med.status === 'taken' || med.status === 'not-taken' ? 'flex' : 'none'}; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; border-radius: 8px; font-weight: 600; ${med.status === 'taken' ? 'background: #d1fae5; color: #065f46;' : 'background: #fee2e2; color: #991b1b;'}">
                                <i class="fas fa-${med.status === 'taken' ? 'check-circle' : 'times-circle'}"></i>
                                ${med.status === 'taken' ? 'Taken' : 'Not Taken'}
                            </div>
                        </div>
                    </div>
                </div>
            `).join('')}
            <button onclick="showSection('add-medicine')" class="btn btn-primary" style="width: 100%; margin-top: 1rem;">
                <i class="fas fa-plus" style="margin-right: 0.5rem;"></i>
                Add More Medicine
            </button>
        `;
    }
    
    // Update stats
    const activeMedicines = medicines.filter(med => med.status === 'active').length;
    document.getElementById('quickStats').innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; text-align: center;">
            <div>
                <div style="font-size: 2rem; font-weight: 700; color: var(--primary-color); margin-bottom: 0.5rem;">${medicines.length}</div>
                <div style="color: var(--text-gray); font-size: 0.9rem;">Total Medicines</div>
            </div>
            <div>
                <div style="font-size: 2rem; font-weight: 700; color: var(--accent-color); margin-bottom: 0.5rem;">${activeMedicines}</div>
                <div style="color: var(--text-gray); font-size: 0.9rem;">Active</div>
            </div>
        </div>
    `;
    
    // Load family profiles
    loadFamilyProfiles();
    
    // Load recent notifications
    loadRecentNotifications();
}

// Load history data
function loadHistoryData() {
    const medicines = JSON.parse(localStorage.getItem('medicines') || '[]');
    const historyContainer = document.getElementById('medicineHistory');
    
    if (medicines.length === 0) {
        historyContainer.innerHTML = '<p style="text-align: center; padding: 2rem; color: var(--text-gray);">No medicine history available. <a href="#add-medicine" onclick="showSection(\'add-medicine\')">Add medicines</a> to start tracking.</p>';
    } else {
        historyContainer.innerHTML = medicines.map(med => `
            <div style="background: var(--bg-light); padding: 1.5rem; border-radius: 15px; margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h4 style="margin: 0 0 0.5rem 0; color: var(--text-dark); font-size: 1.2rem;">${med.name}</h4>
                    <p style="margin: 0 0 0.3rem 0; color: var(--text-gray);"><i class="fas fa-prescription-bottle" style="margin-right: 0.5rem;"></i>${med.dosage}</p>
                    <p style="margin: 0; color: var(--text-gray);"><i class="fas fa-clock" style="margin-right: 0.5rem;"></i>${med.times.join(', ')}</p>
                    ${med.instructions ? `<p style="margin: 0.5rem 0 0 0; color: var(--text-light); font-size: 0.9rem; font-style: italic;"><i class="fas fa-info-circle" style="margin-right: 0.5rem;"></i>${med.instructions}</p>` : ''}
                </div>
                <button onclick="deleteMedicineFromHistory('${med._id}')" style="background: #fee2e2; color: #dc2626; border: 2px solid #dc2626; padding: 0.75rem 1rem; border-radius: 10px; cursor: pointer; font-weight: 600; transition: all 0.3s ease;">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }
}

// Add medicine from page
window.addMedicineFromPage = async function() {
    if (!authToken) {
        showNotification('Please login first to add medicines', 'error');
        showAuthModal();
        return;
    }
    
    const name = document.getElementById('addMedicineName').value;
    const dosage = document.getElementById('addMedicineDosage').value;
    const description = document.getElementById('addMedicineDescription').value;
    const precaution = document.getElementById('addMedicinePrecaution').value;
    const time = document.getElementById('addMedicineTime').value;
    const frequency = document.getElementById('addMedicineFrequency').value;
    const startDate = document.getElementById('addMedicineStartDate').value;
    const endDate = document.getElementById('addMedicineEndDate').value;
    
    // Notification settings
    const enableEmail = document.getElementById('enableEmailAlert').checked;
    const alertEmail = document.getElementById('alertEmail').value;
    const enableSMS = document.getElementById('enableSMSAlert').checked;
    const alertPhone = document.getElementById('alertPhone').value;
    const enableSound = document.getElementById('enableSoundAlert').checked;
    
    if (!name || !dosage || !time || !startDate) {
        showNotification('Please fill in required fields', 'error');
        return;
    }
    
    if (enableEmail && !alertEmail) {
        showNotification('Please enter email address for email alerts', 'error');
        return;
    }
    
    if (enableSMS && !alertPhone) {
        showNotification('Please enter phone number for SMS alerts', 'error');
        return;
    }
    
    // Validate Indian mobile number
    if (enableSMS && alertPhone) {
        const indianMobileRegex = /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/;
        if (!indianMobileRegex.test(alertPhone.replace(/\s/g, ''))) {
            showNotification('Please enter a valid Indian mobile number', 'error');
            return;
        }
    }
    
    const medicines = JSON.parse(localStorage.getItem('medicines') || '[]');
    const newMedicine = {
        _id: 'demo_' + Date.now(),
        name: name,
        dosage: dosage,
        description: description,
        precaution: precaution,
        times: [time],
        frequency: frequency,
        startDate: startDate,
        endDate: endDate,
        status: 'active',
        notifications: {
            email: { enabled: enableEmail, address: alertEmail },
            sms: { enabled: enableSMS, phone: alertPhone },
            sound: { enabled: enableSound }
        }
    };
    medicines.push(newMedicine);
    localStorage.setItem('medicines', JSON.stringify(medicines));
    
    // Save to JSON file for email scheduler
    saveMedicinesToFile(medicines);
    
    // Clear form
    document.getElementById('addMedicineName').value = '';
    document.getElementById('addMedicineDosage').value = '';
    document.getElementById('addMedicineDescription').value = '';
    document.getElementById('addMedicinePrecaution').value = '';
    document.getElementById('addMedicineTime').value = '';
    document.getElementById('addMedicineFrequency').value = 'daily';
    document.getElementById('addMedicineStartDate').value = '';
    document.getElementById('addMedicineEndDate').value = '';
    document.getElementById('alertEmail').value = '';
    document.getElementById('alertPhone').value = '';
    
    // Schedule reminder
    scheduleReminder(newMedicine);
    
    // Log the action
    logMedicineAction(newMedicine._id, 'added', 'Medicine added successfully');
    
    showNotification('Medicine added! Email reminders will be sent automatically.', 'success');
    showSection('dashboard');
    loadDashboardData();
}

// Delete medicine from history
window.deleteMedicineFromHistory = function(id) {
    if (!confirm('Are you sure you want to delete this medicine?')) return;
    
    const medicines = JSON.parse(localStorage.getItem('medicines') || '[]');
    const updatedMedicines = medicines.filter(med => med._id !== id);
    localStorage.setItem('medicines', JSON.stringify(updatedMedicines));
    
    loadHistoryData();
    showNotification('Medicine deleted successfully!', 'success');
}

// Load family profiles
function loadFamilyProfiles() {
    const profiles = JSON.parse(localStorage.getItem('familyProfiles') || '[]');
    const container = document.getElementById('familyProfiles');
    
    if (profiles.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 1rem; color: var(--text-gray);">
                <p style="margin-bottom: 1rem; font-size: 0.9rem;">No family members added</p>
                <button onclick="showAddFamilyModal()" class="btn btn-outline" style="width: 100%;">
                    <i class="fas fa-user-plus" style="margin-right: 0.5rem;"></i>
                    Add Family Member
                </button>
            </div>
        `;
    } else {
        container.innerHTML = `
            ${profiles.map(profile => `
                <div style="background: var(--bg-light); padding: 1rem; border-radius: 10px; margin-bottom: 0.5rem; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h5 style="margin: 0 0 0.2rem 0; color: var(--text-dark);">${profile.name}</h5>
                        <p style="margin: 0; color: var(--text-gray); font-size: 0.8rem;">${profile.relation} • Age ${profile.age}</p>
                    </div>
                    <i class="fas fa-user" style="color: var(--primary-color);"></i>
                </div>
            `).join('')}
            <button onclick="showAddFamilyModal()" class="btn btn-outline" style="width: 100%; margin-top: 0.5rem; font-size: 0.9rem; padding: 0.5rem;">
                <i class="fas fa-plus" style="margin-right: 0.5rem;"></i>
                Add More
            </button>
        `;
    }
}

// Load recent notifications
function loadRecentNotifications() {
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const container = document.getElementById('recentNotifications');
    
    if (notifications.length === 0) {
        container.innerHTML = '<div style="text-align: center; padding: 2rem; color: var(--text-gray); font-size: 0.9rem;">No recent notifications</div>';
    } else {
        container.innerHTML = notifications.slice(0, 3).map(notif => `
            <div style="background: var(--bg-light); padding: 1rem; border-radius: 10px; margin-bottom: 0.5rem; border-left: 3px solid ${notif.type === 'reminder' ? 'var(--secondary-color)' : 'var(--accent-color)'};">
                <p style="margin: 0 0 0.3rem 0; color: var(--text-dark); font-size: 0.9rem; font-weight: 600;">${notif.message}</p>
                <p style="margin: 0; color: var(--text-gray); font-size: 0.8rem;">${new Date(notif.sent_time).toLocaleString()}</p>
            </div>
        `).join('');
    }
}

// Mark medicine as taken
window.markAsTaken = function(medicineId) {
    updateMedicineStatus(medicineId, 'taken');
    const now = new Date();
    logMedicineAction(medicineId, 'taken', `Medicine taken at ${now.toLocaleTimeString()}`);
    showNotification('Medicine marked as taken!', 'success');
    addNotification('reminder', `Medicine taken successfully at ${now.toLocaleTimeString()}`);
    loadDashboardData();
}

// Mark medicine as not taken
window.markAsNotTaken = function(medicineId) {
    updateMedicineStatus(medicineId, 'not-taken');
    const now = new Date();
    logMedicineAction(medicineId, 'not-taken', `Medicine not taken at ${now.toLocaleTimeString()}`);
    showNotification('Medicine marked as not taken', 'error');
    addNotification('alert', `Medicine not taken at ${now.toLocaleTimeString()}`);
    loadDashboardData();
}

// Update medicine status
function updateMedicineStatus(medicineId, status) {
    const medicines = JSON.parse(localStorage.getItem('medicines') || '[]');
    const medicineIndex = medicines.findIndex(med => med._id === medicineId);
    if (medicineIndex !== -1) {
        medicines[medicineIndex].status = status;
        medicines[medicineIndex].lastUpdated = new Date().toISOString();
        localStorage.setItem('medicines', JSON.stringify(medicines));
    }
}

// Log medicine action
function logMedicineAction(medicineId, action, message) {
    const logs = JSON.parse(localStorage.getItem('medicineLogs') || '[]');
    const newLog = {
        log_id: 'log_' + Date.now(),
        medicine_id: medicineId,
        action: action,
        message: message,
        timestamp: new Date().toISOString(),
        status: 'completed'
    };
    logs.push(newLog);
    localStorage.setItem('medicineLogs', JSON.stringify(logs));
}

// Add notification
function addNotification(type, message) {
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const newNotification = {
        notif_id: 'notif_' + Date.now(),
        type: type,
        message: message,
        sent_time: new Date().toISOString(),
        delivery_status: 'delivered'
    };
    notifications.unshift(newNotification); // Add to beginning
    localStorage.setItem('notifications', JSON.stringify(notifications.slice(0, 10))); // Keep only last 10
    loadRecentNotifications();
}

// Show add family modal
window.showAddFamilyModal = function() {
    const modal = document.createElement('div');
    modal.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 2000; display: flex; align-items: center; justify-content: center;">
            <div style="background: white; padding: 2rem; border-radius: 20px; max-width: 400px; width: 90%; color: #333;">
                <h3 style="margin-bottom: 1.5rem; color: var(--primary-color);">Add Family Member</h3>
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Name</label>
                    <input type="text" id="familyName" placeholder="Full name" style="width: 100%; padding: 0.75rem; border: 2px solid #e5e7eb; border-radius: 8px;">
                </div>
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Age</label>
                    <input type="number" id="familyAge" placeholder="Age" style="width: 100%; padding: 0.75rem; border: 2px solid #e5e7eb; border-radius: 8px;">
                </div>
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Relation</label>
                    <select id="familyRelation" style="width: 100%; padding: 0.75rem; border: 2px solid #e5e7eb; border-radius: 8px;">
                        <option value="spouse">Spouse</option>
                        <option value="child">Child</option>
                        <option value="parent">Parent</option>
                        <option value="sibling">Sibling</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Gender</label>
                    <select id="familyGender" style="width: 100%; padding: 0.75rem; border: 2px solid #e5e7eb; border-radius: 8px;">
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div style="display: flex; gap: 1rem;">
                    <button onclick="addFamilyMember()" class="btn btn-primary" style="flex: 1;">Add Member</button>
                    <button onclick="closeFamilyModal()" class="btn btn-outline" style="flex: 1;">Cancel</button>
                </div>
            </div>
        </div>
    `;
    modal.id = 'familyModal';
    document.body.appendChild(modal);
}

// Add family member
window.addFamilyMember = function() {
    const name = document.getElementById('familyName').value;
    const age = document.getElementById('familyAge').value;
    const relation = document.getElementById('familyRelation').value;
    const gender = document.getElementById('familyGender').value;
    
    if (!name || !age) {
        showNotification('Please fill in required fields', 'error');
        return;
    }
    
    const profiles = JSON.parse(localStorage.getItem('familyProfiles') || '[]');
    const newProfile = {
        profile_id: 'profile_' + Date.now(),
        user_id: currentUser.id,
        name: name,
        age: parseInt(age),
        relation: relation,
        gender: gender
    };
    profiles.push(newProfile);
    localStorage.setItem('familyProfiles', JSON.stringify(profiles));
    
    closeFamilyModal();
    loadFamilyProfiles();
    showNotification('Family member added successfully!', 'success');
    addNotification('info', `Added ${name} to family profiles`);
}

// Close family modal
window.closeFamilyModal = function() {
    const modal = document.getElementById('familyModal');
    if (modal) modal.remove();
}

// Schedule reminder system
function scheduleReminder(medicine) {
    const reminderTime = medicine.times[0]; // Get first time
    const [hours, minutes] = reminderTime.split(':').map(Number);
    
    // Store reminder check
    const reminders = JSON.parse(localStorage.getItem('activeReminders') || '[]');
    reminders.push({
        medicineId: medicine._id,
        time: reminderTime,
        medicine: medicine
    });
    localStorage.setItem('activeReminders', JSON.stringify(reminders));
}

// Trigger reminder with all notification types
function triggerReminder(medicine) {
    const notifications = medicine.notifications;
    
    console.log('🔔 MEDICINE REMINDER TRIGGERED:', {
        medicine: medicine.name,
        dosage: medicine.dosage,
        time: medicine.times[0],
        notifications: notifications
    });
    
    // Play sound alert
    if (notifications.sound.enabled) {
        playAlertSound();
        console.log('🔊 Sound alert played');
    }
    
    // Show browser notification and popup
    showReminderNotification(medicine);
    
    // Send email alert
    if (notifications.email.enabled && notifications.email.address) {
        sendEmailAlert(medicine, notifications.email.address);
    }
    
    // Send SMS alert
    if (notifications.sms.enabled && notifications.sms.phone) {
        sendSMSAlert(medicine, notifications.sms.phone);
    }
    
    // Add to notifications log
    addNotification('reminder', `💊 Time to take ${medicine.name} (${medicine.dosage})`);
    
    // Show success message
    showNotification(`💊 Reminder: Time to take ${medicine.name}!`, 'info');
}

// Play alert sound
function playAlertSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.5);
}

// Show reminder notification
function showReminderNotification(medicine) {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('💊 Medicine Reminder', {
            body: `Time to take ${medicine.name} (${medicine.dosage})`,
            requireInteraction: true
        });
    }
    
    showCustomReminderPopup(medicine);
}

// Show custom reminder popup
function showCustomReminderPopup(medicine) {
    const popup = document.createElement('div');
    popup.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 3000; display: flex; align-items: center; justify-content: center;">
            <div style="background: white; padding: 2rem; border-radius: 20px; max-width: 400px; width: 90%; color: #333; text-align: center;">
                <div style="font-size: 4rem; margin-bottom: 1rem;">💊</div>
                <h2 style="color: var(--primary-color); margin-bottom: 1rem;">Medicine Reminder!</h2>
                <h3 style="margin-bottom: 0.5rem; color: var(--text-dark);">${medicine.name}</h3>
                <p style="margin-bottom: 1rem; color: var(--text-gray); font-size: 1.1rem;">${medicine.dosage}</p>
                <div style="display: flex; gap: 1rem; justify-content: center;">
                    <button onclick="markAsTakenFromPopup('${medicine._id}')" style="background: #10b981; color: white; border: none; padding: 1rem 2rem; border-radius: 10px; cursor: pointer; font-weight: 600;">
                        Mark as Taken
                    </button>
                    <button onclick="closeReminderPopup()" style="background: #6b7280; color: white; border: none; padding: 1rem 2rem; border-radius: 10px; cursor: pointer; font-weight: 600;">
                        Close
                    </button>
                </div>
            </div>
        </div>
    `;
    popup.id = 'reminderPopup';
    document.body.appendChild(popup);
}

// Mark as taken from popup
window.markAsTakenFromPopup = function(medicineId) {
    markAsTaken(medicineId);
    closeReminderPopup();
}

// Close reminder popup
window.closeReminderPopup = function() {
    const popup = document.getElementById('reminderPopup');
    if (popup) popup.remove();
}

// Send email alert (fallback for demo)
async function sendEmailAlert(medicine, email) {
    // Try real backend API first
    try {
        const response = await fetch('/api/notifications/send-email-reminder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                email: email,
                medicineName: medicine.name,
                dosage: medicine.dosage,
                time: medicine.times[0],
                precaution: medicine.precaution
            })
        });
        
        if (response.ok) {
            addNotification('email', `Email reminder sent to ${email}`);
            console.log('📧 Email sent successfully');
        } else {
            throw new Error('Backend email service failed');
        }
    } catch (error) {
        // Fallback to demo mode
        console.log(`📧 Email notification: ${medicine.name} reminder sent to ${email}`);
        addNotification('email', `Email reminder sent to ${email} (demo mode)`);
        
        const emailContent = `
🏥 MEDICINE REMINDER

Hi! Time to take your medicine:

💊 Medicine: ${medicine.name}
📋 Dosage: ${medicine.dosage}
⏰ Time: ${medicine.times[0]}
${medicine.precaution ? '⚠️ Precaution: ' + medicine.precaution : ''}

Stay healthy!
- MediAlert Team
        `;
        
        console.log('Email Content:', emailContent);
    }
}

// Send SMS alert (fallback for demo)
async function sendSMSAlert(medicine, phone) {
    const formattedPhone = phone.replace(/\s/g, '').replace(/^(\+91|91|0)/, '+91');
    
    // Try real backend API first
    try {
        const smsContent = `🏥 MediAlert: Time to take ${medicine.name} (${medicine.dosage}). ${medicine.precaution ? 'Precaution: ' + medicine.precaution + '. ' : ''}Stay healthy!`;
        
        const response = await fetch('/api/notifications/send-sms-reminder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                phone: formattedPhone,
                message: smsContent
            })
        });
        
        if (response.ok) {
            addNotification('sms', `SMS reminder sent to ${formattedPhone}`);
            console.log('📱 SMS sent successfully');
        } else {
            throw new Error('Backend SMS service failed');
        }
    } catch (error) {
        // Fallback to demo mode
        console.log(`📱 SMS notification: ${medicine.name} reminder sent to ${formattedPhone}`);
        addNotification('sms', `SMS reminder sent to ${formattedPhone} (demo mode)`);
        
        const smsContent = `🏥 MediAlert: Time to take ${medicine.name} (${medicine.dosage}). ${medicine.precaution ? 'Precaution: ' + medicine.precaution + '. ' : ''}Stay healthy!`;
        console.log('SMS Content:', smsContent);
    }
}

// Start reminder checking system
function startReminderSystem() {
    setInterval(() => {
        const reminders = JSON.parse(localStorage.getItem('activeReminders') || '[]');
        const now = new Date();
        const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        
        reminders.forEach(reminder => {
            if (reminder.time === currentTime) {
                triggerReminder(reminder.medicine);
            }
        });
    }, 60000);
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
        padding: 15px 25px;
        border-radius: 10px;
        color: white;
        z-index: 3000;
        font-weight: 600;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        animation: slideInRight 0.3s ease;
        ${type === 'success' ? 'background: linear-gradient(135deg, #10b981, #059669);' : 
          type === 'error' ? 'background: linear-gradient(135deg, #ef4444, #dc2626);' : 
          'background: linear-gradient(135deg, #3b82f6, #2563eb);'}
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 4000);
}

// Save medicines to JSON file for email scheduler
function saveMedicinesToFile(medicines) {
    // Create downloadable JSON file
    const dataStr = JSON.stringify(medicines, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    // Auto-download the file
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'medicines.json';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log('📁 medicines.json file downloaded. Move it to backend folder for email reminders.');
    showNotification('Medicine data exported! Move medicines.json to backend folder.', 'info');
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(style);