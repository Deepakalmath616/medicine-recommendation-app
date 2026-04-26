# 🔔 Email & SMS Alert Setup Guide

## Current Status
Your app is running in **DEMO MODE** - alerts are logged to console but not actually sent.

## To Enable Real Email Alerts

### Step 1: Get Gmail App Password
1. Go to your Google Account: https://myaccount.google.com/
2. Click **Security** → **2-Step Verification** (enable if not already)
3. Scroll down to **App passwords**
4. Select app: **Mail**, Select device: **Other (Custom name)**
5. Enter name: "MediRemind"
6. Click **Generate**
7. Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)

### Step 2: Update .env File
Open `backend/.env` and replace:
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

With your actual credentials:
```
EMAIL_USER=youremail@gmail.com
EMAIL_PASS=abcdefghijklmnop
```
(Remove spaces from app password)

## To Enable Real SMS Alerts

### Step 1: Create Twilio Account
1. Sign up at: https://www.twilio.com/try-twilio
2. Verify your phone number
3. Get free trial credits ($15)

### Step 2: Get Twilio Credentials
1. Go to Twilio Console: https://console.twilio.com/
2. Copy your **Account SID** (starts with AC...)
3. Copy your **Auth Token**
4. Get a phone number: Console → Phone Numbers → Get a Number

### Step 3: Update .env File
Replace in `backend/.env`:
```
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
```

## Testing Alerts

### Method 1: Use Test Button
1. Start server: `cd backend && npm start`
2. Open app: http://localhost:3000
3. Login and add a medicine
4. Click "🧪 Test Alert Now" button in dashboard

### Method 2: Set Reminder Time
1. Add medicine with time set to 1-2 minutes from now
2. Wait for the scheduled time
3. Alert will trigger automatically

## Troubleshooting

### Email Not Working
- ✅ Check Gmail app password is correct (no spaces)
- ✅ Verify 2FA is enabled on Gmail
- ✅ Check server console for error messages
- ✅ Try sending test email from backend

### SMS Not Working
- ✅ Verify Twilio Account SID starts with "AC"
- ✅ Check phone number format: +1234567890
- ✅ Ensure trial account has credits
- ✅ Verify recipient number is verified in Twilio

### Demo Mode
If credentials aren't configured, the app runs in demo mode:
- ✅ Alerts are logged to browser console
- ✅ Notifications show "(demo mode)" message
- ✅ No actual emails/SMS are sent

## Quick Test Commands

### Test Email (with curl)
```bash
curl -X POST http://localhost:3000/api/notifications/send-email-reminder \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "email": "test@example.com",
    "medicineName": "Test Medicine",
    "dosage": "1 tablet",
    "time": "09:00"
  }'
```

### Check Server Logs
Look for these messages when server starts:
- ✅ "Twilio SMS service initialized" (if configured)
- ⚠️ "Twilio credentials not configured" (if not configured)

## Need Help?
- Check `backend/.env` file has correct values
- Restart server after changing .env
- Check browser console (F12) for error messages
- Check server terminal for backend errors