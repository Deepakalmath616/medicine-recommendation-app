// Add test reminder function
window.testReminder = function() {
    const medicines = JSON.parse(localStorage.getItem('medicines') || '[]');
    if (medicines.length === 0) {
        showNotification('Please add a medicine first', 'error');
        return;
    }
    
    const medicine = medicines[0]; // Test with first medicine
    console.log('🧪 Testing reminder for:', medicine.name);
    
    // Force trigger reminder regardless of notification settings
    const testMedicine = {
        ...medicine,
        notifications: {
            email: { enabled: true, address: 'test@example.com' },
            sms: { enabled: true, phone: '+919876543210' },
            sound: { enabled: true }
        }
    };
    
    triggerReminder(testMedicine);
    showNotification('💊 Test reminder triggered! Check console for details.', 'success');
}