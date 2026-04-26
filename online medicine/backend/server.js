const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/medicine_reminder')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: String,
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model('User', userSchema);

// Medicine Schema
const medicineSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  dosage: { type: String, required: true },
  times: [String],
  frequency: { type: String, default: 'daily' },
  instructions: String,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const Medicine = mongoose.model('Medicine', medicineSchema);

// Auth middleware
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token provided' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Include notification routes
app.use('/api/notifications', require('./routes/notifications'));

// Email setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Include notification routes
app.use('/api/notifications', require('./routes/notifications'));

// Routes
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ name, email, password, phone });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'fallback_secret');
    res.status(201).json({ 
      token, 
      user: { id: user._id, name, email, phone },
      message: 'Account created successfully!'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'fallback_secret');
    res.json({ 
      token, 
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone },
      message: 'Login successful!'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/medicines', auth, async (req, res) => {
  try {
    const medicine = new Medicine({
      ...req.body,
      userId: req.userId
    });
    await medicine.save();
    res.status(201).json({ medicine, message: 'Medicine added successfully!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/medicines', auth, async (req, res) => {
  try {
    const medicines = await Medicine.find({ userId: req.userId, isActive: true });
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/medicines/:id', auth, async (req, res) => {
  try {
    await Medicine.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { isActive: false }
    );
    res.json({ message: 'Medicine deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Send reminder emails
async function sendReminders() {
  try {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const medicines = await Medicine.find({ isActive: true }).populate('userId');
    
    for (const medicine of medicines) {
      if (medicine.times.includes(currentTime)) {
        const user = medicine.userId;
        if (user && user.email) {
          const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: '💊 Medicine Reminder - MediRemind',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #3b82f6;">🏥 Medicine Reminder</h2>
                <p>Hi ${user.name},</p>
                <p>It's time to take your medicine:</p>
                <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin: 20px 0;">
                  <h3 style="color: #333; margin: 0;">${medicine.name}</h3>
                  <p style="color: #666; margin: 5px 0;">Dosage: ${medicine.dosage}</p>
                  ${medicine.instructions ? `<p style="color: #666; margin: 5px 0;">Instructions: ${medicine.instructions}</p>` : ''}
                  <p style="color: #3b82f6; font-weight: bold;">Time: ${currentTime}</p>
                </div>
                <p>Don't forget to mark it as taken in your MediRemind dashboard!</p>
                <p style="color: #666; font-size: 12px;">This is an automated reminder from MediRemind.</p>
              </div>
            `
          };
          
          await transporter.sendMail(mailOptions);
          console.log(`Reminder sent to ${user.email} for ${medicine.name}`);
        }
      }
    }
  } catch (error) {
    console.error('Error sending reminders:', error);
  }
}

// Check for reminders every minute
cron.schedule('* * * * *', sendReminders);

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => {
  console.log(`🏥 MediRemind server running on http://localhost:${PORT}`);
  console.log('📧 Email reminders active');
  console.log('📊 Database connected');
});