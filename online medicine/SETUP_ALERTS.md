# 🚨 URGENT: Email & SMS Setup Required

Your MediRemind app is currently in DEMO MODE because email and SMS credentials are not configured.

## 📧 Quick Email Setup (5 minutes)

### Step 1: Get Gmail App Password
1. Go to: https://myaccount.google.com/security
2. Enable "2-Step Verification" if not already enabled
3. Click "App passwords" → Select "Mail" → Generate
4. Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)

### Step 2: Update .env File
Replace these lines in `backend/.env`:
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

With your actual Gmail:
```
EMAIL_USER=youremail@gmail.com
EMAIL_PASS=abcdefghijklmnop
```
(Remove spaces from app password)

## 📱 SMS Setup (Optional - Twilio)

### Step 1: Create Free Twilio Account
1. Sign up at: https://www.twilio.com/try-twilio
2. Get $15 free credits
3. Copy Account SID, Auth Token, and Phone Number

### Step 2: Update .env File
```
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
```

## 🧪 Test Your Setup

### Method 1: Use Test Button
1. Start server: `cd backend && npm start`
2. Add medicine with email/SMS enabled
3. Click "🧪 Test Alert Now" button

### Method 2: Set Real Reminder
1. Add medicine with time 2 minutes from now
2. Wait for automatic alert

## 🔍 Current Status

**Email**: ❌ Not configured (using placeholder credentials)
**SMS**: ❌ Not configured (using placeholder credentials)
**Database**: ✅ MongoDB Atlas connected
**Browser Alerts**: ✅ Working

## ⚡ Quick Fix

**For Email Only** (Fastest):
1. Use your Gmail account
2. Generate app password
3. Update EMAIL_USER and EMAIL_PASS in .env
4. Restart server

**Result**: You'll receive real email alerts for medicine reminders!

## 🆘 Need Help?

If you can't set up email/SMS, the app still works with:
- ✅ Browser notifications
- ✅ Sound alerts  
- ✅ Visual popups
- ✅ Dashboard reminders

The email/SMS are bonus features - your medicine reminders will still work without them!