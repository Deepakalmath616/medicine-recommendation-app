const nodemailer = require('nodemailer');
require('dotenv').config();

console.log('🧪 Testing Email Configuration...');
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS length:', process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 0);

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Test email configuration
transporter.verify(function(error, success) {
    if (error) {
        console.log('❌ Email configuration error:', error.message);
        console.log('Full error:', error);
    } else {
        console.log('✅ Email server is ready to send messages');
        
        // Send test email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Send to yourself
            subject: '🧪 MediRemind Test Email',
            html: `
                <h2>🏥 MediRemind Test Email</h2>
                <p>If you receive this email, your email configuration is working correctly!</p>
                <p>Time: ${new Date().toLocaleString()}</p>
            `
        };
        
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('❌ Failed to send test email:', error.message);
            } else {
                console.log('✅ Test email sent successfully!');
                console.log('Message ID:', info.messageId);
                console.log('Check your Gmail inbox for the test email.');
            }
        });
    }
});