# 🔐 Gmail App Password Setup for yadavannavarshivarj@gmail.com

## ⚠️ IMPORTANT: Don't use your regular Gmail password!

Your regular password `Shivu@1234` won't work for email alerts. You need a special "App Password" from Google.

## 📧 Step-by-Step Setup:

### Step 1: Enable 2-Factor Authentication
1. Go to: https://myaccount.google.com/security
2. Sign in with: `yadavannavarshivarj@gmail.com` and `Shivu@1234`
3. Find "2-Step Verification" and turn it ON
4. Complete the setup with your phone number

### Step 2: Generate App Password
1. Still on the Security page, scroll down
2. Click "App passwords" (appears after 2FA is enabled)
3. Select app: "Mail"
4. Select device: "Other (Custom name)"
5. Enter name: "MediRemind"
6. Click "Generate"
7. **Copy the 16-character password** (e.g., `abcd efgh ijkl mnop`)

### Step 3: Update .env File
Replace these lines in `backend/.env`:
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

With:
```
EMAIL_USER=yadavannavarshivarj@gmail.com
EMAIL_PASS=your16digitapppassword
```
(Use the app password from Step 2, remove spaces)

### Step 4: Test
1. Restart server: `cd backend && npm start`
2. Add medicine with email alerts
3. Click "Test Alert Now"
4. Check your Gmail inbox

## 🚨 Security Note:
- Never use your regular Gmail password in apps
- App passwords are safer and can be revoked anytime
- Your regular password `Shivu@1234` stays private

## 🆘 If App Password Doesn't Work:
Try "Less secure app access" (not recommended):
1. Go to: https://myaccount.google.com/lesssecureapps
2. Turn ON "Allow less secure apps"
3. Use your regular password in .env

But App Password is much safer!