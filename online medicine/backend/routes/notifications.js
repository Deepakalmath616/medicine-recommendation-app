const express = require('express');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
const auth = require('../middleware/auth');

const router = express.Router();

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Test email configuration on startup
if (process.env.EMAIL_USER && process.env.EMAIL_USER !== 'your-email@gmail.com') {
    transporter.verify(function(error, success) {
        if (error) {
            console.log('❌ Email configuration error:', error.message);
        } else {
            console.log('✅ Email server is ready to send messages');
        }
    });
} else {
    console.log('⚠️ Email not configured - using demo mode');
}

// Twilio configuration
let twilioClient;
try {
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && 
        process.env.TWILIO_ACCOUNT_SID.startsWith('AC')) {
        twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        console.log('✅ Twilio SMS service initialized');
    } else {
        console.log('⚠️ Twilio credentials not configured - SMS disabled');
    }
} catch (error) {
    console.log('⚠️ Twilio initialization failed - SMS disabled:', error.message);
}

// Send email reminder
router.post('/send-email-reminder', auth, async (req, res) => {
    try {
        const { email, medicineName, dosage, time, precaution } = req.body;
        
        console.log('📧 Attempting to send email to:', email);
        console.log('📧 Email config:', {
            user: process.env.EMAIL_USER,
            passLength: process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 0
        });
        
        // Check if email is configured
        if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'your-email@gmail.com') {
            console.log('📧 Email would be sent to:', email, 'for medicine:', medicineName);
            return res.json({ success: true, message: 'Email sent (demo mode - configure EMAIL_USER in .env)' });
        }
        
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
                        <h2 style="color: #1f2937; margin: 0 0 15px 0;">${medicineName}</h2>
                        <p style="color: #6b7280; margin: 5px 0; font-size: 1.1rem;"><strong>Dosage:</strong> ${dosage}</p>
                        <p style="color: #6b7280; margin: 5px 0; font-size: 1.1rem;"><strong>Time:</strong> ${time}</p>
                        ${precaution ? `<div style="background: #fef3c7; color: #d97706; padding: 15px; border-radius: 8px; margin-top: 15px;"><strong>⚠️ Precaution:</strong> ${precaution}</div>` : ''}
                    </div>
                    
                    <div style="text-align: center; margin-top: 25px; color: #6b7280; font-size: 0.9rem;">
                        <p>This is an automated reminder from MediAlert</p>
                        <p>Stay healthy! 💚</p>
                    </div>
                </div>
            `
        };
        
        console.log('📧 Sending email with options:', {
            from: mailOptions.from,
            to: mailOptions.to,
            subject: mailOptions.subject
        });
        
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent successfully:', info.messageId);
        res.json({ success: true, message: 'Email sent successfully', messageId: info.messageId });
        
    } catch (error) {
        console.error('❌ Email error:', error);
        res.status(500).json({ success: false, message: 'Failed to send email: ' + error.message });
    }
});

// Send SMS reminder
router.post('/send-sms-reminder', auth, async (req, res) => {
    try {
        if (!twilioClient) {
            const { phone, message } = req.body;
            console.log('📱 SMS would be sent to:', phone, 'Message:', message);
            return res.json({ success: true, message: 'SMS sent (demo mode - configure Twilio in .env)' });
        }
        
        const { phone, message } = req.body;
        
        await twilioClient.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phone
        });
        
        res.json({ success: true, message: 'SMS sent successfully' });
        
    } catch (error) {
        console.error('SMS error:', error);
        res.status(500).json({ success: false, message: 'Failed to send SMS' });
    }
});

module.exports = router;