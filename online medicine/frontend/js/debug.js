// Debug utility functions - Open browser console and use these

// View all registered users
window.viewRegisteredUsers = function() {
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    console.log('=== REGISTERED USERS ===');
    console.table(users);
    return users;
}

// Clear all registered users (reset)
window.clearAllUsers = function() {
    localStorage.removeItem('registeredUsers');
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    console.log('✅ All users cleared. Please refresh the page.');
}

// Add a test user
window.addTestUser = function() {
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const testUser = {
        id: 'user_test',
        name: 'Test User',
        email: 'test@example.com',
        phone: '1234567890',
        password: 'test123',
        registeredAt: new Date().toISOString()
    };
    users.push(testUser);
    localStorage.setItem('registeredUsers', JSON.stringify(users));
    console.log('✅ Test user added:');
    console.log('Email: test@example.com');
    console.log('Password: test123');
}

// Check if email is registered
window.checkEmail = function(email) {
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const user = users.find(u => u.email === email);
    if (user) {
        console.log('✅ Email is registered:', user);
    } else {
        console.log('❌ Email not found');
    }
    return user;
}

// Add test register function
window.testRegister = function() {
    console.log('Test register function called');
    
    // Fill form with test data
    const nameField = document.getElementById('registerName');
    const emailField = document.getElementById('registerEmail');
    const phoneField = document.getElementById('registerPhone');
    const passwordField = document.getElementById('registerPassword');
    
    if (nameField) nameField.value = 'Test User';
    if (emailField) emailField.value = 'test@example.com';
    if (phoneField) phoneField.value = '1234567890';
    if (passwordField) passwordField.value = 'test123';
    
    console.log('Form filled with test data');
    
    // Call register function
    handleRegister();
}

console.log('🔧 Test function loaded. Use testRegister() to test registration.');

// Add test register function
window.testRegister = function() {
    console.log('Test register function called');
    
    // Fill form with test data
    const nameField = document.getElementById('registerName');
    const emailField = document.getElementById('registerEmail');
    const phoneField = document.getElementById('registerPhone');
    const passwordField = document.getElementById('registerPassword');
    
    if (nameField) nameField.value = 'Test User';
    if (emailField) emailField.value = 'test@example.com';
    if (phoneField) phoneField.value = '1234567890';
    if (passwordField) passwordField.value = 'test123';
    
    console.log('Form filled with test data');
    
    // Call register function
    handleRegister();
}

console.log('🔧 Test function loaded. Use testRegister() to test registration.');