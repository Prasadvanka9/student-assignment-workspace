const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Assignment = require('./models/Assignment');
const { connectDB, disconnectDB } = require('./config/db');

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    console.log('[Seeder] Cleaning existing demo records...');
    const demoEmail = 'student@university.edu';
    const existingUser = await User.findOne({ email: demoEmail });
    if (existingUser) {
      await Assignment.deleteMany({ userId: existingUser._id });
      await User.deleteOne({ _id: existingUser._id });
    }

    console.log('[Seeder] Creating sample student user...');
    const demoStudent = await User.create({
      name: 'Alex Johnson',
      email: demoEmail,
      password: 'password123' // Will be hashed by userSchema pre-save hook
    });

    const now = new Date();
    
    // Dates helpers
    const daysAgo = (days) => {
      const d = new Date(now);
      d.setDate(d.getDate() - days);
      return d;
    };

    const daysFromNow = (days) => {
      const d = new Date(now);
      d.setDate(d.getDate() + days);
      return d;
    };

    console.log('[Seeder] Inserting sample assignments across subjects...');
    const sampleAssignments = [
      {
        title: 'Build Single-Page Application with React Hooks & Router',
        subject: 'React.js',
        description: 'Implement useState, useEffect, dynamic routing, and controlled forms in a full dashboard.',
        dueDate: daysFromNow(2),
        priority: 'High',
        status: 'In Progress',
        userId: demoStudent._id
      },
      {
        title: 'Asynchronous JavaScript & Fetch API Assignment',
        subject: 'JavaScript',
        description: 'Complete hands-on exercises covering Promises, Async/Await, and event loop microtasks.',
        dueDate: daysFromNow(5),
        priority: 'Medium',
        status: 'Pending',
        userId: demoStudent._id
      },
      {
        title: 'Exploratory Data Analysis with Pandas & Seaborn',
        subject: 'Data Analytics',
        description: 'Clean dataset, visualize distributions, detect outliers, and generate summary report.',
        dueDate: daysFromNow(7),
        priority: 'Medium',
        status: 'Pending',
        userId: demoStudent._id
      },
      {
        title: 'Subnetting & TCP/IP Protocol Analysis Lab',
        subject: 'Computer Networks',
        description: 'Analyze Wireshark packet capture file and submit IPv4 subnet breakdown report.',
        dueDate: daysAgo(2), // Overdue assignment
        priority: 'High',
        status: 'Pending',
        userId: demoStudent._id
      },
      {
        title: 'Train Supervised Classification Model (Decision Trees)',
        subject: 'Machine Learning',
        description: 'Tune hyperparameters, plot ROC curve, and achieve >85% accuracy on test split.',
        dueDate: now, // Due Today
        priority: 'High',
        status: 'In Progress',
        userId: demoStudent._id
      },
      {
        title: 'Process Scheduling & Memory Management Simulation',
        subject: 'Operating Systems',
        description: 'Simulate Round-Robin and Shortest-Job-First CPU scheduling algorithms in C/Python.',
        dueDate: daysAgo(5),
        priority: 'Low',
        status: 'Completed',
        userId: demoStudent._id
      }
    ];

    await Assignment.insertMany(sampleAssignments);

    console.log('[Seeder] Database seeded successfully!');
    console.log('[Seeder] Demo Student Account: student@university.edu / password123');
    await disconnectDB();
    process.exit(0);
  } catch (err) {
    console.error('[Seeder] Error seeding data:', err);
    process.exit(1);
  }
};

seedData();

