# 📧 Email & SMS Setup Guide

## Gmail Email Setup

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. **Update .env file**:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-16-digit-app-password
   ```

## Twilio SMS Setup

1. **Create Twilio Account**: https://www.twilio.com/try-twilio
2. **Get Credentials**:
   - Account SID
   - Auth Token
   - Phone Number
3. **Update .env file**:
   ```
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_PHONE_NUMBER=+1234567890
   ```

## Quick Test

1. Start the server: `npm start`
2. Add a medicine with email/SMS enabled
3. Use "Test Alert Now" button in dashboard

## Troubleshooting

- **Email not working**: Check Gmail app password
- **SMS not working**: Verify Twilio credentials and phone number format
- **Both not working**: Check server console for error messages