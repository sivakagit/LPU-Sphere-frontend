// seed.js - Run this to populate your database with sample data
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const ClassModel = require('./models/Class');
const Message = require('./models/Message');

const MONGO_URI = process.env.MONGO_URI;

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing data (optional - comment out if you want to keep existing data)
    await User.deleteMany({});
    await ClassModel.deleteMany({});
    await Message.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create Users
    const users = [
      {
        regNo: '12214001',
        name: 'Aarav Sharma',
        password: 'password123',
        role: 'student',
        classes: ['CSE3A', 'CSE3B'],
      },
      {
        regNo: '12214002',
        name: 'Isha Patel',
        password: 'password123',
        role: 'student',
        classes: ['CSE3A'],
      },
      {
        regNo: '12214007',
        name: 'Rohan Gupta',
        password: 'password123',
        role: 'student',
        classes: ['CSE3A', 'CSE3C'],
      },
      {
        regNo: '12214014',
        name: 'Priya Singh',
        password: 'password123',
        role: 'student',
        classes: ['CSE3A'],
      },
      {
        regNo: '12214018',
        name: 'Arjun Verma',
        password: 'password123',
        role: 'student',
        classes: ['CSE3A', 'CSE3B'],
      },
      {
        regNo: 'F101',
        name: 'Dr. Rajesh Kumar',
        password: 'faculty123',
        role: 'faculty',
        classes: ['CSE3A', 'CSE3B'],
      },
      {
        regNo: 'F102',
        name: 'Prof. Sneha Agarwal',
        password: 'faculty123',
        role: 'faculty',
        classes: ['CSE3C'],
      },
    ];

    await User.insertMany(users);
    console.log('👥 Created users');

    // Create Classes
    const classes = [
      {
        classId: 'CSE3A',
        className: 'CSE Year 3 Section A',
        code: 'K22GE-CSE-122',
        faculty: 'F101',
        members: ['12214001', '12214002', '12214007', '12214014', '12214018'],
      },
      {
        classId: 'CSE3B',
        className: 'CSE Year 3 Section B',
        code: 'K22MR-CSE-123',
        faculty: 'F101',
        members: ['12214001', '12214018'],
      },
      {
        classId: 'CSE3C',
        className: 'Database Management Systems',
        code: 'K22SR-INT-382',
        faculty: 'F102',
        members: ['12214007'],
      },
    ];

    await ClassModel.insertMany(classes);
    console.log('📚 Created classes');

    // Create Messages
    const messages = [
      {
        classId: 'CSE3A',
        senderRegNo: '12214001',
        senderName: 'Aarav Sharma',
        text: 'Hey everyone! Assignment deadline is tomorrow.',
        createdAt: new Date('2025-10-30T09:30:00Z'),
      },
      {
        classId: 'CSE3A',
        senderRegNo: '12214002',
        senderName: 'Isha Patel',
        text: 'Thanks for the reminder! Does anyone have the lecture notes?',
        createdAt: new Date('2025-10-30T09:45:00Z'),
      },
      {
        classId: 'CSE3A',
        senderRegNo: 'F101',
        senderName: 'Dr. Rajesh Kumar',
        text: 'Notes are uploaded on the portal. Good luck with your assignment!',
        createdAt: new Date('2025-10-30T10:15:00Z'),
      },
      {
        classId: 'CSE3A',
        senderRegNo: '12214007',
        senderName: 'Rohan Gupta',
        text: 'Can we have a study group session this evening?',
        createdAt: new Date('2025-10-30T14:20:00Z'),
      },
      {
        classId: 'CSE3A',
        senderRegNo: '12214014',
        senderName: 'Priya Singh',
        text: 'Sure! Library at 6 PM?',
        createdAt: new Date('2025-10-30T14:25:00Z'),
      },
      {
        classId: 'CSE3B',
        senderRegNo: 'F101',
        senderName: 'Dr. Rajesh Kumar',
        text: 'Lab session will be held tomorrow at 3 PM in Lab 204.',
        createdAt: new Date('2025-10-29T11:00:00Z'),
      },
      {
        classId: 'CSE3B',
        senderRegNo: '12214001',
        senderName: 'Aarav Sharma',
        text: 'Got it, sir. Thank you!',
        createdAt: new Date('2025-10-29T11:05:00Z'),
      },
      {
        classId: 'CSE3C',
        senderRegNo: 'F102',
        senderName: 'Prof. Sneha Agarwal',
        text: 'Project presentations will be next week. Please prepare accordingly.',
        createdAt: new Date('2025-10-28T10:00:00Z'),
      },
      {
        classId: 'CSE3C',
        senderRegNo: '12214007',
        senderName: 'Rohan Gupta',
        text: 'Yes ma\'am, we are working on it.',
        createdAt: new Date('2025-10-28T10:30:00Z'),
      },
    ];

    await Message.insertMany(messages);
    console.log('💬 Created messages');

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📝 Test credentials:');
    console.log('Student: regNo: 12214001, password: password123');
    console.log('Faculty: regNo: F101, password: faculty123');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding database:', err);
    process.exit(1);
  }
};

seedData();