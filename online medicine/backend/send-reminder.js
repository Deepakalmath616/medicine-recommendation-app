const nodemailer = require('nodemailer');
require('dotenv').config();

console.log('📧 Sending Medicine Reminder Email...');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Sample medicine reminder
const medicineReminder = {
    name: 'Paracetamol',
    dosage: '500mg',
    time: '08:00 AM',
    precaution: 'Take with food'
};

const mailOptions = {
    from: process.env.EMAIL_USER,
    to: '02fe23bcs134@kletech.ac.in',
    subject: '💊 Medicine Reminder - MediAlert',
    html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 30px; border-radius: 15px; text-align: center; margin-bottom: 20px;">
                <h1 style="margin: 0; font-size: 2rem;">🏥 Medicine Reminder</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">Time to take your medicine</p>
            </div>
            
            <div style="background: #f8fafc; padding: 25px; border-radius: 15px; border-left: 5px solid #3b82f6;">
                <h2 style="color: #1f2937; margin: 0 0 15px 0;">${medicineReminder.name}</h2>
                <p style="color: #6b7280; margin: 5px 0; font-size: 1.1rem;"><strong>💊 Dosage:</strong> ${medicineReminder.dosage}</p>
                <p style="color: #6b7280; margin: 5px 0; font-size: 1.1rem;"><strong>⏰ Time:</strong> ${medicineReminder.time}</p>
                <div style="background: #fef3c7; color: #d97706; padding: 15px; border-radius: 8px; margin-top: 15px;">
                    <strong>⚠️ Precaution:</strong> ${medicineReminder.precaution}
                </div>
            </div>
            
            <div style="text-align: center; margin-top: 25px; color: #6b7280; font-size: 0.9rem;">
                <p>This is an automated reminder from MediAlert</p>
                <p>Stay healthy! 💚</p>
                <p><strong>Current Time:</strong> ${new Date().toLocaleString()}</p>
            </div>
        </div>
    `
};

transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.log('❌ Failed to send medicine reminder:', error.message);
    } else {
        console.log('✅ Medicine reminder email sent successfully!');
        console.log('📧 Email sent to: 02fe23bcs134@kletech.ac.in');
        console.log('💊 Medicine: ' + medicineReminder.name);
        console.log('📋 Dosage: ' + medicineReminder.dosage);
        console.log('⏰ Time: ' + medicineReminder.time);
        console.log('Message ID:', info.messageId);
        console.log('\nCheck your email inbox now!');
    }
});