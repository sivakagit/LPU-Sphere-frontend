// seed.js - Populates MongoDB with sample users, classes, and messages
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

    // Clear old data
    await Promise.all([
      User.deleteMany({}),
      ClassModel.deleteMany({}),
      Message.deleteMany({})
    ]);
    console.log('🗑️  Cleared existing data');

    // 👩‍🎓 Users (username = password = regNo)
    const users = [
      {
        regNo: '12214001',
        name: 'Aarav Sharma',
        password: '12214001',
        role: 'student',
        classes: ['CSE3A', 'CSE3B']
      },
      {
        regNo: '12214002',
        name: 'Isha Patel',
        password: '12214002',
        role: 'student',
        classes: ['CSE3A']
      },
      {
        regNo: '12214007',
        name: 'Rohan Gupta',
        password: '12214007',
        role: 'student',
        classes: ['CSE3A', 'CSE3C']
      },
      {
        regNo: '12214014',
        name: 'Priya Singh',
        password: '12214014',
        role: 'student',
        classes: ['CSE3A']
      },
      {
        regNo: '12214018',
        name: 'Arjun Verma',
        password: '12214018',
        role: 'student',
        classes: ['CSE3A', 'CSE3B']
      },
      {
        regNo: 'F101',
        name: 'Dr. Rajesh Kumar',
        password: 'F101',
        role: 'faculty',
        classes: ['CSE3A', 'CSE3B']
      },
      {
        regNo: 'F102',
        name: 'Prof. Sneha Agarwal',
        password: 'F102',
        role: 'faculty',
        classes: ['CSE3C']
      },
      {
        regNo: '12211633',
        name: 'Ravi Sharma',
        password: '12211633',
        role: 'student',
        classes: ['CSE3C']
      },
      {
        regNo: '12211634',
        name: 'Vikram Nair',
        password: '12211634',
        role: 'student',
        classes: ['CSE3C']
      },
      {
        regNo: '12211635',
        name: 'Aditya Singh',
        password: '12211635',
        role: 'student',
        classes: ['CSE3C']
      },
      {
        regNo: '12211636',
        name: 'Sneha Kapoor',
        password: '12211636',
        role: 'student',
        classes: ['CSE3C']
      },
      {
        regNo: '12211637',
        name: 'Priya Iyer',
        password: '12211637',
        role: 'student',
        classes: ['CSE3C']
      }
    ];

    await User.insertMany(users);
    console.log('👥 Created users');

    // 📚 Classes
    const classes = [
      {
        classId: 'CSE3A',
        className: 'CSE Year 3 Section A',
        code: 'K22GE-CSE-122',
        faculty: 'F101',
        members: ['12214001', '12214002', '12214007', '12214014', '12214018']
      },
      {
        classId: 'CSE3B',
        className: 'CSE Year 3 Section B',
        code: 'K22MR-CSE-123',
        faculty: 'F101',
        members: ['12214001', '12214018']
      },
      {
        classId: 'CSE3C',
        className: 'CSE Year 3 Section C',
        code: 'K22SR-INT-382',
        faculty: 'F102',
        members: [
          '12211633',
          '12211634',
          '12211635',
          '12211636',
          '12211637',
          'F102'
        ]
      }
    ];

    await ClassModel.insertMany(classes);
    console.log('📘 Created classes');

    // 💬 Messages
    const messages = [
      {
        classId: 'CSE3C',
        senderRegNo: 'F102',
        senderName: 'Prof. Sneha Agarwal',
        text: 'Welcome to CSE3C group! This is your main chat for discussions.',
        createdAt: new Date('2025-10-31T10:00:00Z')
      },
      {
        classId: 'CSE3C',
        senderRegNo: '12211633',
        senderName: 'Ravi Sharma',
        text: 'Thank you, ma’am! Looking forward to working together.',
        createdAt: new Date('2025-10-31T10:05:00Z')
      },
      {
        classId: 'CSE3C',
        senderRegNo: '12211636',
        senderName: 'Sneha Kapoor',
        text: 'Hi everyone 👋',
        createdAt: new Date('2025-10-31T10:06:00Z')
      }
    ];

    await Message.insertMany(messages);
    console.log('💬 Created messages');

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📝 Test Logins:');
    console.log('Faculty (CSE3C): F102 / F102');
    console.log('Student (CSE3C): 12211633 / 12211633');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding database:', err);
    process.exit(1);
  }
};

seedData();
