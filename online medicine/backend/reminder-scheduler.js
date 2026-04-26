const nodemailer = require('nodemailer');
const cron = require('node-cron');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

console.log('🏥 MediRemind Scheduler Started');
console.log('📧 Email:', process.env.EMAIL_USER);
console.log('⏰ Checking for reminders every minute...');
console.log('💾 Reading medicines from website data...\n');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Function to read medicines from localStorage backup file
function getMedicinesFromWebsite() {
    try {
        // Try to read from a JSON file that the website can write to
        const medicinesFile = path.join(__dirname, 'medicines.json');
        if (fs.existsSync(medicinesFile)) {
            const data = fs.readFileSync(medicinesFile, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.log('📝 No medicines file found, using sample data');
    }
    
    // Fallback sample medicines
    return [
        {
            name: 'Sample Medicine',
            dosage: '500mg',
            times: ['08:00'],
            precaution: 'Add your medicines through the website',
            notifications: {
                email: { enabled: true, address: '02fe23bcs134@kletech.ac.in' }
            }
        }
    ];
}

async function sendMedicineReminder(medicine) {
    const email = medicine.notifications?.email?.address || '02fe23bcs134@kletech.ac.in';
    const time = medicine.times?.[0] || 'Not specified';
    
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: '💊 Medicine Reminder - MediAlert',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 30px; border-radius: 15px; text-align: center; margin-bottom: 20px;">
                    <h1 style="margin: 0; font-size: 2rem;">🏥 Medicine Reminder</h1>
                    <p style="margin: 10px 0 0 0; opacity: 0.9;">Time to take your medicine</p>
                </div>
                
                <div style="background: #f8fafc; padding: 25px; border-radius: 15px; border-left: 5px solid #3b82f6;">
                    <h2 style="color: #1f2937; margin: 0 0 15px 0;">${medicine.name}</h2>
                    <p style="color: #6b7280; margin: 5px 0; font-size: 1.1rem;"><strong>💊 Dosage:</strong> ${medicine.dosage}</p>
                    <p style="color: #6b7280; margin: 5px 0; font-size: 1.1rem;"><strong>⏰ Time:</strong> ${time}</p>
                    ${medicine.precaution ? `<div style="background: #fef3c7; color: #d97706; padding: 15px; border-radius: 8px; margin-top: 15px;"><strong>⚠️ Precaution:</strong> ${medicine.precaution}</div>` : ''}
                    ${medicine.description ? `<p style="color: #6b7280; margin: 10px 0; font-style: italic;">${medicine.description}</p>` : ''}
                </div>
                
                <div style="text-align: center; margin-top: 25px; color: #6b7280; font-size: 0.9rem;">
                    <p>This is an automated reminder from MediAlert</p>
                    <p>Stay healthy! 💚</p>
                    <p><strong>Sent at:</strong> ${new Date().toLocaleString()}</p>
                </div>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Reminder sent: ${medicine.name} at ${time}`);
    } catch (error) {
        console.log(`❌ Failed to send: ${medicine.name} - ${error.message}`);
    }
}

// Check every minute for medicine reminders
cron.schedule('* * * * *', () => {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    console.log(`⏰ Checking time: ${currentTime}`);
    
    const medicines = getMedicinesFromWebsite();
    
    medicines.forEach(medicine => {
        if (medicine.times && medicine.times.includes(currentTime)) {
            if (medicine.notifications?.email?.enabled) {
                console.log(`🔔 Time to send reminder for ${medicine.name}!`);
                sendMedicineReminder(medicine);
            }
        }
    });
});

// Display current medicines on startup
function displayMedicines() {
    const medicines = getMedicinesFromWebsite();
    console.log('📋 Current medicines scheduled:');
    medicines.forEach(med => {
        const times = med.times ? med.times.join(', ') : 'No time set';
        const emailEnabled = med.notifications?.email?.enabled ? '✅' : '❌';
        console.log(`  ${emailEnabled} ${med.name} (${med.dosage}) at ${times}`);
    });
}

displayMedicines();

console.log('\n🚀 Scheduler is running... Press Ctrl+C to stop');
console.log('💡 Add medicines through the website - they will be automatically detected!');
console.log('💾 To sync website data, create a medicines.json file in the backend folder');

// Keep the process running
process.on('SIGINT', () => {
    console.log('\n👋 MediRemind Scheduler stopped');
    process.exit(0);
});